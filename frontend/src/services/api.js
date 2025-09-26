export const getProfessorsData = async () => {
  try {
    const apiUrl = 'http://localhost:8000/professors';
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Falha ao buscar dados dos professores:", error);
    return []; 
  }
};