import express, { Request, Response } from "express";
import cors from "cors";
import { usuariosRouter } from "./routes/usuarios.routes";

export const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ mensaje: "API de Usuarios funcionando." });
});

app.use("/api/usuarios", usuariosRouter);
