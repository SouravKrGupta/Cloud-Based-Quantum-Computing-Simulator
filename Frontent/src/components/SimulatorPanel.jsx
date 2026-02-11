import React, { useState, useMemo } from 'react';
import { useCircuit } from '../context/CircuitContext';
import { BarChart3, Zap, Eye } from 'lucide-react';

const SimulatorPanel = () => {
  const { circuit, qubits, visualizations, setVisualizations } = useCircuit();
  const [showPanel, setShowPanel] = useState(true);

  // Compute statevector (simplified for demo)
  const statevector = useMemo(() => {
    if (circuit.length === 0) {
      // Initial state |0...0⟩
      const size = Math.pow(2, qubits);
      const vec = new Array(size).fill(0);
      vec[0] = 1;
      return vec;
    }
    // In production, call actual quantum simulator
    // For now, return random probabilities normalized
    const size = Math.pow(2, qubits);
    const vec = Array.from({ length: size }, () => Math.random());
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
    return vec.map((v) => v / norm);
  }, [circuit, qubits]);

  // Compute probabilities from statevector
  const probabilities = useMemo(() => {
    return statevector.map((amp) => Math.abs(amp) ** 2);
  }, [statevector]);

  // Top probability states
  const topStates = useMemo(() => {
    return probabilities
      .map((prob, index) => ({
        state: index.toString(2).padStart(qubits, '0'),
        probability: prob,
        percentage: (prob * 100).toFixed(2),
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 8);
  }, [probabilities, qubits]);

  const handleVisualizationChange = (type) => {
    setVisualizations({ ...visualizations, type });
  };

  return (
    <div className={`bg-gray-800 border-t border-gray-700 transition-all ${
      showPanel ? 'h-96' : 'h-12'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700" onClick={() => setShowPanel(!showPanel)}>
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Eye size={20} />
          Visualizations
        </h3>
        <button className="text-gray-400 hover:text-white">
          {showPanel ? '−' : '+'}
        </button>
      </div>

      {showPanel && (
        <div className="p-4 h-80 overflow-y-auto">
          {/* Visualization Type Selector */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={() => handleVisualizationChange('statevector')}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                visualizations.type === 'statevector'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Zap size={16} />
              Statevector
            </button>
            <button
              onClick={() => handleVisualizationChange('histogram')}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                visualizations.type === 'histogram'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <BarChart3 size={16} />
              Probability Histogram
            </button>
            <button
              onClick={() => handleVisualizationChange('qsphere')}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                visualizations.type === 'qsphere'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Eye size={16} />
              Q-Sphere
            </button>
          </div>

          {/* Visualization Content */}
          {visualizations.type === 'statevector' && (
            <div>
              <h4 className="text-white font-semibold mb-3">Statevector</h4>
              <div className="space-y-2">
                {statevector.map((amp, index) => {
                  const prob = Math.abs(amp) ** 2;
                  const prob_percent = (prob * 100).toFixed(2);
                  if (prob > 0.01) {
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-gray-300 text-sm w-16">
                          {index.toString(2).padStart(qubits, '0')}
                        </span>
                        <div className="flex-1 bg-gray-700 rounded h-6 relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"
                            style={{ width: `${prob * 100}%` }}
                          ></div>
                          <span className="absolute top-0 left-2 text-xs text-white h-full flex items-center">
                            {prob_percent}%
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {visualizations.type === 'histogram' && (
            <div>
              <h4 className="text-white font-semibold mb-3">
                Probability Histogram (Top States)
              </h4>
              <div className="space-y-3">
                {topStates.map((state) => (
                  <div key={state.state} className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm w-24 font-mono">
                      |{state.state}⟩
                    </span>
                    <div className="flex-1 bg-gray-700 rounded h-8 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-full transition-all"
                        style={{ width: `${state.probability * 100}%` }}
                      ></div>
                      <span className="absolute top-0 right-2 text-xs text-white h-full flex items-center font-semibold">
                        {state.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-xs text-gray-400 mt-4">
                  Total states: {Math.pow(2, qubits)}
                </div>
              </div>
            </div>
          )}

          {visualizations.type === 'qsphere' && (
            <div className="text-center">
              <div className="inline-block w-48 h-48 rounded-full border-4 border-blue-500 bg-gray-900 flex items-center justify-center">
                <div className="text-gray-400 text-sm">
                  Q-Sphere visualization with {qubits} qubit(s)
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-4">
                (3D Q-Sphere would render here)
              </p>
            </div>
          )}

          {/* Circuit Stats */}
          <div className="mt-6 p-3 bg-gray-900 rounded border border-gray-700">
            <div className="text-white text-sm space-y-1">
              <div>
                <span className="text-gray-400">Gates in circuit:</span>{' '}
                <span className="font-semibold">{circuit.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Qubits:</span>{' '}
                <span className="font-semibold">{qubits}</span>
              </div>
              <div>
                <span className="text-gray-400">Quantum state dimension:</span>{' '}
                <span className="font-semibold">2^{qubits} = {Math.pow(2, qubits)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulatorPanel;
