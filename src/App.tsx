import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>React Advanced Learner</h1>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/basics">Básicos</Link>
          <Link to="/advanced">Avanzado</Link>
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

      <footer>Hecho con ❤️ — React Advanced Learner</footer>
    </div>
  );
}
