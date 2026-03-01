import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import ZXGraphCanvas from '../components/ZXGraphCanvas';

const ZXGraph = () => {
  const navigate = useNavigate();
  const [zxGraph, setZxGraph] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading ZX-graph from backend
    const loadZXGraph = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setZxGraph({
        nodes: [
          { id: 1, x: 100, y: 100, type: 'z', phase: '0', label: 'Z', color: '#3B82F6' },
          { id: 2, x: 200, y: 150, type: 'x', phase: 'π/2', label: 'X', color: '#EF4444' },
          { id: 3, x: 300, y: 100, type: 'z', phase: 'π', label: 'Z', color: '#3B82F6' },
          { id: 4, x: 400, y: 150, type: 'x', phase: 'π/4', label: 'X', color: '#EF4444' },
          { id: 5, x: 500, y: 100, type: 'z', phase: '3π/2', label: 'Z', color: '#3B82F6' },
        ],
        edges: [
          { source: 1, target: 2 },
          { source: 2, target: 3 },
          { source: 3, target: 4 },
          { source: 4, target: 5 },
          { source: 2, target: 4 },
        ]
      });
      setIsLoading(false);
    };

    loadZXGraph();
  }, []);

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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading ZX-Graph...</p>
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
