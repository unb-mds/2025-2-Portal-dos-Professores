

import { Link } from 'react-router-dom';


export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/professores" style={{ marginRight: '1rem' }}>Professores</Link>
      <Link to="/sobre-nos">Sobre Nós</Link>
    </nav>
  );
}