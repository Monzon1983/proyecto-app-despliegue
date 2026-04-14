import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  edad: number;
};

type UsuarioForm = {
  nombre: string;
  email: string;
  edad: string;
};

const getApiBaseUrl = (): string => {
  const host = window.location.hostname || "localhost";
  return `http://${host}:3000/api/usuarios`;
};

const EMPTY_FORM: UsuarioForm = {
  nombre: "",
  email: "",
  edad: "",
};

function App() {
  const API_BASE_URL = useMemo(() => getApiBaseUrl(), []);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<UsuarioForm>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const isEditing = useMemo(() => editId !== null, [editId]);

  const cargarUsuarios = async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError("");

    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.mensaje ?? "No se pudo cargar usuarios.");
      }

      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void cargarUsuarios();
    const intervalId = window.setInterval(() => {
      void cargarUsuarios(true);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [API_BASE_URL]);

  const limpiarFormulario = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMensaje("");

    const payload = {
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      edad: Number(form.edad),
    };

    if (!payload.nombre || !payload.email || Number.isNaN(payload.edad)) {
      setError("Completa nombre, email y edad correctamente.");
      return;
    }

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${API_BASE_URL}/${editId}` : API_BASE_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.mensaje ?? "No se pudo guardar.");
      }

      setMensaje(isEditing ? "Usuario actualizado." : "Usuario creado.");
      limpiarFormulario();
      await cargarUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    }
  };

  const editarUsuario = (usuario: Usuario) => {
    setEditId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      edad: String(usuario.edad),
    });
    setMensaje("");
    setError("");
  };

  const eliminarUsuario = async (id: number) => {
    setError("");
    setMensaje("");

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.mensaje ?? "No se pudo eliminar.");
      }

      setMensaje("Usuario eliminado.");
      await cargarUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    }
  };

  return (
    <main className="container">
      <h1>CRUD de Usuarios (TypeScript)</h1>
      <p className="subtitle">Conectado a API REST + Prisma + SQLite</p>
      <p className="subtitle small">
        Actualizacion en tiempo real cada 5 segundos. API: {API_BASE_URL}
      </p>

      <form className="card form-grid" onSubmit={onSubmit}>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Edad"
          type="number"
          min={0}
          value={form.edad}
          onChange={(e) => setForm({ ...form, edad: e.target.value })}
        />

        <div className="actions">
          <button type="submit">{isEditing ? "Actualizar" : "Crear"}</button>
          {isEditing && (
            <button type="button" className="secondary" onClick={limpiarFormulario}>
              Cancelar
            </button>
          )}
          <button type="button" className="secondary" onClick={() => void cargarUsuarios()}>
            Refrescar
          </button>
        </div>
      </form>

      {mensaje && <p className="ok">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>Lista de usuarios</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p>No hay usuarios todavía.</p>
        ) : (
          <div className="table-container">
            <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Edad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.edad}</td>
                  <td className="actions-cell">
                    <button type="button" onClick={() => editarUsuario(usuario)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => void eliminarUsuario(usuario.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
