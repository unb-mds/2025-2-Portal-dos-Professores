const API_BASE_URL = `${import.meta.env.BASE_URL}data/`;

/**
 * Busca todos os professores do arquivo JSON.
 * @returns {Promise<Object>} Os dados dos professores.
 */
export const getProfessorsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}professors.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Falha ao buscar dados dos professores:", error);
    return { last_updated: null, professors: [] }; 
  }
};