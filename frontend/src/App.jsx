import { useState, useEffect } from 'react';
import './App.css';
import { getProfessorsData } from './services/api';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProfessorsData().then(jsonData => {
      setData(jsonData);
    });
  }, []);

  return (
    <div className="App">
      <h1>Portal de Professores da UnB</h1>
      <p>O teste de integração com o Docker funcionou!</p>

      {/* Este ternário agora só mostra "Carregando" se a lista estiver vazia. */}
      {data.length === 0 ? (
        <p>Carregando dados da API...</p>
      ) : (
        <div className="cards-container">
          {/* MUDANÇA 2: Mapear 'data' diretamente, pois ele já é o array */}
          {data.map((professor) => (
            <div className="card-professor" key={professor.id}> 
              <img
                src={professor.foto_url}
                alt={`Foto de ${professor.nome}`}
                className="professor-foto"
              />
              <div className="card-info">
                <h3>{professor.nome}</h3>
                <p>{professor.departamento}</p>
                <a
                  href={professor.pagina_sigaa_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver página no SIGAA
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ... resto do seu código ... */}
    </div>
  );
}

export default App;