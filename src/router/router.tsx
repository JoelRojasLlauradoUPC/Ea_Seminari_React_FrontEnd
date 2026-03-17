import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import OrganizacionesPage from '../pages/organizaciones/OrganizacionesPage';
import UsuariosPage from '../pages/usuarios/UsuariosPage';
import OrganizacionDetailPage from '../pages/organizacion-detail/OrganizacionDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <OrganizacionesPage /> },
      { path: 'usuarios', element: <UsuariosPage /> },
      { path: 'organizaciones/:id', element: <OrganizacionDetailPage /> },
    ],
  },
]);

export default router;
