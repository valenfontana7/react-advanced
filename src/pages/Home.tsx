import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const lessons = {
  basics: [
    { slug: "jsx", title: "JSX y componentes" },
    { slug: "props-state", title: "Props y State" },
    { slug: "lifecycle", title: "Ciclo de vida y useEffect" },
    { slug: "forms", title: "Formularios" },
    { slug: "composition", title: "Composición de componentes" },
    { slug: "events", title: "Manejo de eventos" },
    { slug: "refs", title: "Refs y manipulación del DOM" },
    { slug: "hooks-intro", title: "Introducción a Hooks" },
    { slug: "conditional-rendering", title: "Renderizado condicional" },
    { slug: "lists-keys", title: "Listas y keys" },
    { slug: "lifting-state", title: "Elevar estado" },
    { slug: "styling", title: "Estilos en React" },
  ],
  advanced: [
    { slug: "hooks", title: "Hooks avanzados" },
    { slug: "concurrency", title: "Concurrent Mode y Suspense" },
    { slug: "context", title: "Context API" },
    { slug: "performance", title: "Optimización y perfilado" },
    { slug: "testing", title: "Testing en React" },
    { slug: "ssr", title: "SSR y hydration" },
    { slug: "code-splitting", title: "Code-splitting y lazy" },
    { slug: "state-management", title: "State management (Redux / Zustand)" },
    { slug: "accessibility", title: "Accesibilidad en React" },
    { slug: "react-router", title: "Routing con React Router" },
    { slug: "graphql", title: "GraphQL y Apollo" },
    { slug: "profiling-tools", title: "Profiling y DevTools" },
    { slug: "deployment", title: "Despliegue y optimizaciones" },
  ],
};

export default function Home() {
  const { pathname } = useLocation();

  const isRoot = pathname === "/";
  const isBasics = pathname.startsWith("/basics");
  const isAdvanced = pathname.startsWith("/advanced");
  const totalLessons = lessons.basics.length + lessons.advanced.length;

  const [query, setQuery] = useState("");

  const combinedLessons = useMemo(() => {
    return [
      ...lessons.basics.map((l) => ({ ...l, level: "basics" })),
      ...lessons.advanced.map((l) => ({ ...l, level: "advanced" })),
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return combinedLessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) || l.slug.toLowerCase().includes(q)
    );
  }, [query, combinedLessons]);

  return (
    <div>
      <div className="home-hero">
        <div className="hero-left">
          <h2 className="hero-title">Aprende React a tu ritmo</h2>
          <p className="hero-subtitle muted">
            Cursos organizados por nivel con ejemplos prácticos y ejercicios.
          </p>
          <div className="hero-actions">
            <input
              className="search-input"
              placeholder="Buscar lecciones, p. ej. hooks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar lecciones"
            />
            <div className="hero-stats">
              <div className="stat">{totalLessons} lecciones</div>
            </div>
          </div>
        </div>
        <div>
          <Link to="/basics" className="btn primary">
            Comenzar
          </Link>
        </div>
      </div>

      <h2>Lecciones</h2>

      {query ? (
        <section>
          <h3>Resultados</h3>
          {filtered.length ? (
            <div className="section-cards">
              {filtered.map((l) => (
                <Link
                  key={`${l.level}-${l.slug}`}
                  to={`/${l.level}/${l.slug}`}
                  className="card"
                >
                  <div className="card-title">{l.title}</div>
                  <div className="card-desc">Nivel: {l.level}</div>
                  <div className="card-meta">Ir a la lección →</div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted">
              No se encontraron lecciones que coincidan con "{query}".
            </p>
          )}
        </section>
      ) : isRoot ? (
        <div className="overview-links">
          <Link to="/basics" className="overview-link">
            <h3 className="overview-title">Básicos</h3>
            <p className="overview-desc muted">Conceptos esenciales de React</p>
          </Link>

          <Link to="/advanced" className="overview-link">
            <h3 className="overview-title">Avanzado</h3>
            <p className="overview-desc muted">
              Patrones avanzados y rendimiento
            </p>
          </Link>
        </div>
      ) : (
        <>
          {isBasics && (
            <section>
              <h3>Básicos</h3>
              <div className="section-cards">
                {lessons.basics.map((l) => (
                  <Link key={l.slug} to={`/basics/${l.slug}`} className="card">
                    <div className="card-title">{l.title}</div>
                    <div className="card-desc">
                      Fundamentos claros con ejemplos y patrones de uso.
                    </div>
                    <div className="card-meta">Ver lección →</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {isAdvanced && (
            <section>
              <h3>Avanzado</h3>
              <div className="section-cards">
                {lessons.advanced.map((l) => (
                  <Link
                    key={l.slug}
                    to={`/advanced/${l.slug}`}
                    className="card"
                  >
                    <div className="card-title">{l.title}</div>
                    <div className="card-desc">
                      Una introducción clara y ejemplos prácticos.
                    </div>
                    <div className="card-meta">Ver lección →</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
