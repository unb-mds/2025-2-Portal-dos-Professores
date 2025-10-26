// src/pages/HomePage.jsx

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Importando componentes do Chakra UI
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Badge,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  Center,
  Link,
  Wrap,
  WrapItem,
  useColorModeValue,
} from '@chakra-ui/react';

// Importando os ícones que o seu design pedia, da biblioteca 'lucide-react'
// (Seu package.json já tem ela, o 'npm install' já deve ter instalado)
import { ArrowRight, Search, Users, GraduationCap } from 'lucide-react';

// Constante para os departamentos (como no seu exemplo)
const FEATURED_DEPARTMENTS = [
  "Ciência da Computação",
  "Engenharia Elétrica",
  "Matemática",
  "Física",
  "Biologia",
  "Economia",
];

// Componente helper para a seção de Features
function Feature({ icon, title, children }) {
  return (
    <VStack spacing={4} align={{ base: 'center', md: 'start' }} textAlign={{ base: 'center', md: 'left' }}>
      <Center
        bg="blue.500"
        color="white"
        boxSize={12}
        borderRadius="lg"
      >
        <Icon as={icon} boxSize={6} />
      </Center>
      <Heading as="h3" size="md">{title}</Heading>
      <Text color="gray.600">
        {children}
      </Text>
    </VStack>
  );
}

// Componente helper para a seção de Stats
function Stat({ value, label }) {
  return (
    <VStack spacing={1}>
      <Text fontSize="4xl" fontWeight="bold" color="blue.500">
        {value}
      </Text>
      <Text fontSize="md" color="gray.600">
        {label}
      </Text>
    </VStack>
  );
}

export default function HomePage() {
  // Cores para modo claro/escuro
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  const badgeHoverBg = useColorModeValue('blue.500', 'blue.300');
  const badgeHoverColor = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      {/* --- 1. Hero Section --- */}
      <Container maxW="container.lg" py={{ base: 16, md: 24 }}>
        <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
          <Badge
            colorScheme="blue"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="medium"
          >
            <HStack>
              <Icon as={GraduationCap} boxSize={4} />
              <Text>Universidade de Brasília</Text>
            </HStack>
          </Badge>

          <Heading as="h1" fontSize={{ base: '4xl', md: '6xl' }} fontWeight="bold" letterSpacing="tight">
            Portal dos Professores
          </Heading>
          
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600">
            Explore o perfil, pesquisas e disciplinas dos docentes da UnB.
            Encontre o orientador ideal para seu projeto.
          </Text>
          
          <HStack spacing={4} pt={4} direction={{ base: 'column', sm: 'row' }}>
            <Button
              as={RouterLink}
              to="/professores"
              colorScheme="blue"
              size="lg"
              leftIcon={<Icon as={Search} boxSize={5} />}
              rightIcon={<Icon as={ArrowRight} boxSize={5} />}
            >
              Buscar Professores
            </Button>
            <Button
              as={RouterLink}
              to="/sobre"
              variant="outline"
              size="lg"
            >
              Sobre o Projeto
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* --- 2. Stats Section --- */}
      <Box borderTopWidth="1px" borderBottomWidth="1px" bg={sectionBg}>
        <Container maxW="container.lg" py={12}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Stat value="20+" label="Professores Cadastrados" />
            <Stat value="15+" label="Departamentos" />
            <Stat value="100+" label="Publicações Indexadas" />
          </SimpleGrid>
        </Container>
      </Box>

      {/* --- 3. Departments Section --- */}
      <Container maxW="container.lg" py={{ base: 16, md: 24 }}>
        <VStack spacing={8} maxW="4xl" mx="auto">
          <VStack spacing={3} textAlign="center">
            <Heading as="h2" size="xl">Departamentos Populares</Heading>
            <Text fontSize="lg" color="gray.600">
              Navegue por áreas de conhecimento e descubra especialistas
            </Text>
          </VStack>
          
          <Wrap justify="center" spacing={3}>
            {FEATURED_DEPARTMENTS.map((dept) => (
              <WrapItem key={dept}>
                <Badge
                  as={RouterLink}
                  to={`/professores?departamento=${encodeURIComponent(dept)}`}
                  variant="outline"
                  px={4}
                  py={2}
                  fontSize="sm"
                  borderRadius="md"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    bg: badgeHoverBg,
                    color: badgeHoverColor,
                    borderColor: badgeHoverBg,
                  }}
                >
                  {dept}
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        </VStack>
      </Container>
      
      {/* --- 4. Features Section --- */}
      <Box borderTopWidth="1px" bg={sectionBg}>
        <Container maxW="container.lg" py={{ base: 16, md: 24 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Feature icon={Search} title="Busca Avançada">
              Filtre por departamento, área de pesquisa, campus e muito mais
            </Feature>
            <Feature icon={Users} title="Perfis Completos">
              Acesse publicações, disciplinas e informações de contato
            </Feature>
            <Feature icon={GraduationCap} title="Orientação TCC">
              Encontre o orientador ideal para seu trabalho de conclusão
            </Feature>
          </SimpleGrid>
        </Container>
      </Box>

    </Box>
  );
}