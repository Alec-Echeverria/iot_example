import api from './auth';

// Tipos para alarmas
export interface Alarm {
  id: string;
  name: string;
  description?: string;
  variableId: string;
  variableName: string;
  deviceId: string;
  deviceName: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'between';
  value: number;
  valueMax?: number; // Para condición 'between'
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notificationEmail?: string;
  notificationSms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlarmCreate {
  name: string;
  description?: string;
  variableId: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'between';
  value: number;
  valueMax?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notificationEmail?: string;
  notificationSms?: string;
}

export interface AlarmUpdate {
  name?: string;
  description?: string;
  condition?: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'between';
  value?: number;
  valueMax?: number;
  isActive?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  notificationEmail?: string;
  notificationSms?: string;
}

export interface AlarmEvent {
  id: string;
  alarmId: string;
  alarmName: string;
  variableValue: number;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

export interface AlarmStats {
  total: number;
  active: number;
  triggered: number;
  acknowledged: number;
}

// API de alarmas
export const alarmsAPI = {
  // Obtener todas las alarmas
  getAll: async (): Promise<Alarm[]> => {
    try {
      const response = await api.get('/alarms');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener alarmas');
    }
  },

  // Obtener una alarma por ID
  getById: async (id: string): Promise<Alarm> => {
    try {
      const response = await api.get(`/alarms/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener alarma');
    }
  },

  // Crear nueva alarma
  create: async (alarm: AlarmCreate): Promise<Alarm> => {
    try {
      const response = await api.post('/alarms', alarm);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear alarma');
    }
  },

  // Actualizar alarma
  update: async (id: string, alarm: AlarmUpdate): Promise<Alarm> => {
    try {
      const response = await api.put(`/alarms/${id}`, alarm);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar alarma');
    }
  },

  // Eliminar alarma
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/alarms/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar alarma');
    }
  },

  // Activar/desactivar alarma
  toggleActive: async (id: string, isActive: boolean): Promise<Alarm> => {
    try {
      const response = await api.patch(`/alarms/${id}/toggle`, { isActive });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cambiar estado de alarma');
    }
  },

  // Reconocer alarma
  acknowledge: async (id: string): Promise<void> => {
    try {
      await api.post(`/alarms/${id}/acknowledge`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al reconocer alarma');
    }
  },

  // Obtener eventos de alarmas
  getEvents: async (limit?: number): Promise<AlarmEvent[]> => {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await api.get(`/alarms/events${params}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener eventos de alarmas');
    }
  },

  // Reconocer evento de alarma
  acknowledgeEvent: async (eventId: string): Promise<void> => {
    try {
      await api.post(`/alarms/events/${eventId}/acknowledge`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al reconocer evento');
    }
  },

  // Obtener estadísticas de alarmas
  getStats: async (): Promise<AlarmStats> => {
    try {
      const response = await api.get('/alarms/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de alarmas');
    }
  },
};