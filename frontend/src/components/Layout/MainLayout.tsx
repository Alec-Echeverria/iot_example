import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/layout.css';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      // Forzar redirección aunque falle el logout
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="app">
      <Sidebar onLogout={handleLogout} />
      
      <div className="main-content">
        <Header 
          title={title}
          user={user}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
        />
        
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}