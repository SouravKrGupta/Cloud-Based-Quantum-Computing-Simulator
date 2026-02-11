# IBM Quantum Composer User Guide

**Quantum Circuit Simulator** - A professional quantum circuit building experience inspired by IBM Quantum Composer.

---

## 🎯 Quick Start

### 1. The Interface

The quantum composer interface is divided into key sections:

```
┌─────────────────────────────────────────────────────────────┐
│                      TOOLBAR                                │
│  [File] [Undo/Redo] [Align] [Mode] [Run]                   │
├──────────────────┬─────────────────────────────┬────────────┤
│                  │                             │            │
│  OPERATIONS      │   CIRCUIT CANVAS            │   INFO     │
│  Catalog         │                             │   Panel    │
│                  │   • Qubit Wires             │            │
│  • Basic Gates   │   • Gate Blocks             │  Stats:    │
│  • Multi-Qubit   │   • Drag & Drop             │ - Gates    │
│  • Rotation      │   • Selection               │ - Runtime  │
│  • Measure       │                             │            │
│                  │                             │            │
│                  ├─────────────────────────────┤            │
│                  │                             │            │
│                  │   VISUALIZATIONS            │            │
│                  │                             │            │
│                  │ • Statevector              │            │
│                  │ • Histogram                │            │
│                  │ • Q-Sphere                 │            │
│                  │                             │            │
└──────────────────┴─────────────────────────────┴────────────┘
```

---

## 🔧 Operations Catalog (Left Sidebar)

The operations catalog contains all quantum gates organized by category:

### Categories

**Basic Gates** (Blue)
- **H (Hadamard)**: Creates superposition of qubits
- **X (Pauli X/NOT)**: Bit flip operation
- **Y (Pauli Y)**: Bit and phase flip
- **Z (Pauli Z)**: Phase flip
- **S (S Gate)**: Phase gate (π/2)
- **T (T Gate)**: Phase gate (π/8)

**Multi-Qubit** (Blue)
- **CNOT (CX)**: Controlled NOT gate
- **SWAP**: Swap qubit states
- **CCX (Toffoli)**: Double controlled NOT

**Rotation** (Amber)
- **RX(θ)**: Rotation around X-axis
- **RY(θ)**: Rotation around Y-axis
- **RZ(θ)**: Rotation around Z-axis
- **U3(θ,φ,λ)**: General single-qubit unitary

**Measure** (Red)
- **Measure**: Collapse to classical bits
- **Reset**: Reset qubit to |0⟩

### Using the Catalog

1. **Search**: Type in the search box to find gates quickly
2. **Expand Categories**: Click category header to expand/collapse
3. **Drag & Drop**: Drag any gate onto the circuit canvas
4. **Hover**: Hover over gates to see descriptions

---

## 📐 Circuit Canvas (Main Area)

The circuit canvas is where you build your quantum circuits.

### Layout

```
┌──────────────────────────────────────────┐
│ Circuit Name                             │
├──────────────────────────────────────────┤
│  Qubit    Time Slots (80px width each)   │
│ ┌──┬──────────────────────────────────┐  │
│ │q0│  [H] [X]                         │  │
│ │--●--●--●--●--●──────────────────│  │
│ ├──┼──────────────────────────────────┤  │
│ │q1│      [CNOT]                      │  │
│ │--●--●--●--●--●──────────────────│  │
│ ├──┼──────────────────────────────────┤  │
│ │q2│               [RZ(π/2)]          │  │
│ │--●--●--●--●--●──────────────────│  │
│ └──┴──────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Qubit Wires

- Horizontal lines represent qubits (labeled q0, q1, q2, etc.)
- The line extends left to right through time
- Gates are placed anywhere on these wires

### Placing Gates

1. **Drag from Catalog**: Drag a gate onto any qubit wire
2. **Positioning**: Gates snap to 80px time slots
3. **Multiple Gates**: Place multiple gates on the same qubit or across qubits
4. **Multi-qubit Gates**: CNOT connects control and target qubits

### Editing Gates

**Select a Gate**:
- Click any gate block (turns green)
- Ctrl+Click to multi-select gates
- Click empty space to deselect

**Edit Parameters**:
- Click parametric gates (RX, RY, RZ) to edit angles
- Dialog appears with parameter controls

**Delete Gates**:
- Select gate(s) and press Delete
- Or use Delete button in toolbar

### Qubit Management

- **Add Qubits**: Increase the number in "Qubits" input
- **Remove Qubits**: Decrease the number in "Qubits" input
- Max 20 qubits for visualization

---

## 🔄 Toolbar Controls

### File Menu (Left)
- **Save Circuit**: Save to local storage with a name
- **Load Circuit**: Load previously saved circuit
- **Export QASM**: Download circuit as .qasm file

### Edit Controls (Center-Left)
- **Undo (↶)**: Undo last action
- **Redo (↷)**: Redo undone action

### Alignment (Center)
- **Free**: Place gates anywhere
- **Left**: Align gates to left (compact)

### Mode (Center)
- **Edit**: Normal editing mode (default)
- **Inspect**: Step-by-step visualization of circuit execution

### Run Circuit (Right)
- **Run**: Execute circuit on simulator
- Opens execution dialog with options

---

## 📊 Visualizations Panel (Bottom)

Real-time visualization of quantum state as you build:

### Tabs

**Statevector View**
- Bar chart of quantum amplitudes
- Shows phase information via color
- Complete quantum state representation

**Histogram View**
- Probability of measurement outcomes
- Shows top 8 predicted states
- Percentage probabilities displayed

**Q-Sphere View**
- 3D representation of quantum state
- Each basis state is a point on sphere
- Node size = probability, Color = phase

### Using Visualizations

- **Interactive**: Observe changes in real-time as gates are added
- **Collapse**: Click title bar to hide/show panel
- **Export**: Download visualization as SVG or PNG

---

## 🚀 Running Circuits

### Execute Dialog

1. Click **"Run"** button in toolbar
2. Configure execution:
   - **Backend**: Choose simulator or quantum hardware
   - **Shots**: Number of measurements (100-10,000)
   - **Job Name**: Optional custom name
3. Click **"Run on [Backend]"**

### Viewing Results

Results appear in a modal showing:
- **Histogram**: Measurement outcome distribution
- **Statistics**: Metrics and analysis
- **JSON**: Raw result data
- **Export**: Download as CSV or JSON

---

## 💾 File Management

### Saving Circuits

1. Click **File → Save Circuit** or Ctrl+S
2. Enter circuit name
3. Stored in browser's local storage
4. No internet required

### Loading Circuits

1. Click **File → Load Circuit**
2. Select from saved circuits list
3. Circuit loads into editor

### Exporting & Importing

**Export**:
- File → Export QASM
- Downloads as `.qasm` file
- Standard OpenQASM 2.0 format

**Import**:
- File → Load Circuit → choose file
- Parses OpenQASM and builds circuit
- Compatible with Qiskit and IBM tools

---

## 📝 OpenQASM Code

You can view and edit the OpenQASM representation:

### Example Circuit

```qasm
OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

h q[0];
cx q[0],q[1];
rz(pi/2) q[2];
measure q -> c;
```

### Generating Code

1. Switch to **Code View** page
2. View generated OpenQASM
3. Copy or download the code
4. Use in Qiskit: `from qiskit import QuantumCircuit`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Delete` | Remove selected gates |
| `Ctrl+C` | Copy selected gates |
| `Ctrl+V` | Paste gates |
| `Ctrl+A` | Select all gates |
| `Escape` | Deselect |

---

## 🎨 Gate Colors & Types

### Color Coding

```
┌────────────────────────┐
│ Blue Gates             │
│ ├─ Basic Single-Qubit  │
│ ├─ Multi-Qubit (CNOT)  │
│ └─ Classical (NOT)     │
├────────────────────────┤
│ Amber Gates            │
│ └─ Parametric Rotation │
├────────────────────────┤
│ Red Gates              │
│ ├─ Measurement         │
│ └─ Non-Unitary Ops     │
└────────────────────────┘
```

---

## 💡 Tips & Tricks

### Building Efficient Circuits

1. **Use Layers Alignment**: Makes execution order clear
2. **Minimize CNOT Gates**: These are most expensive
3. **Group Related Gates**: Easier to understand circuit flow
4. **Use Custom Gates**: Save common patterns (future feature)

### Debugging Circuits

1. **Use Inspect Mode**: Step through execution
2. **Watch Visualizations**: See state changes in real-time
3. **Check Statevector**: Verify expected quantum state
4. **Export Code**: View generated OpenQASM

### Performance Tips

- Limit qubits to < 8 for fast simulation
- Fewer shots needed for validation
- Use parametric gates for flexibility

---

## 🔗 Integration with Backend

### API Endpoints

**Execute Circuit**
```
POST /api/execute/
Content-Type: application/json

{
  "qasm": "OPENQASM 2.0; ...",
  "backend": "simulator",
  "shots": 1024
}

Response:
{
  "job_id": "job_12345",
  "status": "pending",
  "timestamp": "2024-02-11T10:30:00Z"
}
```

**Get Results**
```
GET /api/jobs/{job_id}/

Response:
{
  "status": "completed",
  "counts": {
    "000": 256,
    "001": 128,
    ...
  },
  "execution_time_ms": 150
}
```

---

## ❓ FAQ

**Q: Can I build circuits with more than 20 qubits?**  
A: The visualizations support up to 20 qubits. Larger circuits can be built and exported but won't visualize.

**Q: How are circuits stored?**  
A: Circuits are stored in your browser's IndexedDB/localStorage. They persist between sessions.

**Q: Can I share circuits?**  
A: Export as .qasm files and share the file. Others can import it.

**Q: What's the difference between Inspect Mode and Run?**  
A: Inspect mode steps through the circuit visualization locally. Run executes on a backend simulator/hardware.

**Q: How many shots should I use?**  
A: More shots = more accurate results but longer runtime. 1024 is typical, 10000 for publication quality.

---

## 🚀 Getting Help

### Resources

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Setup and configuration
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[API Reference](./ARCHITECTURE.md#api-integration)** - Backend API specs

### Common Issues

**Gates not visualizing**: Ensure circuit has at least one gate
**Results not showing**: Check backend is running and accepting requests
**File won't load**: Ensure .qasm file is valid OpenQASM 2.0 format

---

## 📚 Learn More

- [OpenQASM Language](https://openqasm.com/)
- [IBM Quantum Docs](https://quantum.ibm.com/docs)
- [Qiskit Documentation](https://qiskit.org/documentation/)
- [Quantum Computing Basics](https://qiskit.org/learn)

---

**Version**: 1.0.0  
**Last Updated**: February 11, 2026  
**Status**: Complete ✅

---

## Summary

This quantum circuit simulator provides a professional, IBM-inspired interface for building and testing quantum circuits. It combines:

- ✅ Intuitive drag-and-drop gate placement
- ✅ Real-time quantum state visualization
- ✅ OpenQASM code generation and export
- ✅ Local circuit persistence
- ✅ Hardware-ready circuit execution
- ✅ Comprehensive documentation

Perfect for learning quantum computing or developing quantum algorithms!
