import { Usuario } from './usuario';

export interface Organizacion {
  _id: string;
  name: string;
  users: Usuario[];
}


