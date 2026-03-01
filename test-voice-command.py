import requests
import json

# Test the voice command API with different commands

def test_voice_command(command):
    url = 'http://localhost:8000/api/voice-command/'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token'
    }
    data = {
        'command': command
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Command: '{command}'")
            print(f"   Success: {result['success']}")
            if 'data' in result:
                print(f"   Qubits: {result['data']['circuit']['qubits']}")
                print(f"   Gates: {len(result['data']['circuit']['gates'])}")
                for gate in result['data']['circuit']['gates']:
                    print(f"     - {gate['gate']} on q{gate['qubitIndex']} at time {gate['time']}")
                print(f"   Description: {result['data']['circuit']['description']}")
        else:
            print(f"❌ Command: '{command}'")
            print(f"   Status Code: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Command: '{command}'")
        print(f"   Error: {e}")

# Test different commands
print("Testing voice commands...")
print("=" * 50)

test_voice_command("H in q0")
print()

test_voice_command("Add X gate to qubit 1")
print()

test_voice_command("Add CNOT from q0 to q1")
print()

test_voice_command("Add Hadamard to qubit 2")
print()

test_voice_command("CX from q1 to q3")
print()

test_voice_command("Create bell state with two qubits")
print()

test_voice_command("Make three qubits in superposition")
print()

test_voice_command("Add Z gate to q0 and q2")
