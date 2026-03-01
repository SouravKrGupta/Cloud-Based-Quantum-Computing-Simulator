import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCircuit } from '../context/CircuitContext';
import { Copy, Download, Code, CheckCircle, AlertCircle, ArrowLeft, Code2 } from 'lucide-react';

const CodeView = () => {
  const navigate = useNavigate();
  const { circuit, generateOpenQASM, circuitName, qubits, classicalBits } = useCircuit();
  const [copied, setCopied] = useState(false);
  const [copiedQasm, setCopiedQasm] = useState(false);
  const [pythonCode, setPythonCode] = useState('');
  const [qasmCode, setQasmCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showPython, setShowPython] = useState(true);

  // Generate Python code using backend API
  const generatePythonCode = async () => {
    if (!circuit || circuit.length === 0) {
      setError('No circuit to generate code for');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/generate-python/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ 
          circuit: {
            qubits,
            classicalBits,
            gates: circuit,
            description: circuitName
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate Python code');
      }

      const data = await response.json();
      
      if (data.success) {
        setPythonCode(data.data.python_code);
        setShowPython(true);
      } else {
        throw new Error(data.error || 'Failed to generate Python code');
      }
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate QASM code using backend API
  const generateQasmCode = async () => {
    if (!circuit || circuit.length === 0) {
      setError('No circuit to generate code for');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/generate-qasm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ 
          circuit: {
            qubits,
            classicalBits,
            gates: circuit,
            description: circuitName
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate QASM code');
      }

      const data = await response.json();
      
      if (data.success) {
        setQasmCode(data.data.qasm_code);
        setShowPython(false);
      } else {
        throw new Error(data.error || 'Failed to generate QASM code');
      }
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Python code to clipboard
  const copyPythonCode = async () => {
    try {
      await navigator.clipboard.writeText(pythonCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy Python code');
    }
  };

  // Copy QASM code to clipboard
  const copyQasmCode = async () => {
    try {
      await navigator.clipboard.writeText(qasmCode || generateOpenQASM());
      setCopiedQasm(true);
      setTimeout(() => setCopiedQasm(false), 2000);
    } catch (err) {
      setError('Failed to copy QASM code');
    }
  };

  // Download Python code
  const downloadPythonCode = () => {
    const element = document.createElement('a');
    const file = new Blob([pythonCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'quantum_circuit.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download QASM code
  const downloadQasmCode = () => {
    const qasm = qasmCode || generateOpenQASM();
    const element = document.createElement('a');
    const file = new Blob([qasm], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${circuitName || 'circuit'}.qasm`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Circuit statistics
  const gateCount = circuit.length;
  const measurementCount = circuit.filter(g => g.gate === 'Measure').length;
  const singleQubitGates = circuit.filter(g => 
    ['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ'].includes(g.gate)
  ).length;
  const twoQubitGates = circuit.filter(g => 
    ['CNOT', 'SWAP', 'XX', 'YY', 'ZZ'].includes(g.gate)
  ).length;

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
                <Code2 size={24} className="text-indigo-400" />
                <h1 className="text-xl font-semibold">Code Generation</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Code2 size={64} className="mx-auto mb-4 text-slate-600" />
            <h2 className="text-2xl font-semibold mb-2">No Circuit to Generate Code For</h2>
            <p className="text-slate-400 mb-6">
              Please add gates to your circuit in the composer to generate code.
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
              <Code2 size={24} className="text-indigo-400" />
              <h1 className="text-xl font-semibold">Code Generation</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Left Sidebar - Statistics */}
          <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col">
            {/* Statistics */}
            <div className="p-4 border-b border-slate-700 bg-slate-800">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                Circuit Statistics
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Qubits:</span>
                  <span className="text-white font-semibold">{qubits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clbits:</span>
                  <span className="text-white font-semibold">{classicalBits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gates:</span>
                  <span className="text-white font-semibold">{gateCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Measurements:</span>
                  <span className="text-white font-semibold">{measurementCount}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-slate-400">1Q Gates:</span>
                  <span className="text-white font-semibold">{singleQubitGates}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-slate-400">2Q Gates:</span>
                  <span className="text-white font-semibold">{twoQubitGates}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-slate-700 bg-slate-800">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={generatePythonCode}
                  disabled={isGenerating}
                  className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    showPython 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Code size={16} />
                  Generate Python
                </button>
                <button
                  onClick={generateQasmCode}
                  disabled={isGenerating}
                  className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    !showPython 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Code size={16} />
                  Generate QASM
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                About OpenQASM 2.0
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                OpenQASM (Open Quantum Assembly Language) is a quantum assembly language for describing how to run a
                quantum program on a quantum computer. You can use this code with various quantum computing frameworks.
              </p>
              <a
                href="https://github.com/Qiskit/openqasm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs transition inline-block"
              >
                OpenQASM 2.0 Spec ↗
              </a>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="flex-1 flex flex-col">
            {/* Code Tabs */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPython(true)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                    showPython 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Code size={16} className="text-green-400" />
                  Python (Qiskit)
                </button>
                <button
                  onClick={() => setShowPython(false)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                    !showPython 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Code size={16} className="text-blue-400" />
                  OpenQASM 2.0
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-hidden">
              {isGenerating && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-cyan-400">Generating code...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={20} className="text-red-400" />
                      <h3 className="text-sm font-semibold text-red-400">Error</h3>
                    </div>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {!isGenerating && !error && showPython && pythonCode && (
                <div className="h-full flex flex-col">
                  <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-green-400">Python Code (Qiskit)</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={copyPythonCode}
                        className="px-3 py-1 rounded text-xs font-medium bg-slate-700 hover:bg-slate-600 transition flex items-center gap-1"
                      >
                        {copied ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={downloadPythonCode}
                        className="px-3 py-1 rounded text-xs font-medium bg-slate-700 hover:bg-slate-600 transition flex items-center gap-1"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-6">
                    <pre className="text-sm text-slate-300 overflow-x-auto font-mono">
                      <code>{pythonCode}</code>
                    </pre>
                  </div>
                </div>
              )}

              {!isGenerating && !error && !showPython && (
                <div className="h-full flex flex-col">
                  <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-blue-400">OpenQASM Code</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={copyQasmCode}
                        className="px-3 py-1 rounded text-xs font-medium bg-slate-700 hover:bg-slate-600 transition flex items-center gap-1"
                      >
                        {copiedQasm ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copiedQasm ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={downloadQasmCode}
                        className="px-3 py-1 rounded text-xs font-medium bg-slate-700 hover:bg-slate-600 transition flex items-center gap-1"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-6">
                    <pre className="text-sm text-slate-300 overflow-x-auto font-mono">
                      <code>{qasmCode || generateOpenQASM()}</code>
                    </pre>
                  </div>
                </div>
              )}

              {!isGenerating && !error && (!pythonCode || !qasmCode) && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Code2 size={64} className="mx-auto mb-4 text-slate-600" />
                    <h3 className="text-lg font-semibold mb-2">No Code Generated Yet</h3>
                    <p className="text-slate-400 mb-6">
                      Click the buttons in the sidebar to generate Python or QASM code.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={generatePythonCode}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        <Code size={16} className="mr-2" />
                        Generate Python
                      </button>
                      <button
                        onClick={generateQasmCode}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        <Code size={16} className="mr-2" />
                        Generate QASM
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeView;
