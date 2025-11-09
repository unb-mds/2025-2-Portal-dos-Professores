// (Caminho: frontend/src/pages/ProfessoresPage.jsx)

import { useState, useEffect } from 'react';
import { 
  getProfessorsData, 
  getDepartmentsData, 
  getAreasData 
} from '../services/api'; 
import ProfessorCard from '../components/professores/ProfessorCard';

// IMPORTAÇÃO CORRETA (DA BIBLIOTECA 'lucide-react')
import { Search, Filter, ArrowUpDown } from 'lucide-react';

// Os estilos estão no seu 'App.css' global

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

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
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
  }, []); 

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const params = {
      q: query,
      departamento: selectedDepartamento,
      area_pesquisa: selectedArea,
      sort: `nome_${sortOrder}`, 
    };

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

  }, [query, selectedDepartamento, selectedArea, sortOrder]); 

  
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  
  return (
    <div className="prof-page-container">
      
      {/* Títulos */}
      <div className="prof-page-header">
        <h1 className="prof-page-title">Professores da UnB</h1>
        <p className="prof-page-subtitle">
          Explore {isLoading ? '...' : professores.length} perfis de docentes
        </p>
      </div>

      {/* Container de Filtros */}
      <div className="prof-filters-container">
        
        {/* Barra de Busca com Ícone */}
        <div className="search-wrapper">
          <Search className="search-icon" /> {/* <-- CORRIGIDO */}
          <input
            type="text"
            placeholder="Buscar por nome, departamento ou área de pesquisa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input" 
          />
        </div>

        {/* Filtros Dropdown e Ordenação */}
        <div className="filters-row">
          
          {/* Wrapper para Dropdown de Departamento com Ícone */}
          <div className="filter-select-wrapper">
            <Filter className="filter-select-icon" /> {/* <-- CORRIGIDO */}
            <select 
              value={selectedDepartamento} 
              onChange={(e) => setSelectedDepartamento(e.target.value)}
              className="filter-select" 
            >
              <option value="">Todos os departamentos</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Botão de Ordenação com Ícone */}
          <button onClick={toggleSortOrder} className="filter-button">
            <ArrowUpDown className="filter-button-icon" /> {/* <-- CORRIGIDO */}
            Nome {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>

        {/* Tags de Áreas de Pesquisa */}
        <div className="tags-areas-container">
          <h4 className="tags-areas-title">Áreas de Pesquisa:</h4>
          
          <div className="tags-wrapper">
            {/* Botão "Todas" */}
            <button 
              onClick={() => setSelectedArea('')}
              className={`area-tag ${selectedArea === '' ? 'active' : ''}`}
            >
              Todas
            </button>
            
            {/* Mapeamento das áreas */}
            {areas.map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`area-tag ${selectedArea === area ? 'active' : ''}`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Contagem de Resultados */}
      <div className="results-count">
        {!isLoading && (
          <span>{professores.length} {professores.length === 1 ? "resultado" : "resultados"}</span>
        )}
      </div>
      
      {/* Loading/Error/Vazio */}
      {isLoading && <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando professores...</p>}
      
      {error && <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</p>}

      {!isLoading && !error && professores.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            Nenhum professor encontrado com os filtros selecionados.
          </p>
      )}

      {/* Lista de cards */}
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