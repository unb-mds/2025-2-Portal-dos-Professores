// src/components/ProfessorList.jsx

import React from 'react';
// 'SimpleGrid' cria um grid responsivo automaticamente
import { SimpleGrid, Box } from '@chakra-ui/react';
import ProfessorCard from './ProfessorCard'; // O card para cada professor

// Recebe a lista de professores (já filtrada) como propriedade
function ProfessorList({ professores }) {
  
  if (!professores || professores.length === 0) {
    return <Box>Nenhum professor para exibir.</Box>;
  }

  return (
    // 'minChildWidth' diz: tente encaixar o máximo de colunas que 
    // tenham no mínimo 280px de largura. Isso cuida da responsividade.
    <SimpleGrid minChildWidth="280px" spacing={6} mt={6}>
      {professores.map(professor => (
        // Lembre-se de mudar 'id_lattes' para a chave (key) 
        // única que você tem no seu 'professores.json'
        <ProfessorCard 
          key={professor.id_lattes} 
          professor={professor} 
        />
      ))}
    </SimpleGrid>
  );
}

export default ProfessorList;