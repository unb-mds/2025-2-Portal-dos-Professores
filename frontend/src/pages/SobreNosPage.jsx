import React from "react";
import "../styles/sobrenos.css";

const participantesData = [
  { id: 1, nome: "Caio Lacerda", link: "https://github.com/caiolacerdamt" },
  { id: 2, nome: "Ian Pedersoli", link: "https://github.com/ianpedersoli" },
  { id: 3, nome: "Arthur Scartezini", link: "https://github.com/Ascartezin" },
  { id: 4, nome: "Paulo Sérgio", link: "https://github.com/Paulosrsr" },
  { id: 5, nome: "Kaio Amoury", link: "https://github.com/KaioAmouryUnB" },
  { id: 6, nome: "Bruno Augusto", link: "https://github.com/brunodantas9" },
];

const SobreNosPage = () => {
  return (
    <div className="qs-container">
      <div className="qs-content-block">
        <h2 className="qs-title">Quem somos?</h2>

        <div className="qs-text">
          <p>
            O Hub Docente UnB é um projeto acadêmico idealizado e desenvolvido
            por estudantes de Engenharia de Software da Universidade de Brasília,
            no âmbito da disciplina de <strong>Métodos de Desenvolvimento de Software</strong>.
          </p>
          <p>
            Nossa motivação nasceu de uma experiência comum a muitos alunos: a
            dificuldade em encontrar informações consolidadas sobre o corpo docente.
            A busca por um orientador ou a simples curiosidade sobre a linha de pesquisa
            de um professor frequentemente se transforma em uma jornada fragmentada
            entre diversas plataformas.
          </p>
          <p>
            Para resolver esse problema, criamos uma plataforma que centraliza esses dados.
            Utilizando web scraping de fontes públicas, o Hub Docente organiza e apresenta
            os perfis acadêmicos de forma intuitiva, com o objetivo de fortalecer a conexão
            entre alunos e professores.
          </p>
          <p style={{ marginTop: "1.5rem" }}>
            Conheça abaixo a equipe responsável por dar vida a este projeto. Para
            os interessados nos detalhes técnicos, o código fonte está inteiramente
            disponível em nosso repositório no GitHub.
          </p>
        </div>

        <h3 className="qs-subtitle">Equipe de Desenvolvimento</h3>

        <div className="equipe-grid">
          {participantesData.map((pessoa) => (
            <div key={pessoa.id} className="dev-card">
              <div className="dev-info">
                <span className="dev-name">{pessoa.nome}</span>
                <a
                  href={pessoa.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dev-github"
                >
                  {pessoa.link.replace("https://", "")}
                </a>
              </div>
            </div>
          ))}
        </div>

        <h3 className="qs-subtitle">Código-fonte</h3>
        <div className="code-source-block">
          <p className="code-source-text">
            Acesse o repositório completo no GitHub com documentação de setup,
            arquitetura e trilha de contribuição.
          </p>
          <a
            href="https://github.com/unb-mds/2025-2-Portal-dos-Professores"
            target="_blank"
            rel="noopener noreferrer"
            className="code-source-link"
          >
            github.com/unb-mds/2025-2-Portal-dos-Professores
          </a>
        </div>
      </div>
    </div>
  );
};

export default SobreNosPage;
