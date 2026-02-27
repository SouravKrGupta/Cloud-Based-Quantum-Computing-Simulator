import time
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json


class CircuitToZXGraphView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Convert quantum circuit to ZX-graph representation.
        """
        start_time = time.time()

        try:
            circuit_data = request.data.get('circuit', {})

            if not circuit_data:
                return Response({
                    'success': False,
                    'error': 'No circuit configuration provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            qubits = circuit_data.get('qubits', 5)
            gates = circuit_data.get('gates', [])

            # Convert circuit to ZX-graph
            zx_graph = self.circuit_to_zx_graph(qubits, gates)

            response = {
                'success': True,
                'data': {
                    'zx_graph': zx_graph,
                    'execution_time': round(time.time() - start_time, 3)
                }
            }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def circuit_to_zx_graph(self, qubits, gates):
        """
        Convert quantum circuit to ZX-graph representation.
        This is a simplified implementation.
        """
        zx_graph = {
            'qubits': qubits,
            'nodes': [],
            'edges': [],
            'layers': []
        }

        # Create initial nodes for each qubit
        for q in range(qubits):
            zx_graph['nodes'].append({
                'id': f'input_{q}',
                'type': 'z',
                'phase': 0,
                'position': {
                    'x': 0,
                    'y': q * 100
                },
                'label': f'Input {q}'
            })

        # Process each gate and create ZX-graph nodes
        time_slot_nodes = {}
        for gate in gates:
            qubit_index = gate['qubitIndex']
            gate_type = gate['gate']
            time_slot = gate['time']

            if time_slot not in time_slot_nodes:
                time_slot_nodes[time_slot] = []

            # Create node for this gate
            node_id = f'{time_slot}_{qubit_index}_{gate_type}'
            node = {
                'id': node_id,
                'type': 'z',  # Default to Z node
                'phase': 0,
                'position': {
                    'x': (time_slot + 1) * 200,
                    'y': qubit_index * 100
                },
                'label': gate_type
            }

            # Set node type based on gate
            if gate_type == 'X':
                node['type'] = 'x'
            elif gate_type == 'Y':
                node['type'] = 'y'
            elif gate_type == 'H':
                node['type'] = 'h'

            # Set phase based on parameters
            params = gate.get('params', {})
            if 'phase' in params:
                node['phase'] = params['phase']
            elif 'angle' in params:
                node['phase'] = params['angle']

            zx_graph['nodes'].append(node)
            time_slot_nodes[time_slot].append(node_id)

            # Connect to previous layer
            if time_slot == 0:
                # Connect to input node
                zx_graph['edges'].append({
                    'source': f'input_{qubit_index}',
                    'target': node_id
                })
            else:
                # Connect to previous time slot node
                previous_nodes = time_slot_nodes.get(time_slot - 1, [])
                if previous_nodes:
                    zx_graph['edges'].append({
                        'source': previous_nodes[-1],
                        'target': node_id
                    })

        # Create output nodes
        max_time_slot = max([g['time'] for g in gates]) if gates else 0
        for q in range(qubits):
            output_node = {
                'id': f'output_{q}',
                'type': 'z',
                'phase': 0,
                'position': {
                    'x': (max_time_slot + 2) * 200,
                    'y': q * 100
                },
                'label': f'Output {q}'
            }
            zx_graph['nodes'].append(output_node)

            # Connect from last layer
            if max_time_slot in time_slot_nodes:
                layer_nodes = time_slot_nodes[max_time_slot]
                qubit_nodes = [n for n in layer_nodes if zx_graph['nodes'][next(i for i, x in enumerate(zx_graph['nodes']) if x['id'] == n)]['position']['y'] == q * 100]
                if qubit_nodes:
                    zx_graph['edges'].append({
                        'source': qubit_nodes[-1],
                        'target': f'output_{q}'
                    })
            else:
                # Connect directly from input if no gates
                zx_graph['edges'].append({
                    'source': f'input_{q}',
                    'target': f'output_{q}'
                })

        return zx_graph


class ZXGraphSimplificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Apply ZX-calculus rewrite rules to simplify ZX-graph.
        """
        start_time = time.time()

        try:
            zx_graph = request.data.get('zx_graph', {})

            if not zx_graph:
                return Response({
                    'success': False,
                    'error': 'No ZX-graph provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Apply simplification rules
            simplified_graph = self.simplify_zx_graph(zx_graph)

            response = {
                'success': True,
                'data': {
                    'simplified_graph': simplified_graph,
                    'execution_time': round(time.time() - start_time, 3)
                }
            }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def simplify_zx_graph(self, zx_graph):
        """
        Apply ZX-calculus simplification rules.
        This is a simplified implementation.
        """
        # For now, return the same graph (we'll implement actual simplification later)
        simplified = json.loads(json.dumps(zx_graph))

        # Mark as simplified
        simplified['simplified'] = True
        simplified['original_node_count'] = len(zx_graph['nodes'])
        simplified['original_edge_count'] = len(zx_graph['edges'])

        return simplified


class ZXGraphToCircuitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Convert ZX-graph back to quantum circuit.
        """
        start_time = time.time()

        try:
            zx_graph = request.data.get('zx_graph', {})

            if not zx_graph:
                return Response({
                    'success': False,
                    'error': 'No ZX-graph provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Convert ZX-graph to circuit
            circuit = self.zx_graph_to_circuit(zx_graph)

            response = {
                'success': True,
                'data': {
                    'circuit': circuit,
                    'execution_time': round(time.time() - start_time, 3)
                }
            }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def zx_graph_to_circuit(self, zx_graph):
        """
        Convert ZX-graph to quantum circuit.
        This is a simplified implementation.
        """
        qubits = zx_graph.get('qubits', 5)
        nodes = zx_graph.get('nodes', [])
        edges = zx_graph.get('edges', [])

        gates = []
        time_slot = 0

        # Create a simple circuit from ZX-graph
        # This will be improved with actual ZX-calculus to circuit conversion
        for q in range(qubits):
            # Find nodes on this qubit line
            qubit_nodes = [n for n in nodes if n.get('position', {}).get('y', 0) == q * 100]

            for node in qubit_nodes:
                if node.get('label') in ['X', 'Y', 'Z', 'H', 'S', 'T']:
                    gate = {
                        'qubitIndex': q,
                        'gate': node.get('label'),
                        'params': {},
                        'time': time_slot
                    }

                    if node.get('phase', 0) != 0:
                        gate['params']['phase'] = node['phase']

                    gates.append(gate)
                    time_slot += 1

        return {
            'qubits': qubits,
            'gates': gates,
            'description': 'Converted from ZX-graph'
        }
