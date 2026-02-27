import React from 'react';

const CircuitMetrics = ({ originalMetrics, optimizedMetrics }) => {
  const metrics = [
    { label: 'Qubits', original: originalMetrics?.qubits || 0, optimized: optimizedMetrics?.qubits || 0 },
    { label: 'Gates', original: originalMetrics?.gates || 0, optimized: optimizedMetrics?.gates || 0 },
    { label: 'CNOT Gates', original: originalMetrics?.cnotGates || 0, optimized: optimizedMetrics?.cnotGates || 0 },
    { label: 'Depth', original: originalMetrics?.depth || 0, optimized: optimizedMetrics?.depth || 0 },
    { label: 'T-Gates', original: originalMetrics?.tGates || 0, optimized: optimizedMetrics?.tGates || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm font-medium">{metric.label}</span>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="text-2xl font-bold text-white">
                {metric.original}
              </div>
              <div className="text-xs text-gray-500">Original</div>
            </div>
            {optimizedMetrics && (
              <>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-green-400">
                    {metric.optimized}
                  </div>
                  <div className="text-xs text-gray-500">Optimized</div>
                </div>
              </>
            )}
          </div>
          {optimizedMetrics && metric.original > metric.optimized && (
            <div className="mt-2 text-sm text-green-400">
              ↓ {((1 - metric.optimized / metric.original) * 100).toFixed(1)}%
            </div>
          )}
          {optimizedMetrics && metric.original < metric.optimized && (
            <div className="mt-2 text-sm text-red-400">
              ↑ {((metric.optimized / metric.original - 1) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CircuitMetrics;
