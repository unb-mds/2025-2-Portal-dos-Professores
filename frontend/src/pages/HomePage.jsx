import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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

import { ArrowRight, Search, Users, GraduationCap } from 'lucide-react';
import { getProfessorsData, getDepartmentsData } from '../services/api';

function Feature({ icon, title, children }) {
  return (
    <VStack spacing={5} align={{ base: 'center', md: 'start' }} textAlign={{ base: 'center', md: 'left' }}>
      <Center
        bg="blue.500"
        color="white"
        boxSize={14}
        borderRadius="lg"
      >
        <Icon as={icon} boxSize={7} />
      </Center>
      <Heading as="h3" size={{ base: 'sm', md: 'md' }}>{title}</Heading>
      <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
        {children}
      </Text>
    </VStack>
  );
}

function Stat({ value, label }) {
  return (
    <VStack spacing={3}>
      <Text fontSize={{ base: '4xl', md: '5xl' }} fontWeight="bold" color="blue.500">
        {value}
      </Text>
      <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
        {label}
      </Text>
    </VStack>
  );
}

export default function HomePage() {
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  const badgeHoverBg = useColorModeValue('blue.500', 'blue.300');
  const badgeHoverColor = useColorModeValue('white', 'gray.800');
  
  const [stats, setStats] = useState({
    professores: 0,
    departamentos: 0,
    publicacoes: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const [popularDepartments, setPopularDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [professoresData, departamentosData] = await Promise.all([
          getProfessorsData().catch(() => []),
          getDepartmentsData().catch(() => []),
        ]);

        const totalProfessores = Array.isArray(professoresData) ? professoresData.length : 0;
        const totalDepartamentos = Array.isArray(departamentosData) ? departamentosData.length : 0;

        let totalPublicacoes = 0;
        if (Array.isArray(professoresData)) {
          totalPublicacoes = professoresData.reduce((total, professor) => {
            let count = 0;

            if (Array.isArray(professor.artigos)) count += professor.artigos.length;
            else if (Array.isArray(professor.publicacoes)) count += professor.publicacoes.length;
            else if (professor.dados_lattes?.producao_bibliografica)
              count += professor.dados_lattes.producao_bibliografica.length;
            else if (professor.dados_scholar?.publicacoes_scholar)
              count += professor.dados_scholar.publicacoes_scholar.length;

            return total + count;
          }, 0);
        }

        setStats({
          professores: totalProfessores,
          departamentos: totalDepartamentos,
          publicacoes: totalPublicacoes,
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchPopulars = async () => {
      try {
        const professores = await getProfessorsData().catch(() => []);

        if (!Array.isArray(professores)) return;

        const departmentCount = {};

        professores.forEach((prof) => {
          const dept = prof.departamento;
          if (dept) departmentCount[dept] = (departmentCount[dept] || 0) + 1;
        });

        const top = Object.entries(departmentCount)
          .map(([nome, quantidade]) => ({ nome, quantidade }))
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, 6);

        setPopularDepartments(top);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchPopulars();
  }, []);

  return (
    <Box>
      {/* HERO */}
      <Container maxW="8xl" py={{ base: 24, md: 40 }} px={{ base: 8, md: 16 }}>
        <VStack spacing={10} textAlign="center" maxW="5xl" mx="auto">

          <Badge colorScheme="blue" px={4} py={2} borderRadius="full" fontSize="sm">
            <HStack>
              <Icon as={GraduationCap} boxSize={4} />
              <Text>Universidade de Brasília</Text>
            </HStack>
          </Badge>

          <Heading fontSize={{ base: '5xl', md: '6xl', lg: '7xl' }}>Portal dos Professores</Heading>
          
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="4xl">
            Explore o perfil, pesquisas e disciplinas dos docentes da UnB.
            Encontre o orientador ideal para seu projeto.
          </Text>

          <VStack spacing={6} pt={8} w={{ base: '100%', sm: 'auto' }}>
            <Button
              as={RouterLink}
              to="/professores"
              colorScheme="blue"
              size="lg"
              leftIcon={<Icon as={Search} boxSize={5} />}
              rightIcon={<Icon as={ArrowRight} boxSize={5} />}
              w={{ base: '100%', sm: 'auto' }}
            >
              Buscar Professores
            </Button>

            <Button
              as={RouterLink}
              to="/sobre"
              variant="outline"
              size="lg"
              w={{ base: '100%', sm: 'auto' }}
            >
              Sobre o Projeto
            </Button>
          </VStack>
        </VStack>
      </Container>

      {/* STATS */}
      <Box borderTopWidth="1px" borderBottomWidth="1px" bg={sectionBg}>
        <Container maxW="8xl" py={{ base: 20, md: 28 }} px={{ base: 8, md: 16 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={16}>
            <Stat value={isLoadingStats ? "..." : stats.professores} label="Professores Cadastrados" />
            <Stat value={isLoadingStats ? "..." : stats.departamentos} label="Departamentos" />
            <Stat value={isLoadingStats ? "..." : stats.publicacoes} label="Publicações Indexadas" />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Orientador Ideal */}
<Container maxW="7xl" mt={20} px={{ base: 6, md: 16 }}>
  <Box
    bg="linear-gradient(90deg, #F0F4FF 0%, #ECECFF 100%)"
    borderRadius="2xl"
    p={{ base: 6, md: 10 }}
    boxShadow="0 8px 28px rgba(0, 0, 0, 0.08)"
    border="1px solid #E3E8F7"
  >
    <HStack
      spacing={{ base: 4, md: 8 }}
      align="center"
      flexDir={{ base: "column", md: "row" }}
    >
      <Center
        bg="linear-gradient(135deg, #4C6FFF 0%, #335CFF 100%)"
        color="white"
        boxSize={14}
        borderRadius="full"
        flexShrink={0}
      >
        <Icon as={Search} boxSize={7} />
      </Center>

      <VStack align="start" spacing={1} flex="1" textAlign={{ base: "center", md: "left" }}>
        <Heading size="md" fontWeight="600" color="gray.800">
          Encontre seu Orientador Ideal
        </Heading>
        <Text color="gray.600" fontSize="md">
          Nossa IA analisa seu perfil e recomenda os melhores professores para te orientar.
        </Text>
      </VStack>
      <Button
        as={RouterLink}
        to="/orientador"
        colorScheme="blue"
        rightIcon={<ArrowRight />}
        size="lg"
        px={8}
        borderRadius="xl"
      >
        Começar Agora
      </Button>
    </HStack>
  </Box>
</Container>


      {/* DEPARTAMENTOS */}
      <Container maxW="8xl" py={{ base: 24, md: 40 }} px={{ base: 8, md: 16 }}>
        <VStack spacing={12} maxW="6xl" mx="auto">
          <VStack spacing={4} textAlign="center">
            <Heading size={{ base: 'lg', md: 'xl' }}>Departamentos Populares</Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">
              Navegue por áreas de conhecimento e descubra especialistas
            </Text>
          </VStack>

          {isLoadingDepartments ? (
            <Center py={8}>
              <Text color="gray.500">Carregando departamentos...</Text>
            </Center>
          ) : (
            <Wrap justify="center" spacing={4}>
              {popularDepartments.map((dept) => {
                const nomeFormatado = dept.nome
                  .replace(/DEPARTAMENTO/gi, 'FACULDADE')
                  .replace(/DEPTO/gi, 'FACULDADE');

                return (
                  <WrapItem key={dept.nome}>
                    <Badge
                      as={RouterLink}
                      to={`/professores?departamento=${encodeURIComponent(dept.nome)}`}
                      variant="outline"
                      px={5}
                      py={3}
                      fontSize={{ base: 'sm', md: 'md' }}
                      fontWeight="semibold"
                      borderRadius="lg"
                      cursor="pointer"
                      borderWidth="2px"
                      _hover={{
                        bg: badgeHoverBg,
                        color: badgeHoverColor,
                        borderColor: badgeHoverBg,
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                      }}
                    >
                      <HStack spacing={2}>
                        <Text>{nomeFormatado}</Text>
                        <Text
                          fontSize="xs"
                          bg="blue.50"
                          color="blue.600"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          fontWeight="bold"
                        >
                          {dept.quantidade}
                        </Text>
                      </HStack>
                    </Badge>
                  </WrapItem>
                );
              })}
            </Wrap>
          )}
        </VStack>
      </Container>

      {/* FEATURES */}
      <Box borderTopWidth="1px" bg={sectionBg}>
        <Container maxW="8xl" py={{ base: 24, md: 40 }} px={{ base: 8, md: 16 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={16}>
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

      {/* BOTÃO FLUTUANTE */}
      <Box
        position="fixed"
        bottom={{ base: 6, md: 10 }}
        right={{ base: 6, md: 10 }}
        zIndex={1000}
      >
        <Button
          as={RouterLink}
          to="/orientador"
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          p={6}
          rightIcon={<ArrowRight />}
          boxShadow="lg"
        >
          Orientador Ideal
        </Button>
      </Box>

    </Box>
  );
}
