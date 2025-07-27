import api from './auth';

export interface Variable {
  _id: string;
  device_id: string;
  variable_name: string;
  unit: string;
  description: string;
  sampling_ms: number;
  username: string;
}

export interface CreateVariableInput {
  device_id: string;
  variable_name: string;
  unit: string;
  description: string;
  sampling_ms: number;
}

export const variablesAPI = {
  getAll: async (): Promise<Variable[]> => {
    const { data } = await api.get('/variables');
    return data;
  },

  create: async (input: CreateVariableInput): Promise<any> => {
    const { data } = await api.post('/variables', input);
    return data;
  },

  delete: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/variables/${id}`);
    return data;
  },
};
