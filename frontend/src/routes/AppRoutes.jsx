// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import SobreNosPage from '../pages/SobreNosPage'; // ✅ importado

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<SobreNosPage />} /> {/* ✅ rota adicionada */}
      {/* <Route path="/professores" element={<PaginaDeBusca />} /> */}
    </Routes>
  );
}

export default AppRoutes;
