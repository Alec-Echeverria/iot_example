import { useState } from 'react';
import { User, Lock, Mail, Phone, MapPin, Camera, Save, Eye, EyeOff } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../hooks/useAuth';
import '../styles/components.css';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar perfil' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al cambiar contraseña' });
    } finally {
      setIsLoading(false);
    }
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
    <MainLayout title="Mi Perfil">
      <div className="page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-description">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 'var(--spacing-lg)' }}>
          {message.text}
        </div>
      )}

      <div className="grid grid-3" style={{ gap: 'var(--spacing-lg)' }}>
        {/* Información del perfil */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="card-title">Información Personal</h3>
                <p className="card-subtitle">Actualiza tu información básica</p>
              </div>
              {!isEditing ? (
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </button>
              ) : (
                <div className="flex gap-sm">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: '',
                        location: '',
                        bio: ''
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="card-content">
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="+34 123 456 789"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} />
                    Ubicación
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Biografía</label>
                <textarea
                  className="form-textarea"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end mt-lg">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    <Save size={16} />
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Avatar y acciones rápidas */}
        <div className="flex-col gap-lg">
          {/* Avatar */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Foto de Perfil</h3>
            </div>
            <div className="card-content text-center">
              <div 
                className="user-avatar"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  margin: '0 auto var(--spacing-md)',
                  fontSize: '32px'
                }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getUserInitials(user?.name || '')
                )}
              </div>
              <button className="btn btn-outline w-full">
                <Camera size={16} />
                Cambiar Foto
              </button>
            </div>
          </div>

          {/* Información de cuenta */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Información de Cuenta</h3>
            </div>
            <div className="card-content">
              <div className="flex-col gap-md">
                <div>
                  <div className="text-sm text-secondary">Rol</div>
                  <div className="font-medium">{user?.role || 'Usuario'}</div>
                </div>
                <div>
                  <div className="text-sm text-secondary">Miembro desde</div>
                  <div className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-secondary">Última actualización</div>
                  <div className="font-medium">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de seguridad */}
      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="card-title">Seguridad</h3>
              <p className="card-subtitle">Gestiona la seguridad de tu cuenta</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              <Lock size={16} />
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {showPasswordForm && (
          <div className="card-content" style={{ borderTop: '1px solid var(--border-color)' }}>
            <form onSubmit={handlePasswordSubmit}>
              <div className="grid grid-3" style={{ gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                  <label className="form-label">Contraseña Actual</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="form-input"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--gray-400)',
                      }}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nueva Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      className="form-input"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      minLength={6}
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--gray-400)',
                      }}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirmar Contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-input"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--gray-400)',
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-md gap-sm">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  <Lock size={16} />
                  {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
}