import re
from typing import Dict, Any, Tuple

try:
    import speech_recognition as sr
except ImportError:
    raise SystemExit("Missing package: SpeechRecognition. Install: pip install SpeechRecognition pyaudio")

try:
    from qiskit import QuantumCircuit
except ImportError:
    raise SystemExit("Missing package: qiskit. Install: pip install qiskit")

NUMBER_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
}

def _extract_qubit_count(text: str) -> int:
    text = text.lower()

    # "2 qubit(s)"
    m = re.search(r"\b(\d+)\s*qubits?\b", text)
    if m:
        return max(1, int(m.group(1)))

    # "two qubit(s)"
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
    if "bell" in text or ("entangle" in text and n >= 2):
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
        for q in range(n):
            qc.h(q)

    elif intent == "bell":
        if n < 2:
            raise ValueError("Bell/entanglement needs at least 2 qubits.")
        qc.h(0)
        qc.cx(0, 1)

    elif intent == "empty":
        pass

    if measure:
        qc.measure(range(n), range(n))

    summary = f"Intent={intent}, n_qubits={n}, measure={measure}"
    return qc, summary

def listen_once(recognizer: sr.Recognizer, mic: sr.Microphone) -> str:
    """
    Listen from microphone and return recognized text.
    Uses Google's free Web Speech endpoint via SpeechRecognition.
    """
    with mic as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.6)
        print("🎙️ Listening... (speak your command)")
        audio = recognizer.listen(source, timeout=8, phrase_time_limit=8)

    print("🧠 Recognizing...")
    # You can set language="en-IN" for Indian English; change if needed.
    text = recognizer.recognize_google(audio, language="en-IN")
    return text

def main():
    print("Voice Command -> Quantum Circuit (Qiskit)")
    print("Say 'quit' or 'exit' to stop.\n")

    recognizer = sr.Recognizer()

    # Pick default microphone (you can specify device_index if you have multiple mics)
    try:
        mic = sr.Microphone()
    except Exception as e:
        raise SystemExit(f"Microphone not available: {e}")

    while True:
        try:
            spoken = listen_once(recognizer, mic)
            print(f"✅ You said: {spoken}")

            if spoken.strip().lower() in {"quit", "exit", "stop"}:
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

        except sr.WaitTimeoutError:
            print("⏱️ No speech detected (timeout). Try again.\n")
        except sr.UnknownValueError:
            print("❓ Sorry, I couldn't understand that. Please repeat.\n")
        except sr.RequestError as e:
            print(f"🌐 Speech service error: {e}\n"
                  "Tip: This recognizer needs internet. If you want OFFLINE voice, tell me.\n")
        except KeyboardInterrupt:
            print("\nStopped.")
            break
        except Exception as e:
            print(f"Error: {e}\n")

if __name__ == "__main__":
    main()
