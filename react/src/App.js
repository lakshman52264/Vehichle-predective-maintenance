import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MaintenanceDetails from './pages/MaintenanceDetails';
import FuelData from './pages/FuelData';
import PredictionResult from './pages/PredictionResult';
import DriverBehavior from './pages/DriverBehavior';
import Chatbot from './components/chatbot';
import Login from './pages/Login';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

function AppContent() {
  const location = useLocation();

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><MaintenanceDetails /></ProtectedRoute>} />
        <Route path="/fuel-data" element={<ProtectedRoute><FuelData /></ProtectedRoute>} />
        <Route path="/prediction-result" element={<ProtectedRoute><PredictionResult /></ProtectedRoute>} />
        <Route path="/driver-behavior" element={<ProtectedRoute><DriverBehavior /></ProtectedRoute>} />
      </Routes>

      {location.pathname === '/' && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
