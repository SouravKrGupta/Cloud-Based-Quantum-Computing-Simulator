import React, { useState } from 'react';
import { useCircuit } from '../context/CircuitContext';
import { Plus, Trash2, Copy } from 'lucide-react';

const CustomGates = () => {
  const { customGates, addCustomGate, removeCustomGate, circuit } = useCircuit();
  const [showDialog, setShowDialog] = useState(false);
  const [newGateName, setNewGateName] = useState('');
  const [selectedGates, setSelectedGates] = useState([]);

  const handleCreateCustomGate = () => {
    if (newGateName && selectedGates.length > 0) {
      const gates = circuit.filter((g) => selectedGates.includes(g.id));
      addCustomGate(newGateName, gates);
      setNewGateName('');
      setSelectedGates([]);
      setShowDialog(false);
      alert('Custom gate created!');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Custom Gates</h1>
          <button
            onClick={() => setShowDialog(true)}
            disabled={circuit.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Plus size={18} />
            Create Custom Gate
          </button>
        </div>
        <p className="text-gray-400 mt-2">
          Create reusable quantum gate combinations from your circuit
        </p>
      </div>

      {/* Custom Gates List */}
      <div className="flex-1 overflow-auto p-6">
        {customGates.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No custom gates created yet.</p>
            <p className="text-sm mt-2">Create your first custom gate to reuse gate combinations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customGates.map((gate) => (
              <div
                key={gate.id}
                className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-500 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{gate.name}</h3>
                  <button
                    onClick={() => removeCustomGate(gate.id)}
                    className="p-2 bg-red-600 rounded hover:bg-red-700 transition"
                    title="Delete custom gate"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Gates in this custom operation:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {gate.gates.map((g, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-700 px-2 py-1 rounded text-xs"
                      >
                        <span className="font-semibold">{g.gate}</span>
                        {g.qubitIndex !== undefined && (
                          <span className="text-gray-300"> (q{g.qubitIndex})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(gate.name);
                      alert('Gate name copied!');
                    }}
                    className="flex items-center gap-1 flex-1 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm transition"
                  >
                    <Copy size={14} />
                    Copy Name
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create Custom Gate</h2>

            {/* Gate Name Input */}
            <div className="mb-4">
              <label className="text-white text-sm font-semibold block mb-2">
                Custom Gate Name
              </label>
              <input
                type="text"
                value={newGateName}
                onChange={(e) => setNewGateName(e.target.value)}
                placeholder="e.g., BellState, Grover_Setup"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Gate Selection */}
            <div className="mb-6">
              <label className="text-white text-sm font-semibold block mb-2">
                Include Gates from Current Circuit
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {circuit.length === 0 ? (
                  <p className="text-gray-400 text-sm">No gates in circuit</p>
                ) : (
                  circuit.map((gate) => (
                    <label
                      key={gate.id}
                      className="flex items-center gap-2 p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGates.includes(gate.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGates([...selectedGates, gate.id]);
                          } else {
                            setSelectedGates(
                              selectedGates.filter((id) => id !== gate.id)
                            );
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">
                        {gate.gate} (q{gate.qubitIndex})
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setNewGateName('');
                  setSelectedGates([]);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomGate}
                disabled={!newGateName || selectedGates.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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

export default CustomGates;
