const API_BASE_URL = 'https://api-portal-dos-professores.onrender.com/';

export const getProfessorsData = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('nome', params.q);
    if (params.nome) queryParams.append('nome', params.nome);
    if (params.departamento) queryParams.append('departamento', params.departamento);
    if (params.area_pesquisa) queryParams.append('area_pesquisa', params.area_pesquisa);
    if (params.sort) queryParams.append('sort', params.sort);

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
    return []; 
  }
};

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