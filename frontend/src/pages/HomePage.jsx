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
  useColorModeValue,
} from '@chakra-ui/react';

import { ArrowRight, Search, Users, GraduationCap } from 'lucide-react';
import { getProfessorsData, getDepartmentsData } from '../services/api';

function Feature({ icon, title, children }) {
  return (
    <VStack spacing={5} align={{ base: 'center', md: 'start' }} textAlign={{ base: 'center', md: 'left' }}>
      <Center bg="blue.500" color="white" boxSize={14} borderRadius="lg">
        <Icon as={icon} boxSize={7} />
      </Center>
      <Heading as="h3" size={{ base: 'xl', md: '2xl' }} color="blue.700" fontWeight="bold" letterSpacing="tight">{title}</Heading>
      <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
        {children}
      </Text>
    </VStack>
  );
}

function Stat({ value, label }) {
  return (
    <VStack spacing={3}>
      <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color="blue.600">
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

  /* CARREGA ESTATÍSTICAS */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [professoresData, departamentosData] = await Promise.all([
          getProfessorsData().catch(() => []),
          getDepartmentsData().catch(() => []),
        ]);

        // Log detalhado para debug
        if (Array.isArray(professoresData) && professoresData.length > 0) {
          const sample = professoresData[0];
          console.log('📊 Dados recebidos:', {
            professoresCount: professoresData.length,
            departamentosCount: Array.isArray(departamentosData) ? departamentosData.length : 'não é array',
            sampleProfessor: {
              nome: sample.nome,
              temDadosLattes: !!sample.dados_lattes,
              temDadosScholar: !!sample.dados_scholar,
              lattesKeys: sample.dados_lattes ? Object.keys(sample.dados_lattes) : [],
              scholarKeys: sample.dados_scholar ? Object.keys(sample.dados_scholar) : [],
            }
          });
          
          // Log de exemplo de publicações do primeiro professor
          if (sample.dados_scholar?.publicacoes) {
            console.log('📚 Exemplo de publicações Scholar:', sample.dados_scholar.publicacoes.length);
          }
          if (sample.dados_lattes?.producao_bibliografica) {
            console.log('📚 Exemplo de publicações Lattes:', sample.dados_lattes.producao_bibliografica.length);
          }
        }

        // Contar professores
        const totalProfessores = Array.isArray(professoresData) ? professoresData.length : 0;
        const totalDepartamentos = Array.isArray(departamentosData) ? departamentosData.length : 0;

        let totalPublicacoes = 0;
        if (Array.isArray(professoresData)) {
          totalPublicacoes = professoresData.reduce((total, professor) => {
            let count = 0;
            
            // 1. Verificar dados_scholar.publicacoes (estrutura do Scholar)
            if (professor.dados_scholar && typeof professor.dados_scholar === 'object') {
              if (Array.isArray(professor.dados_scholar.publicacoes)) {
                count += professor.dados_scholar.publicacoes.length;
              }
            }
            
            // 2. Verificar dados_lattes - pode ter várias estruturas
            if (professor.dados_lattes && typeof professor.dados_lattes === 'object') {
              // Verificar producao_bibliografica
              if (Array.isArray(professor.dados_lattes.producao_bibliografica)) {
                count += professor.dados_lattes.producao_bibliografica.length;
              }
              // Verificar outras chaves que possam conter publicações
              const lattesKeys = Object.keys(professor.dados_lattes);
              for (const key of lattesKeys) {
                const keyLower = key.toLowerCase();
                // Buscar por chaves que contenham palavras relacionadas a publicações
                if ((keyLower.includes('public') || 
                     keyLower.includes('artigo') || 
                     keyLower.includes('producao') ||
                     keyLower.includes('trabalho') ||
                     keyLower.includes('paper')) && 
                    key !== 'producao_bibliografica') { // Evitar contar duas vezes
                  if (Array.isArray(professor.dados_lattes[key])) {
                    count += professor.dados_lattes[key].length;
                  }
                }
              }
            }
            
            // 3. Verificar arrays diretos no professor
            if (Array.isArray(professor.artigos)) {
              count += professor.artigos.length;
            }
            if (Array.isArray(professor.publicacoes)) {
              count += professor.publicacoes.length;
            }
            
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

  /* CARREGA DEPARTAMENTOS POPULARES */
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
          .slice(0, 5);

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

          <Heading as="h1" size={{ base: '2xl', md: '3xl' }} color="blue.800" fontWeight="bold" letterSpacing="tight">
            Portal dos Professores
          </Heading>

          <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" maxW="4xl" lineHeight="tall">
            Explore o perfil e pesquisas dos docentes da UnB.
            Encontre o orientador ideal para seu projeto.
          </Text>

          {/* Botões da Hero Section */}
          <VStack spacing={6} pt={8} w={{ base: '100%', sm: 'auto' }}>
            
            <Button
              as={RouterLink}
              to="/professores"
              colorScheme="blue"
              size="lg"
              leftIcon={<Icon as={Search} boxSize={5} />}
              rightIcon={<Icon as={ArrowRight} boxSize={5} />}
              w={{ base: '100%', sm: 'auto' }}
              _hover={{
                bg: "blue.700",
                color: "white",
              }}
            >
              Buscar Professores
            </Button>

            <Button
              as={RouterLink}
              to="/orientador"
              colorScheme="teal"
              size="lg"
              leftIcon={<Icon as={GraduationCap} boxSize={5} />}
              rightIcon={<Icon as={ArrowRight} boxSize={5} />}
              w={{ base: '100%', sm: 'auto' }}
              _hover={{
                bg: "teal.700",
                color: "white",
              }}
            >
              Orientador Inteligente
            </Button>

            <Button
              as={RouterLink}
              to="/sobre-nos"
              variant="outline"
              size="lg"
              w={{ base: '100%', sm: 'auto' }}
              _hover={{
                bg: "gray.100",
                color: "gray.800",
              }}
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

      {/* BOX — Orientador Ideal */}
      <Container maxW="7xl" mt={20} px={{ base: 6, md: 16 }}>
        <Box
          bg="linear-gradient(90deg, #F0F4FF 0%, #F0F4FF 100%)"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          boxShadow="0 8px 28px rgba(0, 0, 0, 0.08)"
          border="1px solid #E3E8F7"
          transition="all 0.3s ease"
          cursor="pointer"
          _hover={{
            bg: "#FFFFFF",
            background: "#FFFFFF",
          }}
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

            <VStack align={{ base: "center", md: "start" }} spacing={1} flex="1" textAlign={{ base: "center", md: "left" }}>
              <Heading size="md" fontWeight="600" color="gray.800" textAlign={{ base: "center", md: "left" }}>
                Encontre seu Orientador Ideal
              </Heading>
              <Text color="gray.600" fontSize="md" textAlign={{ base: "center", md: "left" }}>
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
              _hover={{
                bg: "blue.700",
                color: "white",
              }}
            >
              Começar Agora
            </Button>
          </HStack>
        </Box>
      </Container>

      {/* DEPARTAMENTOS */}
      <Container maxW="8xl" py={{ base: 16, md: 40 }} px={{ base: 2, md: 16 }}>
        <VStack spacing={12} maxW="6xl" mx="auto" w="100%">
          <VStack spacing={4} textAlign="center" px={{ base: 2, md: 0 }} w="100%">
            <Heading as="h2" size={{ base: 'xl', md: '2xl' }} color="blue.700" fontWeight="bold" letterSpacing="tight">Departamentos Populares</Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" px={{ base: 2, md: 0 }}>
              Navegue por áreas de conhecimento e descubra especialistas
            </Text>
          </VStack>

          {isLoadingDepartments ? (
            <Center py={8} w="100%">
              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>Carregando departamentos...</Text>
            </Center>
          ) : popularDepartments.length > 0 ? (
            <VStack spacing={3} w="100%" px={{ base: 2, md: 0 }}>
              {popularDepartments.map((dept) => {
                const nomeFormatado = dept.nome
                  .replace(/DEPARTAMENTO/gi, 'FACULDADE')
                  .replace(/DEPTO/gi, 'FACULDADE')
                  .replace(/INSTITUTO/gi, 'FACULDADE');

                return (
                  <Badge
                    key={dept.nome}
                    as={RouterLink}
                    to={`/professores?departamento=${encodeURIComponent(dept.nome)}`}
                    variant="outline"
                    px={{ base: 3, md: 5 }}
                    py={{ base: 2.5, md: 3 }}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="semibold"
                    borderRadius="lg"
                    cursor="pointer"
                    transition="all 0.3s"
                    borderWidth="2px"
                    w="100%"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    minH={{ base: '48px', md: 'auto' }}
                    _hover={{
                      bg: badgeHoverBg,
                      color: badgeHoverColor,
                      borderColor: badgeHoverBg,
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                  >
                    <Text 
                      flex="1" 
                      noOfLines={2}
                      textAlign="left"
                      pr={2}
                      wordBreak="break-word"
                    >
                      {nomeFormatado}
                    </Text>
                    <Text 
                      fontSize={{ base: 'xs', md: 'sm' }}
                      bg="blue.50" 
                      color="blue.600" 
                      px={{ base: 2, md: 2.5 }}
                      py={0.5} 
                      borderRadius="full"
                      fontWeight="bold"
                      whiteSpace="nowrap"
                      flexShrink={0}
                      ml={2}
                    >
                      {dept.quantidade}
                    </Text>
                  </Badge>
                );
              })}
            </VStack>
          ) : (
            <Center py={8} w="100%">
              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>Nenhum departamento encontrado.</Text>
            </Center>
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
              Acesse publicações e informações de contato
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
          _hover={{
            bg: "blue.700",
            color: "white",
          }}
        >
          Orientador Inteligente
        </Button>
      </Box>

    </Box>
  );
}
