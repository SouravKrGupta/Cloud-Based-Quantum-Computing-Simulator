import React, { createContext, useState, useCallback } from 'react';

export const CircuitContext = createContext();

export const CircuitProvider = ({ children }) => {
  const [circuit, setCircuit] = useState([]);
  const [qubits, setQubits] = useState(3);
  const [classicalBits, setClassicalBits] = useState(0);
  const [circuitName, setCircuitName] = useState('Untitled Circuit');
  const [mode, setMode] = useState('edit'); // 'edit' or 'inspect'
  const [inspectIndex, setInspectIndex] = useState(0);
  const [alignment, setAlignment] = useState('left'); // 'free', 'left', 'layers'
  const [visualizations, setVisualizations] = useState({
    type: 'statevector',
    data: null,
  });
  const [execution, setExecution] = useState({
    jobId: null,
    status: null,
    result: null,
  });
  const [customGates, setCustomGates] = useState([]);

  // Add gate to circuit
  const addGate = useCallback((time, qubitIndex, gate, params = {}) => {
    const newGate = {
      id: Date.now(),
      time,
      qubitIndex,
      gate,
      params,
    };
    setCircuit((prev) => [...prev, newGate]);
    return newGate;
  }, []);

  // Remove gate from circuit
  const removeGate = useCallback((gateId) => {
    setCircuit((prev) => prev.filter((g) => g.id !== gateId));
  }, []);

  // Update gate parameters
  const updateGate = useCallback((gateId, updates) => {
    setCircuit((prev) =>
      prev.map((g) => (g.id === gateId ? { ...g, ...updates } : g))
    );
  }, []);

  // Clear circuit
  const clearCircuit = useCallback(() => {
    setCircuit([]);
  }, []);

  // Generate OpenQASM code
  const generateOpenQASM = useCallback(() => {
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n';
    qasm += `qreg q[${qubits}];\n`;
    if (classicalBits > 0) {
      qasm += `creg c[${classicalBits}];\n`;
    }

    const sortedGates = [...circuit].sort((a, b) => a.time - b.time);
    sortedGates.forEach((g) => {
      switch (g.gate) {
        case 'H':
          qasm += `h q[${g.qubitIndex}];\n`;
          break;
        case 'X':
          qasm += `x q[${g.qubitIndex}];\n`;
          break;
        case 'Y':
          qasm += `y q[${g.qubitIndex}];\n`;
          break;
        case 'Z':
          qasm += `z q[${g.qubitIndex}];\n`;
          break;
        case 'S':
          qasm += `s q[${g.qubitIndex}];\n`;
          break;
        case 'T':
          qasm += `t q[${g.qubitIndex}];\n`;
          break;
        case 'RX':
          qasm += `rx(${g.params.angle || 0}) q[${g.qubitIndex}];\n`;
          break;
        case 'RY':
          qasm += `ry(${g.params.angle || 0}) q[${g.qubitIndex}];\n`;
          break;
        case 'RZ':
          qasm += `rz(${g.params.angle || 0}) q[${g.qubitIndex}];\n`;
          break;
        case 'CNOT':
          qasm += `cx q[${g.params.control}], q[${g.qubitIndex}];\n`;
          break;
        case 'Measure':
          qasm += `measure q[${g.qubitIndex}] -> c[${g.params.classicalBit}];\n`;
          break;
        default:
          break;
      }
    });

    return qasm;
  }, [circuit, qubits, classicalBits]);

  // Add custom gate
  const addCustomGate = useCallback((name, gates) => {
    const newCustomGate = {
      id: Date.now(),
      name,
      gates,
    };
    setCustomGates((prev) => [...prev, newCustomGate]);
    return newCustomGate;
  }, []);

  // Remove custom gate
  const removeCustomGate = useCallback((gateId) => {
    setCustomGates((prev) => prev.filter((g) => g.id !== gateId));
  }, []);

  // Save circuit to local storage
  const saveCircuit = useCallback(() => {
    const data = {
      name: circuitName,
      qubits,
      classicalBits,
      gates: circuit,
      customGates,
    };
    localStorage.setItem(`circuit_${circuitName}`, JSON.stringify(data));
  }, [circuit, circuitName, qubits, classicalBits, customGates]);

  // Load circuit from local storage
  const loadCircuit = useCallback((name) => {
    const data = localStorage.getItem(`circuit_${name}`);
    if (data) {
      const parsed = JSON.parse(data);
      setCircuitName(parsed.name);
      setQubits(parsed.qubits);
      setClassicalBits(parsed.classicalBits);
      setCircuit(parsed.gates);
      setCustomGates(parsed.customGates || []);
      return true;
    }
    return false;
  }, []);

  // Get all saved circuits
  const getSavedCircuits = useCallback(() => {
    const keys = Object.keys(localStorage);
    return keys
      .filter((k) => k.startsWith('circuit_'))
      .map((k) => localStorage.getItem(k))
      .map((v) => JSON.parse(v));
  }, []);

  const value = {
    circuit,
    qubits,
    setQubits,
    classicalBits,
    setClassicalBits,
    circuitName,
    setCircuitName,
    mode,
    setMode,
    inspectIndex,
    setInspectIndex,
    alignment,
    setAlignment,
    visualizations,
    setVisualizations,
    execution,
    setExecution,
    customGates,
    addGate,
    removeGate,
    updateGate,
    clearCircuit,
    generateOpenQASM,
    addCustomGate,
    removeCustomGate,
    saveCircuit,
    loadCircuit,
    getSavedCircuits,
  };

  return (
    <CircuitContext.Provider value={value}>{children}</CircuitContext.Provider>
  );
};

export const useCircuit = () => {
  const context = React.useContext(CircuitContext);
  if (!context) {
    throw new Error('useCircuit must be used within CircuitProvider');
  }
  return context;
};
