// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ProfessorProvider } from './context/ProfessorContext.jsx';

const theme = extendTheme({});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter
    basename="/2025-2-Portal-dos-Professores"
  >
    <ChakraProvider theme={theme}>
      <ProfessorProvider>
        <App />
      </ProfessorProvider>
    </ChakraProvider>
  </BrowserRouter>
);
