import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CircuitProvider } from './context/CircuitContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import ResendOTP from './pages/ResendOTP';
import Home from './pages/Home';
import CircuitComposer from './pages/CircuitComposer';
import CodeView from './pages/CodeView';
import Results from './pages/Results';
import CustomGates from './pages/CustomGates';
import FileManager from './pages/FileManager';
import About from './pages/About';
import Documentation from './pages/Documentation';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ZXLab from './pages/ZXLab';
import VoiceQuantumSimulator from './pages/VoiceQuantumSimulator';

const ComposerLayoutRoutes = new Set(['/circuit-composer']);
const ZXLabLayoutRoutes = new Set(['/zx-lab']);
const VoiceSimulatorLayoutRoutes = new Set(['/voice-quantum-simulator']);

const AppShell = () => {
  const location = useLocation();
  const isComposerLayout = ComposerLayoutRoutes.has(location.pathname);
  const isZXLabLayout = ZXLabLayoutRoutes.has(location.pathname);
  const isVoiceSimulatorLayout = VoiceSimulatorLayoutRoutes.has(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isComposerLayout && !isZXLabLayout && !isVoiceSimulatorLayout && <Navbar />}

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/circuit-composer" element={<CircuitComposer />} />
          <Route path="/code-view" element={<CodeView />} />
          <Route path="/results" element={<Results />} />
          <Route path="/custom-gates" element={<CustomGates />} />
          <Route path="/file-manager" element={<FileManager />} />
          <Route path="/about" element={<About />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/resend-otp" element={<ResendOTP />} />

          <Route path="/zx-lab" element={<ZXLab />} />
          <Route path="/voice-quantum-simulator" element={<VoiceQuantumSimulator />} />
        </Routes>
      </main>

      {!isComposerLayout && !isZXLabLayout && !isVoiceSimulatorLayout && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CircuitProvider>
      <Router>
        <AppShell />
      </Router>
    </CircuitProvider>
  );
}

export default App;
