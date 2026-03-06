import React, { useState } from 'react';
import { useCircuit } from '../context/CircuitContext';
import { Play, StopCircle, Settings } from 'lucide-react';

const ExecuteDialog = ({ onClose }) => {
  const { circuit, qubits, classicalBits, circuitName, customGates, setExecution } = useCircuit();
  const [shots, setShots] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (circuit.length === 0) {
      alert('Circuit is empty. Add some gates first.');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to run quantum circuit simulations.');
      return;
    }

    setIsRunning(true);

    try {
      // First, save the circuit to backend to get an ID
      const saveResponse = await fetch('http://localhost:8000/api/circuits/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: circuitName,
          description: 'Executed circuit',
          qubits,
          classical_bits: classicalBits,
          gates: circuit,
          custom_gates: customGates,
        }),
      });

      if (saveResponse.ok) {
        const saveData = await saveResponse.json();
        const circuitId = saveData.data.id;

        // Call quantum circuit simulation API with circuit ID
        const response = await fetch('http://localhost:8000/api/simulate/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            circuit_id: circuitId,
            qubits,
            gates: circuit,
            backend: 'simulator', // Single backend
            shots,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const probabilities = data?.data?.probability_distribution || {};
          const derivedCounts = Object.fromEntries(
            Object.entries(probabilities).map(([state, probability]) => [
              state,
              Math.round((probability || 0) * shots),
            ])
          );

          setExecution({
            jobId: data.data.job_id || `SIM-${Date.now()}`,
            status: 'completed',
            result: {
              ...data.data,
              counts: derivedCounts,
              shots,
              circuitId: circuitId,
            },
          });
          onClose();
        } else {
          alert('Error running simulation');
        }
      } else {
        alert('Error saving circuit');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting job: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Play size={24} />
          Run Circuit
        </h2>

        {/* Shots Configuration */}
        <div className="mb-6">
          <label className="text-white text-sm font-semibold block mb-3">
            Number of Shots
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={shots}
              onChange={(e) => setShots(parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="100"
              max="10000"
              step="100"
              value={shots}
              onChange={(e) => setShots(Math.max(100, parseInt(e.target.value)))}
               className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            />
          </div>
          <span className="text-gray-400 text-xs mt-2">
            How many times to run the circuit
          </span>
        </div>

        {/* Circuit Summary */}
           <div className="mb-6 p-4 bg-slate-900 rounded border border-slate-700">
          <h3 className="text-white font-semibold text-sm mb-2">Circuit Summary</h3>
           <div className="text-gray-300 text-xs space-y-1">
            <div>Gates: {circuit.length}</div>
            <div>Shots: {shots.toLocaleString()}</div>
            <div>Backend: QuantumSim Cloud Simulator</div>
            <div>Operation: Drag and Drop Quantum Circuit</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isRunning}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <StopCircle size={16} className="animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={16} />
                Run
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecuteDialog;
