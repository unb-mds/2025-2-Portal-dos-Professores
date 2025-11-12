import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Text, Center, Spinner, Container } from '@chakra-ui/react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Link } from "react-router-dom";


// Importação dos dados mockados e do Card
import ProfessorCard from '../components/professores/ProfessorCard'; // <-- CONFIRA SE O CAMINHO ESTÁ CERTO
import { professorListMock } from '../data/professorMock'; // <-- CONFIRA SE O CAMINHO ESTÁ CERTO

// Importação da API (que não vamos usar agora, mas deixamos aqui para o futuro)
import { 
  getProfessorsData, 
  getDepartmentsData, 
  getAreasData 
} from '../services/api'; 

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [departments, setDepartments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);

  // Efeito para buscar filtros (mantemos tentando buscar, mas não vai quebrar a página se falhar)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Tenta buscar do backend, se falhar, usa listas vazias por enquanto
        const [deptsData, areasData] = await Promise.all([
          getDepartmentsData().catch(() => []),
          getAreasData().catch(() => []),
        ]);
        setDepartments(deptsData || []);
        setAreas(areasData || []);
      } catch (err) {
        console.warn("Backend offline: Filtros não carregaram.", err);
      }
    };
    fetchFilterOptions();
  }, []); 

  // EFEITO TEMPORÁRIO: Usa dados MOCKADOS em vez da API real
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Simula um atraso de rede de 500ms
    const timer = setTimeout(() => {
        console.log("Usando dados mockados para desenvolvimento.");
        setProfessores(professorListMock);
        setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, selectedDepartamento, selectedArea, sortOrder]); // Recarrega se mudar filtros (mas sempre traz a mesma lista mockada por enquanto)

  /* --- CÓDIGO DA API REAL (COMENTADO TEMPORARIAMENTE) ---
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const params = { q: query, departamento: selectedDepartamento, area_pesquisa: selectedArea, sort: `nome_${sortOrder}` };
    getProfessorsData(params)
      .then(data => setProfessores(data))
      .catch(error => {
        console.error("Erro na API:", error);
        setError("Backend indisponível. Mostrando dados locais se houver.");
      })
      .finally(() => setIsLoading(false));
  }, [query, selectedDepartamento, selectedArea, sortOrder]); 
  --------------------------------------------------------- */

  const toggleSortOrder = () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  return (
    <div className="prof-page-container">
      {/* Cabeçalho e Títulos */}
      <div className="prof-page-header">
        <h1 className="prof-page-title">Professores da UnB</h1>
        <p className="prof-page-subtitle">
          Explore {isLoading ? '...' : professores.length} perfis de docentes
        </p>
      </div>

      {/* Filtros (Mantidos do seu código original) */}
      <div className="prof-filters-container">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome, departamento ou área..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input" 
          />
        </div>
        <div className="filters-row">
          <div className="filter-select-wrapper">
            <Filter className="filter-select-icon" />
            <select value={selectedDepartamento} onChange={(e) => setSelectedDepartamento(e.target.value)} className="filter-select">
              <option value="">Todos os departamentos</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <button onClick={toggleSortOrder} className="filter-button">
            <ArrowUpDown className="filter-button-icon" /> Nome {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>
      </div>
      
      {/* Área de Resultados (Usando Chakra UI para o Grid de Cards) */}
      <Box p={8} pt={0} maxWidth="1400px" margin="0 auto">
        {isLoading ? (
            <Center py={20}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
        ) : error ? (
            <Center py={10}>
                <Text color="red.500">{error}</Text>
            </Center>
        ) : (
            <Box mt={6}>
                <Text fontSize="lg" fontWeight="semibold" mb={6} color="gray.600">
                    {professores.length} resultados encontrados (Modo Mock)
                </Text>

                {professores.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                    {professores.map((professor) => (
                      <Link
                        key={professor.id}
                        to={`/professores/${professor.id}`} // 👈 Navega pra página de detalhe
                        style={{ textDecoration: "none" }}
         >
                       <ProfessorCard professor={professor} />
                      </Link>
             ))}
            </SimpleGrid>
          ) : (
             <Center py={10}>
              <Text color="gray.500" fontSize="lg">
                Nenhum professor encontrado.
              </Text>
            </Center>
      )}

            </Box>
        )}
      </Box>
    </div>
  );
}