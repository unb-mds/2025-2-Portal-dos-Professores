import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SimpleGrid, Box, Text, Center, Container,
  Heading, VStack, HStack, Icon, Input, InputGroup, InputLeftElement, InputRightElement,
  Button, IconButton, useColorModeValue, Wrap, WrapItem, Tag, TagLabel, TagCloseButton,
  List, ListItem, Flex
} from '@chakra-ui/react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

import ProfessorCard from '../components/professores/ProfessorCard';
import { getProfessorsData } from '../services/api';

const SUGGESTED_AREAS = [
  "Inteligência Artificial",
  "Engenharia de Software",
  "Ciência de Dados",
  "Segurança da Informação",
  "Redes de Computadores",
  "Educação",
  "Robótica",
  "Sustentabilidade",
  "Gestão de Projetos"
];

function extractSiape(url) {
  if (!url) return Math.random().toString();
  const match = url.match(/siape=(\d+)/);
  return match ? match[1] : url;
}

const removeAccents = (str) => {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

const AREA_MAPPINGS = {
  // QUÍMICA & BIOLOGIA
  "chemistry": "Química", "chemical": "Química", "quimica": "Química",
  "organic chemistry": "Química Orgânica",
  "analytical chemistry": "Química Analítica",
  "biology": "Biologia", "biologia": "Biologia",
  "bioinformatics": "Bioinformática",

  // COMPUTAÇÃO
  "computer science": "Ciência da Computação", "ciencia da computacao": "Ciência da Computação",
  "software engineering": "Engenharia de Software", "engenharia de software": "Engenharia de Software",
  "artificial intelligence": "Inteligência Artificial", "ai": "Inteligência Artificial", "ia": "Inteligência Artificial",
  "machine learning": "Aprendizado de Máquina", "ml": "Aprendizado de Máquina",
  "deep learning": "Aprendizado Profundo",
  "data science": "Ciência de Dados", "ciencia de dados": "Ciência de Dados",
  "computer networks": "Redes de Computadores", "redes de computadores": "Redes de Computadores",
  "information security": "Segurança da Informação", "cybersecurity": "Segurança da Informação",
  "cloud computing": "Computação em Nuvem",
  "human-computer interaction": "Interação Humano-Computador", "hci": "Interação Humano-Computador",
  "database": "Banco de Dados", "databases": "Banco de Dados",
  "image processing": "Processamento de Imagens",
  "algorithms": "Algoritmos",

  // MATEMÁTICA E FÍSICA
  "mathematics": "Matemática", "math": "Matemática",
  "applied mathematics": "Matemática Aplicada",
  "physics": "Física", "fisica": "Física",
  "algebra": "Álgebra",
  "analysis": "Análise",
  "optimization": "Otimização",
  "logic": "Lógica", "logica": "Lógica",
  "statistics": "Estatística",
  "probability": "Probabilidade",

  // ENGENHARIAS E GERAL
  "robotics": "Robótica", "robotica": "Robótica",
  "education": "Educação", "educacao": "Educação",
  "project management": "Gestão de Projetos",
  "sustainability": "Sustentabilidade"
};

const normalizeAndTranslate = (str) => {
  if (!str) return "";
  const cleanRaw = str.replace(/[\[\]"']/g, '').trim();
  if (cleanRaw.length <= 2) return ""; 

  const searchKey = removeAccents(cleanRaw);
  
  if (AREA_MAPPINGS[searchKey]) {
    return AREA_MAPPINGS[searchKey];
  }

  return cleanRaw.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const getAreas = (professor) => {
  if (!professor) return [];
  const candidates = [
    professor.dados_scholar?.areas_interesse, professor.areas_interesse,
    professor.areas_de_interesse, professor.areasPesquisa, professor.areas_pesquisa,
    professor.area_atuacao, professor.keywords, professor.dados_lattes?.areas_de_atuacao,
    professor.dados_lattes?.areas_interesse, professor.dados_lattes?.areas
  ];
  const found = candidates.find(val => val !== undefined && val !== null);
  if (!found) return [];
  if (Array.isArray(found)) return found;
  if (typeof found === 'string') {
    return found.replace(/[\[\]"']/g, '').split(/[;,]+/).map(a => a.trim()).filter(a => a.length > 0);
  }
  return [];
};

export default function ProfessoresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [professores, setProfessores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [query, setQuery] = useState(''); 
  const [debouncedQuery, setDebouncedQuery] = useState(''); 
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]); 
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [areaInput, setAreaInput] = useState('');
  const [isAreaListOpen, setIsAreaListOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12; 

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const headerBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const dropdownBg = useColorModeValue("white", "gray.800");
  const filterBlockBg = useColorModeValue("gray.50", "gray.700");
  const inputBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const departamentoFromUrl = searchParams.get('departamento');
    if (departamentoFromUrl) {
      setSelectedDepartamento(decodeURIComponent(departamentoFromUrl));
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    getProfessorsData({}) 
      .then(data => {
        const dataWithId = data.map(prof => ({ ...prof, id: extractSiape(prof.pagina_sigaa_url) }));
        setProfessores(dataWithId);
      })
      .catch(error => {
        console.error("Erro:", error);
        setProfessores([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedQuery(query); setCurrentPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { departments, allAreas } = useMemo(() => {
    const depsSet = new Set();
    const areasMap = new Map(); 
    professores.forEach(prof => {
      if (prof.departamento) depsSet.add(prof.departamento);
      const profAreas = getAreas(prof);
      profAreas.forEach(rawArea => {
        const niceName = normalizeAndTranslate(rawArea);
        if (niceName) {
            const key = removeAccents(niceName);
            if (!areasMap.has(key)) areasMap.set(key, niceName);
        }
      });
    });
    return {
      departments: Array.from(depsSet).sort(),
      allAreas: Array.from(areasMap.values()).sort((a, b) => a.localeCompare(b))
    };
  }, [professores]);

  const activeSuggestions = useMemo(() => {
    return SUGGESTED_AREAS.filter(s => allAreas.some(area => area === s) && !selectedAreas.includes(s));
  }, [allAreas, selectedAreas]);

  const filteredAreaSuggestions = useMemo(() => {
    if (!areaInput) return [];
    const term = removeAccents(areaInput);
    
    return allAreas.filter(area => { 
        if (selectedAreas.includes(area)) return false;
        const normArea = removeAccents(area); 
        if (normArea.includes(term)) return true;
        const dictionaryMatch = Object.keys(AREA_MAPPINGS).some(mappingKey => {
            const isRelatedToCurrentArea = AREA_MAPPINGS[mappingKey] === area;
            const keyMatchesTerm = mappingKey.includes(term);
            return isRelatedToCurrentArea && keyMatchesTerm;
        });
        
        return dictionaryMatch;
    }).slice(0, 10);
  }, [areaInput, allAreas, selectedAreas]);

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
      const selectedDeptLower = selectedDepartamento.toLowerCase().trim();
      result = result.filter(p => {
        if (!p.departamento) return false;
        const profDeptLower = p.departamento.toLowerCase().trim();
        return profDeptLower === selectedDeptLower || profDeptLower.includes(selectedDeptLower) || selectedDeptLower.includes(profDeptLower);
      });
    }

    if (selectedAreas.length > 0) {
      result = result.filter(p => {
        const pAreas = getAreas(p);
        return selectedAreas.some(selected => 
            pAreas.some(profArea => {
                const translated = normalizeAndTranslate(profArea);
                return translated === selected;
            })
        );
      });
    }

    result.sort((a, b) => {
      const nomeA = (a.nome || "").toString();
      const nomeB = (b.nome || "").toString();
      return sortOrder === 'asc' ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
    });

    return result;
  }, [professores, debouncedQuery, selectedDepartamento, selectedAreas, sortOrder]);

  const totalProfessores = filteredAndSortedProfessors.length;
  const totalPages = Math.ceil(totalProfessores / ITEMS_PER_PAGE) || 1;
  const currentProfessors = filteredAndSortedProfessors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleArea = (area) => {
    setSelectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
    setCurrentPage(1); setAreaInput(''); setIsAreaListOpen(false);
  };

  const clearFilters = () => {
    setQuery(''); setSelectedDepartamento(''); setSelectedAreas([]); setAreaInput(''); setCurrentPage(1); setSearchParams({});
  };

  const handleDepartamentoChange = (dept) => {
    setSelectedDepartamento(dept); setCurrentPage(1);
    setSearchParams(dept ? { departamento: encodeURIComponent(dept) } : {});
  };

  const hasActiveFilters = query || selectedDepartamento || selectedAreas.length > 0;
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return (
    <Box bg={pageBg} minH="calc(100vh - 60px)">
      <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} py={8} px={4} boxShadow="sm">
        <Container maxW="container.xl"> 
          <VStack spacing={6} align="stretch">
            <VStack align="start" spacing={1} mb={2}>
              <Heading as="h1" size={{ base: '2xl', md: '3xl' }} color="blue.800" fontWeight="bold" letterSpacing="tight">Professores da UnB</Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">Explore {professores.length > 0 ? professores.length : '...'} perfis de docentes</Text>
            </VStack>

            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none"><Icon as={Search} color="gray.400" /></InputLeftElement>
              <Input type="text" placeholder="Buscar por nome ou termo geral..." value={query} onChange={(e) => setQuery(e.target.value)} bg={useColorModeValue("white", "gray.700")} borderColor={useColorModeValue("gray.300", "gray.600")} _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }} />
            </InputGroup>

            <HStack spacing={3} wrap="wrap" align="start">
              <InputGroup size="md" maxW={{ base: "full", md: "300px" }}>
                 <InputLeftElement pointerEvents="none"><Icon as={Filter} color="gray.500" boxSize={4} /></InputLeftElement>
                 <Input as="select" value={selectedDepartamento} onChange={(e) => handleDepartamentoChange(e.target.value)} bg={useColorModeValue("white", "gray.700")} borderColor={useColorModeValue("gray.300", "gray.600")} borderRadius="md" pl={10} cursor="pointer">
                    <option value="">Todos os departamentos</option>
                    {departments.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                 </Input>
              </InputGroup>
              <Button onClick={toggleSortOrder} leftIcon={<Icon as={ArrowUpDown} boxSize={4} />} variant="outline" bg={useColorModeValue("white", "gray.700")} color={mutedColor} fontWeight="normal" minW="140px">Nome {sortOrder === 'asc' ? '(A-Z)' : '(Z-A)'}</Button>
              {hasActiveFilters && (<Button variant="ghost" colorScheme="red" onClick={clearFilters} leftIcon={<Icon as={X} boxSize={4} />}>Limpar filtros</Button>)}
            </HStack>

            {/* --- ÁREA DE FILTRO CINZA --- */}
            <Box mt={6} p={6} bg={filterBlockBg} borderRadius="xl" border="1px solid" borderColor={useColorModeValue("gray.100", "gray.600")}>
                <Flex gap={8} direction={{ base: 'column', lg: 'row' }} align="flex-start">
                    
                    {/* INPUT COM DROPDOWN */}
                    <Box flex={{ base: "1", lg: "0 0 450px" }} w="full" position="relative" zIndex={20}>
                        <HStack mb={3} spacing={2}>
                           <Icon as={Search} size={16} color="blue.500"/>
                           <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider">FILTRAR POR ÁREA DE INTERESSE</Text>
                        </HStack>
                        
                        <InputGroup size="md">
                            <Input 
                                placeholder="Digite para buscar (ex: Inteligência Artificial...)" 
                                value={areaInput}
                                onChange={(e) => { setAreaInput(e.target.value); setIsAreaListOpen(true); }}
                                onFocus={() => setIsAreaListOpen(true)}
                                bg={inputBg}
                                pr="2.5rem"
                                borderColor={useColorModeValue("gray.300", "gray.600")}
                                borderRadius="md" 
                                shadow="sm"
                                _focus={{ borderColor: "blue.500", shadow: "md", ring: 1, ringColor: "blue.200" }}
                            />
                             {areaInput && (<InputRightElement><IconButton size="sm" icon={<X size={14}/>} onClick={() => {setAreaInput(''); setIsAreaListOpen(false)}} variant="ghost" color="gray.500" aria-label="Limpar" /></InputRightElement>)}
                        </InputGroup>

                        {isAreaListOpen && areaInput && filteredAreaSuggestions.length > 0 && (
                            <List bg={dropdownBg} border="1px solid" borderColor={borderColor} borderRadius="md" position="absolute" w="full" mt={1} maxH="250px" overflowY="auto" boxShadow="xl">
                                {filteredAreaSuggestions.map((area, idx) => (
                                    <ListItem key={idx} px={4} py={3} cursor="pointer" transition="all 0.2s" _hover={{ bg: useColorModeValue("blue.50", "blue.900"), color: "blue.700", pl: 6 }} onClick={() => toggleArea(area)} borderBottomWidth={idx !== filteredAreaSuggestions.length - 1 ? "1px" : "0"} borderColor={borderColor}>
                                        <HStack><Icon as={Search} size={14} color="gray.400"/><Text fontSize="sm">{area}</Text></HStack>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>

                    {/* SUGESTÕES POPULARES */}
                    {activeSuggestions.length > 0 && !areaInput && (
                        <Box flex="1" w="full">
                           <HStack mb={3} spacing={2} align="center">
                             <Icon as={Sparkles} color="blue.500" size={16} fill="currentColor"/>
                             <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider">SUGESTÕES POPULARES</Text>
                           </HStack>
                           
                           <Wrap spacing={3}>
                              {activeSuggestions.map(sug => (
                                <WrapItem key={sug}>
                                  <Tag size="md" variant="outline" colorScheme="blue" cursor="pointer" onClick={() => toggleArea(sug)} borderRadius="full" px={3} py={1} bg={useColorModeValue("white", "gray.800")} border="1px solid" borderColor="blue.100" transition="all 0.2s" _hover={{ transform: "translateY(-2px)", shadow: "md", bg: "blue.50", borderColor: "blue.300", color: "blue.700" }}>
                                    <TagLabel fontWeight="medium" fontSize="sm">{sug}</TagLabel>
                                  </Tag>
                                </WrapItem>
                              ))}
                           </Wrap>
                        </Box>
                    )}
                </Flex>

                {/* FILTROS ATIVOS */}
                {selectedAreas.length > 0 && (
                    <Box mt={5} pt={4} borderTop="1px dashed" borderColor="gray.300">
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>FILTROS ATIVOS:</Text>
                        <Wrap spacing={2}>
                            {selectedAreas.map((area) => (
                                <WrapItem key={area}>
                                    <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue" boxShadow="sm">
                                        <TagLabel pl={1}>{area}</TagLabel>
                                        <TagCloseButton onClick={() => toggleArea(area)} />
                                    </Tag>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                )}
            </Box>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <HStack justify="space-between" mb={6}>
             <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color="gray.600">{isLoading ? <Text>Carregando...</Text> : `Mostrando ${currentProfessors.length} de ${totalProfessores} resultados`}</Text>
            {totalPages > 1 && (<Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">Página {currentPage} de {totalPages}</Text>)}
        </HStack>
        {isLoading ? (<Center py={20}><Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">Carregando perfis...</Text></Center>) : currentProfessors.length > 0 ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 3 }} spacing={6} pb={10}>
              {currentProfessors.map((professor) => (<ProfessorCard key={professor.id} professor={professor} />))}
            </SimpleGrid>
            {totalPages > 1 && (<HStack justify="center" spacing={4} py={8}><IconButton icon={<ChevronLeft />} onClick={handlePrevPage} isDisabled={currentPage === 1} aria-label="Anterior" variant="outline" /><HStack spacing={2} display={{ base: 'none', md: 'flex' }}><Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">Página {currentPage} de {totalPages}</Text></HStack><IconButton icon={<ChevronRight />} onClick={handleNextPage} isDisabled={currentPage === totalPages} aria-label="Próxima" variant="outline" /></HStack>)}
          </>
        ) : (
          <Center py={20} flexDirection="column" bg={headerBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
             <Icon as={Search} boxSize={10} color="gray.300" mb={4} />
            <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>Nenhum professor encontrado com os filtros selecionados.</Text>
            <Button mt={4} variant="outline" onClick={clearFilters}>Limpar filtros</Button>
          </Center>
        )}
      </Container>
    </Box>
  );
}