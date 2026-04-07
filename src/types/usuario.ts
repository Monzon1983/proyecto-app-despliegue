export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  edad: number;
}

export type CrearUsuarioDTO = Omit<Usuario, "id">;

export type ActualizarUsuarioDTO = Partial<CrearUsuarioDTO>;
