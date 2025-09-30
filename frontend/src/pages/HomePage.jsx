
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="hero-box">
      <h1>Hub Docente UnB</h1>
      <p>
        Sabemos como é desafiador encontrar informações sobre os professores de forma
        clara e centralizada. Por isso, apresentamos o seu portal de professores da
        FCTE. Mapeamos os dados públicos para que você possa focar no que realmente
        importa: descobrir linhas de pesquisa, publicações e disciplinas para
        encontrar o professor que deseja, ou o orientador perfeito para o seu
        trabalho.
      </p>
      <button>Explorar Professores</button>
    </div>
  );
}