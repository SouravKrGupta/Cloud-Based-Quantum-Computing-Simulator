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

const ComposerLayoutRoutes = new Set(['/circuit-composer', '/quantum-composer']);

const AppShell = () => {
  const location = useLocation();
  const isComposerLayout = ComposerLayoutRoutes.has(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isComposerLayout && <Navbar />}

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
          <Route path="/quantum-composer" element={<CircuitComposer />} />
        </Routes>
      </main>

      {!isComposerLayout && <Footer />}
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
