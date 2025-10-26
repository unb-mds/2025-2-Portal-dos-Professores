// src/components/ProfessorCard.jsx

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Badge,
  Heading,
  LinkBox,
  LinkOverlay,
  useColorModeValue, // Hook para modo claro/escuro
} from '@chakra-ui/react';

// Recebe o objeto 'professor' individual como propriedade
function ProfessorCard({ professor }) {
  
  // Ajuste os nomes das chaves (ex: 'prof.nome') para bater com o seu JSON!
  const {
    id_lattes, // ou o que for único
    nome,
    departamento,
    foto, // (Exemplo, se você tiver uma foto no JSON)
    areas_interesse 
  } = professor;

  // Imagem padrão caso o professor não tenha foto
  const profileImage = foto || 'https://via.placeholder.com/300x300.png?text=Foto+Professor';
  
  // Cor de fundo do card
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    // LinkBox permite que o card inteiro seja clicável
    <LinkBox
      as="article"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      boxShadow="sm"
      transition="all 0.2s ease-in-out"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-4px)' }}
    >
      <Image src={profileImage} alt={`Foto de ${nome}`} objectFit="cover" h="250px" w="100%" />

      <Box p={5}>
        <Box d="flex" alignItems="baseline" mb={2}>
          {/* Exemplo de Badge - ajuste com dados reais */}
          <Badge borderRadius="full" px="2" colorScheme="blue">
            {departamento || 'UnB'}
          </Badge>
        </Box>
        
        {/* O LinkOverlay faz o Heading ser o link principal */}
        <LinkOverlay
          as={RouterLink}
          // Esta rota '/professor/:id' deve existir no seu AppRoutes.jsx
          to={`/professor/${id_lattes}`}
        >
          <Heading as="h3" size="md" noOfLines={2}>
            {nome}
          </Heading>
        </LinkOverlay>

        {/* Exemplo de como mostrar áreas - ajuste com dados reais */}
        {areas_interesse && (
          <Text mt={2} noOfLines={2} fontSize="sm" color="gray.600">
            {areas_interesse.join(', ')}
          </Text>
        )}
      </Box>
    </LinkBox>
  );
}

export default ProfessorCard;