import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Axios configurado para llamar al backend de FastAPI
const api = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Interceptor que agrega el token a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores 401 automáticamente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export interface LoginCredentials {
  username: string; // Este campo lo usas como identificador principal (no email)
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
  name: string;
  country: string;
  city: string;
  company?: string;
  rol?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  country: string;
  city: string;
  company?: string;
  rol?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authAPI = {
  // Iniciar sesión (POST /login) con formulario tipo x-www-form-urlencoded
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const form = new URLSearchParams();
    form.append('username', credentials.username);
    form.append('password', credentials.password);

    const { data } = await api.post('/login', form);

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user)); // ✅ guardar user directamente

    return data;
  },

  // Registro de usuario (POST /users)
  register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    const { data } = await api.post('/users', credentials);

    // Guardar token y user (igual que login)
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user ?? {})); // Si aún no devuelves `user`, deja objeto vacío
    console.log('Respuesta completa del backend:', data);

    return data;
  },

  // Obtener el usuario actual (GET /users)
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/users');
    return data;
  },

  // Actualizar datos del usuario actual (PATCH /users/{username})
  updateProfile: async (username: string, data: Partial<RegisterCredentials>): Promise<void> => {
    await api.patch(`/users/${username}`, data);
  },

  // Eliminar usuario autenticado (DELETE /users/{username})
  deleteUser: async (username: string): Promise<void> => {
    await api.delete(`/users/${username}`);
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si el token es válido (básicamente vuelve a consultar el perfil)
  verifyToken: async (): Promise<User> => {
    return await authAPI.getProfile();
  },
};

export default api;


