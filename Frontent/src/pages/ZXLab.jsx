import React, { useState } from 'react';
import { Zap, Download, Code, Upload, Maximize2, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import ZXGraphCanvas from '../components/ZXGraphCanvas';
import CircuitMetrics from '../components/CircuitMetrics';

const ZXLab = () => {
  const [circuitView, setCircuitView] = useState('circuit'); // 'circuit' or 'zx'
  const [qasmCode, setQasmCode] = useState(`// Sample Quantum Circuit in OpenQASM 2.0
OPENQASM 2.0;
include "qelib1.inc";

// 5-qubit circuit with various gates
qreg q[5];
creg c[5];

// Apply some gates
h q[0];
x q[1];
h q[2];
t q[3];
s q[4];

// Some controlled operations
cx q[0],q[1];
cx q[2],q[3];
cz q[1],q[4];

// More single-qubit gates
h q[0];
t q[1];
tdg q[2];
s q[3];
z q[4];

// More controlled operations
cx q[3],q[4];
cx q[0],q[2];
cz q[1],q[3];

// Measurement
measure q -> c;`);

  const [originalMetrics, setOriginalMetrics] = useState({
    qubits: 5,
    gates: 15,
    cnotGates: 5,
    depth: 8,
    tGates: 3,
  });

  const [optimizedMetrics, setOptimizedMetrics] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <main className="container mx-auto py-6 px-4 md:px-6 flex-1">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-3xl font-bold tracking-tight">ZXLab</h1>
              <div className="inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gradient-to-r from-purple-500 to-blue-500 text-white self-start sm:self-auto px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award mr-1 h-3.5 w-3.5">
                  <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                  <circle cx="12" cy="8" r="6"></circle>
                </svg>
                First Interactive Web-Based ZX-Calculus Tool
              </div>
            </div>
            <p className="text-gray-400">Interactive Quantum Circuit Simplifier via ZX-Calculus</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Circuit Panel */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 text-gray-100 shadow-sm lg:col-span-1">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="text-2xl font-semibold leading-none tracking-tight flex items-center justify-between">
                  Input Circuit
                  <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-9 rounded-md px-3">
                      <Upload size={16} className="mr-2" />
                      Import
                    </button>
                    <input id="file-upload" type="file" accept=".qasm" className="hidden" />
                  </div>
                </div>
                <div className="text-sm text-gray-400">Paste QASM code or upload a file</div>
              </div>
              <div className="p-6 pt-0">
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono text-sm h-[300px]"
                  placeholder="Enter OpenQASM 2.0 code here..."
                  value={qasmCode}
                  onChange={(e) => setQasmCode(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  <button 
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 h-10 px-4 py-2"
                    onClick={() => {
                      // Simulate circuit simplification
                      setOptimizedMetrics({
                        qubits: 5,
                        gates: 10,
                        cnotGates: 3,
                        depth: 6,
                        tGates: 2,
                      });
                    }}
                  >
                    <Zap size={16} className="mr-2" />
                    Auto-Simplify
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-10 px-4 py-2">
                    <Download size={16} className="mr-2" />
                    Export QASM
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-10 px-4 py-2">
                    <Code size={16} className="mr-2" />
                    Export Python
                  </button>
                </div>
              </div>
            </div>

            {/* Visualization Panel */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 text-gray-100 shadow-sm lg:col-span-2">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-2xl font-semibold leading-none tracking-tight">Visualization</div>
                  <div dir="ltr" data-orientation="horizontal" className="w-full sm:w-[400px]">
                    <div role="tablist" aria-orientation="horizontal" className="h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-gray-400 grid w-full grid-cols-2" tabindex="-1" data-orientation="horizontal">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={circuitView === 'circuit'}
                        data-state={circuitView === 'circuit' ? 'active' : 'inactive'}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                          circuitView === 'circuit'
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'hover:bg-gray-700 hover:text-gray-200'
                        }`}
                        onClick={() => setCircuitView('circuit')}
                      >
                        Circuit View
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={circuitView === 'zx'}
                        data-state={circuitView === 'zx' ? 'active' : 'inactive'}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                          circuitView === 'zx'
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'hover:bg-gray-700 hover:text-gray-200'
                        }`}
                        onClick={() => setCircuitView('zx')}
                      >
                        ZX-Graph View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div>
                  <div className="">
                    <div className="flex justify-end mb-2 gap-2">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-9 rounded-md px-3" title="Enter fullscreen">
                        <Maximize2 size={16} />
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-9 rounded-md px-3" title="Pan view">
                        <Move size={16} />
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-9 rounded-md px-3" title="Zoom in">
                        <ZoomIn size={16} />
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-9 rounded-md px-3" title="Zoom out">
                        <ZoomOut size={16} />
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-9 rounded-md px-3" title="Reset view">
                        <RotateCcw size={16} />
                      </button>
                    </div>
                    {circuitView === 'circuit' ? (
                      <div className="flex items-center justify-center h-[400px] border border-gray-700 rounded-md bg-gray-800">
                        <p className="text-gray-400">No valid circuit data available</p>
                      </div>
                    ) : (
                      <ZXGraphCanvas qasmCode={qasmCode} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rewrite Rules Panel */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 text-gray-100 shadow-sm lg:col-span-1">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">Rewrite Rules</div>
                <div className="text-sm text-gray-400">Select a subgraph and apply ZX-calculus rules</div>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-md text-sm">
                    Switch to ZX-Graph view to apply rewrite rules
                  </div>
                  <div className="w-full" data-orientation="vertical">
                    {[
                      { name: 'Spider Fusion', level: 'basic', color: 'green', description: 'Fuses adjacent spiders of the same color' },
                      { name: 'Identity Removal', level: 'basic', color: 'green', description: 'Removes identity operators from the graph' },
                      { name: 'Color Change', level: 'basic', color: 'green', description: 'Changes the color of a spider' },
                      { name: 'Copy Rule', level: 'intermediate', color: 'blue', description: 'Copies a spider to a new location' },
                      { name: 'π-Commutation', level: 'intermediate', color: 'blue', description: 'Commutes π phases through spiders' },
                      { name: 'Bialgebra Law', level: 'advanced', color: 'amber', description: 'Simplifies complex algebraic structures' },
                      { name: 'Hopf Law', level: 'advanced', color: 'amber', description: 'Simplifies Hopf algebra structures' },
                      { name: 'Local Complementation', level: 'advanced', color: 'amber', description: 'Performs local complementation operations' },
                    ].map((rule, index) => (
                      <div key={index} data-state="closed" data-orientation="vertical" className="border-b border-gray-700">
                        <h3 data-orientation="vertical" data-state="closed" className="flex">
                          <button
                            type="button"
                            aria-controls={`radix-${index}`}
                            aria-expanded="false"
                            data-state="closed"
                            data-orientation="vertical"
                            className="flex flex-1 items-center justify-between py-4 transition-all hover:underline [&[data-state=open]>svg]:rotate-180 text-sm font-medium"
                          >
                            <div className="flex items-center">
                              {rule.name}
                              <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ml-2 bg-${rule.color}-500 text-white border-${rule.color}-400`}>
                                {rule.level}
                              </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 shrink-0 transition-transform duration-200">
                              <path d="m6 9 6 6 6-6"></path>
                            </svg>
                          </button>
                        </h3>
                        <div data-state="closed" id={`radix-${index}`} hidden="" role="region" aria-labelledby={`radix-${index}`} data-orientation="vertical" className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="p-4 bg-gray-800 rounded-b-md">
                            <p className="text-gray-300 text-sm">{rule.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-gray-600 bg-gray-800 hover:bg-gray-700 h-10 px-4 py-2 w-full mt-4">
                    Auto-Apply Optimal Rules
                  </button>
                </div>
              </div>
            </div>

            {/* Circuit Metrics Panel */}
            <div className="rounded-lg border border-gray-700 bg-gray-900 text-gray-100 shadow-sm lg:col-span-2">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">Circuit Metrics</div>
                <div className="text-sm text-gray-400">Compare original and optimized circuit metrics</div>
              </div>
              <div className="p-6 pt-0">
                {originalMetrics ? (
                  <CircuitMetrics
                    originalMetrics={originalMetrics}
                    optimizedMetrics={optimizedMetrics}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[200px]">
                    <p className="text-gray-400">No circuit data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ZXLab;
