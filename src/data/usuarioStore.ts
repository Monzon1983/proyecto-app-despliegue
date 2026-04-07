import { ActualizarUsuarioDTO, CrearUsuarioDTO, Usuario } from "../types/usuario";

const usuarios: Usuario[] = [];
let nextId = 1;

export const listarUsuarios = (): Usuario[] => {
  return usuarios;
};

export const buscarUsuarioPorId = (id: number): Usuario | undefined => {
  return usuarios.find((usuario) => usuario.id === id);
};

export const crearUsuario = (data: CrearUsuarioDTO): Usuario => {
  const nuevoUsuario: Usuario = {
    id: nextId++,
    ...data,
  };

  usuarios.push(nuevoUsuario);
  return nuevoUsuario;
};

export const actualizarUsuario = (
  id: number,
  data: ActualizarUsuarioDTO
): Usuario | undefined => {
  const usuario = buscarUsuarioPorId(id);

  if (!usuario) {
    return undefined;
  }

  Object.assign(usuario, data);
  return usuario;
};

export const eliminarUsuario = (id: number): boolean => {
  const index = usuarios.findIndex((usuario) => usuario.id === id);

  if (index === -1) {
    return false;
  }

  usuarios.splice(index, 1);
  return true;
};
