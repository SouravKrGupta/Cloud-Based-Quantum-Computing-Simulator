import React, { useState, useRef, useEffect } from 'react';
import { useCircuit } from '../context/CircuitContext';
import { Trash2, Edit2, X } from 'lucide-react';

const CircuitCanvas = () => {
  const {
    circuit,
    qubits,
    classicalBits,
    addGate,
    removeGate,
    updateGate,
    setQubits,
  } = useCircuit();
  const [draggedGate, setDraggedGate] = useState(null);
  const [editingGate, setEditingGate] = useState(null);
  const [selectedGates, setSelectedGates] = useState(new Set());
  const gridRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, qubitIndex) => {
    e.preventDefault();
    const gateData = e.dataTransfer.getData('gate');
    if (gateData) {
      const gate = JSON.parse(gateData);
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const timeSlot = Math.floor(x / 80); // Assuming 80px per time slot
      addGate(timeSlot, qubitIndex, gate.name);
    }
  };

  const handleGateClick = (gateId, e) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedGates((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(gateId)) {
          newSet.delete(gateId);
        } else {
          newSet.add(gateId);
        }
        return newSet;
      });
    } else {
      setSelectedGates(new Set([gateId]));
    }
  };

  const handleRemoveGate = (gateId) => {
    removeGate(gateId);
    setSelectedGates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(gateId);
      return newSet;
    });
  };

  const handleEditGate = (gate) => {
    setEditingGate(gate);
  };

  const handleSaveEdit = () => {
    if (editingGate && editingGate.params) {
      updateGate(editingGate.id, { params: editingGate.params });
    }
    setEditingGate(null);
  };

  // Group gates by qubit and time slot
  const gatesByQubit = {};
  for (let i = 0; i < qubits; i++) {
    gatesByQubit[i] = circuit.filter((g) => g.qubitIndex === i);
  }

  const maxTime = circuit.length > 0 ? Math.max(...circuit.map((g) => g.time)) : 0;

  return (
    <section className="flex-1 bg-gray-900 border-l border-gray-700 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Circuit Editor</h2>
          <div className="flex items-center gap-4">
            <label className="text-white text-sm">
              Qubits:
              <input
                type="number"
                min="1"
                max="20"
                value={qubits}
                onChange={(e) => setQubits(Math.max(1, parseInt(e.target.value)))}
                className="ml-2 w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </label>
            {selectedGates.size > 0 && (
              <div className="text-white text-sm">
                {selectedGates.size} gate(s) selected
              </div>
            )}
          </div>
        </div>

        {/* Circuit Grid */}
        <div
          ref={gridRef}
          className="border border-gray-700 rounded bg-gray-800 overflow-x-auto"
        >
          <div className="inline-block min-w-full">
            {/* Qubit Lines */}
            {Array.from({ length: qubits }).map((_, qubitIndex) => (
              <div
                key={`qubit-${qubitIndex}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, qubitIndex)}
                className="border-b border-gray-700 h-20 bg-gray-800 relative"
              >
                {/* Qubit label */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 border-r border-gray-700 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    q{qubitIndex}
                  </span>
                </div>

                {/* Qubit wire */}
                <div className="absolute left-12 right-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>

                {/* Time slots */}
                {Array.from({ length: maxTime + 5 }).map((_, timeIndex) => (
                  <div
                    key={`slot-${qubitIndex}-${timeIndex}`}
                    className="absolute top-0 bottom-0 w-20 border-r border-gray-700"
                    style={{ left: `calc(3rem + ${timeIndex * 80}px)` }}
                  ></div>
                ))}

                {/* Gate Blocks */}
                {gatesByQubit[qubitIndex].map((gate) => (
                  <div
                    key={gate.id}
                    className={`absolute top-1/2 transform -translate-y-1/2 w-16 h-14 -ml-8 ${
                      gate.gate === 'Measure'
                        ? 'bg-red-600 hover:bg-red-700'
                        : gate.gate.includes('R')
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } rounded border border-gray-300 flex items-center justify-center cursor-move transition ${
                      selectedGates.has(gate.id) ? 'ring-2 ring-green-400' : ''
                    }`}
                    style={{
                      left: `calc(3rem + ${gate.time * 80}px)`,
                    }}
                    onClick={(e) => handleGateClick(gate.id, e)}
                  >
                    <div className="text-center text-white font-semibold text-xs">
                      {gate.gate}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Classical Bits (if any) */}
            {classicalBits > 0 &&
              Array.from({ length: classicalBits }).map((_, bitIndex) => (
                <div
                  key={`cbit-${bitIndex}`}
                  className="border-b border-gray-700 h-20 bg-gray-800 relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 border-r border-gray-700 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      c{bitIndex}
                    </span>
                  </div>
                  <div className="absolute left-12 right-0 top-1/2 h-0.5 bg-gradient-to-r from-red-500 to-transparent opacity-50"></div>
                </div>
              ))}
          </div>
        </div>

        {/* Gate Details / Edit Panel */}
        {editingGate && (
          <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                Edit {editingGate.gate}
              </h3>
              <button
                onClick={() => setEditingGate(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {editingGate.gate.includes('R') && (
              <div className="mb-4">
                <label className="text-white text-sm">
                  Angle (radians):
                  <input
                    type="number"
                    step="0.1"
                    value={editingGate.params.angle || 0}
                    onChange={(e) =>
                      setEditingGate({
                        ...editingGate,
                        params: {
                          ...editingGate.params,
                          angle: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="ml-2 w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </label>
              </div>
            )}

            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        )}

        {/* Selected Gates Toolbar */}
        {selectedGates.size > 0 && (
          <div className="mt-6 flex gap-2">
            <button
              onClick={() =>
                selectedGates.forEach((gateId) => {
                  const gate = circuit.find((g) => g.id === gateId);
                  if (gate) handleEditGate(gate);
                })
              }
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={() =>
                selectedGates.forEach((gateId) => handleRemoveGate(gateId))
              }
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}

        {/* Empty State */}
        {circuit.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-lg">
              Drag gates from the Operations Catalog or adjust qubit count to get started.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CircuitCanvas;
