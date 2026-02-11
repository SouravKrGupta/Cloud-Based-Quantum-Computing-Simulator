import React, { useState, useEffect } from 'react';
import { useCircuit } from '../context/CircuitContext';
import { Download, Trash2, Upload, Plus } from 'lucide-react';

const FileManager = () => {
  const { loadCircuit, saveCircuit, getSavedCircuits, circuitName, setCircuitName, clearCircuit } = useCircuit();
  const [savedCircuits, setSavedCircuits] = useState([]);
  const [showNewCircuit, setShowNewCircuit] = useState(false);

  useEffect(() => {
    // Load saved circuits from localStorage
    const circuits = getSavedCircuits();
    setSavedCircuits(circuits);
  }, [getSavedCircuits]);

  const handleLoadCircuit = (name) => {
    if (loadCircuit(name)) {
      alert(`Circuit "${name}" loaded!`);
      // Refresh the list
      const circuits = getSavedCircuits();
      setSavedCircuits(circuits);
    }
  };

  const handleDeleteCircuit = (name) => {
    if (confirm(`Delete circuit "${name}"?`)) {
      localStorage.removeItem(`circuit_${name}`);
      setSavedCircuits((prev) => prev.filter((c) => c.name !== name));
    }
  };

  const handleNewCircuit = () => {
    clearCircuit();
    setCircuitName('Untitled Circuit');
    setShowNewCircuit(false);
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.qasm')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const name = file.name.replace('.qasm', '');
        setCircuitName(name);
        // Parse QASM and load circuit
        alert(`File "${name}" loaded! (QASM parsing to be implemented)`);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a .qasm file');
    }
  };

  const handleDownloadCircuit = (circuit) => {
    const data = JSON.stringify(circuit, null, 2);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' + encodeURIComponent(data)
    );
    element.setAttribute('download', `${circuit.name}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">File Manager</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewCircuit(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              New Circuit
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition cursor-pointer">
              <Upload size={18} />
              Import .qasm
              <input
                type="file"
                accept=".qasm"
                onChange={handleUploadFile}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
        <p className="text-gray-400 mt-2">
          Manage your quantum circuits, save and load from local storage
        </p>
      </div>

      {/* Circuits List */}
      <div className="flex-1 overflow-auto p-6">
        {savedCircuits.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No saved circuits yet.</p>
            <p className="text-sm mt-2">Create and save a circuit to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCircuits.map((circuit) => (
              <div
                key={circuit.name}
                className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-500 transition"
              >
                <h3 className="text-lg font-semibold mb-2">{circuit.name}</h3>
                <div className="text-sm text-gray-400 space-y-1 mb-4">
                  <div>Qubits: {circuit.qubits}</div>
                  <div>Classical Bits: {circuit.classicalBits}</div>
                  <div>Gates: {circuit.gates.length}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadCircuit(circuit.name)}
                    className="flex-1 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm transition"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDownloadCircuit(circuit)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                    title="Download circuit"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCircuit(circuit.name)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                    title="Delete circuit"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Circuit Dialog */}
      {showNewCircuit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">New Circuit</h2>
            <p className="text-gray-400 mb-4">
              Create a new quantum circuit to start building from scratch.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowNewCircuit(false)}
                className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNewCircuit}
                className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
