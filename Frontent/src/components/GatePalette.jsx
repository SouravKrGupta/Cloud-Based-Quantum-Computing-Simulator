import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Grid3x3, List } from 'lucide-react';

const GatePalette = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('icons'); // 'list' or 'icons'
  const [expandedCategories, setExpandedCategories] = useState({
    hadamard: true,
    classical: true,
    phase: true,
    quantum: true,
    nonUnitary: true,
  });

  // Comprehensive IBM Quantum Composer gates with colors - matching official design
  const gates = {
    hadamard: [
      { name: 'H', fullName: 'Hadamard Gate', color: 'bg-red-600' },
    ],
    classical: [
      { name: 'NOT', fullName: 'Pauli X (NOT)', color: 'bg-blue-600' },
      { name: 'CNOT', fullName: 'Controlled NOT', color: 'bg-blue-600' },
      { name: 'CCX', fullName: 'Toffoli Gate', color: 'bg-blue-600' },
      { name: 'SWAP', fullName: 'SWAP Gate', color: 'bg-blue-600' },
      { name: 'cSWAP', fullName: 'Controlled SWAP', color: 'bg-blue-600' },
      { name: 'I', fullName: 'Identity Gate', color: 'bg-blue-600' },
    ],
    phase: [
      { name: 'T', fullName: 'T Gate', color: 'bg-cyan-400' },
      { name: 'S', fullName: 'S Gate', color: 'bg-cyan-400' },
      { name: 'Z', fullName: 'Pauli Z', color: 'bg-cyan-400' },
      { name: 'T†', fullName: 'T Dagger', color: 'bg-cyan-400' },
      { name: 'S†', fullName: 'S Dagger', color: 'bg-cyan-400' },
      { name: 'Phase', fullName: 'Phase Gate', color: 'bg-cyan-400' },
      { name: 'RZ', fullName: 'RZ Rotation', color: 'bg-cyan-400' },
      { name: 'SX', fullName: 'SX Gate', color: 'bg-cyan-400' },
    ],
    quantum: [
      { name: 'SX†', fullName: 'SX Dagger', color: 'bg-purple-600' },
      { name: 'Y', fullName: 'Pauli Y', color: 'bg-purple-600' },
      { name: 'U', fullName: 'U3 Gate', color: 'bg-purple-600' },
      { name: 'IX', fullName: 'X Identity', color: 'bg-purple-600' },
      { name: 'IY', fullName: 'Y Identity', color: 'bg-purple-600' },
      { name: 'RXX', fullName: 'RXX Interaction', color: 'bg-purple-600' },
      { name: 'RZZ', fullName: 'RZZ Interaction', color: 'bg-purple-600' },
      { name: 'RX', fullName: 'RX Rotation', color: 'bg-purple-600' },
      { name: 'RY', fullName: 'RY Rotation', color: 'bg-purple-600' },
      { name: 'RCCX', fullName: 'Simplified Toffoli', color: 'bg-purple-600' },
      { name: 'RC3X', fullName: 'Simplified 3-Toffoli', color: 'bg-purple-600' },
    ],
    nonUnitary: [
      { name: 'M', fullName: 'Measurement', color: 'bg-gray-600' },
      { name: '||', fullName: 'Barrier', color: 'bg-gray-600' },
      { name: 'Reset', fullName: 'Reset Qubit', color: 'bg-gray-600' },
      { name: 'Control', fullName: 'Control Modifier', color: 'bg-gray-500' },
      { name: 'if', fullName: 'Conditional Operation', color: 'bg-gray-500' },
    ],
  };


  // Category labels for display
  const categoryLabels = {
    hadamard: 'Hadamard',
    classical: 'Classical',
    phase: 'Phase',
    quantum: 'Quantum',
    nonUnitary: 'Visualizations',
  };

  // Filter gates based on search
  const filteredGates = useMemo(() => {
    const result = {};
    Object.entries(gates).forEach(([category, categoryGates]) => {
      result[category] = categoryGates.filter(gate =>
        gate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gate.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return result;
  }, [searchTerm]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleDragStart = (e, gate) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'gate', gate }));
  };

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-700 h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Operations</h3>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
              title="List view"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode('icons')}
              className={`p-1.5 rounded transition ${
                viewMode === 'icons'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
              title="Icon view"
            >
              <Grid3x3 size={14} />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search gates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition"
          />
        </div>
      </div>

      {/* Gate Categories */}
      <div className="flex-1 overflow-y-auto p-3">
        {Object.entries(gates).map(([categoryKey, categoryGates]) => {
          const filtered = filteredGates[categoryKey];
          if (filtered.length === 0) return null;

          const categoryColorMap = {
            hadamard: { dot: 'bg-red-500', border: 'border-red-900', header: 'hover:text-red-300' },
            classical: { dot: 'bg-blue-500', border: 'border-blue-900', header: 'hover:text-blue-300' },
            phase: { dot: 'bg-cyan-500', border: 'border-cyan-900', header: 'hover:text-cyan-300' },
            quantum: { dot: 'bg-purple-500', border: 'border-purple-900', header: 'hover:text-purple-300' },
            nonUnitary: { dot: 'bg-gray-500', border: 'border-gray-700', header: 'hover:text-gray-300' },
          };

          const colors = categoryColorMap[categoryKey];

          return (
            <div key={categoryKey} className="mb-4">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryKey)}
                className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-800 rounded transition text-gray-300 ${colors.header} font-semibold text-xs uppercase tracking-wide mb-2`}
              >
                <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span>
                {expandedCategories[categoryKey] ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                {categoryLabels[categoryKey]}
              </button>

               {/* Gates Display */}
               {expandedCategories[categoryKey] && (
                 <div className={viewMode === 'list' 
                   ? 'space-y-1 pl-4' 
                   : 'grid grid-cols-5 gap-1 pl-0'}>
                   {filtered.map((gate) => (
                     <div
                       key={gate.name}
                       draggable
                       onDragStart={(e) => handleDragStart(e, gate)}
                       className={`cursor-move transition hover:opacity-90 ${
                         viewMode === 'list'
                           ? `p-1.5 border rounded ${gate.color} border-opacity-40 text-white text-xs flex flex-col`
                           : `p-1.5 rounded ${gate.color} text-white flex flex-col items-center justify-center aspect-square text-center hover:shadow-lg`
                       }`}
                       title={gate.fullName}
                     >
                       {viewMode === 'list' ? (
                         <>
                           <div className="font-bold text-xs">{gate.name}</div>
                           <div className="text-xs opacity-80 leading-tight">{gate.fullName}</div>
                         </>
                       ) : (
                         <>
                           <div className="text-sm font-bold leading-tight">{gate.name}</div>
                           <div className="text-xs opacity-90 leading-tight">{gate.fullName}</div>
                         </>
                       )}
                     </div>
                   ))}
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default GatePalette;
