import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Router, 
  Settings, 
  Activity, 
  Bell, 
  User, 
  BarChart3,
  LogOut
} from 'lucide-react';
import '../../styles/layout.css';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/devices', label: 'Dispositivos', icon: Router },
  { path: '/variables', label: 'Variables', icon: Activity },
  { path: '/alarms', label: 'Alarmas', icon: Bell },
  { path: '/grafana', label: 'Dashboards', icon: BarChart3 },
  { path: '/profile', label: 'Perfil', icon: User },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <a href="/dashboard" className="sidebar-logo">
          <Router className="nav-icon" />
          IoT Platform
        </a>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              {item.label}
            </button>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ marginTop: 'auto', color: 'var(--error-color)' }}
        >
          <LogOut className="nav-icon" />
          Cerrar Sesión
        </button>
      </nav>
    </div>
  );
}