import { useEffect, useMemo, useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import { usuariosApi } from '../../api/usuarios';
import type { Organizacion } from '../../models/organizacion';
import type { Usuario } from '../../models/usuario';

const LIMITE = 10;

type UsuarioFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizacion: string;
};

const initialForm: UsuarioFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  organizacion: '',
};

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [form, setForm] = useState<UsuarioFormState>(initialForm);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

  const usuariosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();
    return usuarios.filter((user) => user.name.toLowerCase().includes(term));
  }, [usuarios, search]);

  const usuariosVisibles = mostrarTodos
    ? usuariosFiltrados
    : usuariosFiltrados.slice(0, LIMITE);

  const formHasErrors =
    !form.name.trim() ||
    !form.email.trim() ||
    !form.organizacion ||
    form.password.length < 6 ||
    form.password !== form.confirmPassword ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const load = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await usuariosApi.getAll();
      setUsuarios(data);
    } catch {
      setErrorMsg('No se han podido cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizaciones = async () => {
    try {
      const data = await usuariosApi.getOrganizaciones();
      setOrganizaciones(data);
    } catch {
      setErrorMsg('No se han podido cargar las organizaciones.');
    }
  };

  useEffect(() => {
    void load();
    void loadOrganizaciones();
  }, []);

  const resetForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setForm(initialForm);
  };

  const organizacionLabel = (user: Usuario) => {
    if (!user.organizacion) return '-';
    if (typeof user.organizacion === 'string') return user.organizacion;
    return user.organizacion.name ?? '-';
  };

  const guardar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formHasErrors) return;

    try {
      setErrorMsg('');
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        organizacion: form.organizacion,
      };

      if (editandoId) {
        await usuariosApi.update(editandoId, payload);
      } else {
        await usuariosApi.create(payload);
      }

      resetForm();
      await load();
    } catch {
      setErrorMsg(editandoId ? 'No se ha podido actualizar el usuario.' : 'No se ha podido crear el usuario.');
    }
  };

  const eliminar = async () => {
    if (!usuarioAEliminar) return;

    try {
      setErrorMsg('');
      await usuariosApi.remove(usuarioAEliminar._id);
      setUsuarioAEliminar(null);
      await load();
    } catch {
      setErrorMsg('No se ha podido eliminar el usuario.');
    }
  };

  return (
    <section>
      <h2>Usuarios</h2>

      <p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
        />
      </p>

      {loading && <p>Cargando...</p>}
      {!loading && errorMsg && <p>{errorMsg}</p>}
      {!loading && !errorMsg && usuarios.length === 0 && <p>No hay usuarios.</p>}

      {!mostrarForm && (
        <button
          type="button"
          className="btn"
          onClick={() => setMostrarForm(true)}
          style={{ marginBottom: 15 }}
        >
          Añadir Nuevo Usuario
        </button>
      )}

      {mostrarForm && (
        <div className="card form-card stacked">
          <h3>{editandoId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>

          <form onSubmit={guardar}>
            <div className="field-block">
              <label htmlFor="organizacion">Organización:</label>
              <select
                id="organizacion"
                value={form.organizacion}
                onChange={(e) => setForm((current) => ({ ...current, organizacion: e.target.value }))}
              >
                <option value="">Selecciona una organización</option>
                {organizaciones.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-block">
              <label htmlFor="name">Nombre:</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              />
            </div>

            <div className="field-block">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
              />
              {!!form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                <small className="error-text">Formato de email inválido.</small>
              )}
            </div>

            <div className="field-block">
              <label htmlFor="password">Contraseña:</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
              />
              {!!form.password && form.password.length < 6 && (
                <small className="error-text">La contraseña debe tener al menos 6 caracteres.</small>
              )}
            </div>

            <div className="field-block">
              <label htmlFor="confirmPassword">Repetir contraseña:</label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((current) => ({ ...current, confirmPassword: e.target.value }))}
              />
              {!!form.confirmPassword && form.password !== form.confirmPassword && (
                <small className="error-text">Las contraseñas no coinciden.</small>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn" disabled={formHasErrors}>
                Guardar
              </button>
              <button type="button" className="btn" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {!loading && !errorMsg && usuariosVisibles.length > 0 && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Organización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosVisibles.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{organizacionLabel(user)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setMostrarForm(true);
                        setEditandoId(user._id);
                        setForm({
                          name: user.name,
                          email: user.email,
                          password: user.password ?? '',
                          confirmPassword: user.password ?? '',
                          organizacion:
                            typeof user.organizacion === 'string'
                              ? user.organizacion
                              : user.organizacion?._id ?? '',
                        });
                      }}
                    >
                      Editar
                    </button>
                    <button type="button" className="btn" onClick={() => setUsuarioAEliminar(user)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        {!mostrarTodos && usuariosFiltrados.length > LIMITE && (
          <button type="button" className="btn" onClick={() => setMostrarTodos(true)}>
            Mostrar más
          </button>
        )}

        {mostrarTodos && (
          <button type="button" className="btn" onClick={() => setMostrarTodos(false)}>
            Mostrar menos
          </button>
        )}
      </div>

      <button type="button" className="btn" onClick={() => void load()} style={{ marginTop: 15 }}>
        Recargar
      </button>

      {usuarioAEliminar && (
        <ConfirmDialog
          title="Eliminar usuario"
          message={`¿Seguro que quieres borrar a ${usuarioAEliminar.name}?`}
          onCancel={() => setUsuarioAEliminar(null)}
          onConfirm={() => void eliminar()}
        />
      )}
    </section>
  );
}

export default UsuariosPage;
