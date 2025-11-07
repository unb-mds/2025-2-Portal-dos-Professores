// (Caminho: frontend/src/services/api.js)

// Define a URL base da sua API (o backend rodando)
const API_BASE_URL = 'http://localhost:8000';

// --- 1. SUA FUNÇÃO EXISTENTE (MODIFICADA) ---
/**
 * Busca professores com base em filtros.
 * @param {object} params - Um objeto com os filtros (q, departamento, etc.)
 */
export const getProfessorsData = async (params = {}) => {
  try {
    // URLSearchParams é a forma mais fácil de construir a query string
    const queryParams = new URLSearchParams();
    
    // Adiciona apenas os parâmetros que foram definidos e não são vazios
    if (params.q) queryParams.append('q', params.q);
    if (params.departamento) queryParams.append('departamento', params.departamento);
    // (Parâmetro 'campus' removido)
    if (params.area_pesquisa) queryParams.append('area_pesquisa', params.area_pesquisa);
    if (params.sort) queryParams.append('sort', params.sort);

    // Constrói a URL final: ex: http://localhost:8000/professors?q=ana&departamento=CIC
    const apiUrl = `${API_BASE_URL}/professors?${queryParams.toString()}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Falha ao buscar dados dos professores:", error);
    return []; // Retorna array vazio em caso de erro
  }
};

// --- 2. NOVAS FUNÇÕES (ADICIONADAS) ---
// Funções para popular os menus de filtro na página

export const getDepartmentsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/departamentos`);
    if (!response.ok) throw new Error('Falha ao buscar departamentos');
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar departamentos:", error);
    return [];
  }
};

// (Função getCampusesData removida)

export const getAreasData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/areas-pesquisa`);
    if (!response.ok) throw new Error('Falha ao buscar áreas de pesquisa');
    return await response.json();
  } catch (error) {
    console.error("Falha ao buscar áreas de pesquisa:", error);
    return [];
  }
};