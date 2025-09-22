import { useState, useEffect } from 'react';
import './App.css';
import { getProfessorsData } from './services/api'; 

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getProfessorsData().then(jsonData => {
      setData(jsonData);
    });
  }, []);

  return (
    <>
    <div className="App">
      <h1>Portal de Professores da UnB</h1>
      <p>O teste de integração com o Docker funcionou!</p>
      <pre>
        {data ? JSON.stringify(data, null, 2) : "Carregando dados do JSON..."}
      </pre>
    </div>
    <h2>
      Testando o Cache CDN do Github
    </h2>
    </>
  )
}

export default App