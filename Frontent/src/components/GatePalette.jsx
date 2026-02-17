import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';

const GATE_CATEGORIES = {
  operations: {
    label: 'Operations',
    gates: [
      { name: 'H', fullName: 'Hadamard' },
      { name: 'CNOT', fullName: 'Controlled NOT' },
      { name: 'CCX', fullName: 'Toffoli' },
      { name: 'SWAP', fullName: 'Swap' },
      { name: 'I', fullName: 'Identity' },
      { name: 'X', fullName: 'Pauli X' },
      { name: 'Y', fullName: 'Pauli Y' },
    ],
    dot: 'bg-blue-500',
  },
  phase: {
    label: 'Phase',
    gates: [
      { name: 'T', fullName: 'T Gate' },
      { name: 'S', fullName: 'S Gate' },
      { name: 'Z', fullName: 'Pauli Z' },
      { name: 'Tdg', fullName: 'T Dagger' },
      { name: 'Sdg', fullName: 'S Dagger' },
      { name: 'P', fullName: 'Phase' },
      { name: 'RZ', fullName: 'RZ Rotation' },
      { name: 'RX', fullName: 'RX Rotation' },
      { name: 'RY', fullName: 'RY Rotation' },
    ],
    dot: 'bg-cyan-500',
  },
  nonUnitary: {
    label: 'Non-unitary & modifiers',
    gates: [
      { name: 'Measure', fullName: 'Measurement' },
      { name: 'Reset', fullName: 'Reset qubit' },
      { name: 'Barrier', fullName: 'Barrier' },
      { name: 'Control', fullName: 'Control modifier' },
      { name: 'if', fullName: 'Conditional' },
    ],
    dot: 'bg-gray-500',
  },
};

const colorForGate = (gateName) => {
  if (['Measure', 'Reset', 'Barrier', 'Control', 'if'].includes(gateName)) return 'bg-gray-600';
  if (['RX', 'RY', 'RZ', 'P'].includes(gateName)) return 'bg-cyan-500';
  if (gateName === 'H') return 'bg-red-500';
  return 'bg-blue-700';
};

const GatePalette = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState({
    operations: true,
    phase: true,
    nonUnitary: true,
  });

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return GATE_CATEGORIES;

    const reduced = {};
    Object.entries(GATE_CATEGORIES).forEach(([key, value]) => {
      const gates = value.gates.filter(
        (gate) =>
          gate.name.toLowerCase().includes(term) ||
          gate.fullName.toLowerCase().includes(term)
      );
      if (gates.length > 0) {
        reduced[key] = { ...value, gates };
      }
    });
    return reduced;
  }, [searchTerm]);

  const handleDragStart = (event, gate) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify({ type: 'gate', gate }));
  };

  return (
    <aside className="w-80 bg-gray-900 border-r border-gray-700 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
        <h3 className="text-white text-2xl font-semibold mb-3">Operations</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search gate"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <div className="p-3 space-y-4">
        {Object.entries(filtered).map(([key, category]) => (
          <section key={key}>
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))}
              className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-800 text-left"
            >
              <span className={`w-2 h-2 rounded-full ${category.dot}`} />
              {expanded[key] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className="text-sm font-semibold text-gray-200">{category.label}</span>
            </button>

            {expanded[key] && (
              <div className="grid grid-cols-6 gap-2 mt-2">
                {category.gates.map((gate) => (
                  <div
                    key={`${key}-${gate.name}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, gate)}
                    className={`${colorForGate(gate.name)} cursor-move rounded text-white h-10 flex items-center justify-center text-sm font-semibold hover:opacity-85`}
                    title={gate.fullName}
                  >
                    {gate.name}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </aside>
  );
};

export default GatePalette;
