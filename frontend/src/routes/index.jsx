import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'; 
import App from '../App';
import HomePage from '../pages/HomePage';
import SobreNosPage from '../pages/SobreNosPage';
import ProfessoresPage from '../pages/ProfessoresPage';
// Importe as páginas que faltam
import ProfessorDetailPage from '../pages/ProfessorDetailPage';
import EncontrarOrientadorPage from '../pages/EncontrarOrientadorPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/professores', element: <ProfessoresPage /> },
        
        // ADICIONANDO A ROTA DE DETALHES (importante para /professores/:id funcionar oficialmente)
        { path: '/professores/:id', element: <ProfessorDetailPage /> }, 
        
        { path: '/sobre-nos', element: <SobreNosPage /> },
        
        // ADICIONANDO A ROTA QUE ESTAVA FALTANDO
        { path: '/orientador', element: <EncontrarOrientadorPage /> }, 

        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ],
  { basename: '/2025-2-Portal-dos-Professores/' }
);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}