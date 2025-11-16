import { useState, useEffect } from 'react';
import {
  SimpleGrid, Box, Text, Center, Container,
  Heading, VStack, HStack, Icon, Input, InputGroup, InputLeftElement,
  Select, Button, IconButton, useColorModeValue
} from '@chakra-ui/react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

import ProfessorCard from '../components/professores/ProfessorCard';
import { professorListMock } from '../data/professorMock';
import { getDepartmentsData, getAreasData } from '../services/api';

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [departments, setDepartments] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 21;

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const headerBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const titleColor = useColorModeValue("blue.800", "blue.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [deptsData] = await Promise.all([
          getDepartmentsData().catch(() => []),
        ]);
        setDepartments(deptsData || []);
      } catch (err) {
        console.warn("Backend offline.");
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setCurrentPage(1);

    setTimeout(() => {
      const multipliedData = Array(20).fill(professorListMock).flatMap((x, i) => 
        x.map(p => ({ ...p, id: `${p.id}-${i}` }))
      );
      
      const filtered = multipliedData.filter(prof => 
        prof.nome.toLowerCase().includes(query.toLowerCase()) &&
        (selectedDepartamento === '' || prof.departamento === selectedDepartamento)
      );

      const sorted = [...filtered].sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.nome.localeCompare(b.nome) 
          : b.nome.localeCompare(a.nome);
      });

      setProfessores(sorted);
      setIsLoading(false);
    }, 600);
  }, [query, selectedDepartamento, sortOrder]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProfessors = professores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(professores.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <Box bg={pageBg} minH="calc(100vh - 60px)">
      <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} py={10} px={4} boxShadow="sm">
        <Container maxW="container.lg">
          <VStack spacing={6} align="stretch">
            <VStack align="start" spacing={1}>
              <Heading as="h1" size="xl" color={titleColor} letterSpacing="tight">
                Professores da UnB
              </Heading>
              <Text fontSize="lg" color={mutedColor}>
                Explore o corpo docente, as suas áreas de pesquisa e contactos.
              </Text>
            </VStack>

            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={Search} color="gray.400" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Pesquisar por nome, área de pesquisa..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                bg={useColorModeValue("white", "gray.700")}
                borderColor={useColorModeValue("gray.300", "gray.600")}
                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                fontSize="md"
              />
            </InputGroup>

            <HStack spacing={4} wrap="wrap">
              <InputGroup size="md" maxW={{ base: "full", md: "300px" }}>
                 <InputLeftElement pointerEvents="none">
                    <Icon as={Filter} color="gray.400" boxSize={4} />
                 </InputLeftElement>
                  <Select
                    placeholder="Todos os departamentos"
                    value={selectedDepartamento}
                    onChange={(e) => setSelectedDepartamento(e.target.value)}
                    bg={useColorModeValue("white", "gray.700")}
                    borderColor={useColorModeValue("gray.300", "gray.600")}
                    borderRadius="md"
                    pl={10} 
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Select>
              </InputGroup>

              <Button
                onClick={toggleSortOrder}
                leftIcon={<Icon as={ArrowUpDown} boxSize={4} />}
                variant="outline"
                size="md"
                bg={useColorModeValue("white", "gray.700")}
                borderColor={useColorModeValue("gray.300", "gray.600")}
                color={mutedColor}
                fontWeight="normal"
              >
                Nome {sortOrder === 'asc' ? '(A-Z)' : '(Z-A)'}
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <HStack justify="space-between" mb={6}>
             <Text fontSize="md" fontWeight="medium" color={mutedColor}>
                Mostrando {currentProfessors.length} de {professores.length} resultados
            </Text>
            {totalPages > 1 && (
                <Text fontSize="sm" color={mutedColor}>
                    Página {currentPage} de {totalPages}
                </Text>
            )}
        </HStack>

        {isLoading ? (
          <Center py={20}>
             <Text>A carregar...</Text>
          </Center>
        ) : professores.length > 0 ? (
          <>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, xl: 3 }}
              spacing={6}
              pb={10}
            >
              {currentProfessors.map((professor) => (
                <ProfessorCard key={professor.id} professor={professor} />
              ))}
            </SimpleGrid>

            {totalPages > 1 && (
                <HStack justify="center" spacing={4} py={8}>
                    <IconButton 
                        icon={<ChevronLeft />} 
                        onClick={handlePrevPage} 
                        isDisabled={currentPage === 1}
                        aria-label="Página anterior"
                        variant="outline"
                    />
                    
                    <HStack spacing={2}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 1)
                            .map((page, index, array) => (
                                <Box key={page} display="inline-block">
                                    {index > 0 && array[index - 1] !== page - 1 && <Text color="gray.400" display="inline" mx={2}>...</Text>}
                                    <Button
                                        onClick={() => {
                                            setCurrentPage(page);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        variant={currentPage === page ? "solid" : "ghost"}
                                        colorScheme={currentPage === page ? "blue" : "gray"}
                                        size="sm"
                                    >
                                        {page}
                                    </Button>
                                </Box>
                            ))
                        }
                    </HStack>

                    <IconButton 
                        icon={<ChevronRight />} 
                        onClick={handleNextPage} 
                        isDisabled={currentPage === totalPages}
                        aria-label="Próxima página"
                        variant="outline"
                    />
                </HStack>
            )}
          </>
        ) : (
          <Center py={20} flexDirection="column" bg={headerBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
             <Icon as={Search} boxSize={10} color="gray.300" mb={4} />
            <Text color={mutedColor} fontSize="lg">
              Nenhum professor encontrado com os filtros selecionados.
            </Text>
          </Center>
        )}
      </Container>
    </Box>
  );
}