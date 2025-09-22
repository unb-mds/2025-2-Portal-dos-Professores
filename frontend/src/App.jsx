// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import { getProfessorsData } from './services/api'; // <--- Importa a função

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // A lógica de busca agora é uma chamada de função simples e limpa
    getProfessorsData().then(jsonData => {
      setData(jsonData);
    });
  }, []);

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