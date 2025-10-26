// src/components/Footer.jsx

import React from 'react';
import { Box, Text, HStack, VStack, Link, Icon } from '@chakra-ui/react';
import { Linkedin, Twitter, Github } from 'lucide-react'; // Seu package.json tem esses ícones

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
          <Link href="#" isExternal _hover={{ color: 'white' }}>
            <Icon as={Linkedin} boxSize={5} />
          </Link>
          <Link href="#" isExternal _hover={{ color: 'white' }}>
            <Icon as={Twitter} boxSize={5} />
          </Link>
          <Link href="#" isExternal _hover={{ color: 'white' }}>
            <Icon as={Github} boxSize={5} />
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Footer;