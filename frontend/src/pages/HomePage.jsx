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

// Lista removida - agora vamos buscar do backend

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
  
  // Estados para as estatísticas
  const [stats, setStats] = useState({
    professores: 0,
    departamentos: 0,
    publicacoes: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  // Estados para faculdades populares
  const [popularDepartments, setPopularDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  // Buscar estatísticas da API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('🔄 Buscando estatísticas da API...');
        
        // Buscar professores e faculdades em paralelo
        const [professoresData, departamentosData] = await Promise.all([
          getProfessorsData().catch((err) => {
            console.error('❌ Erro ao buscar professores:', err);
            return [];
          }),
          getDepartmentsData().catch((err) => {
            console.error('❌ Erro ao buscar faculdades:', err);
            return [];
          }),
        ]);

        console.log('📊 Dados recebidos:', {
          professoresCount: Array.isArray(professoresData) ? professoresData.length : 'não é array',
          departamentosCount: Array.isArray(departamentosData) ? departamentosData.length : 'não é array',
          professoresDataSample: Array.isArray(professoresData) && professoresData.length > 0 ? professoresData[0] : null,
        });

        // Contar professores
        const totalProfessores = Array.isArray(professoresData) ? professoresData.length : 0;

        // Contar faculdades
        const totalDepartamentos = Array.isArray(departamentosData) ? departamentosData.length : 0;

        // Contar publicações: verificar diferentes estruturas possíveis
        let totalPublicacoes = 0;
        if (Array.isArray(professoresData)) {
          totalPublicacoes = professoresData.reduce((total, professor) => {
            let count = 0;
            
            // Verifica diferentes possíveis estruturas de dados
            // 1. professor.artigos (array direto)
            if (Array.isArray(professor.artigos)) {
              count += professor.artigos.length;
            }
            // 2. professor.publicacoes (array direto)
            else if (Array.isArray(professor.publicacoes)) {
              count += professor.publicacoes.length;
            }
            // 3. professor.dados_lattes.producao_bibliografica
            else if (professor.dados_lattes && Array.isArray(professor.dados_lattes.producao_bibliografica)) {
              count += professor.dados_lattes.producao_bibliografica.length;
            }
            // 4. professor.dados_scholar.publicacoes_scholar
            else if (professor.dados_scholar && Array.isArray(professor.dados_scholar.publicacoes_scholar)) {
              count += professor.dados_scholar.publicacoes_scholar.length;
            }
            // 5. Verificar se dados_lattes é um objeto com outras chaves que possam conter publicações
            else if (professor.dados_lattes && typeof professor.dados_lattes === 'object') {
              // Tenta encontrar qualquer array que possa ser publicações
              const lattesKeys = Object.keys(professor.dados_lattes);
              for (const key of lattesKeys) {
                if (key.toLowerCase().includes('public') || key.toLowerCase().includes('artigo') || key.toLowerCase().includes('producao')) {
                  if (Array.isArray(professor.dados_lattes[key])) {
                    count += professor.dados_lattes[key].length;
                    break; // Usa o primeiro array encontrado
                  }
                }
              }
            }
            
            return total + count;
          }, 0);
        }

        console.log('✅ Estatísticas calculadas:', {
          professores: totalProfessores,
          departamentos: totalDepartamentos,
          publicacoes: totalPublicacoes,
        });

        setStats({
          professores: totalProfessores,
          departamentos: totalDepartamentos,
          publicacoes: totalPublicacoes,
        });
      } catch (error) {
        console.error('❌ Erro ao buscar estatísticas:', error);
        // Mantém valores padrão em caso de erro
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Buscar faculdades populares (com mais professores)
  useEffect(() => {
    const fetchPopularDepartments = async () => {
      try {
        console.log('🔄 Buscando faculdades populares...');
        
        const professoresData = await getProfessorsData().catch(() => []);
        
        if (!Array.isArray(professoresData) || professoresData.length === 0) {
          setPopularDepartments([]);
          setIsLoadingDepartments(false);
          return;
        }

        // Contar professores por faculdade
        const departmentCount = {};
        professoresData.forEach((professor) => {
          const dept = professor.departamento;
          if (dept && typeof dept === 'string' && dept.trim() !== '') {
            departmentCount[dept] = (departmentCount[dept] || 0) + 1;
          }
        });

        // Converter para array e ordenar por quantidade (mais popular primeiro)
        const departmentsArray = Object.entries(departmentCount)
          .map(([nome, quantidade]) => ({ nome, quantidade }))
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, 6); // Pega os top 6 faculdades

        console.log('✅ Faculdades populares encontradas:', departmentsArray);
        setPopularDepartments(departmentsArray);
      } catch (error) {
        console.error('❌ Erro ao buscar faculdades populares:', error);
        setPopularDepartments([]);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchPopularDepartments();
  }, []);

  return (
    <Box>
      {/* --- 1. Hero Section --- */}
      <Container maxW="8xl" py={{ base: 24, md: 40 }} px={{ base: 8, md: 16 }}>
        <VStack spacing={10} textAlign="center" maxW="5xl" mx="auto">
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

          <Heading as="h1" fontSize={{ base: '5xl', md: '6xl', lg: '7xl' }} fontWeight="bold" letterSpacing="tight">
            Portal dos Professores
          </Heading>
          
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="4xl" lineHeight="tall">
            Explore o perfil, pesquisas e disciplinas dos docentes da UnB.
            Encontre o orientador ideal para seu projeto.
          </Text>
          
         {/* --- Botões principais da Hero Section --- */}
            <VStack spacing={6} pt={8} w={{ base: '100%', sm: 'auto' }}>

              {/* Buscar Professores */}
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

              {/* 🔥 NOVO BOTÃO — Orientador Inteligente */}
              <Button
                as={RouterLink}
                to="/orientador"
                colorScheme="teal"
                size="lg"
                leftIcon={<Icon as={GraduationCap} boxSize={5} />}
                rightIcon={<Icon as={ArrowRight} boxSize={5} />}
                w={{ base: '100%', sm: 'auto' }}
              >
                Orientador Inteligente
              </Button>

              {/* Sobre o Projeto */}
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

          {/* FIM DA CORREÇÃO */}
        </VStack>
      </Container>

      {/* --- 2. Stats Section --- */}
      <Box borderTopWidth="1px" borderBottomWidth="1px" bg={sectionBg}>
        <Container maxW="8xl" py={{ base: 20, md: 28 }} px={{ base: 8, md: 16 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 10, md: 16 }}>
            <Stat 
              value={isLoadingStats ? "..." : `${stats.professores}`} 
              label="Professores Cadastrados" 
            />
            <Stat 
              value={isLoadingStats ? "..." : `${stats.departamentos}`} 
              label="Departamentos" 
            />
            <Stat 
              value={isLoadingStats ? "..." : `${stats.publicacoes}`} 
              label="Publicações Indexadas" 
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* --- 3. Departments Section --- */}
      <Container maxW="8xl" py={{ base: 24, md: 40 }} px={{ base: 8, md: 16 }}>
        <VStack spacing={12} maxW="6xl" mx="auto">
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size={{ base: 'lg', md: 'xl' }}>Departamentos Populares</Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">
              Navegue por áreas de conhecimento e descubra especialistas
            </Text>
          </VStack>
          
          {isLoadingDepartments ? (
            <Center py={8}>
              <Text color="gray.500">Carregando departamentos...</Text>
            </Center>
          ) : popularDepartments.length > 0 ? (
            <Wrap justify="center" spacing={4}>
              {popularDepartments.map((dept) => {
                // Substituir "DEPARTAMENTO" e "DEPTO" por "FACULDADE" no nome
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
                      transition="all 0.3s"
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
          ) : (
            <Center py={8}>
              <Text color="gray.500">Nenhum departamento encontrado.</Text>
            </Center>
          )}
        </VStack>
      </Container>
      
      {/* --- 4. Features Section --- */}
      <Box borderTopWidth="1px" bg={sectionBg}>
        <Container maxW="8xl" py={{ base: 24, md: 40 }} px={{ base: 8, md: 16 }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 12, md: 16 }}>
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