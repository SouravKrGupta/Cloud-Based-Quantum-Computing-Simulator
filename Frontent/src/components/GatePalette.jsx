import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';

const GatePalette = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    singleQubit: true,
    multiQubit: true,
    parametric: true,
    measurement: true,
  });

  const gates = {
    singleQubit: [
      { name: 'H', label: 'Hadamard', description: 'Superposition' },
      { name: 'X', label: 'Pauli X (NOT)', description: 'Bit flip' },
      { name: 'Y', label: 'Pauli Y', description: 'Bit & phase flip' },
      { name: 'Z', label: 'Pauli Z', description: 'Phase flip' },
      { name: 'S', label: 'S Gate', description: 'Phase gate' },
      { name: 'T', label: 'T Gate', description: 'π/8 phase' },
    ],
    multiQubit: [
      { name: 'CNOT', label: 'CNOT (CX)', description: 'Controlled NOT' },
      { name: 'SWAP', label: 'SWAP', description: 'Swap qubits' },
      { name: 'CCX', label: 'Toffoli', description: 'Controlled CNOT' },
    ],
    parametric: [
      { name: 'RX', label: 'RX(θ)', description: 'Rotation X' },
      { name: 'RY', label: 'RY(θ)', description: 'Rotation Y' },
      { name: 'RZ', label: 'RZ(θ)', description: 'Rotation Z' },
      { name: 'U3', label: 'U3(θ,φ,λ)', description: 'General 1Q unitary' },
    ],
    measurement: [
      { name: 'Measure', label: 'Measure', description: 'Measurement' },
      { name: 'Reset', label: 'Reset', description: 'Reset qubit' },
    ],
  };

  const filteredGates = useMemo(() => {
    const filtered = {};
    Object.entries(gates).forEach(([category, categoryGates]) => {
      filtered[category] = categoryGates.filter(
        (gate) =>
          gate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gate.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return filtered;
  }, [searchTerm]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDragStart = (e, gate) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('gate', JSON.stringify(gate));
  };

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
        <h3 className="text-sm font-semibold text-white mb-3">Operations Catalog</h3>
        <div className="relative">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search gates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Gate Categories */}
      <div className="p-4 space-y-4">
        {/* Single Qubit Gates */}
        <div>
          <button
            onClick={() => toggleCategory('singleQubit')}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-700 rounded transition text-white font-semibold text-sm"
          >
            {expandedCategories.singleQubit ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Single Qubit
          </button>
          {expandedCategories.singleQubit && (
            <div className="mt-2 space-y-2">
              {filteredGates.singleQubit.map((gate) => (
                <div
                  key={gate.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, gate)}
                  className="p-3 bg-gray-700 rounded cursor-move hover:bg-gray-600 transition group"
                  title={gate.description}
                >
                  <div className="font-semibold text-white text-sm">{gate.name}</div>
                  <div className="text-xs text-gray-300">{gate.label}</div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300">
                    {gate.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Multi Qubit Gates */}
        <div>
          <button
            onClick={() => toggleCategory('multiQubit')}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-700 rounded transition text-white font-semibold text-sm"
          >
            {expandedCategories.multiQubit ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Multi Qubit
          </button>
          {expandedCategories.multiQubit && (
            <div className="mt-2 space-y-2">
              {filteredGates.multiQubit.map((gate) => (
                <div
                  key={gate.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, gate)}
                  className="p-3 bg-gray-700 rounded cursor-move hover:bg-gray-600 transition group"
                  title={gate.description}
                >
                  <div className="font-semibold text-white text-sm">{gate.name}</div>
                  <div className="text-xs text-gray-300">{gate.label}</div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300">
                    {gate.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Parametric Gates */}
        <div>
          <button
            onClick={() => toggleCategory('parametric')}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-700 rounded transition text-white font-semibold text-sm"
          >
            {expandedCategories.parametric ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Parametric
          </button>
          {expandedCategories.parametric && (
            <div className="mt-2 space-y-2">
              {filteredGates.parametric.map((gate) => (
                <div
                  key={gate.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, gate)}
                  className="p-3 bg-yellow-700 rounded cursor-move hover:bg-yellow-600 transition group"
                  title={gate.description}
                >
                  <div className="font-semibold text-white text-sm">{gate.name}</div>
                  <div className="text-xs text-yellow-100">{gate.label}</div>
                  <div className="text-xs text-yellow-200 group-hover:text-yellow-100">
                    {gate.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Measurement Gates */}
        <div>
          <button
            onClick={() => toggleCategory('measurement')}
            className="flex items-center gap-2 w-full p-2 hover:bg-gray-700 rounded transition text-white font-semibold text-sm"
          >
            {expandedCategories.measurement ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Measurement
          </button>
          {expandedCategories.measurement && (
            <div className="mt-2 space-y-2">
              {filteredGates.measurement.map((gate) => (
                <div
                  key={gate.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, gate)}
                  className="p-3 bg-red-700 rounded cursor-move hover:bg-red-600 transition group"
                  title={gate.description}
                >
                  <div className="font-semibold text-white text-sm">{gate.name}</div>
                  <div className="text-xs text-red-100">{gate.label}</div>
                  <div className="text-xs text-red-200 group-hover:text-red-100">
                    {gate.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default GatePalette;
