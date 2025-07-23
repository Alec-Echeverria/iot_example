import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Router, Eye, EyeOff, AlertCircle, CheckCircle, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/login.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.country ||
      !formData.city
    ) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      setIsLoading(true);
      const data = await register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        city: formData.city,
      });
      console.log("Respuesta del backend:", data);  // 👈 Asegúrate de que venga el token


      setSuccess('Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="login-container">
  <div className="login-card">
    <div className="login-header">
      <div className="login-logo">
        <div className="login-logo-icon">
          <Router size={24} />
        </div>
      </div>
      <h1 className="login-title">Crear Cuenta</h1>
      <p className="login-subtitle">Únete a la plataforma IoT</p>
    </div>

    {error && (
      <div className="login-error full-width">
        <AlertCircle size={16} />
        {error}
      </div>
    )}
    {success && (
      <div className="login-success full-width">
        <CheckCircle size={16} />
        {success}
      </div>
    )}

    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          <User size={16} /> Nombre completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Tu nombre completo"
          disabled={isLoading}
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="username" className="form-label">
          <User size={16} /> Nombre de usuario
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Ej. alejandro123"
          disabled={isLoading}
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          <Mail size={16} /> Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="form-input"
          placeholder="tu@email.com"
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="country" className="form-label">🌍 País</label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Ej. Colombia"
          disabled={isLoading}
          autoComplete="country"
        />
      </div>

      <div className="form-group">
        <label htmlFor="city" className="form-label">🏙️ Ciudad</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Ej. Bogotá"
          disabled={isLoading}
          autoComplete="address-level2"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          <Lock size={16} /> Contraseña
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
            autoComplete="new-password"
            style={{ paddingRight: '45px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--gray-400)',
              padding: '4px',
            }}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          <Lock size={16} /> Confirmar contraseña
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Repite tu contraseña"
            disabled={isLoading}
            autoComplete="new-password"
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
              padding: '4px',
            }}
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="remember-me full-width">
        <input
          type="checkbox"
          id="acceptTerms"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <label htmlFor="acceptTerms">
          Acepto los <a href="#" style={{ color: 'var(--primary-color)' }}>términos y condiciones</a>
        </label>
      </div>

      <button
        type="submit"
        className="login-button full-width"
        disabled={
          isLoading ||
          !formData.name ||
          !formData.username ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword ||
          !formData.country ||
          !formData.city ||
          !formData.acceptTerms
        }
      >
        {isLoading ? (
          <div className="login-loading">
            <div className="login-spinner" />
            Registrando...
          </div>
        ) : (
          'Crear Cuenta'
        )}
      </button>
    </form>

    <div className="login-footer">
      <p className="login-footer-text">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
          Inicia sesión
        </Link>
      </p>
    </div>
  </div>
</div>
  );
}
