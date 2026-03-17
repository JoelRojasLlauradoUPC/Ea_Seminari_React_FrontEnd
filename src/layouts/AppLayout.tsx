import { NavLink, Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="logo">mini-spa</span>
        </div>

        <nav className="nav">
          <NavLink to="/" end>
            Organizaciones
          </NavLink>
          <NavLink to="/usuarios">Usuarios</NavLink>
        </nav>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <small>Seminari React + TypeScript · CRUD</small>
      </footer>
    </>
  );
}

export default AppLayout;
