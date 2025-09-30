

import { useState, useEffect } from 'react';
import { getProfessorsData } from '../services/api';
import ProfessorCard from '../components/professores/ProfessorCard';

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProfessorsData()
      .then(data => {
        setProfessores(data);
      })
      .catch(error => {
        console.error("Erro ao buscar dados dos professores:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando dados da API...</p>;
  }

  return (
    <div className="professores-container" style={{ padding: '1rem' }}>
      <h1>Nossos Professores</h1>
      <div className="cards-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {professores.map((professor) => (
          <ProfessorCard key={professor.id} professor={professor} />
        ))}
      </div>
    </div>
  );
}