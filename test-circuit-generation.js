import axios from 'axios';

async function testCircuitGeneration() {
  try {
    console.log('Testing voice command API...');
    
    // Test 1: Simple H gate command
    console.log('\n1. Testing "H in q0":');
    const response1 = await axios.post('http://localhost:8000/api/voice-command/', {
      command: 'H in q0'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token'
      }
    });
    
    if (response1.data.success) {
      console.log('✓ Success');
      console.log('  Circuit:', response1.data.data.circuit);
    } else {
      console.log('✗ Failed:', response1.data.error);
    }
    
    // Test 2: CNOT gate command
    console.log('\n2. Testing "CNOT from q0 to q1":');
    const response2 = await axios.post('http://localhost:8000/api/voice-command/', {
      command: 'CNOT from q0 to q1'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token'
      }
    });
    
    if (response2.data.success) {
      console.log('✓ Success');
      console.log('  Circuit:', response2.data.data.circuit);
    } else {
      console.log('✗ Failed:', response2.data.error);
    }
    
    // Test 3: Multi-qubit command
    console.log('\n3. Testing "Add H gate to q0 q1 q3":');
    const response3 = await axios.post('http://localhost:8000/api/voice-command/', {
      command: 'Add H gate to q0 q1 q3'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token'
      }
    });
    
    if (response3.data.success) {
      console.log('✓ Success');
      console.log('  Circuit:', response3.data.data.circuit);
    } else {
      console.log('✗ Failed:', response3.data.error);
    }
    
  } catch (error) {
    console.error('\nError:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
testCircuitGeneration();
