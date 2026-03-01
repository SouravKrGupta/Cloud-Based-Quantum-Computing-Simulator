import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, BarChart3, Globe, Atom } from 'lucide-react';
import { useCircuit } from '../context/CircuitContext';

const Visualizations = () => {
  const navigate = useNavigate();
  const { circuit, qubits } = useCircuit();
  const [activeView, setActiveView] = useState('probabilities');

  // Quantum simulation utilities
  const c = (re = 0, im = 0) => ({ re, im });
  const add = (a, b) => c(a.re + b.re, a.im + b.im);
  const mul = (a, b) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const scale = (a, k) => c(a.re * k, a.im * k);
  const abs2 = (a) => a.re * a.re + a.im * a.im;

  const parseAngle = (value, fallback = 0) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value !== 'string') return fallback;
    const text = value.trim().toLowerCase().replace(/\s+/g, '');

    if (text === 'pi') return Math.PI;
    if (text === '-pi') return -Math.PI;
    if (text === 'pi/2') return Math.PI / 2;
    if (text === '-pi/2') return -Math.PI / 2;
    if (text === 'pi/4') return Math.PI / 4;
    if (text === '-pi/4') return -Math.PI / 4;
    if (text.includes('pi')) {
      const coeff = Number(text.replace('pi', ''));
      if (Number.isFinite(coeff)) return coeff * Math.PI;
    }
    const n = Number(text);
    return Number.isFinite(n) ? n : fallback;
  };

  const applySingleQubitGate = (state, n, qubit, m00, m01, m10, m11) => {
    const size = 1 << n;
    const bit = 1 << qubit;
    const next = state.slice();

    for (let i = 0; i < size; i += 1) {
      if ((i & bit) !== 0) continue;
      const j = i | bit;
      const a0 = state[i];
      const a1 = state[j];
      next[i] = add(mul(m00, a0), mul(m01, a1));
      next[j] = add(mul(m10, a0), mul(m11, a1));
    }
    return next;
  };

  const applyCnot = (state, n, control, target) => {
    if (control === target) return state;
    const size = 1 << n;
    const cBit = 1 << control;
    const tBit = 1 << target;
    const next = state.slice();

    for (let i = 0; i < size; i += 1) {
      if ((i & cBit) === 0) continue;
      if ((i & tBit) !== 0) continue;
      const j = i | tBit;
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
    }
    return next;
  };

  const simulateStatevector = (circuit, qubits) => {
    const n = Math.min(Math.max(qubits, 1), 8);
    const size = 1 << n;
    let state = new Array(size).fill(null).map(() => c(0, 0));
    state[0] = c(1, 0);

    const sorted = [...circuit].sort((a, b) => a.time - b.time);

    for (const gateOp of sorted) {
      const gate = (gateOp.gate || '').toUpperCase();
      const q = Math.max(0, Math.min(n - 1, Number(gateOp.qubitIndex ?? 0)));
      const angle = parseAngle(gateOp?.params?.angle, 0);

      switch (gate) {
        case 'H': {
          const s = 1 / Math.sqrt(2);
          state = applySingleQubitGate(state, n, q, scale(c(1, 0), s), scale(c(1, 0), s), scale(c(1, 0), s), scale(c(-1, 0), s));
          break;
        }
        case 'X':
          state = applySingleQubitGate(state, n, q, c(0, 0), c(1, 0), c(1, 0), c(0, 0));
          break;
        case 'Y':
          state = applySingleQubitGate(state, n, q, c(0, 0), c(0, -1), c(0, 1), c(0, 0));
          break;
        case 'Z':
          state = applySingleQubitGate(state, n, q, c(1, 0), c(0, 0), c(0, 0), c(-1, 0));
          break;
        case 'S':
          state = applySingleQubitGate(state, n, q, c(1, 0), c(0, 0), c(0, 0), c(0, 1));
          break;
        case 'SDG':
          state = applySingleQubitGate(state, n, q, c(1, 0), c(0, 0), c(0, 0), c(0, -1));
          break;
        case 'T': {
          const p = Math.PI / 4;
          state = applySingleQubitGate(state, n, q, c(1, 0), c(0, 0), c(0, 0), c(Math.cos(p), Math.sin(p)));
          break;
        }
        case 'TDG': {
          const p = -Math.PI / 4;
          state = applySingleQubitGate(state, n, q, c(1, 0), c(0, 0), c(0, 0), c(Math.cos(p), Math.sin(p)));
          break;
        }
        case 'P':
          state = applySingleQubitGate(state, n, q, c(1, 0), c(0, 0), c(0, 0), c(Math.cos(angle), Math.sin(angle)));
          break;
        case 'RX': {
          const ct = Math.cos(angle / 2);
          const st = Math.sin(angle / 2);
          state = applySingleQubitGate(state, n, q, c(ct, 0), c(0, -st), c(0, -st), c(ct, 0));
          break;
        }
        case 'RY': {
          const ct = Math.cos(angle / 2);
          const st = Math.sin(angle / 2);
          state = applySingleQubitGate(state, n, q, c(ct, 0), c(-st, 0), c(st, 0), c(ct, 0));
          break;
        }
        case 'RZ': {
          const a = angle / 2;
          state = applySingleQubitGate(state, n, q, c(Math.cos(-a), Math.sin(-a)), c(0, 0), c(0, 0), c(Math.cos(a), Math.sin(a)));
          break;
        }
        case 'CNOT':
        case 'CX': {
          const rawControl = Number(gateOp?.params?.control);
          const control = Number.isInteger(rawControl) ? Math.max(0, Math.min(n - 1, rawControl)) : q === 0 ? 1 : q - 1;
          state = applyCnot(state, n, control, q);
          break;
        }
        default:
          break;
      }
    }

    const probs = state.map(abs2);
    const norm = probs.reduce((s, v) => s + v, 0) || 1;
    const normalized = state.map((amp) => scale(amp, 1 / Math.sqrt(norm)));
    return { n, statevector: normalized };
  };

  // Calculate simulation results
  const sim = simulateStatevector(circuit, qubits);
  const states = sim.statevector.map((amp, i) => ({
    state: i.toString(2).padStart(sim.n, '0'),
    amplitude: Math.sqrt(abs2(amp)),
    probability: abs2(amp),
    phase: Math.atan2(amp.im, amp.re),
  }));

  const topStates = [...states].sort((a, b) => b.probability - a.probability);

  // Render Probability Bar Chart
  const renderProbabilityChart = () => {
    const data = states.slice(0, 16).map((s) => ({ state: s.state, value: s.probability }));
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 border border-slate-700 rounded bg-slate-900 p-6">
          <div className="relative h-full">
            {/* Y-axis */}
            <div className="absolute left-8 top-2 bottom-8 border-l border-slate-700" />
            {/* X-axis */}
            <div className="absolute left-8 right-2 bottom-8 border-b border-slate-700" />
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-2 bottom-8 flex flex-col justify-between text-xs text-gray-500">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>
            
            {/* Bars */}
            <div className="absolute left-10 right-2 bottom-10 top-3 flex items-end gap-1">
              {data.map((item) => (
                <div key={item.state} className="flex-1 min-w-[12px] flex items-end justify-center">
                  <div
                    className="w-full bg-cyan-500 hover:bg-cyan-400 transition-colors cursor-pointer"
                    style={{ height: `${Math.max(2, item.value * 100)}%` }}
                    title={`|${item.state}>: ${(item.value * 100).toFixed(2)}%`}
                  />
                </div>
              ))}
            </div>
            
            {/* X-axis labels */}
            <div className="absolute left-10 right-2 bottom-0 flex gap-1">
              {data.map((item) => (
                <span key={`label-${item.state}`} className="flex-1 text-[10px] text-gray-500 rotate-[-65deg] origin-top-left">
                  |{item.state}⟩
                </span>
              ))}
            </div>
            
            {/* Y-axis title */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500">
              Probability
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Top State</h3>
            <p className="text-2xl font-bold text-white">|{topStates[0]?.state}⟩</p>
            <p className="text-sm text-gray-400">{(topStates[0]?.probability * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Total States</h3>
            <p className="text-2xl font-bold text-white">{states.length}</p>
            <p className="text-sm text-gray-400">2^{sim.n} states</p>
          </div>
        </div>
      </div>
    );
  };

  // Render Q-Sphere
  const renderQSphere = () => {
    const displayStates = topStates.slice(0, 12);
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 border border-slate-700 rounded bg-slate-900 p-6 relative overflow-hidden">
          {/* Q-Sphere visualization */}
          <div className="absolute inset-x-0 top-0 bottom-20 flex items-center justify-center">
            <div className="relative w-80 h-80 rounded-full border border-slate-700 bg-slate-800/50">
              {/* Equator line */}
              <div className="absolute top-1/2 left-0 right-0 border-t border-slate-700" />
              {/* Latitude line */}
              <div className="absolute top-[68%] left-[14%] right-[14%] h-16 border border-slate-700 rounded-full" />
              
              {/* State spheres */}
              {displayStates.map((item, idx) => {
                const theta = (idx / Math.max(1, displayStates.length)) * Math.PI * 2;
                const r = 70 * (0.35 + item.probability);
                const x = Math.cos(theta) * r;
                const y = Math.sin(theta) * r * 0.65;
                const size = 8 + item.probability * 32;
                
                return (
                  <div
                    key={`q-${item.state}`}
                    className="absolute rounded-full border border-white/60 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      width: `${size}px`,
                      height: `${size}px`,
                      transform: 'translate(-50%, -50%)',
                      background: `hsl(${((item.phase + Math.PI) / (2 * Math.PI)) * 360}deg 75% 55%)`,
                    }}
                    title={`|${item.state}⟩ P=${(item.probability * 100).toFixed(1)}% phase=${item.phase.toFixed(2)}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-16 left-6 text-xs text-gray-400">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full" />
              <span>Top state: |{topStates[0]?.state || '0'.repeat(sim.n)}⟩</span>
            </div>
            <div>Probability: {((topStates[0]?.probability || 1) * 100).toFixed(2)}%</div>
          </div>
          
          {/* State list */}
          <div className="absolute bottom-2 left-6 right-6 text-[10px] text-gray-400">
            <div className="grid grid-cols-4 gap-2 border-t border-gray-700 pt-2">
              {displayStates.slice(0, 4).map((item) => (
                <div key={`qv-${item.state}`} className="truncate hover:text-white transition-colors cursor-pointer">
                  |{item.state}⟩ {(item.probability * 100).toFixed(1)}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Statevector Bar Chart
  const renderStatevectorChart = () => {
    const data = states.slice(0, 16).map((s) => ({ state: s.state, value: s.amplitude }));
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 border border-slate-700 rounded bg-slate-900 p-6">
          <div className="relative h-full">
            {/* Y-axis */}
            <div className="absolute left-8 top-2 bottom-8 border-l border-slate-700" />
            {/* X-axis */}
            <div className="absolute left-8 right-2 bottom-8 border-b border-slate-700" />
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-2 bottom-8 flex flex-col justify-between text-xs text-gray-500">
              <span>1.0</span>
              <span>0.8</span>
              <span>0.6</span>
              <span>0.4</span>
              <span>0.2</span>
              <span>0.0</span>
            </div>
            
            {/* Bars */}
            <div className="absolute left-10 right-2 bottom-10 top-3 flex items-end gap-1">
              {data.map((item) => (
                <div key={item.state} className="flex-1 min-w-[12px] flex items-end justify-center">
                  <div
                    className="w-full bg-purple-500 hover:bg-purple-400 transition-colors cursor-pointer"
                    style={{ height: `${Math.max(2, item.value * 100)}%` }}
                    title={`|${item.state}>: ${item.value.toFixed(3)}`}
                  />
                </div>
              ))}
            </div>
            
            {/* X-axis labels */}
            <div className="absolute left-10 right-2 bottom-0 flex gap-1">
              {data.map((item) => (
                <span key={`label-${item.state}`} className="flex-1 text-[10px] text-gray-500 rotate-[-65deg] origin-top-left">
                  |{item.state}⟩
                </span>
              ))}
            </div>
            
            {/* Y-axis title */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500">
              Amplitude
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Max Amplitude</h3>
            <p className="text-2xl font-bold text-white">{Math.max(...states.map(s => s.amplitude)).toFixed(3)}</p>
            <p className="text-sm text-gray-400">State: |{topStates[0]?.state}⟩</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Avg Amplitude</h3>
            <p className="text-2xl font-bold text-white">{(states.reduce((sum, s) => sum + s.amplitude, 0) / states.length).toFixed(3)}</p>
            <p className="text-sm text-gray-400">Across all states</p>
          </div>
        </div>
      </div>
    );
  };

  // Render active view
  const renderActiveView = () => {
    switch (activeView) {
      case 'probabilities':
        return renderProbabilityChart();
      case 'qsphere':
        return renderQSphere();
      case 'statevector':
        return renderStatevectorChart();
      default:
        return renderProbabilityChart();
    }
  };

  if (!circuit || circuit.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-950 text-white">
        {/* Header */}
        <div className="bg-slate-900 text-white border-b border-slate-700 py-3 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/circuit-composer')}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800 transition"
              >
                <ArrowLeft size={20} />
                Back to Composer
              </button>
              <div className="flex items-center gap-2">
                <Eye size={24} className="text-cyan-400" />
                <h1 className="text-xl font-semibold">Visualizations</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Eye size={64} className="mx-auto mb-4 text-slate-600" />
            <h2 className="text-2xl font-semibold mb-2">No Circuit Visualization</h2>
            <p className="text-slate-400 mb-6">
              Please add gates to your circuit in the composer to see visualizations.
            </p>
            <button
              onClick={() => navigate('/circuit-composer')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Go to Circuit Composer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-700 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/circuit-composer')}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800 transition"
            >
              <ArrowLeft size={20} />
              Back to Composer
            </button>
            <div className="flex items-center gap-2">
              <Eye size={24} className="text-cyan-400" />
              <h1 className="text-xl font-semibold">Visualizations</h1>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Live from drag-drop operations • {circuit.length} gates
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar - View Selection */}
          <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-700 bg-slate-800">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                Visualization Types
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveView('probabilities')}
                  className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeView === 'probabilities'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <BarChart3 size={16} />
                  Probability Distribution
                </button>
                <button
                  onClick={() => setActiveView('qsphere')}
                  className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeView === 'qsphere'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Globe size={16} />
                  Q-Sphere (3D)
                </button>
                <button
                  onClick={() => setActiveView('statevector')}
                  className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeView === 'statevector'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Atom size={16} />
                  Statevector Amplitude
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                About Visualizations
              </h3>
              
              {activeView === 'probabilities' && (
                <div className="text-xs text-slate-400">
                  <p className="mb-2">
                    The probability distribution shows the likelihood of each quantum state being measured.
                  </p>
                  <p className="mb-2">
                    Each bar represents the probability of measuring a specific quantum state, calculated from
                    the statevector amplitudes.
                  </p>
                  <p>
                    The highest probability state is highlighted in cyan.
                  </p>
                </div>
              )}

              {activeView === 'qsphere' && (
                <div className="text-xs text-slate-400">
                  <p className="mb-2">
                    The Q-Sphere provides an intuitive 3D visualization of quantum states. Each point on the sphere
                    represents a quantum state, with its position showing the phase and amplitude.
                  </p>
                  <p className="mb-2">
                    - <strong>Radius:</strong> Probability amplitude
                  </p>
                  <p className="mb-2">
                    - <strong>Color:</strong> Phase (HSL color wheel)
                  </p>
                  <p className="mb-2">
                    - <strong>Size:</strong> Probability
                  </p>
                  <p>
                    This visualization helps identify quantum superpositions and entanglement patterns.
                  </p>
                </div>
              )}

              {activeView === 'statevector' && (
                <div className="text-xs text-slate-400">
                  <p className="mb-2">
                    The statevector visualization shows the amplitude of each quantum state in the superposition.
                  </p>
                  <p className="mb-2">
                    Quantum states with larger amplitudes have higher probabilities of being measured.
                  </p>
                  <p>
                    This visualization is ideal for understanding the linear algebra representation of quantum circuits.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main View */}
          <div className="flex-1 flex flex-col">
            {/* View Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {activeView === 'probabilities' && 'Probability Distribution'}
                  {activeView === 'qsphere' && 'Q-Sphere Visualization'}
                  {activeView === 'statevector' && 'Statevector Amplitude'}
                </h2>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-slate-700 rounded text-xs text-gray-300">
                    {states.length} states
                  </div>
                  <div className="px-3 py-1 bg-slate-700 rounded text-xs text-gray-300">
                    {circuit.length} gates
                  </div>
                </div>
              </div>
            </div>

            {/* Visualization Content */}
            <div className="flex-1 p-6">
              {renderActiveView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
