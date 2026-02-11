import React from 'react';
import { useCircuit } from '../context/CircuitContext';
import { Copy, Download } from 'lucide-react';

const CodeView = () => {
  const { circuit, generateOpenQASM, circuitName } = useCircuit();
  const [copied, setCopied] = React.useState(false);

  const qasm = generateOpenQASM();

  const handleCopy = () => {
    navigator.clipboard.writeText(qasm);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(qasm)
    );
    element.setAttribute('download', `${circuitName}.qasm`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Code View</h1>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 rounded hover:bg-green-700 transition"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-auto p-6">
        {circuit.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No circuit gates added yet.</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded border border-gray-700 p-4">
            <pre
              className="text-sm font-mono text-gray-300 overflow-x-auto"
              style={{ fontSize: '13px', lineHeight: '1.6' }}
            >
              <code>{qasm}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-2">OpenQASM 2.0</h3>
        <p className="text-gray-400 text-sm">
          OpenQASM (Open Quantum Assembly Language) is a quantum assembly language for describing how to run a
          quantum program on a quantum computer. You can edit the code directly, and it will be reflected in your circuit.
        </p>
      </div>
    </div>
  );
};

export default CodeView;
