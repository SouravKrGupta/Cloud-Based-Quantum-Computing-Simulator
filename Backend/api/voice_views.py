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
    # Check for multiple gate commands first
    # Pattern: gate [on] qX, gate [on] qY, etc.
    gate_patterns = r"\b(h|hadamard|x|not|y|z|s|t|cx|cnot)\b.*?\bq(\d+)\b"
    multiple_gate_matches = re.findall(gate_patterns, text)
    
    if multiple_gate_matches:
        intent = "add_gates"
        gates = []
        qubits = set()
        
        for gate_match, qubit_match in multiple_gate_matches:
            gate = gate_match.upper()
            if gate == "HADAMARD":
                gate = "H"
            elif gate == "NOT":
                gate = "X"
            elif gate == "CNOT":
                gate = "CX"
                
            qubit = int(qubit_match)
            qubits.add(qubit)
            gates.append({"gate": gate, "qubit": qubit})
        
        max_qubit = max(qubits) if qubits else 0
        n_qubits = max(n, max_qubit + 1)
        
        return {
            "intent": intent, 
            "n_qubits": n_qubits, 
            "measure": ("measure" in text) or ("measurement" in text), 
            "raw": command,
            "gates": gates
        }

    # Check for single gate commands
    gate_match = re.search(r"\b(h|hadamard|x|not|y|z|s|t|cx|cnot)\b", text)
    if gate_match:
        intent = "add_gate"
        gate = gate_match.group(1).upper()
        if gate == "HADAMARD":
            gate = "H"
        elif gate == "NOT":
            gate = "X"
        elif gate == "CNOT":
            gate = "CX"
        
        # Extract qubit information from various formats: q0, qubit 1, q1, etc.
        qubit_list = []
        # Match q followed by number (q0, q1, q2, etc.)
        qubit_matches = re.findall(r"q(\d+)", text)
        if qubit_matches:
            qubit_list.extend(list(map(int, qubit_matches)))
        
        # Match "qubit" followed by number (qubit 0, qubit 1, etc.)
        qubit_word_matches = re.findall(r"qubit\s*(\d+)", text)
        if qubit_word_matches:
            qubit_list.extend(list(map(int, qubit_word_matches)))
        
        # Remove duplicates and sort
        qubit_list = sorted(list(set(qubit_list)))
        
        return {
            "intent": intent, 
            "n_qubits": max(n, max(qubit_list) + 1) if qubit_list else n, 
            "measure": ("measure" in text) or ("measurement" in text), 
            "raw": command,
            "gate": gate,
            "qubits": qubit_list
        }
    
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

    if intent == "add_gates":
        # Add multiple specific gates to specified qubits
        for gate_info in parsed["gates"]:
            gate = gate_info["gate"]
            qubit = gate_info["qubit"]
            
            if gate == "CX" or gate == "CNOT":
                # For CNOT, need control and target qubits - default to q0 as control
                gates.append({
                    "qubitIndex": qubit,
                    "gate": "CNOT",
                    "params": {"target": (qubit + 1) % n},
                    "time": time_slot
                })
            else:
                # For single-qubit gates
                gates.append({
                    "qubitIndex": qubit,
                    "gate": gate,
                    "params": {},
                    "time": time_slot
                })
        
        time_slot += 1

    elif intent == "add_gate":
        # Add specific gate to specified qubit(s)
        gate = parsed["gate"]
        qubits = parsed["qubits"]
        
        if not qubits:
            # If no qubits specified, default to qubit 0
            qubits = [0]
        
        if gate == "CX" or gate == "CNOT":
            # For CNOT, need control and target qubits
            if len(qubits) >= 2:
                gates.append({
                    "qubitIndex": qubits[0],
                    "gate": "CNOT",
                    "params": {"target": qubits[1]},
                    "time": time_slot
                })
            else:
                # Default CNOT from q0 to q1
                gates.append({
                    "qubitIndex": 0,
                    "gate": "CNOT",
                    "params": {"target": 1},
                    "time": time_slot
                })
        else:
            # For single-qubit gates
            for q in qubits:
                gates.append({
                    "qubitIndex": q,
                    "gate": gate,
                    "params": {},
                    "time": time_slot
                })
        
        time_slot += 1

    elif intent == "superposition":
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
    description = f"{intent} state with {n} qubits"
    if intent == "add_gate":
        qubit_str = ", ".join([f"q{q}" for q in parsed["qubits"]])
        description = f"Added {parsed['gate']} gate to qubit(s) {qubit_str}"
    elif intent == "add_gates":
        gate_strs = []
        for gate_info in parsed["gates"]:
            gate_strs.append(f"{gate_info['gate']} on q{gate_info['qubit']}")
        description = f"Added gates: {', '.join(gate_strs)}"
    
    return {
        "qubits": n,
        "gates": gates,
        "description": description
    }


class VoiceCommandView(APIView):
    # Remove authentication requirement for testing purposes
    # permission_classes = [IsAuthenticated]

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
