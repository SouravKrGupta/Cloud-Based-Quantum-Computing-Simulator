import requests
import json

def test_voice_command_api():
    print("Testing Voice Command API - Complete Integration")
    print("=" * 60)
    
    # Test 1: Simple H gate command
    print("\n1. Testing 'H in q0':")
    url = 'http://localhost:8000/api/voice-command/'
    headers = {'Content-Type': 'application/json'}
    data = {'command': 'H in q0'}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Success")
            print(f"   Qubits: {result['data']['circuit']['qubits']}")
            print(f"   Gates: {len(result['data']['circuit']['gates'])}")
            for gate in result['data']['circuit']['gates']:
                print(f"     - {gate['gate']} on q{gate['qubitIndex']}")
            print(f"   Description: {result['data']['circuit']['description']}")
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 2: CNOT gate command
    print("\n2. Testing 'CNOT from q0 to q1':")
    data = {'command': 'CNOT from q0 to q1'}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Success")
            print(f"   Qubits: {result['data']['circuit']['qubits']}")
            print(f"   Gates: {len(result['data']['circuit']['gates'])}")
            for gate in result['data']['circuit']['gates']:
                print(f"     - {gate['gate']} on q{gate['qubitIndex']} (target: q{gate['params']['target']})")
            print(f"   Description: {result['data']['circuit']['description']}")
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 3: Multi-qubit command
    print("\n3. Testing 'Add H gate to q0 q1 q3':")
    data = {'command': 'Add H gate to q0 q1 q3'}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Success")
            print(f"   Qubits: {result['data']['circuit']['qubits']}")
            print(f"   Gates: {len(result['data']['circuit']['gates'])}")
            for gate in result['data']['circuit']['gates']:
                print(f"     - {gate['gate']} on q{gate['qubitIndex']}")
            print(f"   Description: {result['data']['circuit']['description']}")
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test 4: Bell state command
    print("\n4. Testing 'Create a bell state with two qubits':")
    data = {'command': 'Create a bell state with two qubits'}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Success")
            print(f"   Qubits: {result['data']['circuit']['qubits']}")
            print(f"   Gates: {len(result['data']['circuit']['gates'])}")
            for gate in result['data']['circuit']['gates']:
                if gate['gate'] == 'CNOT':
                    print(f"     - {gate['gate']} on q{gate['qubitIndex']} (target: q{gate['params']['target']})")
                else:
                    print(f"     - {gate['gate']} on q{gate['qubitIndex']}")
            print(f"   Description: {result['data']['circuit']['description']}")
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("All tests completed!")

if __name__ == "__main__":
    test_voice_command_api()
