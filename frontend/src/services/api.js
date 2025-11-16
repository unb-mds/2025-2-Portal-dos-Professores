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
    // O backend espera 'nome' (não 'q'), mas aceitamos ambos para compatibilidade
    if (params.q) queryParams.append('nome', params.q);
    if (params.nome) queryParams.append('nome', params.nome);
    if (params.departamento) queryParams.append('departamento', params.departamento);
    // (Parâmetro 'campus' removido)
    if (params.area_pesquisa) queryParams.append('area_pesquisa', params.area_pesquisa);
    if (params.sort) queryParams.append('sort', params.sort);

    // Constrói a URL final: se não há parâmetros, não adiciona o '?'
    const queryString = queryParams.toString();
    const apiUrl = queryString 
      ? `${API_BASE_URL}/professors?${queryString}`
      : `${API_BASE_URL}/professors`;
    
    console.log('🔗 Buscando professores em:', apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Recebidos ${Array.isArray(data) ? data.length : 0} professores`);
    return data; 
  } catch (error) {
    console.error("❌ Falha ao buscar dados dos professores:", error);
    return []; // Retorna array vazio em caso de erro
  }
};

// --- 2. NOVAS FUNÇÕES (ADICIONADAS) ---
// Funções para popular os menus de filtro na página

export const getDepartmentsData = async () => {
  try {
    const apiUrl = `${API_BASE_URL}/departamentos`;
    console.log('🔗 Buscando departamentos em:', apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log(`✅ Recebidos ${Array.isArray(data) ? data.length : 0} departamentos`);
    return data;
  } catch (error) {
    console.error("❌ Falha ao buscar departamentos:", error);
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