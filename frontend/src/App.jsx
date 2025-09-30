import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X, Linkedin, Twitter, Github } from "lucide-react";
import "./App.css";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItem = ({ to, children }) => (
    <li>
      <Link to={to} onClick={() => setIsMenuOpen(false)}>
        {children}
      </Link>
    </li>
  );

  return (
    <div className="container">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            Hub Docente
          </Link>

          {/* Menu Desktop */}
          <nav>
            <ul>
              <NavItem to="/">HOME</NavItem>
              <NavItem to="/professores">PROFESSORES</NavItem>
              <NavItem to="/sobre-nos">SOBRE NÓS</NavItem>
            </ul>
          </nav>

          <button
            className="mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={24} color="#333" /> : <Menu size={24} color="#333" />}
          </button>
        </div>

        {isMenuOpen && (
          <ul className="mobile-menu-dropdown">
            <NavItem to="/">HOME</NavItem>
            <NavItem to="/professores">PROFESSORES</NavItem>
            <NavItem to="/sobre-nos">SOBRE NÓS</NavItem>
          </ul>
        )}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>Projeto da disciplina de MDS - UnB</p>
        <p>&copy; 2025 Hub Docente UnB</p>
        <div className="social-icons">
          <a href="#" aria-label="LinkedIn">
            <Linkedin size={24} />
          </a>
          <a href="#" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="#" aria-label="GitHub">
            <Github size={24} />
          </a>
        </div>
      </footer>
    </div>
  );
}