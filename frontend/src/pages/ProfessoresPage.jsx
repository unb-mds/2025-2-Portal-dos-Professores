import { useState, useEffect, useMemo } from 'react';
import {
  SimpleGrid, Box, Text, Center, Container,
  Heading, VStack, HStack, Icon, Input, InputGroup, InputLeftElement,
  Button, IconButton, useColorModeValue, Wrap, WrapItem, Tag, TagLabel, TagCloseButton
} from '@chakra-ui/react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';

import ProfessorCard from '../components/professores/ProfessorCard';
import { getDepartmentsData, getProfessorsData } from '../services/api';

function extractSiape(url) {
  if (!url) return Math.random().toString();
  const match = url.match(/siape=(\d+)/);
  return match ? match[1] : url;
}

const normalizeString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') 
    .replace(/\b\w/g, l => l.toUpperCase()); 
};

const getAreas = (professor) => {
  if (!professor) return [];

  const candidates = [
    professor.dados_scholar?.areas_interesse, 
    professor.areas_interesse,
    professor.areas_de_interesse,
    professor.areasPesquisa,
    professor.areas_pesquisa,
    professor.area_atuacao,
    professor.keywords,
    professor.dados_lattes?.areas_de_atuacao,
    professor.dados_lattes?.areas_interesse,
    professor.dados_lattes?.areas
  ];

  const found = candidates.find(val => val !== undefined && val !== null);

  if (!found) return [];
  if (Array.isArray(found)) return found;
  
  if (typeof found === 'string') {
    let clean = found.replace(/[\[\]"']/g, ''); 
    return clean.split(/[;,]+/).map(a => a.trim()).filter(a => a.length > 0);
  }
  
  return [];
};

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [query, setQuery] = useState(''); 
  const [debouncedQuery, setDebouncedQuery] = useState(''); 
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]); 
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [showAllAreas, setShowAllAreas] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12; 

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const headerBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const titleColor = useColorModeValue("blue.800", "blue.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    setIsLoading(true);
    getProfessorsData({}) 
      .then(data => {
        const dataWithId = data.map(prof => ({
          ...prof,
          id: extractSiape(prof.pagina_sigaa_url) 
        }));
        setProfessores(dataWithId);
      })
      .catch(error => {
        console.error("Falha ao buscar professores:", error);
        setProfessores([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { departments, allAreas } = useMemo(() => {
    const depsSet = new Set();
    const areasSet = new Set();

    professores.forEach(prof => {
      if (prof.departamento) depsSet.add(prof.departamento);
      
      const profAreas = getAreas(prof);
      profAreas.forEach(a => {
        const cleanArea = normalizeString(a);
        if (cleanArea.length > 2) { 
            areasSet.add(cleanArea);
        }
      });
    });

    return {
      departments: Array.from(depsSet).sort(),
      allAreas: Array.from(areasSet).sort((a, b) => a.localeCompare(b))
    };
  }, [professores]);

  const filteredAndSortedProfessors = useMemo(() => {
    let result = [...professores];

    if (debouncedQuery) {
      const term = debouncedQuery.toLowerCase();
      result = result.filter(p => 
        (p.nome && p.nome.toLowerCase().includes(term)) ||
        (p.departamento && p.departamento.toLowerCase().includes(term)) ||
        getAreas(p).some(area => area.toLowerCase().includes(term))
      );
    }

    if (selectedDepartamento) {
      result = result.filter(p => p.departamento === selectedDepartamento);
    }

    if (selectedAreas.length > 0) {
      result = result.filter(p => {
        const pAreas = getAreas(p);
        return selectedAreas.some(selected => 
            pAreas.some(profArea => normalizeString(profArea) === selected)
        );
      });
    }

    result.sort((a, b) => {
      const nomeA = (a.nome || "").toString();
      const nomeB = (b.nome || "").toString();
      return sortOrder === 'asc' 
        ? nomeA.localeCompare(nomeB) 
        : nomeB.localeCompare(nomeA);
    });

    return result;
  }, [professores, debouncedQuery, selectedDepartamento, selectedAreas, sortOrder]);

  const totalProfessores = filteredAndSortedProfessors.length;
  const totalPages = Math.ceil(totalProfessores / ITEMS_PER_PAGE) || 1;
  const currentProfessors = filteredAndSortedProfessors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const toggleArea = (area) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedDepartamento('');
    setSelectedAreas([]);
    setCurrentPage(1);
  };

  const hasActiveFilters = query || selectedDepartamento || selectedAreas.length > 0;
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  const VISIBLE_TAGS = 40;
  const displayedAreas = (showAllAreas || selectedAreas.length > 0) 
    ? allAreas 
    : allAreas.slice(0, VISIBLE_TAGS);

  return (
    <Box bg={pageBg} minH="calc(100vh - 60px)">
      <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} py={8} px={4} boxShadow="sm">
        <Container maxW="container.xl"> 
          <VStack spacing={6} align="stretch">
            <VStack align="start" spacing={1} mb={2}>
              <Heading as="h1" size="xl" color={titleColor} letterSpacing="tight">Professores da UnB</Heading>
              <Text fontSize="lg" color={mutedColor}>Explore {professores.length > 0 ? professores.length : '...'} perfis de docentes</Text>
            </VStack>

            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none"><Icon as={Search} color="gray.400" /></InputLeftElement>
              <Input type="text" placeholder="Buscar por nome, departamento ou área de pesquisa..." value={query} onChange={(e) => setQuery(e.target.value)} bg={useColorModeValue("white", "gray.700")} borderColor={useColorModeValue("gray.300", "gray.600")} _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }} />
            </InputGroup>

            <HStack spacing={3} wrap="wrap" align="start">
              <InputGroup size="md" maxW={{ base: "full", md: "300px" }}>
                 <InputLeftElement pointerEvents="none"><Icon as={Filter} color="gray.500" boxSize={4} /></InputLeftElement>
                 <Input as="select" value={selectedDepartamento} onChange={(e) => setSelectedDepartamento(e.target.value)} bg={useColorModeValue("white", "gray.700")} borderColor={useColorModeValue("gray.300", "gray.600")} borderRadius="md" pl={10} cursor="pointer">
                    <option value="">Todos os departamentos</option>
                    {departments.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                  </Input>
              </InputGroup>
              <Button onClick={toggleSortOrder} leftIcon={<Icon as={ArrowUpDown} boxSize={4} />} variant="outline" bg={useColorModeValue("white", "gray.700")} color={mutedColor} fontWeight="normal" minW="140px">Nome {sortOrder === 'asc' ? '(A-Z)' : '(Z-A)'}</Button>
              {hasActiveFilters && (<Button variant="ghost" colorScheme="red" onClick={clearFilters} leftIcon={<Icon as={X} boxSize={4} />}>Limpar filtros</Button>)}
            </HStack>

            {allAreas.length > 0 && (
              <Box pt={4} borderTop="1px dashed" borderColor="gray.200" mt={2}>
                <HStack justify="space-between" mb={3}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                      Filtrar por Áreas de Interesse ({allAreas.length}):
                    </Text>
                    
                    {allAreas.length > VISIBLE_TAGS && selectedAreas.length === 0 && (
                        <Button 
                            size="xs" 
                            variant="ghost" 
                            color="blue.500" 
                            rightIcon={showAllAreas ? <Icon as={ChevronUp} /> : <Icon as={ChevronDown} />}
                            onClick={() => setShowAllAreas(!showAllAreas)}
                        >
                            {showAllAreas ? "Ver menos" : `Ver todas (+${allAreas.length - VISIBLE_TAGS})`}
                        </Button>
                    )}
                </HStack>
                
                <Wrap spacing={2}>
                    {displayedAreas.map((area) => {
                        const isSelected = selectedAreas.includes(area);
                        return (
                        <WrapItem key={area}>
                            <Tag
                            size="md"
                            borderRadius="full"
                            variant={isSelected ? "solid" : "outline"}
                            colorScheme={isSelected ? "blue" : "gray"}
                            cursor="pointer"
                            onClick={() => toggleArea(area)}
                            _hover={{ bg: isSelected ? "blue.600" : "gray.100" }}
                            transition="all 0.2s"
                            >
                            <TagLabel>{area}</TagLabel>
                            {isSelected && <TagCloseButton onClick={(e) => { e.stopPropagation(); toggleArea(area); }} />}
                            </Tag>
                        </WrapItem>
                        );
                    })}
                    {!showAllAreas && allAreas.length > VISIBLE_TAGS && selectedAreas.length === 0 && (
                        <WrapItem>
                            <Tag size="md" borderRadius="full" variant="ghost" color="blue.500" cursor="pointer" onClick={() => setShowAllAreas(true)}>
                                ...
                            </Tag>
                        </WrapItem>
                    )}
                </Wrap>
              </Box>
            )}

          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <HStack justify="space-between" mb={6}>
             <Text fontSize="md" fontWeight="medium" color={mutedColor}>{isLoading ? <Text>Carregando...</Text> : `Mostrando ${currentProfessors.length} de ${totalProfessores} resultados`}</Text>
            {totalPages > 1 && (<Text fontSize="sm" color={mutedColor}>Página {currentPage} de {totalPages}</Text>)}
        </HStack>

        {isLoading ? (
          <Center py={20}><Text fontSize="lg">Carregando perfis...</Text></Center>
        ) : currentProfessors.length > 0 ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 3 }} spacing={6} pb={10}>
              {currentProfessors.map((professor) => (<ProfessorCard key={professor.id} professor={professor} />))}
            </SimpleGrid>
            {totalPages > 1 && (
                <HStack justify="center" spacing={4} py={8}>
                    <IconButton icon={<ChevronLeft />} onClick={handlePrevPage} isDisabled={currentPage === 1} aria-label="Anterior" variant="outline" />
                    <HStack spacing={2} display={{ base: 'none', md: 'flex' }}><Text fontSize="sm" color="gray.500">Página {currentPage} de {totalPages}</Text></HStack>
                    <IconButton icon={<ChevronRight />} onClick={handleNextPage} isDisabled={currentPage === totalPages} aria-label="Próxima" variant="outline" />
                </HStack>
            )}
          </>
        ) : (
          <Center py={20} flexDirection="column" bg={headerBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
             <Icon as={Search} boxSize={10} color="gray.300" mb={4} />
            <Text color={mutedColor} fontSize="lg">Nenhum professor encontrado com os filtros selecionados.</Text>
            <Button mt={4} variant="outline" onClick={clearFilters}>Limpar filtros</Button>
          </Center>
        )}
      </Container>
    </Box>
  );
}