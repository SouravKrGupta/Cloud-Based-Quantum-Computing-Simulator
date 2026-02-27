import React, { useState } from 'react';
import { Code, Download, Copy, CheckCircle, AlertCircle } from 'lucide-react';

const CodeGeneration = ({ circuit }) => {
  const [pythonCode, setPythonCode] = useState('');
  const [qasmCode, setQasmCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedQasm, setCopiedQasm] = useState(false);
  const [error, setError] = useState('');
  const [showPython, setShowPython] = useState(true);

  const generatePythonCode = async () => {
    if (!circuit) {
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
        body: JSON.stringify({ circuit })
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

  const generateQasmCode = async () => {
    if (!circuit) {
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
        body: JSON.stringify({ circuit })
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

  const copyPythonCode = async () => {
    try {
      await navigator.clipboard.writeText(pythonCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy Python code');
    }
  };

  const copyQasmCode = async () => {
    try {
      await navigator.clipboard.writeText(qasmCode);
      setCopiedQasm(true);
      setTimeout(() => setCopiedQasm(false), 2000);
    } catch (err) {
      setError('Failed to copy QASM code');
    }
  };

  const downloadPythonCode = () => {
    const element = document.createElement('a');
    const file = new Blob([pythonCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'quantum_circuit.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadQasmCode = () => {
    const element = document.createElement('a');
    const file = new Blob([qasmCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'quantum_circuit.qasm';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!circuit) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Code Generation</h3>
        <div className="text-center py-8 text-gray-400">
          <Code size={48} className="mx-auto mb-4 opacity-50" />
          <p>No circuit available for code generation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Code size={20} className="text-green-400" />
          Code Generation
        </h3>
        <div className="flex gap-2">
          <button
            onClick={generatePythonCode}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showPython 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Python
          </button>
          <button
            onClick={generateQasmCode}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !showPython 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            QASM
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isGenerating && (
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <div className="animate-pulse">Generating code...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {showPython && pythonCode && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-green-400">Python Code (Qiskit)</h4>
              <div className="flex gap-2">
                <button
                  onClick={copyPythonCode}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={downloadPythonCode}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
              <code>{pythonCode}</code>
            </pre>
          </div>
        )}

        {!showPython && qasmCode && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-blue-400">OpenQASM Code</h4>
              <div className="flex gap-2">
                <button
                  onClick={copyQasmCode}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  {copiedQasm ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={downloadQasmCode}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
              <code>{qasmCode}</code>
            </pre>
          </div>
        )}

        {(!pythonCode || !qasmCode) && !isGenerating && (
          <div className="text-center py-8 text-gray-400">
            <Code size={48} className="mx-auto mb-4 opacity-50" />
            <p>Click a button above to generate code</p>
          </div>
        )}

        {showPython && !pythonCode && !isGenerating && (
          <button
            onClick={generatePythonCode}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Code size={20} />
            Generate Python Code
          </button>
        )}

        {!showPython && !qasmCode && !isGenerating && (
          <button
            onClick={generateQasmCode}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Code size={20} />
            Generate QASM Code
          </button>
        )}
      </div>
    </div>
  );
};

export default CodeGeneration;
