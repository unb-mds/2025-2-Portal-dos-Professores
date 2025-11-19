import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Criação do Contexto (o 'Armazém')
const ProfessorContext = createContext();

// URL da API (usada APENAS aqui, no ponto de coleta)
const API_URL = "https://api-portal-dos-professores.onrender.com/professors";

// 2. O Provedor (Componente que fará a busca e fornecerá os dados)
export const ProfessorProvider = ({ children }) => {
  const [professorsList, setProfessorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProfessors = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Erro ${response.status}.`);
        }
        const data = await response.json();
        setProfessorsList(data); // Guarda a lista de 349 professores
      } catch (err) {
        setError(err.message || "Falha ao buscar a lista de professores.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProfessors();
  }, []); // O array vazio [] garante que a chamada rode APENAS uma vez

  // 3. O valor que será compartilhado com todos os componentes
  const contextValue = {
    professorsList,
    isLoading,
    error,
  };

  return (
    <ProfessorContext.Provider value={contextValue}>
      {children}
    </ProfessorContext.Provider>
  );
};

// 4. Hook customizado para facilitar o uso nos componentes (ex: useProfessorData)
export const useProfessorData = () => {
  const context = useContext(ProfessorContext);
  if (!context) {
    throw new Error('useProfessorData deve ser usado dentro de um ProfessorProvider');
  }
  return context;
};