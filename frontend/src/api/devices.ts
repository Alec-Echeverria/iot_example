import api from './auth';

// Tipos para dispositivos
export interface Device {
  id: string;
  name: string;
  device_id: string;
  username: string;
  mqtt_username: string;
  mqtt_password: string;
  status:string;
}

export interface DeviceCreate {
  name: string;
  device_id: string;
}

export interface DeviceUpdate {
  name?: string;
  type?: string;
  location?: string;
  description?: string;
}

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  error: number;
}

// API de dispositivos
export const devicesAPI = {
  // Obtener todos los dispositivos
  getAll: async (): Promise<Device[]> => {
    try {
      const response = await api.get('/devices');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener dispositivos');
    }
  },

  // Obtener un dispositivo por ID
  getById: async (id: string): Promise<Device> => {
    try {
      const response = await api.get(`/devices/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener dispositivo');
    }
  },

  // Crear nuevo dispositivo
  create: async (device: DeviceCreate): Promise<Device> => {
    try {
      const response = await api.post('/devices', device);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear dispositivo');
    }
  },

  // Actualizar dispositivo -- No implementado
  update: async (id: string, device: DeviceUpdate): Promise<Device> => {
    try {
      const response = await api.put(`/devices/${id}`, device);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar dispositivo');
    }
  },

  // Eliminar dispositivo
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/devices/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar dispositivo');
    }
  },

  // Obtener estadísticas de dispositivos
  getStats: async (): Promise<DeviceStats> => {
    try {
      const response = await api.get('/devices/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  // Reiniciar dispositivo
  restart: async (id: string): Promise<void> => {
    try {
      await api.post(`/devices/${id}/restart`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al reiniciar dispositivo');
    }
  },

  // Actualizar firmware
  updateFirmware: async (id: string): Promise<void> => {
    try {
      await api.post(`/devices/${id}/update-firmware`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar firmware');
    }
  },
};