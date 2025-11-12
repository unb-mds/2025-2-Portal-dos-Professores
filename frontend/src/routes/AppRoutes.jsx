// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import SobreNosPage from '../pages/SobreNosPage';
import ProfessoresPage from '../pages/ProfessoresPage';
import ProfessorDetailPage from '../pages/ProfessorDetailPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<SobreNosPage />} />
      <Route path="/professores" element={<ProfessoresPage />} />
      <Route path="/professores/:id" element={<ProfessorDetailPage />} />
    </Routes>
  );
}

export default AppRoutes;