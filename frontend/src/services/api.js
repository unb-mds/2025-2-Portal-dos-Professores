// Usa o backend local em desenvolvimento, produção em deploy
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8000' 
  : 'https://api-portal-dos-professores.onrender.com';

// --- BUSCA DE PROFESSORES ---
export const getProfessorsData = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Mapeia parâmetros de busca
    if (params.q) queryParams.append('nome', params.q); 
    if (params.nome) queryParams.append('nome', params.nome);
    if (params.departamento) queryParams.append('departamento', params.departamento);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const apiUrl = queryString 
      ? `${API_BASE_URL}/professors?${queryString}`
      : `${API_BASE_URL}/professors`;
    
    console.log('🔗 [API] Buscando professores em:', apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ [API] Recebidos ${Array.isArray(data) ? data.length : 0} professores`);
    return data; 
  } catch (error) {
    console.error("❌ [API] Falha ao buscar dados dos professores:", error);
    return []; 
  }
};

// --- BUSCA DE DEPARTAMENTOS ---
export const getDepartmentsData = async () => {
  try {
    const apiUrl = `${API_BASE_URL}/departamentos`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Erro: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ [API] Falha ao buscar departamentos:", error);
    return [];
  }
};

// --- CONSULTA AO AGENTE DE IA ---
export const askAgentForRecommendations = async (formData) => {
  try {
    const agentUrl = 'https://api-portal-dos-professores.onrender.com/api/v1/agente/perguntar';
    console.log('🤖 [API] Enviando perfil para IA em:', agentUrl);

    // Formata os dados conforme a IA espera (strings separadas por vírgula)
    const payload = {
      nome: formData.nome,
      curso: formData.curso,
      tipo_projeto: formData.tipoProjeto,
      interesses: formData.topicosInteresse.join(', '),
      habilidades: formData.habilidadesTecnicas.join(', ')
    };

    const response = await fetch(agentUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Erro API Agente: ${response.status}`);

    const data = await response.json();
    console.log('💡 [API] Resposta da IA recebida com sucesso');
    return data;
  } catch (error) {
    console.error("❌ [API] Falha na consulta ao Agente:", error);
    throw error;
  }
};