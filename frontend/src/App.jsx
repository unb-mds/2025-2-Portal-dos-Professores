// src/App.jsx

import React from 'react';
// Importa o componente que define as rotas
import AppRoutes from './routes/AppRoutes.jsx'; // <--- ADICIONEI .jsx AQUI

// Componentes de Layout do Chakra
import { Box, useColorModeValue } from '@chakra-ui/react';

// Importe seus componentes de Header e Footer
// TODO: Ajuste o caminho se eles estiverem em outro lugar
import Header from './components/Header.jsx'; // <--- ADICIONEI .jsx AQUI
import Footer from './components/Footer.jsx'; // <--- ADICIONEI .jsx AQUI

function App() {
  // Pega a cor de fundo cinza clara (como no design que você gostou)
  const mainBg = useColorModeValue('gray.50', 'gray.800');

  return (
    // Este Box garante que o footer fique no fim da página
    <Box display="flex" flexDirection="column" minHeight="100vh">
      
      {/* 1. O seu Header (que já estava funcionando) */}
      <Header />

      {/* 2. O "recheio" da página */}
      <Box as="main" flex="1" bg={mainBg}>
        {/* É AQUI QUE AS ROTAS SÃO RENDERIZADAS */}
        <AppRoutes />
      </Box>

      {/* 3. O seu Footer (que já estava funcionando) */}
      <Footer />
      
    </Box>
  );
}

export default App;