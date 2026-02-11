# 🧪 Testing Checklist

## Pre-Launch Verification

### ✅ Component Imports & Setup
- [ ] App.jsx imports CircuitProvider
- [ ] App.jsx has all routes
- [ ] CircuitContext.jsx is accessible
- [ ] All components are properly exported
- [ ] No import errors in console

### ✅ Page Navigation
- [ ] Home page loads at `/`
- [ ] Circuit Composer loads at `/circuit-composer`
- [ ] Code View loads at `/code-view`
- [ ] Results page loads at `/results`
- [ ] Custom Gates page loads at `/custom-gates`
- [ ] File Manager loads at `/file-manager`
- [ ] Documentation loads at `/documentation`
- [ ] Legacy `/quantum-composer` redirects to `/circuit-composer`

---

## Circuit Composer Tests

### Toolbar
- [ ] Undo button appears
- [ ] Redo button appears (disabled initially)
- [ ] File menu opens/closes
- [ ] Save Circuit dialog appears
- [ ] Load Circuit file input works
- [ ] Export QASM button works
- [ ] Alignment buttons toggle states
- [ ] Inspect mode button toggles
- [ ] Run button is clickable

### Gate Palette
- [ ] Search input filters gates
- [ ] Single Qubit gates category expands/collapses
- [ ] Multi Qubit gates category expands/collapses
- [ ] Parametric gates category expands/collapses
- [ ] Measurement gates category expands/collapses
- [ ] Colors differentiate gate types:
  - [ ] Single/Multi = Blue
  - [ ] Parametric = Yellow
  - [ ] Measurement = Red
- [ ] Gates can be dragged

### Circuit Canvas
- [ ] Qubit wires display correctly
- [ ] Qubit labels show (q0, q1, etc.)
- [ ] Can adjust qubit count
- [ ] Can drag gates onto wires
- [ ] Dropped gates appear correctly
- [ ] Can select gates (highlight with green ring)
- [ ] Can multi-select gates (Ctrl/Cmd+Click)
- [ ] Selected gate count displays
- [ ] Can edit gate parameters
- [ ] Can delete selected gates
- [ ] Edit panel shows for parametric gates
- [ ] Empty state message displays when no gates

### Simulator Panel
- [ ] Panel opens (initially collapsed)
- [ ] Can expand/collapse panel
- [ ] Statevector tab shows probability bars
- [ ] Histogram tab shows top states
- [ ] Q-Sphere tab shows placeholder
- [ ] Statistics show:
  - [ ] Circuit stats (gates, qubits)
  - [ ] Quantum state dimension

### Visualizations (with gates added)
- [ ] Statevector probabilities update
- [ ] Histogram updates when gates change
- [ ] State evolution is visible
- [ ] Top states are ranked by probability
- [ ] Percentage values display correctly

---

## CodeView Page Tests

- [ ] OpenQASM code displays
- [ ] Copy button works
- [ ] Download button downloads .qasm file
- [ ] Code updates when circuit changes
- [ ] Empty state shows when no gates

---

## Results Page Tests

- [ ] Results list displays (with sample data)
- [ ] Can view result details in modal
- [ ] Download button works (JSON)
- [ ] Download button works (CSV)
- [ ] Can delete results
- [ ] Status badge shows correctly

---

## CustomGates Page Tests

- [ ] Create Custom Gate button available when gates exist
- [ ] Dialog opens on click
- [ ] Can enter custom gate name
- [ ] Can select gates from circuit
- [ ] Create button works
- [ ] Created gates appear in list
- [ ] Can delete custom gates
- [ ] Can copy custom gate names

---

## FileManager Page Tests

- [ ] New Circuit button works
- [ ] Import .qasm button visible
- [ ] Can select .qasm file
- [ ] Saved circuits list displays
- [ ] Can load circuits
- [ ] Can delete circuits
- [ ] Can download circuits as JSON
- [ ] Proper error messages show

---

## ExecuteDialog Tests (UI Only)

- [ ] Dialog opens when Run clicked
- [ ] Backend selector visible (Simulator/IBM Quantum)
- [ ] Shot slider works (100-10000)
- [ ] Shot number input works
- [ ] Circuit summary displays
- [ ] Run button is functional
- [ ] Cancel button closes dialog

---

## ResultsView Tests (UI Only)

- [ ] Results modal opens
- [ ] Can switch between tabs
- [ ] Histogram tab shows bar chart
- [ ] Statistics tab shows metrics
- [ ] Raw JSON tab shows formatted code
- [ ] Copy button works
- [ ] Download buttons work
- [ ] Close button works

---

## Responsive Design Tests

### Mobile (375px width)
- [ ] Navbar collapses properly
- [ ] Sidebar hides on small screens
- [ ] Circuit canvas scrolls horizontally
- [ ] Buttons stack vertically
- [ ] Text is readable

### Tablet (768px width)
- [ ] Layout adapts gracefully
- [ ] Sidebar sidebar visible
- [ ] Buttons are touch-friendly

### Desktop (1200px+ width)
- [ ] All elements visible
- [ ] Optimal spacing
- [ ] No horizontal scrolling needed

---

## State Management Tests

### Circuit Operations
- [ ] Adding gates updates circuit state
- [ ] Removing gates updates state
- [ ] Editing gates updates params
- [ ] Clearing circuit resets state
- [ ] Qubit count changes work
- [ ] Circuit name can be changed

### LocalStorage
- [ ] Save circuit stores to localStorage
- [ ] Load circuit retrieves from localStorage
- [ ] Circuits persist on page refresh
- [ ] Can retrieve saved circuits list

### Custom Gates
- [ ] Custom gates store in state
- [ ] Custom gates persist during session
- [ ] Can remove custom gates

---

## Code Quality Tests

### Browser Console
- [ ] No console errors
- [ ] No console warnings
- [ ] No 404 errors
- [ ] All images load
- [ ] CSS loads properly

### Performance
- [ ] Page loads fast (< 3s)
- [ ] No lag when dragging gates
- [ ] Visualizations update smoothly
- [ ] No memory leaks

---

## Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Color contrast is sufficient
- [ ] Buttons have hover states
- [ ] Icons have tooltips
- [ ] Form labels are associated

---

## Cross-Browser Tests

- [ ] Firefox
- [ ] Chrome
- [ ] Safari
- [ ] Edge

---

## Integration Points (When Backend Ready)

- [ ] Execute Circuit API call
- [ ] Get Job Status API call
- [ ] QASM parsing works
- [ ] Results display correctly
- [ ] Error handling works

---

## User Workflow Tests

### First-Time User
- [ ] Landing page explains features
- [ ] Clear call-to-action to start
- [ ] Documentation accessible
- [ ] Can create first circuit easily

### Basic Circuit
1. [ ] Navigate to Circuit Composer
2. [ ] Drag H gate to q0
3. [ ] Drag CNOT (q0 control, q1 target)
4. [ ] See visualizations update
5. [ ] View code in Code View
6. [ ] Save circuit
7. [ ] Load circuit back
8. [ ] Create custom gate from gates
9. [ ] Export as QASM

### Advanced Workflow
1. [ ] Load Bell State circuit
2. [ ] Modify parameters
3. [ ] Run simulation
4. [ ] View results
5. [ ] Export results as CSV
6. [ ] Create custom gate
7. [ ] Use in new circuit

---

## Documentation Tests

- [ ] Documentation page loads
- [ ] Sections expand/collapse
- [ ] Links work
- [ ] Code examples display
- [ ] FAQs are helpful
- [ ] External links work

---

## Error Handling Tests

- [ ] Invalid file format shows error
- [ ] Qubit limit enforced
- [ ] Empty circuit name validation
- [ ] Network error handling
- [ ] LocalStorage full handling

---

## Final Checklist

- [ ] All routes work
- [ ] All pages load without errors
- [ ] Styling is consistent
- [ ] No broken links
- [ ] All buttons functional
- [ ] State management working
- [ ] LocalStorage operations working
- [ ] Ready for backend integration

---

**Testing Status**: 🔄 Pending
**Last Updated**: February 11, 2026

## Notes for QA:
- Focus on Canvas drag-and-drop functionality
- Verify all visualization updates
- Test localStorage persistence
- Check responsive design on mobile
- Validate form inputs

## Known Limitations:
- Backend API not yet implemented
- Q-Sphere visualization is placeholder
- Undo/Redo not implemented
- Circuit parsing from QASM needs implementation
- Real hardware execution via IBM Quantum pending backend setup
