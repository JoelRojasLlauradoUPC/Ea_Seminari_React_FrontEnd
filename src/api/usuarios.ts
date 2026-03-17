import { api } from './http';
import type { Usuario } from '../models/usuario';
import type { Organizacion } from '../models/organizacion';

export const usuariosApi = {
  getAll: async () => (await api.get<Usuario[]>('/usuarios')).data,
  getById: async (id: string) => (await api.get<Usuario>(`/usuarios/${id}`)).data,
  getOrganizaciones: async () =>
    (await api.get<Organizacion[]>('/organizaciones')).data,
  create: async (payload: {
    name: string;
    email: string;
    password: string;
    organizacion: string;
  }) => (await api.post<Usuario>('/usuarios', payload)).data,
  update: async (
    id: string,
    payload: {
      name: string;
      email: string;
      password: string;
      organizacion: string;
    }
  ) => (await api.put<Usuario>(`/usuarios/${id}`, payload)).data,
  remove: async (id: string) => {
    await api.delete(`/usuarios/${id}`);
  },
};
