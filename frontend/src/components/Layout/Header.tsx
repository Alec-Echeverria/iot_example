import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import '../../styles/layout.css';

interface HeaderProps {
  title: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
  onProfileClick: () => void;
}

export default function Header({ title, user, onLogout, onProfileClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    onProfileClick();
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      
      <div className="header-actions">
        <div className="user-menu" ref={dropdownRef}>
          <button className="user-button" onClick={toggleDropdown}>
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                getUserInitials(user.name)
              )}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-secondary">{user.email}</div>
            </div>
            <ChevronDown className={`transition ${isDropdownOpen ? 'transform rotate-180' : ''}`} size={16} />
          </button>
          
          <div className={`user-dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <button className="dropdown-item" onClick={handleProfileClick}>
              <User size={16} />
              Mi Perfil
            </button>
            <button className="dropdown-item" onClick={() => console.log('Settings clicked')}>
              <Settings size={16} />
              Configuración
            </button>
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <button className="dropdown-item danger" onClick={handleLogout}>
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}