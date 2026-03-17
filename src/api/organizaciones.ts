import { api } from './http';
import type { Organizacion } from '../models/organizacion';
import type { Usuario } from '../models/usuario';

export const organizacionesApi = {
  getAll: async () => (await api.get<Organizacion[]>('/organizaciones')).data,
  getById: async (id: string) =>
    (await api.get<Organizacion>(`/organizaciones/${id}`)).data,
  create: async (name: string) =>
    (await api.post<Organizacion>('/organizaciones', { name })).data,
  update: async (id: string, name: string) =>
    (await api.put<Organizacion>(`/organizaciones/${id}`, { name })).data,
  remove: async (id: string) => {
    await api.delete(`/organizaciones/${id}`);
  },
  getUsuarios: async (id: string) =>
    (await api.get<Usuario[]>(`/organizaciones/${id}/usuarios`)).data,
};
