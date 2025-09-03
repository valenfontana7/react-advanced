import React from "react";
import { useParams, Link } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";

export default function Lesson() {
  const { level, slug } = useParams();

  const contentMap = {
    basics: {
      jsx: {
        title: "JSX y componentes",
        intro:
          "JSX es la sintaxis recomendada para describir la UI en React. Aunque parece HTML, es azúcar sintáctico para llamadas a React.createElement.",
        theory: [
          "JSX permite interpolar expresiones JavaScript dentro de llaves: { } y se transforma a llamadas a React.createElement.",
          "Los componentes funcionales son funciones que reciben props y retornan JSX; son la unidad básica de composición en React.",
        ],
        example: `function Hello({ name }) {
  return <h1>Hola, {name}!</h1>
}

// Uso:
<Hello name="María" />`,
      },
      lifecycle: {
        title: "Ciclo de vida y efectos (useEffect)",
        intro:
          "useEffect reemplaza los métodos de ciclo de vida en componentes funcionales y permite sincronizar efectos secundarios.",
        theory: [
          "useEffect se ejecuta después del render y puede devolver una función de limpieza.",
          "Diferencia entre efectos con array de dependencias vacío (componentDidMount) y con dependencias (componentDidUpdate).",
        ],
        example: `import { useEffect, useState } from 'react'

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <time>{now.toLocaleTimeString()}</time>
}`,
      },
      composition: {
        title: "Composición de componentes",
        intro:
          "Prefiere composición sobre herencia: combinar componentes pequeños para crear interfaces complejas y reutilizables.",
        example: `function Card({ children }) {
  return <div className="card">{children}</div>
}`,
      },
      forms: {
        title: "Formularios y manejo de inputs",
        intro:
          "Manejo de formularios en React usando state controlado, registrando valores y validaciones simples.",
        theory: [
          "Inputs controlados: el valor del campo proviene del state y se actualiza con onChange.",
          "Para formularios complejos, considera bibliotecas como React Hook Form que optimizan rendimiento y gestión.",
        ],
        example: `import { useState } from 'react'
  function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return (
      <form onSubmit={(e) => { e.preventDefault(); /* enviar */ }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        <button type="submit">Entrar</button>
      </form>
    )
  }`,
      },
      "props-state": {
        title: "Props y State",
        intro:
          "Props y state son dos formas de manejar datos en componentes: props vienen del padre y son inmutables; state es local y puede cambiar.",
        theory: [
          "Props: datos de solo lectura que permiten parametrizar componentes; el padre controla su valor.",
          "State: mecanismo interno para mantener y actualizar valores que afectan la renderización, normalmente con useState o useReducer.",
        ],
        example: `import { useState } from 'react'

function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial)
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  )
}`,
      },
    },
    advanced: {
      hooks: {
        title: "Hooks avanzados",
        general: [
          'Los hooks son funciones que permiten "enganchar" el estado y el ciclo de vida en componentes funcionales.',
          "Reglas principales: llamar hooks en el nivel superior y solo desde componentes o custom hooks.",
        ],
        specific: {
          useReducer: {
            intro:
              "useReducer es útil para manejar lógica de estado compleja y transiciones explícitas.",
            example: `import { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 };
    case 'dec':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function CounterWithReducer() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div>
      <p>Contador: {state.count}</p>
      <button onClick={() => dispatch({ type: 'dec' })}>-</button>
      <button onClick={() => dispatch({ type: 'inc' })}>+</button>
    </div>
  );
}
`,
          },
          useCallback_useMemo: {
            intro:
              "useCallback y useMemo ayudan a evitar recomputaciones o recreaciones de funciones/valores entre renders cuando existan dependencias estables.",
            example: `import { useState, useCallback, useMemo } from 'react'

function ExpensiveComputation(n) {
  return n * 2;
}

function Parent() {
  const [count, setCount] = useState(0);
  const double = useMemo(() => ExpensiveComputation(count), [count]);
  const onInc = useCallback(() => setCount((c) => c + 1), []);
  return (
    <div>
      <p>Doble: {double}</p>
      <button onClick={onInc}>+</button>
    </div>
  );
}
`,
          },
          customHooks: {
            intro:
              'Los custom hooks permiten extraer y reutilizar lógica basada en hooks; deben comenzar con "use".',
            example: `import { useState, useEffect } from 'react'

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}
`,
          },
        },
      },
      concurrency: {
        title: "Suspense y Concurrent Rendering",
        intro:
          "React Suspense y el modo concurrente ofrecen herramientas para manejar carga de datos y mejorar la respuesta de la UI.",
        example: `// Ejemplo de recurso + Suspense
function wrapPromise(promise) { let status='pending'; let result; const suspender = promise.then(r => { status='success'; result=r }, e => { status='error'; result=e }); return { read() { if (status==='pending') throw suspender; if (status==='error') throw result; return result } } }

function fetchUser(id) { return wrapPromise(fetch('/api/user/' + id).then(r => r.json())) }
const resource = fetchUser(1)
function User(){ const user = resource.read(); return <div>Usuario: {user.name}</div> }`,
      },
      performance: {
        title: "Optimización y perfilado",
        intro:
          "Estrategias para medir y mejorar el rendimiento: memoización, splitting, lazy loading y profilado.",
        example: `import React, { Profiler } from 'react'

function onRenderCallback(id, phase, actualDuration) { console.log(id, phase, actualDuration) }
function Heavy(){ return <div>Contenido pesado</div> }
function App(){ return (<Profiler id="Heavy" onRender={onRenderCallback}><Heavy/></Profiler>) }`,
      },
      testing: {
        title: "Testing en React",
        intro:
          "Principios para probar componentes: testing-library para pruebas de integración y Vitest/Jest como runner.",
        example: `import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

test('botón responde a clics', async () => { render(<Button>OK</Button>); const btn = screen.getByText('OK'); await userEvent.click(btn); expect(btn).toBeInTheDocument(); })`,
      },
      ssr: {
        title: "SSR y hydration",
        intro:
          "Server-side rendering (SSR) mejora la carga inicial; React hydration enlaza la UI del servidor con el cliente.",
        example: `function Hello({ name }) { return <div>Hola {name}</div> } // En SSR se renderiza con ReactDOMServer.renderToString`,
      },
    },
  };

  if (!level || !slug) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Lección no encontrada</h2>
        <p>
          Vuelve a <Link to="/">Inicio</Link>
        </p>
      </div>
    );
  }

  // contentMap es un objeto dinámico; hacemos un cast a any para indexar con strings
  // (suficiente para este ejemplo educativo). Si prefieres, podemos definir tipos más estrictos.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry = (contentMap as any)[level as string]?.[slug as string];

  if (!entry) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No hay contenido para esta lección</h2>
        <p>
          Revisa <Link to="/">Inicio</Link>
        </p>
      </div>
    );
  }

  const sections = Object.keys(entry).filter((k) => k !== "title");

  const translateKey = (k: string) => {
    const map: Record<string, string> = {
      intro: "Introducción",
      theory: "Teoría",
      example: "Ejemplo",
      bestPractices: "Buenas prácticas",
      pitfalls: "Errores comunes",
      resources: "Recursos",
      general: "General",
      specific: "Específico",
    };
    return map[k] ?? k.charAt(0).toUpperCase() + k.slice(1);
  };

  return (
    <div className="lesson-page">
      <div className="lesson-top">
        <header className="lesson-hero">
          <div className="lesson-hero-inner">
            <div className="lesson-badge">{level?.toUpperCase()}</div>
            <h1 className="lesson-title">
              {entry.title || `${level} / ${slug}`}
            </h1>
            {entry.intro && <p className="lesson-intro">{entry.intro}</p>}
          </div>
        </header>
        <aside className="lesson-sidebar">
          <nav className="toc">
            <strong>Contenido</strong>
            <ul>
              {sections.map((s) => {
                // usar el title definido en la sección si existe
                // @ts-ignore
                const secTitle = (entry as any)[s]?.title ?? translateKey(s);
                return (
                  <li key={s}>
                    <a
                      href={`#sec-${s}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(`sec-${s}`);
                        if (el)
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                    >
                      {secTitle}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div style={{ marginTop: 20 }}>
            <Link to={`/${level}`}>Volver a {level}</Link>
          </div>
        </aside>
      </div>
      <main className="lesson-main">
        {sections.map((secKey) => {
          // @ts-ignore
          const sec = entry[secKey];
          const title =
            (sec && typeof sec === "object" && sec.title) ||
            translateKey(secKey);

          // Si la sección es una cadena (string), renderizarla directamente
          if (sec == null || typeof sec === "string") {
            return (
              <section
                id={`sec-${secKey}`}
                key={secKey}
                className="lesson-section spec-card"
              >
                <h3>{title}</h3>
                {typeof sec === "string" &&
                  (secKey === "example" ? (
                    <div className="spec-example">
                      <CodeBlock code={sec} language="tsx" />
                    </div>
                  ) : (
                    <p>{sec}</p>
                  ))}
              </section>
            );
          }

          // Si la sección es un array, mostrarlo como lista
          if (Array.isArray(sec)) {
            return (
              <section
                id={`sec-${secKey}`}
                key={secKey}
                className="lesson-section spec-card"
              >
                <h3>{title}</h3>
                <ul>
                  {sec.map((it: any, i: number) => (
                    <li key={i}>{String(it)}</li>
                  ))}
                </ul>
              </section>
            );
          }

          // Si es un objeto, iterar sus subsecciones (intro, theory, example...)
          const subsectionKeys = Object.keys(sec).filter((k) => k !== "title");
          return (
            <section
              id={`sec-${secKey}`}
              key={secKey}
              className="lesson-section spec-card"
            >
              <h3>{title}</h3>
              {subsectionKeys.map((sub) => {
                // @ts-ignore
                const content = sec[sub];
                if (!content && content !== 0) return null;
                return (
                  <div key={sub} style={{ marginTop: 10 }}>
                    <h4 className="spec-title">{translateKey(sub)}</h4>
                    {sub === "example" && typeof content === "string" ? (
                      <div className="spec-example">
                        <CodeBlock code={content} language="tsx" />
                      </div>
                    ) : Array.isArray(content) ? (
                      <ul>
                        {content.map((it: string, i: number) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    ) : (
                      typeof content === "string" && (
                        <p className="spec-intro">{content}</p>
                      )
                    )}
                  </div>
                );
              })}
            </section>
          );
        })}
      </main>
      <div style={{ display: "none" }} />
    </div>
  );
}
