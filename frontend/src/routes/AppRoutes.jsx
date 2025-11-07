// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import SobreNosPage from '../pages/SobreNosPage';
import ProfessoresPage from '../pages/ProfessoresPage'; // <--- 1. IMPORTE A PÁGINA AQUI

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<SobreNosPage />} />
      
      {/* 2. ADICIONE A ROTA CORRETA PARA PROFESSORES */}
      <Route path="/professores" element={<ProfessoresPage />} />
    </Routes>
  );
}

export default AppRoutes;