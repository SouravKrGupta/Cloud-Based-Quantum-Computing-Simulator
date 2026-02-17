"""
Offline Voice Command -> Quantum Circuit (Qiskit)
(No PyAudio needed)

Requirements:
  pip install qiskit vosk sounddevice numpy

You must download and unzip a Vosk model folder, e.g.:
  vosk-model-small-en-us-0.15
and set MODEL_PATH to that folder name.

Example voice commands:
  - "Create a two qubit for superposition"
  - "Make three qubits in superposition and measure"
  - "Create a bell state with two qubits"
  - "Entangle two qubits then measure"
  - "Create two qubits"
  - "Quit" / "Exit" / "Stop"
"""

import json
import queue
import re
import sys
from typing import Dict, Any, Tuple

import numpy as np
import sounddevice as sd
from vosk import Model, KaldiRecognizer

from qiskit import QuantumCircuit

# -----------------------
# Configure model path
# -----------------------
#MODEL_PATH = "C:\Users\HP\VScode160126\vosk-model-small-en-us-0.15"  # change if your folder name differs
MODEL_PATH = "C:/Users/HP/VScode160126/vosk-model-small-en-us-0.15/vosk-model-small-en-us-0.15"
# -----------------------
# Parsing helpers
# -----------------------
NUMBER_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
}

def _extract_qubit_count(text: str) -> int:
    text = text.lower()

    # digits: "2 qubit(s)"
    m = re.search(r"\b(\d+)\s*qubits?\b", text)
    if m:
        return max(1, int(m.group(1)))

    # words: "two qubit(s)"
    for w, n in NUMBER_WORDS.items():
        if re.search(rf"\b{w}\s*qubits?\b", text):
            return n

    # "two-qubit" / "2-qubit"
    m2 = re.search(r"\b(\d+)[- ]qubit\b", text)
    if m2:
        return max(1, int(m2.group(1)))
    for w, n in NUMBER_WORDS.items():
        if re.search(rf"\b{w}[- ]qubit\b", text):
            return n

    return 1

def parse_command(command: str) -> Dict[str, Any]:
    text = command.strip().lower()
    n = _extract_qubit_count(text)

    # Intent detection
    if "ghz" in text and n >= 3:
        intent = "ghz"
    elif "bell" in text or ("entangle" in text and n >= 2):
        intent = "bell"
    elif "superposition" in text:
        intent = "superposition"
    else:
        intent = "empty"

    wants_measure = any(k in text for k in ["measure", "measurement", "readout"])
    return {"intent": intent, "n_qubits": n, "measure": wants_measure, "raw": command}

def build_circuit(parsed: Dict[str, Any]) -> Tuple[QuantumCircuit, str]:
    n = parsed["n_qubits"]
    measure = parsed["measure"]
    intent = parsed["intent"]

    qc = QuantumCircuit(n, n) if measure else QuantumCircuit(n)

    if intent == "superposition":
        # Put all qubits into |+> state
        for q in range(n):
            qc.h(q)

    elif intent == "bell":
        # Bell state: H on qubit 0, then CX 0->1
        if n < 2:
            raise ValueError("Bell/entanglement needs at least 2 qubits.")
        qc.h(0)
        qc.cx(0, 1)

    elif intent == "ghz":
        # GHZ: H on 0, then chain CNOTs 0->1, 1->2, ...
        if n < 3:
            raise ValueError("GHZ needs at least 3 qubits.")
        qc.h(0)
        for i in range(n - 1):
            qc.cx(i, i + 1)

    elif intent == "empty":
        # allocate only
        pass

    if measure:
        qc.measure(range(n), range(n))

    summary = f"Intent={intent}, n_qubits={n}, measure={measure}"
    return qc, summary

# -----------------------
# Offline voice recognition (Vosk + sounddevice)
# -----------------------
def pick_input_device() -> int:
    """
    Returns the default input device index.
    If your mic isn't detected, print devices and choose manually.
    """
    dev = sd.default.device[0]
    if dev is None:
        return -1
    return dev

def print_audio_devices():
    devices = sd.query_devices()
    print("\nAvailable audio devices:\n")
    for i, d in enumerate(devices):
        io = []
        if d["max_input_channels"] > 0:
            io.append("IN")
        if d["max_output_channels"] > 0:
            io.append("OUT")
        print(f"[{i}] {'/'.join(io):<6} {d['name']}")
    print()

def listen_once_offline(
    recognizer: KaldiRecognizer,
    samplerate: int = 16000,
    device: int = None,
    silence_timeout_sec: float = 2.0,
    max_listen_sec: float = 8.0,
) -> str:
    """
    Listen from mic, return recognized text when a final result is produced.
    Stops if it hears nothing meaningful for a while.
    """
    q = queue.Queue()

    def callback(indata, frames, time, status):
        if status:
            print(status, file=sys.stderr)
        q.put(bytes(indata))

    if device is None:
        device = pick_input_device()

    if device == -1:
        raise RuntimeError("No default microphone found. Run print_audio_devices() and set device index.")

    print("🎙️ Speak your command...")

    # simple energy check to avoid endless waiting
    heard_anything = False
    silent_chunks = 0
    max_silent_chunks = int((silence_timeout_sec * samplerate) / 8000) + 1

    start_chunks = 0
    max_chunks = int((max_listen_sec * samplerate) / 8000) + 1

    with sd.RawInputStream(
        samplerate=samplerate,
        blocksize=8000,
        dtype="int16",
        channels=1,
        callback=callback,
        device=device,
    ):
        while True:
            data = q.get()
            start_chunks += 1

            # crude "signal present" check
            arr = np.frombuffer(data, dtype=np.int16)
            if np.max(np.abs(arr)) > 500:  # threshold; adjust if needed
                heard_anything = True
                silent_chunks = 0
            else:
                if heard_anything:
                    silent_chunks += 1

            if recognizer.AcceptWaveform(data):
                result = json.loads(recognizer.Result())
                text = (result.get("text") or "").strip()
                if text:
                    return text

            # stop if we've listened too long without a final result
            if start_chunks >= max_chunks:
                partial = json.loads(recognizer.PartialResult()).get("partial", "").strip()
                return partial

            # stop if silence after speaking
            if heard_anything and silent_chunks >= max_silent_chunks:
                partial = json.loads(recognizer.PartialResult()).get("partial", "").strip()
                return partial

def main():
    # Load Vosk model
    try:
        model = Model(MODEL_PATH)
    except Exception as e:
        raise SystemExit(
            f"Could not load Vosk model from '{MODEL_PATH}'.\n"
            f"Make sure the model folder exists next to this script.\n"
            f"Error: {e}"
        )

    samplerate = 16000
    rec = KaldiRecognizer(model, samplerate)

    print("Offline Voice Command -> Quantum Circuit (Qiskit)")
    print("Say: 'quit' / 'exit' / 'stop' to end.")
    print("Tip: If mic not working, call print_audio_devices() and set device index.\n")

    # Uncomment this if you need to see devices:
    # print_audio_devices()
    # device_index = 2  # <-- set your microphone index here if needed
    device_index = None  # use default mic

    while True:
        try:
            # Reset recognizer state each loop
            rec.Reset()

            spoken = listen_once_offline(recognizer=rec, samplerate=samplerate, device=device_index)
            spoken = (spoken or "").strip()
            if not spoken:
                print("❓ I didn't catch that. Please speak again.\n")
                continue

            print(f"✅ You said: {spoken}")

            if spoken.lower() in {"quit", "exit", "stop"}:
                print("Bye!")
                break

            parsed = parse_command(spoken)
            qc, summary = build_circuit(parsed)

            print("\nParsed:", summary)
            print("\nCircuit:\n")
            print(qc.draw(output="text"))

            print("\n(OpenQASM 2.0):\n")
            try:
                print(qc.qasm())
            except Exception:
                print("QASM export not available in this Qiskit version.")

            print("-" * 70 + "\n")

        except KeyboardInterrupt:
            print("\nStopped.")
            break
        except Exception as e:
            print(f"Error: {e}\n")
            print("If this is a microphone/device error, run print_audio_devices() and set device_index.\n")

if __name__ == "__main__":
    main()

