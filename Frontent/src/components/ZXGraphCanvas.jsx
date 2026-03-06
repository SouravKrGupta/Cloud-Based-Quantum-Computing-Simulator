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
    } else if (circuit && circuit.length > 0) {
      // Build ZX graph from circuit data
      const zxGraph = buildZXGraphFromCircuit(circuit);
      setNodes(zxGraph.nodes);
      setEdges(zxGraph.edges);
    } else {
      // Create sample ZX-graph when no circuit data
      createSampleGraph();
    }
  }, [circuit, zxGraph]);










  const buildZXGraphFromCircuit = (circuitData) => {
    // Simple ZX graph construction from quantum circuit
    const newNodes = [];
    const newEdges = [];
    const qubitPositions = {};
    
    // Add qubit inputs (Z spiders)
    circuitData.forEach(gate => {
      if (!qubitPositions[gate.qubitIndex]) {
        const x = 100 + gate.qubitIndex * 150;
        const y = 50;
        qubitPositions[gate.qubitIndex] = {
          x,
          y,
          currentNodeId: `q${gate.qubitIndex}_0`
        };
        
        newNodes.push({
          id: `q${gate.qubitIndex}_0`,
          x,
          y,
          type: 'z',
          phase: '0',
          label: 'Z',
          color: '#3B82F6'
        });
      }
    });

    // Process each gate and build ZX graph
    circuitData.forEach(gate => {
      const qubitPos = qubitPositions[gate.qubitIndex];
      const timeStep = gate.time;
      const nodeId = `q${gate.qubitIndex}_${timeStep + 1}`;
      
      // Add new node based on gate type
      if (gate.gate === 'H') {
        // Hadamard is X spider
        newNodes.push({
          id: nodeId,
          x: qubitPos.x,
          y: 100 + timeStep * 100,
          type: 'x',
          phase: '0',
          label: 'X',
          color: '#EF4444'
        });
      } else if (gate.gate === 'X') {
        // X is X spider with phase π
        newNodes.push({
          id: nodeId,
          x: qubitPos.x,
          y: 100 + timeStep * 100,
          type: 'x',
          phase: 'π',
          label: 'X',
          color: '#EF4444'
        });
      } else if (gate.gate === 'Z') {
        // Z is Z spider with phase π
        newNodes.push({
          id: nodeId,
          x: qubitPos.x,
          y: 100 + timeStep * 100,
          type: 'z',
          phase: 'π',
          label: 'Z',
          color: '#3B82F6'
        });
      } else if (gate.gate === 'S') {
        // S is Z spider with phase π/2
        newNodes.push({
          id: nodeId,
          x: qubitPos.x,
          y: 100 + timeStep * 100,
          type: 'z',
          phase: 'π/2',
          label: 'Z',
          color: '#3B82F6'
        });
      } else if (gate.gate === 'T') {
        // T is Z spider with phase π/4
        newNodes.push({
          id: nodeId,
          x: qubitPos.x,
          y: 100 + timeStep * 100,
          type: 'z',
          phase: 'π/4',
          label: 'Z',
          color: '#3B82F6'
        });
      } else if (gate.gate === 'CNOT') {
        // CNOT is X spider between control and target
        const targetQubit = gate.params.target;
        const targetPos = qubitPositions[targetQubit];
        
        const controlNodeId = `q${gate.qubitIndex}_${timeStep + 1}`;
        const targetNodeId = `q${targetQubit}_${timeStep + 1}`;
        
        newNodes.push({
          id: controlNodeId,
          x: qubitPos.x,
          y: 100 + timeStep * 100,
          type: 'z',
          phase: '0',
          label: 'Z',
          color: '#3B82F6'
        });
        
        newNodes.push({
          id: targetNodeId,
          x: targetPos.x,
          y: 100 + timeStep * 100,
          type: 'x',
          phase: '0',
          label: 'X',
          color: '#EF4444'
        });
        
        newEdges.push({ source: controlNodeId, target: targetNodeId });
        newEdges.push({ source: qubitPos.currentNodeId, target: controlNodeId });
        newEdges.push({ source: targetPos.currentNodeId, target: targetNodeId });
        
        qubitPositions[gate.qubitIndex].currentNodeId = controlNodeId;
        qubitPositions[targetQubit].currentNodeId = targetNodeId;
        return;
      }
      
      // Connect current node to previous node
      newEdges.push({ source: qubitPos.currentNodeId, target: nodeId });
      qubitPositions[gate.qubitIndex].currentNodeId = nodeId;
    });

    return { nodes: newNodes, edges: newEdges };
  };

  const createSampleGraph = () => {
    // Create some nodes
    const newNodes = [
      { id: 'z-1', x: 100, y: 100, type: 'z', phase: '0', label: 'Z', color: '#3B82F6' },
      { id: 'x-1', x: 200, y: 150, type: 'x', phase: 'π/2', label: 'X', color: '#EF4444' },
      { id: 'z-2', x: 300, y: 100, type: 'z', phase: 'π', label: 'Z', color: '#3B82F6' },
      { id: 'x-2', x: 400, y: 150, type: 'x', phase: 'π/4', label: 'X', color: '#EF4444' },
      { id: 'z-3', x: 500, y: 100, type: 'z', phase: '3π/2', label: 'Z', color: '#3B82F6' },
    ];

    // Create edges
    const newEdges = [
      { source: 'z-1', target: 'x-1' },
      { source: 'x-1', target: 'z-2' },
      { source: 'z-2', target: 'x-2' },
      { source: 'x-2', target: 'z-3' },
      { source: 'x-1', target: 'x-2' },
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

  // Make canvas responsive
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }
    };

    // Initial size
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded-md bg-gray-800 cursor-crosshair w-full h-full"
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