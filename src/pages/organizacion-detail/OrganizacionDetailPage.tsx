import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { organizacionesApi } from '../../api/organizaciones';
import { usuariosApi } from '../../api/usuarios';
import type { Organizacion } from '../../models/organizacion';
import type { Usuario } from '../../models/usuario';

function OrganizacionDetailPage() {
  const { id = '' } = useParams();
  const [organizacion, setOrganizacion] = useState<Organizacion | null>(null);
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [usuariosEnOrganizacion, setUsuariosEnOrganizacion] = useState<Usuario[]>([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<Usuario[]>([]);
  const [destinosSeleccionados, setDestinosSeleccionados] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const [org, usersInOrg, allUsers, allOrgs] = await Promise.all([
        organizacionesApi.getById(id),
        organizacionesApi.getUsuarios(id),
        usuariosApi.getAll(),
        usuariosApi.getOrganizaciones(),
      ]);

      setOrganizacion(org);
      setOrganizaciones(allOrgs);
      setUsuariosEnOrganizacion(usersInOrg);

      const usuariosActualesIds = new Set(usersInOrg.map((user) => user._id));
      setUsuariosDisponibles(allUsers.filter((user) => !usuariosActualesIds.has(user._id)));
    } catch {
      setErrorMsg('No se han podido cargar los datos de la organización.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, [id]);

  const nombreOrganizacion = (user: Usuario) => {
    const orgId = typeof user.organizacion === 'string' ? user.organizacion : user.organizacion?._id;
    return organizaciones.find((org) => org._id === orgId)?.name ?? '-';
  };

  const organizacionesDestino = organizaciones.filter((org) => org._id !== id);

  const addUsuario = async (user: Usuario) => {
    if (!user.password || user.password.length < 6) {
      setErrorMsg(
        `No se puede añadir a ${user.name} porque el backend exige password en update y este usuario no la trae en la respuesta.`
      );
      return;
    }

    try {
      setErrorMsg('');
      setSuccessMsg('');
      await usuariosApi.update(user._id, {
        name: user.name,
        email: user.email,
        password: user.password,
        organizacion: id,
      });
      setSuccessMsg(`Usuario ${user.name} añadido correctamente.`);
      await cargarDatos();
    } catch {
      setErrorMsg(`No se ha podido añadir a ${user.name}.`);
    }
  };

  const removeUsuario = async (user: Usuario) => {
    const destinoId = destinosSeleccionados[user._id];

    if (!destinoId) {
      setErrorMsg(`Selecciona una organización de destino para quitar a ${user.name}.`);
      return;
    }

    if (!user.password || user.password.length < 6) {
      setErrorMsg(
        `No se puede mover a ${user.name} porque el backend exige password en update y este usuario no la trae en la respuesta.`
      );
      return;
    }

    try {
      setErrorMsg('');
      setSuccessMsg('');
      await usuariosApi.update(user._id, {
        name: user.name,
        email: user.email,
        password: user.password,
        organizacion: destinoId,
      });
      setSuccessMsg(`Usuario ${user.name} quitado de la organización actual.`);
      await cargarDatos();
    } catch {
      setErrorMsg(`No se ha podido quitar a ${user.name}.`);
    }
  };

  return (
    <section>
      <h2>Detalle de la organización</h2>
      <Link to="/" className="btn">
        Volver
      </Link>

      {loading && <p>Cargando...</p>}
      {!loading && errorMsg && <p>{errorMsg}</p>}

      {!loading && !errorMsg && organizacion && (
        <>
          <div className="card detail-card">
            <h3>{organizacion.name}</h3>
            <p>
              <strong>ID:</strong> {organizacion._id}
            </p>
          </div>

          <h3>Sincronización de usuarios</h3>
          {!!successMsg && <p className="success-text">{successMsg}</p>}
          {!!errorMsg && <p className="error-text">{errorMsg}</p>}

          <div className="sync-grid">
            <div className="card sync-card">
              <h4>Usuarios vinculados</h4>
              {usuariosEnOrganizacion.length === 0 && <p>No hay usuarios vinculados a esta organización.</p>}

              <ul className="list compact-list">
                {usuariosEnOrganizacion.map((user) => (
                  <li key={user._id} className="item-row">
                    <div>
                      <strong>{user.name}</strong>
                      <br />
                      <span>{user.email}</span>
                    </div>

                    <div className="actions">
                      <select
                        value={destinosSeleccionados[user._id] ?? ''}
                        onChange={(e) =>
                          setDestinosSeleccionados((current) => ({
                            ...current,
                            [user._id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Mover a...</option>
                        {organizacionesDestino.map((org) => (
                          <option key={org._id} value={org._id}>
                            {org.name}
                          </option>
                        ))}
                      </select>

                      <button type="button" className="btn delete-btn" onClick={() => void removeUsuario(user)}>
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card sync-card">
              <h4>Usuarios disponibles para añadir</h4>
              {usuariosDisponibles.length === 0 && <p>No hay usuarios disponibles para añadir.</p>}

              <ul className="list compact-list">
                {usuariosDisponibles.map((user) => (
                  <li key={user._id} className="item-row">
                    <div>
                      <strong>{user.name}</strong>
                      <br />
                      <span>{user.email}</span>
                      <br />
                      <small>Organización actual: {nombreOrganizacion(user)}</small>
                    </div>

                    <div className="actions">
                      <button type="button" className="btn" onClick={() => void addUsuario(user)}>
                        Añadir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default OrganizacionDetailPage;
