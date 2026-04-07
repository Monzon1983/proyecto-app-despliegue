"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuariosRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.usuariosRouter = (0, express_1.Router)();
exports.usuariosRouter.get("/", async (_req, res) => {
    const usuarios = await prisma_1.prisma.usuario.findMany({
        orderBy: { id: "asc" },
    });
    res.status(200).json(usuarios);
});
exports.usuariosRouter.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ mensaje: "El id debe ser numerico." });
    }
    const usuario = await prisma_1.prisma.usuario.findUnique({
        where: { id },
    });
    if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }
    return res.status(200).json(usuario);
});
exports.usuariosRouter.post("/", async (req, res) => {
    const body = req.body;
    if (!body?.nombre || !body?.email || typeof body?.edad !== "number") {
        return res.status(400).json({
            mensaje: "Debes enviar nombre, email y edad (number).",
        });
    }
    try {
        const nuevoUsuario = await prisma_1.prisma.usuario.create({
            data: body,
        });
        return res.status(201).json(nuevoUsuario);
    }
    catch (_error) {
        return res.status(409).json({
            mensaje: "No se pudo crear el usuario. Verifica que el email sea unico.",
        });
    }
});
exports.usuariosRouter.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    if (Number.isNaN(id)) {
        return res.status(400).json({ mensaje: "El id debe ser numerico." });
    }
    const usuario = await prisma_1.prisma.usuario.findUnique({
        where: { id },
    });
    if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }
    try {
        const usuarioActualizado = await prisma_1.prisma.usuario.update({
            where: { id },
            data: body,
        });
        return res.status(200).json(usuarioActualizado);
    }
    catch (_error) {
        return res.status(409).json({
            mensaje: "No se pudo actualizar. Verifica que el email sea unico.",
        });
    }
});
exports.usuariosRouter.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ mensaje: "El id debe ser numerico." });
    }
    const eliminado = await prisma_1.prisma.usuario.deleteMany({
        where: { id },
    });
    if (eliminado.count === 0) {
        return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }
    return res.status(204).send();
});
