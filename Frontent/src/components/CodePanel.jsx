import React, { useMemo, useState } from 'react';
import { useCircuit } from '../context/CircuitContext';
import { Copy, Download, Code2 } from 'lucide-react';

const CodePanel = () => {
  const { generateOpenQASM, circuit, circuitName, qubits, classicalBits } = useCircuit();
  const [copied, setCopied] = useState(false);
  const [sessionId] = useState(
    () => `QC_${Date.now()}_${Math.random().toString(36).slice(2, 11).toUpperCase()}`
  );

  const openQasmCode = useMemo(() => {
    return generateOpenQASM();
  }, [circuit, generateOpenQASM]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(openQasmCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([openQasmCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${circuitName || 'circuit'}.qasm`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gateCount = circuit.length;
  const measurementCount = circuit.filter(g => g.gate === 'Measure').length;
  const singleQubitGates = circuit.filter(g => 
    ['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ'].includes(g.gate)
  ).length;
  const twoQubitGates = circuit.filter(g => 
    ['CNOT', 'SWAP', 'XX', 'YY', 'ZZ'].includes(g.gate)
  ).length;

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Generated Code</h3>
          </div>
          <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded font-mono">
            OpenQASM 2.0
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyCode}
            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium text-gray-200 transition flex items-center justify-center gap-2"
            title="Copy code to clipboard"
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownloadCode}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium text-white transition flex items-center justify-center gap-2"
            title="Download code as .qasm file"
          >
            <Download size={14} />
            Export
          </button>
        </div>

        {/* Session Info */}
        <div className="mt-3 p-2 bg-gray-700 rounded border border-gray-600">
          <div className="text-xs text-gray-400 mb-1">Session ID</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-cyan-400 text-xs font-mono break-all">{sessionId}</code>
            <button
              onClick={handleCopySessionId}
              className="p-1 hover:bg-gray-600 rounded transition"
              title="Copy session ID"
            >
              <Copy size={12} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Circuit Statistics */}
      <div className="px-4 py-3 border-b border-gray-700 bg-gray-850 text-xs text-gray-300 grid grid-cols-2 gap-2 flex-shrink-0">
        <div className="flex justify-between">
          <span className="text-gray-500">Qubits:</span>
          <span className="text-white font-semibold">{qubits}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Clbits:</span>
          <span className="text-white font-semibold">{classicalBits}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Gates:</span>
          <span className="text-white font-semibold">{gateCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Measurements:</span>
          <span className="text-white font-semibold">{measurementCount}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="text-gray-500">1Q Gates:</span>
          <span className="text-white font-semibold">{singleQubitGates}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="text-gray-500">2Q Gates:</span>
          <span className="text-white font-semibold">{twoQubitGates}</span>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-0">
        {openQasmCode.split('\n').map((line, index) => (
          <div
            key={index}
            className="flex gap-3 text-gray-300 hover:bg-gray-800 px-2 py-0.5 rounded transition group"
          >
            <span className="text-gray-600 select-none w-6 text-right group-hover:text-gray-500 flex-shrink-0">
              {index + 1}
            </span>
            <code className="flex-1 text-gray-100 break-words">
              {line || '\u00A0'}
            </code>
          </div>
        ))}

        {openQasmCode.trim().length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
            <div className="text-center">
              <Code2 size={32} className="mx-auto mb-2 opacity-50" />
              <p className="font-semibold">No Circuit Code Yet</p>
              <p className="text-xs mt-1 text-gray-600">Add gates from the left panel</p>
              <p className="text-xs mt-2 text-gray-600">to generate OpenQASM code</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-gray-800 p-3 flex-shrink-0">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Code Lines:</span>
            <span className="text-white">
              {openQasmCode.split('\n').filter(line => line.trim()).length}
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-700">
            <span>Depth:</span>
            <span className="text-white">
              {Math.max(...circuit.map(g => g.time || 0), 0) + 1 || 0}
            </span>
          </div>
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
    </div>
  );
};

export default CodePanel;
