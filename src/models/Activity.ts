export interface Activity {
  _id: string;
  tipoAccion: 'CREATE' | 'UPDATE' | 'DELETE';
  entidad: 'USUARIO' | 'ORGANIZACION';
  nombreElemento: string;
  entidadId?: string;
  createdAt?: string;
  updatedAt?: string;
}