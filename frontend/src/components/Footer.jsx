// src/components/Footer.jsx

import React from 'react';
import { Box, Text, HStack, VStack, Link, Icon } from '@chakra-ui/react';
import { Github, BookOpen } from 'lucide-react';

// Este é o Footer que você já tinha, agora como um componente
function Footer() {
  return (
    <Box as="footer" bg="gray.800" color="gray.400" py={8} px={4}>
      <VStack spacing={4}>
        <Text textAlign="center" fontSize="sm">
          Projeto da disciplina de MDS - UnB<br />
          © 2025 Hub Docente UnB
        </Text>
        <HStack spacing={5}>
          <Link 
            href="https://github.com/unb-mds/2025-2-Portal-dos-Professores" 
            isExternal 
            _hover={{ color: 'white' }}
          >
            <Icon as={Github} boxSize={5} />
          </Link>
          <Link 
            href="https://portal-dos-professores.readthedocs.io/pt/latest/" 
            isExternal 
            _hover={{ color: 'white' }}
          >
            <Icon as={BookOpen} boxSize={5} />
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Footer;