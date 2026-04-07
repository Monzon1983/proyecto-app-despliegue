"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.buscarUsuarioPorId = exports.listarUsuarios = void 0;
const usuarios = [];
let nextId = 1;
const listarUsuarios = () => {
    return usuarios;
};
exports.listarUsuarios = listarUsuarios;
const buscarUsuarioPorId = (id) => {
    return usuarios.find((usuario) => usuario.id === id);
};
exports.buscarUsuarioPorId = buscarUsuarioPorId;
const crearUsuario = (data) => {
    const nuevoUsuario = {
        id: nextId++,
        ...data,
    };
    usuarios.push(nuevoUsuario);
    return nuevoUsuario;
};
exports.crearUsuario = crearUsuario;
const actualizarUsuario = (id, data) => {
    const usuario = (0, exports.buscarUsuarioPorId)(id);
    if (!usuario) {
        return undefined;
    }
    Object.assign(usuario, data);
    return usuario;
};
exports.actualizarUsuario = actualizarUsuario;
const eliminarUsuario = (id) => {
    const index = usuarios.findIndex((usuario) => usuario.id === id);
    if (index === -1) {
        return false;
    }
    usuarios.splice(index, 1);
    return true;
};
exports.eliminarUsuario = eliminarUsuario;
