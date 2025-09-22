// /frontend/src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // CORREÇÃO AQUI: Usando import.meta.env.BASE_URL para construir o caminho dinamicamente
    const jsonPath = `${import.meta.env.BASE_URL}data/professors.json`;
    console.log("Tentando buscar JSON em:", jsonPath); // Adicionado para depuração

    fetch(jsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} at ${jsonPath}`);
        }
        return response.json();
      })
      .then(jsonData => setData(jsonData))
      .catch(error => console.error('Erro ao buscar JSON:', error))
  }, [])

  return (
    <div className="App">
      <h1>Portal de Professores da UnB</h1>
      <p>O teste de integração com o Docker funcionou!</p>
      <pre>
        {data ? JSON.stringify(data, null, 2) : "Carregando dados do JSON..."}
      </pre>
    </div>
  )
}

export default App