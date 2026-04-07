"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const usuarios_routes_1 = require("./routes/usuarios.routes");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get("/", (_req, res) => {
    res.status(200).json({ mensaje: "API de Usuarios funcionando." });
});
exports.app.use("/api/usuarios", usuarios_routes_1.usuariosRouter);
