import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Code, Layers, Target, Github, Twitter, Linkedin, Globe } from 'lucide-react';
import VoiceCommand from '../components/VoiceCommand';
import CodeGeneration from '../components/CodeGeneration';
import ZXGraphCanvas from '../components/ZXGraphCanvas';
import CircuitMetrics from '../components/CircuitMetrics';

const VoiceQuantumSimulator = () => {
  const [generatedCircuit, setGeneratedCircuit] = useState(null);
  const [zxGraph, setZxGraph] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [circuitView, setCircuitView] = useState('circuit'); // 'circuit' or 'zx'

  const handleCircuitGenerated = async (circuit) => {
    setGeneratedCircuit(circuit);
    setIsProcessing(false);
    // Clear previous ZX graph
    setZxGraph(null);
  };

  const convertToZXGraph = async () => {
    if (!generatedCircuit) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:8000/api/circuit-to-zx/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ circuit: generatedCircuit })
      });

      if (!response.ok) {
        throw new Error('Failed to convert to ZX-graph');
      }

      const data = await response.json();
      
      if (data.success) {
        setZxGraph(data.data.zx_graph);
        setCircuitView('zx');
      } else {
        throw new Error(data.error || 'Failed to convert to ZX-graph');
      }
    } catch (err) {
      console.error('Error converting to ZX-graph:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const simplifyZXGraph = async () => {
    if (!zxGraph) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:8000/api/zx-simplify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ zx_graph: zxGraph })
      });

      if (!response.ok) {
        throw new Error('Failed to simplify ZX-graph');
      }

      const data = await response.json();
      
      if (data.success) {
        setZxGraph(data.data.simplified_graph);
      } else {
        throw new Error(data.error || 'Failed to simplify ZX-graph');
      }
    } catch (err) {
      console.error('Error simplifying ZX-graph:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToCircuit = async () => {
    if (!zxGraph) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:8000/api/zx-to-circuit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ zx_graph: zxGraph })
      });

      if (!response.ok) {
        throw new Error('Failed to convert to circuit');
      }

      const data = await response.json();
      
      if (data.success) {
        setGeneratedCircuit(data.data.circuit);
        setCircuitView('circuit');
      } else {
        throw new Error(data.error || 'Failed to convert to circuit');
      }
    } catch (err) {
      console.error('Error converting to circuit:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Voice Quantum Simulator</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
            <div className="bg-purple-900/20 p-3 rounded-full inline-block mb-4">
              <Mic className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Voice-Based</h3>
            <p className="text-gray-400 text-sm">Create quantum circuits using natural language voice commands</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
            <div className="bg-blue-900/20 p-3 rounded-full inline-block mb-4">
              <Code className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Code Generation</h3>
            <p className="text-gray-400 text-sm">Generate Python (Qiskit) and QASM code from your circuits</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
            <div className="bg-green-900/20 p-3 rounded-full inline-block mb-4">
              <Layers className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">ZX-Calculus</h3>
            <p className="text-gray-400 text-sm">Visualize and simplify circuits using ZX-calculus representation</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
            <div className="bg-yellow-900/20 p-3 rounded-full inline-block mb-4">
              <Target className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">National Mission</h3>
            <p className="text-gray-400 text-sm">Aligning with India's National Quantum Mission for quantum computing advancement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Command Section */}
          <div className="space-y-6">
            <VoiceCommand onCircuitGenerated={handleCircuitGenerated} />

            {/* Code Generation */}
            <CodeGeneration circuit={generatedCircuit} />
          </div>

          {/* Visualization Section */}
          <div className="space-y-6">
            {/* Circuit Visualization */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  {circuitView === 'circuit' ? 'Circuit Visualization' : 'ZX-Graph Visualization'}
                </h3>
                {generatedCircuit && (
                  <div className="flex gap-2">
                    <button
                      onClick={convertToZXGraph}
                      disabled={isProcessing || circuitView === 'zx'}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        circuitView === 'zx'
                          ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } disabled:opacity-50`}
                    >
                      Show ZX-Graph
                    </button>
                    {circuitView === 'zx' && (
                      <>
                        <button
                          onClick={simplifyZXGraph}
                          disabled={isProcessing || !zxGraph}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Simplify
                        </button>
                        <button
                          onClick={convertToCircuit}
                          disabled={isProcessing}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Back to Circuit
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {isProcessing && (
                <div className="text-center py-8 text-blue-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p>Processing...</p>
                </div>
              )}

              {!isProcessing && !generatedCircuit && (
                <div className="text-center py-8 text-gray-400">
                  <Mic className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Click "Start Listening" to create your first circuit with voice commands</p>
                </div>
              )}

              {!isProcessing && generatedCircuit && circuitView === 'circuit' && (
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <ZXGraphCanvas circuit={generatedCircuit} />
                </div>
              )}

              {!isProcessing && generatedCircuit && circuitView === 'zx' && zxGraph && (
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <ZXGraphCanvas circuit={generatedCircuit} zxGraph={zxGraph} />
                </div>
              )}
            </div>

            {/* Metrics */}
            {generatedCircuit && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Circuit Metrics</h3>
                <CircuitMetrics circuit={generatedCircuit} />
              </div>
            )}
          </div>
        </div>

        {/* National Quantum Mission Section */}
        <div className="mt-12 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">National Quantum Mission</h3>
          </div>
          <p className="text-gray-300 mb-4">
            This Voice Quantum Simulator is designed to align with India's National Quantum Mission,
            aimed at advancing quantum computing research and education in the country. By providing
            intuitive tools for quantum circuit design and analysis, we aim to democratize access to
            quantum computing knowledge.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium mb-2">Education</h4>
              <p>Making quantum computing accessible to students and researchers</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium mb-2">Research</h4>
              <p>Supporting quantum algorithm development and circuit optimization</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium mb-2">Innovation</h4>
              <p>Fostering quantum technology innovation and startups</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Voice Quantum Simulator</h3>
              <p className="text-gray-400 text-sm mb-4">
                An innovative quantum circuit design tool using voice recognition and ZX-calculus visualization.
              </p>
              <div className="flex gap-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Voice Command</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Code Generation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">ZX-Calculus</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">National Quantum Mission</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">Email: info@quantumsim.example.com</li>
                <li className="text-gray-400">Phone: +91 1234567890</li>
                <li className="text-gray-400">Location: India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 Voice Quantum Simulator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoiceQuantumSimulator;
