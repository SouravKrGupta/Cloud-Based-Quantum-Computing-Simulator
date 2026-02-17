import re
from typing import Dict, Any, Tuple

try:
    from qiskit import QuantumCircuit
except ImportError:
    raise SystemExit(
        "Qiskit is not installed.\n"
        "Install it with: pip install qiskit\n"
    )

NUMBER_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
}

def _extract_qubit_count(text: str) -> int:
    """
    Extract qubit count from text:
    - digits: "2 qubit", "3 qubits"
    - words: "two qubit", "three qubits"
    Defaults to 1 if not found.
    """
    text = text.lower()

    # Digits
    m = re.search(r"\b(\d+)\s*qubits?\b", text)
    if m:
        return max(1, int(m.group(1)))

    # Number words
    for w, n in NUMBER_WORDS.items():
        if re.search(rf"\b{w}\s*qubits?\b", text):
            return n

    # Also allow "two-qubit" / "2-qubit"
    m2 = re.search(r"\b(\d+)[- ]qubit\b", text)
    if m2:
        return max(1, int(m2.group(1)))
    for w, n in NUMBER_WORDS.items():
        if re.search(rf"\b{w}[- ]qubit\b", text):
            return n

    return 1

def parse_command(command: str) -> Dict[str, Any]:
    """
    Convert a human-like command into an 'intent' + parameters.
    """
    text = command.strip().lower()
    n = _extract_qubit_count(text)

    # Intent detection (priority order)
    if "bell" in text or ("entangle" in text and n >= 2):
        intent = "bell"
    elif "superposition" in text:
        intent = "superposition"
    else:
        intent = "empty"

    wants_measure = ("measure" in text) or ("measurement" in text)
    return {"intent": intent, "n_qubits": n, "measure": wants_measure, "raw": command}

def build_circuit(parsed: Dict[str, Any]) -> Tuple[QuantumCircuit, str]:
    """
    Build a Qiskit circuit from parsed intent.
    """
    n = parsed["n_qubits"]
    measure = parsed["measure"]
    intent = parsed["intent"]

    if measure:
        qc = QuantumCircuit(n, n)
    else:
        qc = QuantumCircuit(n)

    if intent == "superposition":
        # Put ALL qubits into uniform superposition with H
        for q in range(n):
            qc.h(q)

    elif intent == "bell":
        # Bell state uses first two qubits: H(0), CX(0,1)
        if n < 2:
            raise ValueError("Bell/entanglement needs at least 2 qubits.")
        qc.h(0)
        qc.cx(0, 1)

    elif intent == "empty":
        # Do nothing (just allocate qubits)
        pass

    if measure:
        qc.measure(range(n), range(n))

    # A friendly summary
    summary = f"Intent={intent}, n_qubits={n}, measure={measure}"
    return qc, summary

def main():
    print("Human-like command -> Quantum Circuit (Qiskit)")
    print("Type 'quit' to exit.\n")
    while True:
        cmd = input("Command: ").strip()
        if not cmd:
            continue
        if cmd.lower() in {"quit", "exit"}:
            break

        try:
            parsed = parse_command(cmd)
            qc, summary = build_circuit(parsed)
            print("\nParsed:", summary)
            print("\nCircuit:\n")
            print(qc.draw(output="text"))
            print("\n(OpenQASM 2.0):\n")
            try:
                print(qc.qasm())
            except Exception:
                print("QASM export not available in this Qiskit version.")
            print("-" * 60, "\n")
        except Exception as e:
            print(f"Error: {e}\n")

if __name__ == "__main__":
    main()



