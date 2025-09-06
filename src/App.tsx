import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="React logo"
          >
            <circle cx="20" cy="20" r="3.5" fill="#61DAFB" />
            <g stroke="#61DAFB" strokeWidth="2" fill="none">
              <ellipse rx="16" ry="6.5" cx="20" cy="20" />
              <ellipse
                rx="16"
                ry="6.5"
                cx="20"
                cy="20"
                transform="rotate(60 20 20)"
              />
              <ellipse
                rx="16"
                ry="6.5"
                cx="20"
                cy="20"
                transform="rotate(120 20 20)"
              />
            </g>
          </svg>
        </div>
        <nav className="nav-links">
          <Link className="nav-link" to="/">
            Inicio
          </Link>
          <Link className="nav-link" to="/basics">
            Básicos
          </Link>
          <Link className="nav-link" to="/advanced">
            Avanzado
          </Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:level/:slug" element={<Lesson />} />
          <Route path="/basics" element={<Home />} />
          <Route path="/advanced" element={<Home />} />
        </Routes>
      </main>

      <footer className="site-footer">
        Hecho con ❤️ — React Advanced Learner
      </footer>
    </div>
  );
}
