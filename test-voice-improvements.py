import requests
import json

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

print("Testing voice command improvements...")
print("=" * 60)

# Test commands with different qubit formats
test_voice_command("H in q0")
print()

test_voice_command("Add X gate to qubit 1")
print()

test_voice_command("CNOT from q0 to q1")
print()

test_voice_command("Add Hadamard to qubit 2")
print()

test_voice_command("CX from q1 to q3")
print()

test_voice_command("Add Z gate to q0 and q2")
print()

test_voice_command("Y gate on qubit 0 and qubit 3")
print()

print("=" * 60)
print("\nTesting with multiple qubit references:")
test_voice_command("Add H gate to q0 q1 q3")
print()

test_voice_command("X in qubit 2, q3, and q5")
