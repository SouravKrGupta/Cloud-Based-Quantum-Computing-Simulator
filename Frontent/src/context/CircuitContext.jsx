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
  const [history, setHistory] = useState([[]]); // Track circuit changes for undo/redo
  const [historyIndex, setHistoryIndex] = useState(0);

  const normalizeGateName = useCallback((gateName) => {
    const map = {
      NOT: 'X',
      M: 'Measure',
      MEASURE: 'Measure',
      PHASE: 'P',
      Tdg: 'Tdg',
      Sdg: 'Sdg',
      CX: 'CNOT',
    };
    return map[gateName] || gateName;
  }, []);

  // Add gate to circuit
  const addGate = useCallback((time, qubitIndex, gate, params = {}) => {
    const normalizedGate = normalizeGateName(gate);
    const newGate = {
      id: Date.now(),
      time,
      qubitIndex,
      gate: normalizedGate,
      params,
    };
    setCircuit((prev) => {
      const newCircuit = [...prev, newGate];
      // Add to history
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push([...newCircuit]);
        return newHistory;
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);
      return newCircuit;
    });
    return newGate;
  }, [normalizeGateName, historyIndex]);

  // Remove gate from circuit
  const removeGate = useCallback((gateId) => {
    setCircuit((prev) => {
      const newCircuit = prev.filter((g) => g.id !== gateId);
      // Add to history
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push([...newCircuit]);
        return newHistory;
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);
      return newCircuit;
    });
  }, [historyIndex]);

  // Update gate parameters
  const updateGate = useCallback((gateId, updates) => {
    setCircuit((prev) => {
      const newCircuit = prev.map((g) => (g.id === gateId ? { ...g, ...updates } : g));
      // Add to history
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push([...newCircuit]);
        return newHistory;
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);
      return newCircuit;
    });
  }, [historyIndex]);

  // Clear circuit
  const clearCircuit = useCallback(() => {
    setCircuit([]);
    // Add to history
    setHistory([[]]);
    setHistoryIndex(0);
  }, []);

  // Undo last operation
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCircuit([...history[newIndex]]);
    }
  }, [history, historyIndex]);

  // Redo last operation
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCircuit([...history[newIndex]]);
    }
  }, [history, historyIndex]);

  // Align gates to grid
  const alignGates = useCallback((alignmentType) => {
    setAlignment(alignmentType);
    
    if (alignmentType === 'left') {
      // Left align all gates (time=0)
      setCircuit((prev) => 
        prev.map(gate => ({ ...gate, time: 0 }))
      );
    } else if (alignmentType === 'layers') {
      // Layer alignment - group gates by time slot
      const timeSlots = {};
      const alignedCircuit = [...circuit];
      
      alignedCircuit.forEach((gate, index) => {
        if (!timeSlots[gate.qubitIndex]) {
          timeSlots[gate.qubitIndex] = 0;
        }
        gate.time = timeSlots[gate.qubitIndex];
        timeSlots[gate.qubitIndex]++;
      });
      
      setCircuit(alignedCircuit);
    }
    // 'free' alignment doesn't change positions
  }, [circuit]);

  // Generate OpenQASM code
  const generateOpenQASM = useCallback(() => {
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n';
    qasm += `qreg q[${qubits}];\n`;
    if (classicalBits > 0) {
      qasm += `creg c[${classicalBits}];\n`;
    }

    const sortedGates = [...circuit].sort((a, b) => a.time - b.time);
    sortedGates.forEach((g) => {
      const gate = normalizeGateName(g.gate);

      switch (gate) {
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
        case 'Tdg':
          qasm += `tdg q[${g.qubitIndex}];\n`;
          break;
        case 'Sdg':
          qasm += `sdg q[${g.qubitIndex}];\n`;
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
        case 'P':
          qasm += `p(${g.params.angle || 'pi/2'}) q[${g.qubitIndex}];\n`;
          break;
        case 'I':
          qasm += `id q[${g.qubitIndex}];\n`;
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
  }, [circuit, qubits, classicalBits, normalizeGateName]);

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

  // Save circuit to backend
  const saveCircuit = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to save circuits to backend');
      return false;
    }

    try {
      const response = await fetch('http://localhost:8000/api/circuits/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: circuitName,
          qubits,
          classical_bits: classicalBits,
          gates: circuit,
          custom_gates: customGates,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Circuit saved to backend:', data);
        return true;
      } else {
        console.error('Error saving circuit:', response.status);
        alert('Failed to save circuit');
        return false;
      }
    } catch (error) {
      console.error('Error saving circuit:', error);
      alert('Failed to save circuit');
      return false;
    }
  }, [circuit, circuitName, qubits, classicalBits, customGates]);

  // Load circuit from local storage (fallback)
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

  // Get all saved circuits (from backend)
  const getSavedCircuits = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Fallback to localStorage if not logged in
      const keys = Object.keys(localStorage).filter(key => key.startsWith('circuit_'));
      return keys.map(key => {
        const data = JSON.parse(localStorage.getItem(key));
        return {
          id: key.replace('circuit_', ''),
          name: data.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          qubits: data.qubits,
        };
      });
    }

    try {
      const response = await fetch('http://localhost:8000/api/circuits/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        console.error('Error fetching circuits:', response.status);
        return [];
      }
    } catch (error) {
      console.error('Error fetching circuits:', error);
      return [];
    }
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
    alignGates,
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
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
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
