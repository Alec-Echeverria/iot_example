import api from './auth';

// Tipos para variables
export interface Variable {
  id: string;
  name: string;
  deviceId: string;
  deviceName: string;
  type: 'number' | 'string' | 'boolean';
  unit?: string;
  value: any;
  timestamp: string;
  description?: string;
  minValue?: number;
  maxValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VariableCreate {
  name: string;
  deviceId: string;
  type: 'number' | 'string' | 'boolean';
  unit?: string;
  description?: string;
  minValue?: number;
  maxValue?: number;
}

export interface VariableUpdate {
  name?: string;
  type?: 'number' | 'string' | 'boolean';
  unit?: string;
  description?: string;
  minValue?: number;
  maxValue?: number;
}

export interface VariableData {
  timestamp: string;
  value: any;
}

// API de variables
export const variablesAPI = {
  // Obtener todas las variables
  getAll: async (): Promise<Variable[]> => {
    try {
      const response = await api.get('/variables');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener variables');
    }
  },

  // Obtener variables por dispositivo
  getByDevice: async (deviceId: string): Promise<Variable[]> => {
    try {
      const response = await api.get(`/variables/device/${deviceId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener variables del dispositivo');
    }
  },

  // Obtener una variable por ID
  getById: async (id: string): Promise<Variable> => {
    try {
      const response = await api.get(`/variables/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener variable');
    }
  },

  // Crear nueva variable
  create: async (variable: VariableCreate): Promise<Variable> => {
    try {
      const response = await api.post('/variables', variable);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear variable');
    }
  },

  // Actualizar variable
  update: async (id: string, variable: VariableUpdate): Promise<Variable> => {
    try {
      const response = await api.put(`/variables/${id}`, variable);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar variable');
    }
  },

  // Eliminar variable
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/variables/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar variable');
    }
  },

  // Obtener datos históricos de una variable
  getHistoricalData: async (
    id: string,
    startDate: string,
    endDate: string,
    limit?: number
  ): Promise<VariableData[]> => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...(limit && { limit: limit.toString() }),
      });
      const response = await api.get(`/variables/${id}/data?${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener datos históricos');
    }
  },

  // Enviar valor a una variable
  sendValue: async (id: string, value: any): Promise<void> => {
    try {
      await api.post(`/variables/${id}/value`, { value });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al enviar valor');
    }
  },
};