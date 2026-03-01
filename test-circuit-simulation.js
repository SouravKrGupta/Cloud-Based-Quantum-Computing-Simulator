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

  console.log("Initial state:", state);

  const sorted = [...circuit].sort((a, b) => a.time - b.time);
  console.log("Sorted circuit:", sorted);

  for (const gateOp of sorted) {
    const gate = (gateOp.gate || '').toUpperCase();
    const q = Math.max(0, Math.min(n - 1, Number(gateOp.qubitIndex ?? 0)));
    const angle = parseAngle(gateOp?.params?.angle, 0);

    console.log(`Applying ${gate} gate to qubit ${q}`);

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
        console.log(`Unknown gate: ${gate}`);
        break;
    }

    console.log("State after gate:", state);
  }

  const probs = state.map(abs2);
  const norm = probs.reduce((s, v) => s + v, 0) || 1;
  console.log("Total probability before normalization:", norm);
  const normalized = state.map((amp) => scale(amp, 1 / Math.sqrt(norm)));
  
  const finalProbs = normalized.map(abs2);
  console.log("Final probabilities:", finalProbs);
  console.log("Total probability after normalization:", finalProbs.reduce((s, v) => s + v, 0));

  return { n, statevector: normalized };
};

// Test with a simple quantum circuit (1 qubit, H gate)
const testCircuit1 = [
  { id: 1, time: 0, qubitIndex: 0, gate: 'H', params: {} }
];

console.log("=== Testing 1-qubit circuit with H gate ===");
const result1 = simulateStatevector(testCircuit1, 1);
console.log("\n=== Final Results ===");
result1.statevector.forEach((amp, index) => {
  const state = index.toString(2).padStart(result1.n, '0');
  console.log(`|${state}⟩: ${amp.re.toFixed(3)} + ${amp.im.toFixed(3)}i`);
  console.log(`  Probability: ${abs2(amp).toFixed(3)}`);
  console.log(`  Amplitude: ${Math.sqrt(abs2(amp)).toFixed(3)}`);
  console.log(`  Phase: ${Math.atan2(amp.im, amp.re).toFixed(3)} rad`);
  console.log();
});

// Test with Bell state circuit (2 qubits)
const testCircuit2 = [
  { id: 1, time: 0, qubitIndex: 0, gate: 'H', params: {} },
  { id: 2, time: 1, qubitIndex: 1, gate: 'CNOT', params: { control: 0 } }
];

console.log("=== Testing 2-qubit Bell state circuit ===");
const result2 = simulateStatevector(testCircuit2, 2);
console.log("\n=== Final Results ===");
result2.statevector.forEach((amp, index) => {
  const state = index.toString(2).padStart(result2.n, '0');
  console.log(`|${state}⟩: ${amp.re.toFixed(3)} + ${amp.im.toFixed(3)}i`);
  console.log(`  Probability: ${abs2(amp).toFixed(3)}`);
  console.log(`  Amplitude: ${Math.sqrt(abs2(amp)).toFixed(3)}`);
  console.log(`  Phase: ${Math.atan2(amp.im, amp.re).toFixed(3)} rad`);
  console.log();
});
