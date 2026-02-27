import React, { useEffect, useRef, useState } from 'react';
import { useCircuit } from '../context/CircuitContext';

const ZXGraphCanvas = ({ circuit, zxGraph }) => {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState(new Set());

  // Initialize canvas
  useEffect(() => {
    if (zxGraph) {
      // Use provided ZX-graph data
      setNodes(zxGraph.nodes || []);
      setEdges(zxGraph.edges || []);
    } else if (circuit) {
      // Create sample ZX-graph from circuit data
      createSampleGraph();
    }
  }, [circuit, zxGraph]);

  const createSampleGraph = () => {
    // Create some nodes
    const newNodes = [
      { id: 1, x: 100, y: 100, type: 'z', phase: '0', label: 'Z', color: '#3B82F6' },
      { id: 2, x: 200, y: 150, type: 'x', phase: 'π/2', label: 'X', color: '#EF4444' },
      { id: 3, x: 300, y: 100, type: 'z', phase: 'π', label: 'Z', color: '#3B82F6' },
      { id: 4, x: 400, y: 150, type: 'x', phase: 'π/4', label: 'X', color: '#EF4444' },
      { id: 5, x: 500, y: 100, type: 'z', phase: '3π/2', label: 'Z', color: '#3B82F6' },
    ];

    // Create edges
    const newEdges = [
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 3, target: 4 },
      { source: 4, target: 5 },
      { source: 2, target: 4 },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Draw graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    edges.forEach(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);

      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNodes.has(node.id);

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#10B981' : '#1F2937';
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // Phase label
      ctx.font = '12px Arial';
      ctx.fillText(node.phase, node.x, node.y + 25);
    });
  }, [nodes, edges, selectedNodes]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= 30;
    });

    if (clickedNode) {
      setSelectedNodes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(clickedNode.id)) {
          newSet.delete(clickedNode.id);
        } else {
          newSet.add(clickedNode.id);
        }
        return newSet;
      });
    } else {
      setSelectedNodes(new Set());
    }
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-gray-700 rounded-md bg-gray-800 cursor-crosshair"
        onClick={handleCanvasClick}
      />
      <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-80 rounded px-2 py-1 text-sm text-white">
        Nodes: {nodes.length} | Edges: {edges.length}
      </div>
      {selectedNodes.size > 0 && (
        <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-80 rounded px-2 py-1 text-sm text-green-400">
          {selectedNodes.size} node(s) selected
        </div>
      )}
    </div>
  );
};

export default ZXGraphCanvas;
