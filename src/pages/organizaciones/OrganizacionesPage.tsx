import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { organizacionesApi } from '../../api/organizaciones';
import type { Organizacion } from '../../models/organizacion';
import ConfirmDialog from '../../components/ConfirmDialog';

const LIMITE = 10;

function OrganizacionesPage() {
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [orgAEliminar, setOrgAEliminar] = useState<Organizacion | null>(null);

  const organizacionesFiltradas = useMemo(() => {
    const term = search.trim().toLowerCase();
    return organizaciones.filter((org) => org.name.toLowerCase().includes(term));
  }, [organizaciones, search]);

  const organizacionesVisibles = mostrarTodas
    ? organizacionesFiltradas
    : organizacionesFiltradas.slice(0, LIMITE);

  const load = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await organizacionesApi.getAll();
      setOrganizaciones(data);
    } catch {
      setErrorMsg('No se han podido cargar las organizaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const resetForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setNombre('');
  };

  const guardar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nombre.trim()) return;

    try {
      setErrorMsg('');
      if (editandoId) {
        await organizacionesApi.update(editandoId, nombre.trim());
      } else {
        await organizacionesApi.create(nombre.trim());
      }
      resetForm();
      await load();
    } catch {
      setErrorMsg(
        editandoId
          ? 'No se ha podido actualizar la organización.'
          : 'No se ha podido crear la organización.'
      );
    }
  };

  const eliminar = async () => {
    if (!orgAEliminar) return;

    try {
      setErrorMsg('');
      await organizacionesApi.remove(orgAEliminar._id);
      setOrgAEliminar(null);
      await load();
    } catch {
      setErrorMsg('No se ha podido eliminar la organización.');
    }
  };

  return (
    <section>
      <h2>Organizaciones</h2>

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

      {!loading && !errorMsg && organizaciones.length > 0 && (
        <ul className="list">
          {organizacionesVisibles.map((org) => (
            <li className="card" key={org._id}>
              <div>
                <span className="name">
                  {expanded[org._id] || org.name.length <= 15
                    ? org.name
                    : `${org.name.slice(0, 15)}...`}
                </span>

                {org.name.length > 15 && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      setExpanded((current) => ({
                        ...current,
                        [org._id]: !current[org._id],
                      }))
                    }
                  >
                    {expanded[org._id] ? 'Mostrar menos' : 'Mostrar más'}
                  </button>
                )}
              </div>

              <div>
                <span className="muted">{org._id}</span>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setMostrarForm(true);
                    setEditandoId(org._id);
                    setNombre(org.name);
                  }}
                >
                  Editar
                </button>
                <Link className="btn" to={`/organizaciones/${org._id}`}>
                  Ver detalle
                </Link>
                <button
                  type="button"
                  className="btn delete-btn"
                  onClick={() => setOrgAEliminar(org)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!mostrarTodas && organizacionesFiltradas.length > LIMITE && (
        <button type="button" className="btn" onClick={() => setMostrarTodas(true)}>
          Mostrar más
        </button>
      )}

      {mostrarTodas && (
        <button type="button" className="btn" onClick={() => setMostrarTodas(false)}>
          Mostrar menos
        </button>
      )}

      {!loading && !errorMsg && organizaciones.length === 0 && <p>No hay organizaciones.</p>}

      {!mostrarForm && (
        <button type="button" className="btn" onClick={() => setMostrarForm(true)}>
          Añadir
        </button>
      )}

      {mostrarForm && (
        <div className="card form-card">
          <h3>{editandoId ? 'Editar Organización' : 'Nueva Organización'}</h3>

          <form onSubmit={guardar}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <div className="form-actions">
              <button type="submit" className="btn" disabled={!nombre.trim()}>
                {editandoId ? 'Actualizar' : 'Guardar'}
              </button>
              <button type="button" className="btn" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <button type="button" className="btn" onClick={() => void load()}>
        Recargar
      </button>

      {orgAEliminar && (
        <ConfirmDialog
          title="Eliminar organización"
          message={`¿Seguro que quieres eliminar ${orgAEliminar.name}?`}
          onCancel={() => setOrgAEliminar(null)}
          onConfirm={() => void eliminar()}
        />
      )}
    </section>
  );
}

export default OrganizacionesPage;
