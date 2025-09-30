

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'; 
import App from '../App';
import HomePage from '../pages/HomePage';
import SobreNosPage from '../pages/SobreNosPage';
import ProfessoresPage from '../pages/ProfessoresPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/professores', element: <ProfessoresPage /> },
      { path: '/sobre-nos', element: <SobreNosPage /> },
      {
        path: '*', 
        element: <Navigate to="/" replace />, 
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}