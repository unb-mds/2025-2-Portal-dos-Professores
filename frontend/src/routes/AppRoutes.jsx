// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importe a página que fizemos
import HomePage from '../pages/HomePage';

// TODO: Importe as outras páginas quando elas existirem
// import SobrePage from '../pages/SobrePage';

function AppRoutes() {
  return (
    <Routes>
      {/* Diz ao router: "Quando a URL for "/", mostre o componente HomePage" */}
      <Route path="/" element={<HomePage />} />
      
      {/* <Route path="/sobre" element={<SobrePage />} /> */}
      {/* <Route path="/professores" element={<PaginaDeBusca />} /> */}
    </Routes>
  );
}

export default AppRoutes;