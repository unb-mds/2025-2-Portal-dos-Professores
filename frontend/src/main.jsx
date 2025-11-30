// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './App.css';
import { HashRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ProfessorProvider } from './context/ProfessorContext.jsx';
import { ScrollToTop } from './components/ScrollToTop.jsx';

const theme = extendTheme({
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        letterSpacing: 'tight',
      },
      sizes: {
        '4xl': {
          fontSize: { base: '2.5rem', md: '3rem', lg: '3.75rem' },
          lineHeight: { base: '1.2', md: '1.1' },
        },
        '3xl': {
          fontSize: { base: '2rem', md: '2.5rem', lg: '3rem' },
          lineHeight: { base: '1.2', md: '1.1' },
        },
        '2xl': {
          fontSize: { base: '1.75rem', md: '2rem', lg: '2.25rem' },
          lineHeight: { base: '1.3', md: '1.2' },
        },
        xl: {
          fontSize: { base: '1.5rem', md: '1.75rem', lg: '2rem' },
          lineHeight: { base: '1.4', md: '1.3' },
        },
        lg: {
          fontSize: { base: '1.25rem', md: '1.5rem' },
          lineHeight: { base: '1.5', md: '1.4' },
        },
        md: {
          fontSize: { base: '1.125rem', md: '1.25rem' },
          lineHeight: '1.5',
        },
        sm: {
          fontSize: '1rem',
          lineHeight: '1.5',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <ScrollToTop />
    <ChakraProvider theme={theme}>
      <ProfessorProvider>
        <App />
      </ProfessorProvider>
    </ChakraProvider>
  </HashRouter>
);

