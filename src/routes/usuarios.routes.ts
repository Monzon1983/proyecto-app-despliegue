import { Request, Response, Router } from "express";
import { ActualizarUsuarioDTO, CrearUsuarioDTO } from "../types/usuario";
import { prisma } from "../lib/prisma";

export const usuariosRouter = Router();

usuariosRouter.get("/", async (_req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { id: "asc" },
  });
  res.status(200).json(usuarios);
});

usuariosRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ mensaje: "El id debe ser numerico." });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado." });
  }

  return res.status(200).json(usuario);
});

usuariosRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body as CrearUsuarioDTO;

  if (!body?.nombre || !body?.email || typeof body?.edad !== "number") {
    return res.status(400).json({
      mensaje: "Debes enviar nombre, email y edad (number).",
    });
  }

  try {
    const nuevoUsuario = await prisma.usuario.create({
      data: body,
    });
    return res.status(201).json(nuevoUsuario);
  } catch (_error) {
    return res.status(409).json({
      mensaje: "No se pudo crear el usuario. Verifica que el email sea unico.",
    });
  }
});

usuariosRouter.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body = req.body as ActualizarUsuarioDTO;

  if (Number.isNaN(id)) {
    return res.status(400).json({ mensaje: "El id debe ser numerico." });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado." });
  }

  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: body,
    });
    return res.status(200).json(usuarioActualizado);
  } catch (_error) {
    return res.status(409).json({
      mensaje: "No se pudo actualizar. Verifica que el email sea unico.",
    });
  }
});

usuariosRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ mensaje: "El id debe ser numerico." });
  }

  const eliminado = await prisma.usuario.deleteMany({
    where: { id },
  });

  if (eliminado.count === 0) {
    return res.status(404).json({ mensaje: "Usuario no encontrado." });
  }

  return res.status(204).send();
});
