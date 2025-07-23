import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Variables from "./pages/Variables";
import Alarms from "./pages/Alarms";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Grafana from "./pages/Grafana";
import ProtectedRoute from "./components/ProtectedRoute";
import './styles/layout.css';
import './styles/components.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/devices" element={
          <ProtectedRoute>
            <Devices />
          </ProtectedRoute>
        } />
        <Route path="/variables" element={
          <ProtectedRoute>
            <Variables />
          </ProtectedRoute>
        } />
        <Route path="/alarms" element={
          <ProtectedRoute>
            <Alarms />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/grafana" element={
          <ProtectedRoute>
            <Grafana />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
