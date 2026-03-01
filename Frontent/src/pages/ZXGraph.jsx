import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { useCircuit } from '../context/CircuitContext';
import ZXGraphCanvas from '../components/ZXGraphCanvas';

const ZXGraph = () => {
  const navigate = useNavigate();
  const { circuit } = useCircuit();
  const [zxGraph, setZxGraph] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate ZX-graph from circuit data
    const generateZXGraph = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert quantum circuit to ZX-graph
      const nodes = [];
      const edges = [];
      
      // Create Z nodes for each qubit and gate
      const zNodes = circuit.map((gate, index) => ({
        id: `z-${index}`,
        x: 100 + index * 150,
        y: 100 + (index % 2) * 100,
        type: 'z',
        phase: index % 2 === 0 ? '0' : 'π/2',
        label: 'Z',
        color: '#3B82F6'
      }));
      
      // Create X nodes for each qubit and gate
      const xNodes = circuit.map((gate, index) => ({
        id: `x-${index}`,
        x: 100 + index * 150,
        y: 200 + (index % 2) * 100,
        type: 'x',
        phase: index % 2 === 0 ? 'π/2' : '0',
        label: 'X',
        color: '#EF4444'
      }));
      
      nodes.push(...zNodes, ...xNodes);
      
      // Create edges between corresponding Z and X nodes
      circuit.forEach((gate, index) => {
        edges.push({
          source: `z-${index}`,
          target: `x-${index}`
        });
        
        // Create horizontal edges between adjacent nodes
        if (index > 0) {
          edges.push({
            source: `z-${index - 1}`,
            target: `z-${index}`
          });
          edges.push({
            source: `x-${index - 1}`,
            target: `x-${index}`
          });
        }
      });
      
      // If no circuit, create a simple default graph
      if (circuit.length === 0) {
        nodes.push({
          id: 'default-z',
          x: 400,
          y: 150,
          type: 'z',
          phase: '0',
          label: 'Z',
          color: '#3B82F6'
        }, {
          id: 'default-x',
          x: 450,
          y: 200,
          type: 'x',
          phase: 'π/2',
          label: 'X',
          color: '#EF4444'
        });
        
        edges.push({
          source: 'default-z',
          target: 'default-x'
        });
      }
      
      setZxGraph({ nodes, edges });
      setIsLoading(false);
    };

    generateZXGraph();
  }, [circuit]);

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
              <Layers size={24} className="text-teal-400" />
              <h1 className="text-xl font-semibold">ZX-Graph Representation</h1>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {circuit.length > 0 ? `${circuit.length} gates` : 'Empty circuit'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Generating ZX-Graph...</p>
            </div>
          </div>
        ) : (
          <ZXGraphCanvas zxGraph={zxGraph} />
        )}
      </div>
    </div>
  );
};

export default ZXGraph;
