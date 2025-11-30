// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import SobreNosPage from '../pages/SobreNosPage';
import ProfessoresPage from '../pages/ProfessoresPage';
import ProfessorDetailPage from '../pages/ProfessorDetailPage';
import EncontrarOrientadorPage from '../pages/EncontrarOrientadorPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre-nos" element={<SobreNosPage />} />
      <Route path="/professores" element={<ProfessoresPage />} />
      <Route path="/professores/:id" element={<ProfessorDetailPage />} />
      <Route path="/orientador" element={<EncontrarOrientadorPage />}/>
    </Routes>
  );
}

export default AppRoutes;