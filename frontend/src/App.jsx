

import { Outlet } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        {/* O conteúdo da página atual (definida nas rotas) será renderizado aqui */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;