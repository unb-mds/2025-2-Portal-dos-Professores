
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Bem-vindo ao Portal de Professores</h1>
      <p>Encontre informações e publicações dos docentes da universidade.</p>
      <Link to="/professores">
        <button>Ver lista de professores</button>
      </Link>
    </div>
  );
}