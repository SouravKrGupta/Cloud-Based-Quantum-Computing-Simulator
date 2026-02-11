import React, { useState } from 'react';
import {
  Play,
  Save,
  Share2,
  Upload,
  Settings,
  Trash2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Undo,
  Redo
} from 'lucide-react';

// Quantum gate definitions (IBM Quantum Composer style)
const GATES = [
  // Quantum Gates - Single Qubit
  { id: 'hadamard', name: 'Hadamard', symbol: 'H', color: 'bg-red-500', group: 'Single Qubit' },
  { id: 'pauli-x', name: 'Pauli-X', symbol: 'X', color: 'bg-blue-500', group: 'Single Qubit' },
  { id: 'pauli-y', name: 'Pauli-Y', symbol: 'Y', color: 'bg-green-500', group: 'Single Qubit' },
  { id: 'pauli-z', name: 'Pauli-Z', symbol: 'Z', color: 'bg-purple-500', group: 'Single Qubit' },
  { id: 'sx', name: 'SX', symbol: '√X', color: 'bg-yellow-500', group: 'Single Qubit' },
  { id: 'sxdg', name: 'SXdg', symbol: '√X⁺', color: 'bg-orange-500', group: 'Single Qubit' },
  { id: 'rx', name: 'RX', symbol: 'RX', color: 'bg-indigo-500', group: 'Single Qubit' },
  { id: 'ry', name: 'RY', symbol: 'RY', color: 'bg-pink-500', group: 'Single Qubit' },
  { id: 'rz', name: 'RZ', symbol: 'RZ', color: 'bg-teal-500', group: 'Single Qubit' },
  { id: 'u', name: 'U', symbol: 'U', color: 'bg-cyan-500', group: 'Single Qubit' },
  
  // Phase Gates
  { id: 't-gate', name: 'T Gate', symbol: 'T', color: 'bg-amber-500', group: 'Phase' },
  { id: 's-gate', name: 'S Gate', symbol: 'S', color: 'bg-lime-500', group: 'Phase' },
  { id: 'phase-shift', name: 'Phase', symbol: 'P', color: 'bg-blue-600', group: 'Phase' },
  
  // Multi-Qubit Gates
  { id: 'cnot', name: 'CNOT', symbol: '⊕', color: 'bg-red-600', group: 'Multi-Qubit' },
  { id: 'rzz', name: 'RZZ', symbol: 'RZZ', color: 'bg-green-600', group: 'Multi-Qubit' },
  { id: 'rccx', name: 'RCCX', symbol: 'RCCX', color: 'bg-purple-600', group: 'Multi-Qubit' },
  { id: 'rc3x', name: 'RC3X', symbol: 'RC3X', color: 'bg-orange-600', group: 'Multi-Qubit' },
  
  // Non-Unitary Operations
  { id: 'measure', name: 'Measure', symbol: '📏', color: 'bg-gray-600', group: 'Non-Unitary' },
  { id: 'reset', name: 'Reset', symbol: '⏮️', color: 'bg-gray-500', group: 'Non-Unitary' },
  { id: 'barrier', name: 'Barrier', symbol: '|', color: 'bg-gray-400', group: 'Non-Unitary' },
  
  // Classical Operations
  { id: 'identity', name: 'Identity', symbol: 'I', color: 'bg-gray-700', group: 'Classical' },
  { id: 'swap', name: 'Swap', symbol: 'SWAP', color: 'bg-indigo-600', group: 'Classical' },
  { id: 'if', name: 'If', symbol: 'if', color: 'bg-pink-600', group: 'Classical' }
];

const QuantumComposer = () => {
  const [qubits, setQubits] = useState(4);
  const [gates, setGates] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);
  const [draggedGate, setDraggedGate] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [circuitName, setCircuitName] = useState('Untitled Circuit');
  const [currentCircuitId, setCurrentCircuitId] = useState(null);
  const [showCodeView, setShowCodeView] = useState(false);
  const [showVisualizations, setShowVisualizations] = useState(false);

  // Generate OpenQASM 2.0 code from circuit
  const generateOpenQASM = () => {
    let code = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\nqreg q[${qubits}];\ncreg c[${qubits}];\n\n`;
    
    // Sort gates by position and qubit
    const sortedGates = [...gates].sort((a, b) => {
      if (a.position === b.position) {
        return a.qubit - b.qubit;
      }
      return a.position - b.position;
    });

    sortedGates.forEach(gate => {
      const gateDefinition = GATES.find(g => g.id === gate.type);
      if (gateDefinition) {
        // Handle gate parameters
        let gateParams = '';
        if (gate.properties.angle) {
          gateParams = `(${gate.properties.angle}) `;
        }
        
        // Handle measurement gates specially
        if (gateDefinition.id === 'measure') {
          code += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
        } else {
          code += `${gateDefinition.symbol.toLowerCase()} ${gateParams}q[${gate.qubit}];\n`;
        }
      }
    });

    return code;
  };

  // Handle gate drag start
  const handleGateDragStart = (gate) => {
    setDraggedGate(gate);
  };

  // Handle gate drop on canvas
  const handleDrop = (e, qubit, position) => {
    e.preventDefault();
    if (!draggedGate) return;

    const newGate = {
      id: `gate-${Date.now()}`,
      type: draggedGate.id,
      symbol: draggedGate.symbol,
      qubit,
      position,
      properties: {}
    };

    setGates(prev => [...prev, newGate]);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle gate click
  const handleGateClick = (gate) => {
    setSelectedGate(gate);
  };

  // Handle simulation
  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const response = await fetch('http://localhost:8000/api/simulate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          qubits,
          gates,
          circuit_id: currentCircuitId
        })
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const data = await response.json();
      setSimulationResult(data.data);
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Simulation failed: ' + error.message);
    } finally {
      setIsSimulating(false);
    }
  };

  // Handle save circuit
  const handleSave = async () => {
    try {
      const circuitData = {
        name: circuitName,
        description: 'Quantum circuit created with QuantumComposer',
        qubits,
        gates,
        is_public: false
      };

      let response;
      if (currentCircuitId) {
        response = await fetch(`http://localhost:8000/api/circuits/${currentCircuitId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(circuitData)
        });
      } else {
        response = await fetch('http://localhost:8000/api/circuits/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(circuitData)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save circuit');
      }

      const data = await response.json();
      setCurrentCircuitId(data.data.id);
      alert('Circuit saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed: ' + error.message);
    }
  };

  // Handle load circuit
  const handleLoad = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/circuits/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load circuits');
      }

      const data = await response.json();
      
      const circuits = data.data;
      if (circuits.length === 0) {
        alert('No circuits found');
        return;
      }

      const circuitSelect = prompt(
        'Select a circuit to load:\n' + 
        circuits.map(c => `${c.id}: ${c.name}`).join('\n')
      );

      if (circuitSelect) {
        const circuitId = parseInt(circuitSelect);
        const selectedCircuit = circuits.find(c => c.id === circuitId);
        
        if (selectedCircuit) {
          setQubits(selectedCircuit.qubits);
          setGates(selectedCircuit.gates);
          setCircuitName(selectedCircuit.name);
          setCurrentCircuitId(selectedCircuit.id);
          setSimulationResult(null);
        }
      }
    } catch (error) {
      console.error('Load failed:', error);
      alert('Load failed: ' + error.message);
    }
  };

  // Handle share circuit
  const handleShare = async () => {
    if (!currentCircuitId) {
      alert('Please save the circuit first');
      return;
    }

    const emails = prompt('Enter emails to share with (comma-separated):');
    if (!emails) return;

    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);

    try {
      const response = await fetch(`http://localhost:8000/api/circuits/${currentCircuitId}/share/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          emails: emailList
        })
      });

      if (!response.ok) {
        throw new Error('Failed to share circuit');
      }

      alert('Circuit shared successfully');
    } catch (error) {
      console.error('Share failed:', error);
      alert('Share failed: ' + error.message);
    }
  };

  // Handle make circuit public
  const handleMakePublic = async () => {
    if (!currentCircuitId) {
      alert('Please save the circuit first');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/circuits/${currentCircuitId}/public/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          is_public: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to make circuit public');
      }

      alert('Circuit is now public');
    } catch (error) {
      console.error('Make public failed:', error);
      alert('Make public failed: ' + error.message);
    }
  };

  // Handle delete gate
  const handleDeleteGate = () => {
    if (!selectedGate) return;
    setGates(prev => prev.filter(g => g.id !== selectedGate.id));
    setSelectedGate(null);
  };

  // Get max position from gates
  const maxPosition = Math.max(0, ...gates.map(g => g.position));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">QuantumComposer</h1>
            </div>
            
            <input
              type="text"
              value={circuitName}
              onChange={(e) => setCircuitName(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Circuit Name"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulate}
              disabled={isSimulating || gates.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Play className="w-4 h-4" />
              <span>Simulate</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={handleMakePublic}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Make Public</span>
            </button>

            <button
              onClick={handleLoad}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              <span>Load</span>
            </button>

            <button
              onClick={() => setShowCodeView(!showCodeView)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with quantum gates */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operations</h2>
          
          {Object.entries(
            GATES.reduce((acc, gate) => {
              if (!acc[gate.group]) {
                acc[gate.group] = [];
              }
              acc[gate.group].push(gate);
              return acc;
            }, {})
          ).map(([group, groupGates]) => (
            <div key={group} className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{group}</h3>
              <div className="grid grid-cols-2 gap-2">
                {groupGates.map((gate) => (
                  <div
                    key={gate.id}
                    draggable
                    onDragStart={() => handleGateDragStart(gate)}
                    onClick={() => handleGateClick(gate)}
                    className="flex items-center justify-center space-x-2 p-2 rounded-lg cursor-grab hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className={ `${gate.color} w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm` }>
                      {gate.symbol}
                    </div>
                    <div className="text-xs font-medium text-gray-900">{gate.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Canvas and code view area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas toolbar */}
          <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQubits(Math.max(1, qubits - 1))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                - Qubit
              </button>
              <span className="text-sm text-gray-600">Qubits: {qubits}</span>
              <button
                onClick={() => setQubits(Math.min(10, qubits + 1))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                + Qubit
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert('Undo not implemented')}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={() => alert('Redo not implemented')}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <Redo className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quantum circuit grid */}
          <div className="flex-1 bg-white overflow-auto" style={{ transform: `scale(${zoom})` }}>
            <div className="min-w-max p-8">
              <div className="grid grid-cols-1 gap-2">
                {/* Qubit lines */}
                {Array.from({ length: qubits }).map((_, qubitIndex) => (
                  <div key={qubitIndex} className="flex items-center space-x-2">
                    {/* Qubit label */}
                    <div className="w-16 text-right text-sm font-medium text-gray-900">
                      q[{qubitIndex}]
                    </div>
                    
                    {/* Qubit line with gates */}
                    <div className="flex-1 min-w-[800px]">
                      <div className="flex items-center h-16">
                        {/* Quantum gates */}
                        {Array.from({ length: maxPosition + 2 }).map((_, position) => {
                          const gate = gates.find(g => g.qubit === qubitIndex && g.position === position);
                          const gateDefinition = gate ? GATES.find(g => g.id === gate.type) : null;
                          
                          return (
                            <div
                              key={position}
                              className="w-16 h-16 border border-gray-200 rounded-md flex items-center justify-center relative"
                              onDrop={(e) => handleDrop(e, qubitIndex, position)}
                              onDragOver={handleDragOver}
                            >
                              {gate && gateDefinition && (
                                <div
                                  className={`w-12 h-12 ${gateDefinition.color} rounded-md flex items-center justify-center text-white font-bold text-sm cursor-pointer`}
                                  onClick={() => handleGateClick(gate)}
                                >
                                  {gateDefinition.symbol}
                                </div>
                              )}
                              
                              {/* Add gate indicator */}
                              {!gate && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300 opacity-0 hover:opacity-100">
                                  <div className="w-3 h-3 border-2 border-dashed border-gray-300 rounded-full" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code view */}
          {showCodeView && (
            <div className="bg-gray-900 text-green-400 p-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
              <pre className="text-sm font-mono">{generateOpenQASM()}</pre>
            </div>
          )}

          {/* Visualizations */}
          {showVisualizations && simulationResult && (
            <div className="bg-white border-t border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualizations</h3>
              
              {/* Q-Sphere visualization (placeholder) */}
              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-900 mb-2">Q-Sphere</h4>
                <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Q-Sphere visualization coming soon</p>
                </div>
              </div>

              {/* Probability distribution */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">Probability Distribution</h4>
                <div className="h-64 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-end justify-around h-full">
                    {Object.entries(simulationResult.probability_distribution).map(([state, probability], index) => (
                      <div key={state} className="flex flex-col items-center">
                        <div
                          className="w-16 rounded-t-md transition-all duration-300"
                          style={{
                            height: `${probability * 100}px`,
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                          }}
                        />
                        <div className="mt-2 text-sm font-medium text-gray-900">{state}</div>
                        <div className="text-xs text-gray-500">{(probability * 100).toFixed(0)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right panel */}
        <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          {/* Gate properties panel */}
          {selectedGate && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Gate Properties</h3>
                <button
                  onClick={handleDeleteGate}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gate Type</label>
                  <p className="text-sm text-gray-900">{selectedGate.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qubit Position</label>
                  <p className="text-sm text-gray-900">q[{selectedGate.qubit}]</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gate Position</label>
                  <p className="text-sm text-gray-900">Position {selectedGate.position}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Angle</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedGate.properties.angle || 0}
                    onChange={(e) => setGates(prev => prev.map(g => 
                      g.id === selectedGate.id ? { 
                        ...g, 
                        properties: { ...g.properties, angle: parseFloat(e.target.value) } 
                      } : g
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Simulation results */}
          {simulationResult && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Simulation Results</h3>
                <button
                  onClick={() => setSimulationResult(null)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">State Vectors</div>
                  <div className="text-lg font-semibold text-blue-900">{simulationResult.state_vector.length}</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Measurements</div>
                  <div className="text-lg font-semibold text-green-900">
                    {simulationResult.measurements.reduce((a, b) => a + b, 0)}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600">Execution Time</div>
                  <div className="text-lg font-semibold text-purple-900">
                    {simulationResult.execution_time}s
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600">Circuit Depth</div>
                  <div className="text-lg font-semibold text-orange-900">{gates.length}</div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default QuantumComposer;
