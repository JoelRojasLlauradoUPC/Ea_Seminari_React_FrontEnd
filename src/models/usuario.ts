import { Organizacion } from './organizacion';

export interface Usuario {
  _id: string;
  name: string;
  email: string;
  password?: string;
  organizacion?: Organizacion;
  createdAt?: string;
  updatedAt?: string;
}
