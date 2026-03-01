import React, { useState } from 'react';
import { Download, Eye, Trash2 } from 'lucide-react';

const Results = () => {
  const [results, setResults] = useState([
    {
      id: 1,
      jobId: 'JOB-12345',
      circuitName: 'Bell State',
      backend: 'Simulator',
      shots: 1000,
      date: '2024-02-11',
      status: 'COMPLETED',
      mostProbable: '00',
      count: 532,
    },
    {
      id: 2,
      jobId: 'JOB-12346',
      circuitName: 'Superposition Test',
      backend: 'QuantumSim Cloud',
      shots: 1024,
      date: '2024-02-10',
      status: 'COMPLETED',
      mostProbable: '01',
      count: 256,
    },
  ]);

  const [selectedResult, setSelectedResult] = useState(null);

  const handleDeleteResult = (id) => {
    setResults((prev) => prev.filter((result) => result.id !== id));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Execution Results</h1>
        <p className="text-gray-400 mt-2">
          View your past quantum circuit execution results
        </p>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-auto p-6">
        {results.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No execution results yet.</p>
            <p className="text-sm mt-2">Run a circuit to see results here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-500 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{result.circuitName}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          result.status === 'COMPLETED'
                            ? 'bg-green-600 text-green-100'
                            : 'bg-yellow-600 text-yellow-100'
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Job ID: {result.jobId}</div>
                      <div>Backend: {result.backend}</div>
                      <div>Shots: {result.shots.toLocaleString()}</div>
                      <div>Most Probable State: |{result.mostProbable}⟩ ({result.count} counts)</div>
                      <div>Date: {result.date}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedResult(result)}
                      className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                      title="View details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        element.setAttribute(
                          'href',
                          'data:application/json;charset=utf-8,' +
                            encodeURIComponent(JSON.stringify(result, null, 2))
                        );
                        element.setAttribute('download', `${result.jobId}.json`);
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="p-2 bg-green-600 rounded hover:bg-green-700 transition"
                      title="Download results"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteResult(result.id)}
                      className="p-2 bg-red-600 rounded hover:bg-red-700 transition"
                      title="Delete results"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedResult.jobId}</h2>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Circuit Information</h3>
                <div className="bg-gray-900 p-4 rounded space-y-1 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span> {selectedResult.circuitName}
                  </div>
                  <div>
                    <span className="text-gray-400">Backend:</span> {selectedResult.backend}
                  </div>
                  <div>
                    <span className="text-gray-400">Shots:</span>{' '}
                    {selectedResult.shots.toLocaleString()}
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span> {selectedResult.date}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <div className="bg-gray-900 p-4 rounded">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Most Probable State</p>
                    <p className="text-3xl font-bold text-blue-400 my-2">
                      |{selectedResult.mostProbable}⟩
                    </p>
                    <p className="text-gray-400 text-sm">
                      {selectedResult.count} counts ({(
                        (selectedResult.count / selectedResult.shots) *
                        100
                      ).toFixed(1)}
                      %)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedResult(null)}
                className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
