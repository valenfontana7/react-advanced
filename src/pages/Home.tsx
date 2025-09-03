import React from "react";
import { Link, useLocation } from "react-router-dom";

const lessons = {
  basics: [
    { slug: "jsx", title: "JSX y componentes" },
    { slug: "props-state", title: "Props y State" },
    { slug: "lifecycle", title: "Ciclo de vida y useEffect" },
    { slug: "forms", title: "Formularios" },
    { slug: "composition", title: "Composición de componentes" },
  ],
  advanced: [
    { slug: "hooks", title: "Hooks avanzados" },
    { slug: "concurrency", title: "Concurrent Mode y Suspense" },
    { slug: "context", title: "Context API" },
    { slug: "performance", title: "Optimización y perfilado" },
    { slug: "testing", title: "Testing en React" },
    { slug: "ssr", title: "SSR y hydration" },
  ],
};

export default function Home() {
  const { pathname } = useLocation();

  const isRoot = pathname === "/";
  const isBasics = pathname.startsWith("/basics");
  const isAdvanced = pathname.startsWith("/advanced");

  return (
    <div>
      <h2>Lecciones</h2>

      {isRoot ? (
        <div style={{ display: "flex", gap: 18 }}>
          <Link
            to="/basics"
            style={{
              padding: "12px 18px",
              background: "var(--card-bg)",
              borderRadius: 10,
              textDecoration: "none",
              color: "var(--text)",
            }}
          >
            <h3 style={{ margin: 0 }}>Básicos</h3>
            <p className="muted" style={{ margin: "6px 0 0 0" }}>
              Conceptos esenciales de React
            </p>
          </Link>

          <Link
            to="/advanced"
            style={{
              padding: "12px 18px",
              background: "var(--card-bg)",
              borderRadius: 10,
              textDecoration: "none",
              color: "var(--text)",
            }}
          >
            <h3 style={{ margin: 0 }}>Avanzado</h3>
            <p className="muted" style={{ margin: "6px 0 0 0" }}>
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
