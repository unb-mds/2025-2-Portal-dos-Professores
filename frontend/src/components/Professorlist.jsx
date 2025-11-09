// Arquivo: frontend/src/components/Professorlist.jsx

import { SimpleGrid, Box, Text, Center, Container } from '@chakra-ui/react';
// Importa o card que você acabou de criar
import ProfessorCard from "./professores/ProfessorCard"
// Importa a lista de dados falsos
import { professorListMock } from '../data/professorMock';

function Professorlist() {
  // Usa a lista mockada. Depois, aqui entrará a lista real vinda da API.
  const professores = professorListMock;

  return (
    <Container maxW="container.xl" py={8}>
      {/* Título da Seção */}
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
           Professores da UnB
        </Text>
        <Text color="gray.500">
          {professores.length} perfis encontrados
        </Text>
      </Box>

      {/* Grid de Cards */}
      {professores.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {professores.map((prof) => (
            <ProfessorCard key={prof.id} professor={prof} />
          ))}
        </SimpleGrid>
      ) : (
        // Mensagem caso a lista esteja vazia
        <Center py={10}>
          <Text color="gray.500" fontSize="lg">
            Nenhum professor encontrado.
          </Text>
        </Center>
      )}
    </Container>
  );
}

export default Professorlist;