import re
from typing import Dict, Any, Tuple
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json
import time


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
    elif "ghz" in text and n >= 3:
        intent = "ghz"
    else:
        intent = "empty"

    wants_measure = ("measure" in text) or ("measurement" in text)
    return {"intent": intent, "n_qubits": n, "measure": wants_measure, "raw": command}


def build_circuit(parsed: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build a circuit configuration from parsed intent.
    """
    n = parsed["n_qubits"]
    measure = parsed["measure"]
    intent = parsed["intent"]

    gates = []
    time_slot = 0

    if intent == "superposition":
        # Put ALL qubits into uniform superposition with H
        for q in range(n):
            gates.append({
                "qubitIndex": q,
                "gate": "H",
                "params": {},
                "time": time_slot
            })
        time_slot += 1

    elif intent == "bell":
        # Bell state uses first two qubits: H(0), CX(0,1)
        if n < 2:
            raise ValueError("Bell/entanglement needs at least 2 qubits.")
        gates.append({
            "qubitIndex": 0,
            "gate": "H",
            "params": {},
            "time": time_slot
        })
        time_slot += 1
        gates.append({
            "qubitIndex": 0,
            "gate": "CNOT",
            "params": {"target": 1},
            "time": time_slot
        })
        time_slot += 1

    elif intent == "ghz":
        # GHZ state: H on 0, then chain CNOTs 0->1, 1->2, ...
        if n < 3:
            raise ValueError("GHZ needs at least 3 qubits.")
        gates.append({
            "qubitIndex": 0,
            "gate": "H",
            "params": {},
            "time": time_slot
        })
        time_slot += 1
        for i in range(n - 1):
            gates.append({
                "qubitIndex": i,
                "gate": "CNOT",
                "params": {"target": i + 1},
                "time": time_slot
            })
            time_slot += 1

    elif intent == "empty":
        # Do nothing (just allocate qubits)
        pass

    if measure:
        for q in range(n):
            gates.append({
                "qubitIndex": q,
                "gate": "Measure",
                "params": {"classicalBit": q},
                "time": time_slot
            })
        time_slot += 1

    # Return circuit configuration
    return {
        "qubits": n,
        "gates": gates,
        "description": f"{intent} state with {n} qubits{' and measurement' if measure else ''}"
    }


class VoiceCommandView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Process voice command and generate quantum circuit configuration.
        """
        start_time = time.time()

        try:
            command = request.data.get('command', '')
            if not command:
                return Response({
                    'success': False,
                    'error': 'No command provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Parse the voice command
            parsed = parse_command(command)

            # Build circuit configuration
            circuit_config = build_circuit(parsed)

            # Generate response
            response = {
                'success': True,
                'data': {
                    'circuit': circuit_config,
                    'parsed': parsed,
                    'execution_time': round(time.time() - start_time, 3)
                }
            }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TextToCircuitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Process text command and generate quantum circuit configuration.
        """
        start_time = time.time()

        try:
            command = request.data.get('text', '')
            if not command:
                return Response({
                    'success': False,
                    'error': 'No text command provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Parse the text command
            parsed = parse_command(command)

            # Build circuit configuration
            circuit_config = build_circuit(parsed)

            # Generate response
            response = {
                'success': True,
                'data': {
                    'circuit': circuit_config,
                    'parsed': parsed,
                    'execution_time': round(time.time() - start_time, 3)
                }
            }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
