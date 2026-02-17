import React, { useMemo, useState } from 'react';
import { ChevronDown, Info, MoreVertical } from 'lucide-react';
import { useCircuit } from '../context/CircuitContext';

const LEFT_PANEL_OPTIONS = ['Probabilities', 'Statevector'];
const RIGHT_PANEL_OPTIONS = ['Q-sphere', 'Statevector'];

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
    const num = Number(text.replace('pi', ''));
    if (Number.isFinite(num)) return num * Math.PI;
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
    const temp = next[i];
    next[i] = next[j];
    next[j] = temp;
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
      case 'P': {
        state = applySingleQubitGate(state, n, q, c(1, 0), c(0, 0), c(0, 0), c(Math.cos(angle), Math.sin(angle)));
        break;
      }
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
        const control = Number.isInteger(rawControl)
          ? Math.max(0, Math.min(n - 1, rawControl))
          : q === 0
          ? 1
          : q - 1;
        state = applyCnot(state, n, control, q);
        break;
      }
      case 'MEASURE':
      case 'RESET':
      case 'BARRIER':
      case 'I':
      case 'ID':
      default:
        break;
    }
  }

  const probs = state.map(abs2);
  const norm = probs.reduce((s, v) => s + v, 0) || 1;
  const normalized = state.map((amp) => scale(amp, 1 / Math.sqrt(norm)));
  return { n, statevector: normalized };
};

const SimulatorPanel = () => {
  const { circuit, qubits } = useCircuit();
  const [showPanel, setShowPanel] = useState(true);
  const [leftView, setLeftView] = useState('Probabilities');
  const [rightView, setRightView] = useState('Q-sphere');

  const sim = useMemo(() => simulateStatevector(circuit, qubits), [circuit, qubits]);

  const states = useMemo(() => {
    return sim.statevector.map((amp, i) => ({
      state: i.toString(2).padStart(sim.n, '0'),
      amplitude: Math.sqrt(abs2(amp)),
      probability: abs2(amp),
      phase: Math.atan2(amp.im, amp.re),
    }));
  }, [sim]);

  const top = useMemo(() => [...states].sort((a, b) => b.probability - a.probability).slice(0, 8), [states]);

  const renderBarChart = (items, ylabel) => (
    <div className="h-full flex flex-col">
      <div className="flex-1 border border-slate-300 rounded bg-white p-3">
        <div className="relative h-full">
          <div className="absolute left-8 top-2 bottom-8 border-l border-slate-300" />
          <div className="absolute left-8 right-2 bottom-8 border-b border-slate-300" />
          <div className="absolute left-0 top-2 bottom-8 flex flex-col justify-between text-xs text-slate-500">
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>
          <div className="absolute left-10 right-2 bottom-10 top-3 flex items-end gap-1">
            {items.map((item) => (
              <div key={item.state} className="flex-1 min-w-[8px] flex items-end justify-center">
                <div
                  className="w-full bg-sky-400"
                  style={{ height: `${Math.max(2, item.value * 100)}%` }}
                  title={`${item.state}: ${(item.value * 100).toFixed(2)}%`}
                />
              </div>
            ))}
          </div>
          <div className="absolute left-10 right-2 bottom-0 flex gap-1">
            {items.map((item) => (
              <span key={`l-${item.state}`} className="flex-1 text-[10px] text-slate-500 rotate-[-65deg] origin-top-left">
                {item.state}
              </span>
            ))}
          </div>
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-500">{ylabel}</div>
        </div>
      </div>
    </div>
  );

  const renderQSphere = () => {
    const display = top.slice(0, 6);
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 border border-slate-300 rounded bg-white p-3 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-56 h-56 rounded-full border border-slate-300 bg-slate-100">
              <div className="absolute top-1/2 left-0 right-0 border-t border-slate-300" />
              <div className="absolute top-[68%] left-[14%] right-[14%] h-10 border border-slate-300 rounded-full" />
              {display.map((item, idx) => {
                const theta = (idx / Math.max(1, display.length)) * Math.PI * 2;
                const r = 58 * (0.35 + item.probability);
                const x = Math.cos(theta) * r;
                const y = Math.sin(theta) * r * 0.65;
                const size = 6 + item.probability * 24;
                return (
                  <div
                    key={`q-${item.state}`}
                    className="absolute rounded-full border border-white/70"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      width: `${size}px`,
                      height: `${size}px`,
                      transform: 'translate(-50%, -50%)',
                      background: `hsl(${((item.phase + Math.PI) / (2 * Math.PI)) * 360}deg 80% 55%)`,
                    }}
                    title={`|${item.state}> P=${(item.probability * 100).toFixed(1)}% phase=${item.phase.toFixed(2)}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 text-xs text-slate-600">
            <div>Top state: |{top[0]?.state || '0'.repeat(sim.n)}&gt;</div>
            <div>Probability: {((top[0]?.probability || 1) * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
    );
  };

  const renderPanel = (view) => {
    if (view === 'Q-sphere') return renderQSphere();
    if (view === 'Statevector') {
      const data = states.slice(0, 16).map((s) => ({ state: s.state, value: s.amplitude }));
      return renderBarChart(data, 'Amplitude');
    }
    const data = states.slice(0, 16).map((s) => ({ state: s.state, value: s.probability }));
    return renderBarChart(data, 'Probability (%)');
  };

  const renderHeader = (view, onChange, options) => (
    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 bg-slate-50">
      <div className="relative">
        <select
          value={view}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-slate-300 rounded px-2 py-1 pr-7 text-lg text-slate-700"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
      <div className="flex items-center gap-2">
        <button className="text-slate-500 hover:text-slate-700" title={`About ${view}`}>
          <Info size={16} />
        </button>
        <button className="text-slate-500 hover:text-slate-700" title="Panel options">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <section className={`bg-slate-100 border-t border-slate-300 transition-all ${showPanel ? 'h-[340px]' : 'h-12'}`}>
      <div className="h-12 px-4 flex items-center justify-between bg-slate-50 border-b border-slate-300">
        <button onClick={() => setShowPanel((prev) => !prev)} className="text-sm text-slate-700 flex items-center gap-1">
          Visualizations
          <ChevronDown size={16} className={`${showPanel ? '' : '-rotate-90'} transition-transform`} />
        </button>
        {showPanel && (
          <span className="text-xs text-slate-500">Live update while drag & drop</span>
        )}
      </div>

      {showPanel && (
        <div className="h-[288px] grid grid-cols-1 lg:grid-cols-2">
          <div className="border-r border-slate-300 flex flex-col">
            {renderHeader(leftView, setLeftView, LEFT_PANEL_OPTIONS)}
            <div className="flex-1 p-2">{renderPanel(leftView)}</div>
          </div>
          <div className="flex flex-col">
            {renderHeader(rightView, setRightView, RIGHT_PANEL_OPTIONS)}
            <div className="flex-1 p-2">{renderPanel(rightView)}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SimulatorPanel;
