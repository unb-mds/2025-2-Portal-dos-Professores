// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Importe o BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// Importações do Chakra
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({});

ReactDOM.createRoot(document.getElementById('root')).render(
  // 2. Envolva todo o seu aplicativo com o BrowserRouter
  //    (Fora do ChakraProvider)
  <BrowserRouter
    // Esta prop "basename" é MUITO IMPORTANTE por causa da sua URL
    basename="/2025-2-Portal-dos-Professores"
  >
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </BrowserRouter>
  // (Nós removemos o React.StrictMode antes, mantenha assim por enquanto)
);