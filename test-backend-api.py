import requests
import json

def test_voice_command_api():
    # Test 1: Simple H gate command
    print("1. Testing 'H in q0':")
    url = 'http://localhost:8000/api/voice-command/'
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        'command': 'H in q0'
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        result = response.json()
        
        if result['success']:
            print("✅ Success!")
            print(f"Generated Circuit: {json.dumps(result['data']['circuit'], indent=2)}")
        else:
            print(f"❌ Error: {result['error']}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: CNOT gate command
    print("2. Testing 'CNOT from q0 to q1':")
    data = {
        'command': 'CNOT from q0 to q1'
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        result = response.json()
        
        if result['success']:
            print("✅ Success!")
            print(f"Generated Circuit: {json.dumps(result['data']['circuit'], indent=2)}")
        else:
            print(f"❌ Error: {result['error']}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("Testing Voice Command Backend API")
    print("="*50)
    test_voice_command_api()
