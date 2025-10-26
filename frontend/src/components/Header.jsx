// src/components/Header.jsx

import React from 'react';
import { Box, Heading, HStack, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

// Este é o Header que você já tinha, agora como um componente
function Header() {
  return (
    <Box as="header" bg="white" boxShadow="sm" px={8} py={4} zIndex={10} position="relative">
      <HStack justifyContent="space-between" alignItems="center" maxW="container.lg" mx="auto">
        <Heading as="h1" size="md">
          <RouterLink to="/">Hub Docente</RouterLink>
        </Heading>
        <HStack as="nav" spacing={6}>
          <Link as={RouterLink} to="/" fontWeight="medium" _hover={{ color: 'blue.500' }}>HOME</Link>
          <Link as={RouterLink} to="/professores" fontWeight="medium" _hover={{ color: 'blue.500' }}>PROFESSORES</Link>
          <Link as={RouterLink} to="/sobre" fontWeight="medium" _hover={{ color: 'blue.500' }}>SOBRE NÓS</Link>
        </HStack>
      </HStack>
    </Box>
  );
}

export default Header;