import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sobrenos.css'; 

const participantesData = [
    { id: 1, nome: "Caio Lacerda", link: "https://github.com/caiolacerdamt" },
    { id: 2, nome: "Ian Pedersoli", link: "https://github.com/ianpedersoli" },
    { id: 3, nome: "Arthur Scartezini", link: "https://github.com/Ascartezin" },
    { id: 4, nome: "Paulo Sérgio", link: "https://github.com/Paulosrsr" },
    { id: 5, nome: "Kaio Amoury", link: "https://github.com/KaioAmouryUnB" },
    { id: 6, nome: "Bruno Augusto", link: "https://github.com/brunodantas9" },
];

const ParticipanteCard = ({ nome, link }) => (
    <div className="participante-card">
        <div className="foto">foto</div>
        <h4>{nome}</h4>
        <a href={`http://${link}`} target="_blank" rel="noopener noreferrer">
            {link}
        </a>
    </div>
);

const SobreNos = () => {
    return (
        <> 
            <section id="quem-somos">
                <div className="container"> 
                    <h1>Quem somos?</h1>
                    
                    <p className="quem-somos-texto">
                        O Hub Docente UnB é um projeto acadêmico idealizado e desenvolvido por estudantes de Engenharia de Software da 
                        Universidade de Brasília, no âmbito da disciplina de Métodos de Desenvolvimento de Software.
                        <br /><br />
                        Nosso objetivo é criar uma ferramenta que facilite o acesso rápido e intuitivo a perfis acadêmicos 
                        consolidados sobre o corpo docente. A busca por um orientador ou a simples curiosidade sobre a linha de pesquisa de 
                        um professor é simplificada em uma única tela. Por meio da agregação inteligente de
                        dados de fontes públicas, o Hub Docente organiza e apresenta os perfis acadêmicos de forma intuitiva, com o objetivo 
                        de conectar alunos e professores de maneira eficiente.
                        <br /><br />
                        Conheça abaixo a equipe responsável por dar vida a este projeto. Para os interessados nos detalhes técnicos, e 
                        contribuições para o desenvolvimento, disponha em nossos repositórios no GitHub.
                    </p>

                    <div className="participantes-grid">
                        {participantesData.map(participante => (
                            <ParticipanteCard 
                                key={participante.id} 
                                nome={participante.nome} 
                                link={participante.link} 
                            />
                        ))}
                    </div>
                </div>
            </section>
        </> 
    );
};

export default SobreNos;
