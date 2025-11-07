// (Caminho: frontend/src/pages/ProfessoresPage.jsx)

import { useState, useEffect } from 'react';

// 1. IMPORTAÇÕES ATUALIZADAS
// (Removemos getCampusesData)
import { 
  getProfessorsData, 
  getDepartmentsData,  // <- NOVO
  getAreasData         // <- NOVO
} from '../services/api'; 
import ProfessorCard from '../components/professores/ProfessorCard';

export default function ProfessoresPage() {
  // --- 2. SEUS ESTADOS ATUAIS (MANTIDOS) ---
  const [professores, setProfessores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 3. NOVOS ESTADOS ADICIONADOS (Para os filtros) ---
  // (Removemos selectedCampus)
  const [query, setQuery] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [sortBy, setSortBy] = useState('nome_asc'); // 'A-Z' por padrão

  // (Removemos campuses)
  const [departments, setDepartments] = useState([]);
  const [areas, setAreas] = useState([]);

  // Para tratar erros
  const [error, setError] = useState(null);

  // --- 4. NOVO useEffect (Roda 1 vez para buscar as OPÇÕES de filtro) ---
  // (Removemos a chamada para getCampusesData)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Busca todos os dados dos filtros em paralelo
        const [deptsData, areasData] = await Promise.all([
          getDepartmentsData(),
          getAreasData(),
        ]);
        
        setDepartments(deptsData);
        setAreas(areasData);

      } catch (err) {
        console.error("Erro ao buscar opções de filtro:", err);
      }
    };

    fetchFilterOptions();
  }, []); // <-- Array vazio [] = Roda só uma vez

  // --- 5. SEU useEffect (MODIFICADO para buscar PROFESSORES) ---
  // (Removemos selectedCampus das dependências)
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Objeto com todos os filtros (sem campus)
    const params = {
      q: query,
      departamento: selectedDepartamento,
      area_pesquisa: selectedArea,
      sort: sortBy,
    };

    // Chama a API com os parâmetros
    getProfessorsData(params)
      .then(data => {
        setProfessores(data);
      })
      .catch(error => {
        console.error("Erro ao buscar dados dos professores:", error);
        setError("Não foi possível carregar os professores.");
      })
      .finally(() => {
        setIsLoading(false);
      });

  // Roda esta função toda vez que um filtro mudar
  }, [query, selectedDepartamento, selectedArea, sortBy]); 

  
  // --- 6. SEU JSX ATUALIZADO (Removendo o dropdown de Campus) ---
  
  return (
    // Seu container principal
    <div className="professores-container" style={{ padding: '1rem', minHeight: '70vh' }}>
      
      {/* === INÍCIO: NOVOS ELEMENTOS DE FILTRO === */}
      
      <h2>Professores da UnB</h2>
      <p>Explore {isLoading ? '...' : professores.length} perfis de docentes</p>

      {/* Barra de Busca Principal */}
      <div className="busca-container" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nome, departamento ou área de pesquisa..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }} // Estilo de exemplo
        />
      </div>

      {/* Filtros Dropdown e Ordenação */}
      <div className="filtros-dropdown-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <select 
          value={selectedDepartamento} 
          onChange={(e) => setSelectedDepartamento(e.target.value)}
        >
          <option value="">Todos os departamentos</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* DROPDOWN DE CAMPUS REMOVIDO DAQUI */}

        <button onClick={() => setSortBy('nome_asc')}>
          Nome A-Z
        </button>
      </div>

      {/* Tags de Áreas de Pesquisa */}
      <div className="tags-areas-container" style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h4 style={{width: '100%', margin: '0 0 0.5rem 0'}}>Áreas de Pesquisa:</h4>
        <button 
          onClick={() => setSelectedArea('')}
          style={{ fontWeight: selectedArea === '' ? 'bold' : 'normal' }} // Exemplo de 'ativo'
        >
          Todas
        </button>
        {areas.map(area => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            style={{ fontWeight: selectedArea === area ? 'bold' : 'normal' }} // Exemplo de 'ativo'
          >
            {area}
          </button>
        ))}
      </div>
      {/* === FIM: NOVOS ELEMENTOS DE FILTRO === */}

      
      <h1>Nossos Professores</h1>
      
      {/* Tratamento dos estados de 'loading', 'error' e 'vazio' */}
      {isLoading && <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando professores...</p>}
      
      {error && <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</p>}

      {!isLoading && !error && professores.length === 0 && (
         <p style={{ textAlign: 'center', padding: '2rem' }}>
            Nenhum professor encontrado com os filtros selecionados.
         </p>
      )}

      {/* Sua lista de cards (só aparece se não estiver carregando e tiver professores) */}
      {!isLoading && !error && professores.length > 0 && (
        <div className="cards-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {professores.map((professor) => (
            <ProfessorCard key={professor.id} professor={professor} />
          ))}
        </div>
      )}
    </div>
  );
}