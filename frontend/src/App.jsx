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
    <div className="App">
      <h1>Portal de Professores da UnB</h1>
      <p>O teste de integração com o Docker funcionou!</p>

      {!data ? (
        <p>Carregando dados do JSON...</p>
      ) : (
        <div className="cards-container">
          {data.professors.map((professor, index) => (
            <div className="card-professor" key={index}>
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

      <h2>Testando o Cache CDN do Github</h2>
      <h2>Hello World</h2>
    </div>
  );
}

export default App;
