import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";
import Markdown from "../components/Markdown";

export default function Lesson() {
  const { level, slug } = useParams();

  // control local para cross-fade: mantenemos el slug/level actuales y alternamos visibilidad
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(slug);
  const [currentLevel, setCurrentLevel] = useState<string | undefined>(level);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Si no cambió, nada
    if (slug === currentSlug && level === currentLevel) return;

    // iniciar fade out
    setVisible(false);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // esperar el tiempo de transición y luego cambiar contenido y hacer fade in
    timerRef.current = window.setTimeout(() => {
      setCurrentSlug(slug);
      setCurrentLevel(level);
      setVisible(true);
      timerRef.current = null;
    }, 260); // debe coincidir con la duración en CSS

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [slug, level, currentSlug, currentLevel]);

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
      events: {
        title: "Manejo de eventos",
        intro:
          "Eventos en React: los handlers se pasan como props camelCase (onClick, onChange). React usa un sistema de eventos sintéticos que normaliza el comportamiento entre navegadores.",
        theory: [
          "Los eventos en React reciben un SyntheticEvent que envuelve el evento nativo y previene diferencias entre navegadores.",
          "Para prevenir el comportamiento por defecto usa event.preventDefault() y para detener la propagación event.stopPropagation().",
          "Si necesitas pasar argumentos al handler, envuelve la llamada en una función: onClick={() => handle(id)}.",
        ],
        example: `function FormExample(){
  function onSubmit(e){
    e.preventDefault();
    const fd = new FormData(e.target);
    alert('enviado: ' + fd.get('name'))
  }
  return (
    <form onSubmit={onSubmit}>
      <input name="name" placeholder="Nombre" />
      <button type="submit">Enviar</button>
    </form>
  )
}
`,
        bestPractices: [
          "Evita crear funciones inline en render cuando impacte el rendimiento en listas grandes (memoiza handlers si es necesario).",
          "Usa nombres claros para handlers: handleClick, onSubmitForm.",
          "Prefiere delegación cuando trabajes con muchas entradas si la estructura lo permite.",
        ],
      },
      refs: {
        title: "Refs y manipulación del DOM",
        intro:
          "useRef permite mantener una referencia mutable a un elemento DOM o a un valor entre renders; útil para focus, medir tamaños o almacenar valores mutables.",
        theory: [
          "useRef devuelve un objeto { current } que persiste entre renders y no provoca re-render al cambiar.",
          "Para exponer APIs desde componentes hijos, usa forwardRef + useImperativeHandle.",
          "Evita manipular el DOM frecuentemente; cuando sea posible, usa el modelo declarativo.",
        ],
        example: `import { useRef } from 'react'

function FocusInput(){
  const ref = useRef(null)
  return (
    <div>
      <input ref={ref} placeholder="escribe aquí" />
      <button onClick={() => ref.current && ref.current.focus()}>Focus</button>
    </div>
  )
}
`,
        bestPractices: [
          "Usa refs para casos imperativos (focus, selección, integración con librerías), no para lógica de estado.",
          "Cuando expongas funciones desde un componente, documenta la API y usa forwardRef correctamente.",
        ],
      },
      "hooks-intro": {
        title: "Introducción a Hooks",
        intro:
          "Los hooks permiten usar estado y otras características de React sin escribir clases. Son funciones que respetan reglas de invocación (nivel superior y solo en componentes o custom hooks).",
        theory: [
          "useState para estado local y actualizaciones basadas en funciones.",
          "useEffect para sincronizar efectos y limpieza (timers, suscripciones).",
          "useMemo/useCallback para memoización cuando sea necesario para rendimiento.",
        ],
        example: `import { useState, useEffect } from 'react'

function Counter(){
  const [count, setCount] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCount(c => c + 1), 1000)
    return () => clearInterval(t)
  }, [])
  return <div>Segundos: {count}</div>
}
`,
        bestPractices: [
          "Sigue las reglas de los hooks: llama hooks siempre en el mismo orden.",
          "Extrae lógica reutilizable en custom hooks cuando tenga sentido.",
        ],
      },
      "conditional-rendering": {
        title: "Renderizado condicional",
        intro:
          "Cómo mostrar u ocultar elementos en función de estado o props usando condicionales y operadores ternarios.",
        theory: [
          "Operador && para render simple",
          "Operador ternario para alternativas",
          "Extraer lógica a funciones para mantener JSX limpio",
        ],
        example: `function Greeting({logged}){ return <div>{logged ? <p>Bienvenido</p> : <p>Por favor inicia sesión</p>}</div> }`,
      },
      "lists-keys": {
        title: "Listas y keys",
        intro:
          "Renderizar listas con map y usar keys estables para ayudar a React a reconciliar elementos.",
        theory: [
          "Usa keys únicas y estables (id) en lugar de índices",
          "Las keys influyen en preservación de estado entre renders",
        ],
        example: `items.map(item => <li key={item.id}>{item.name}</li>)`,
      },
      "lifting-state": {
        title: "Elevar estado",
        intro:
          "Compartir estado entre componentes hermanos elevando el estado al ancestro común y pasando props y callbacks.",
        example: `function Parent(){ const [value,setValue]=useState(''); return <><Input value={value} onChange={setValue} /><Display value={value} /></> }`,
      },
      styling: {
        title: "Estilos en React",
        intro:
          "Opciones para estilos: CSS modular, styled-components, Tailwind, y CSS-in-JS; trade-offs y rendimiento.",
        theory: [
          "CSS clásico y módulos CSS",
          "Librerías utility-first como Tailwind",
          "CSS-in-JS para scoping y theming",
        ],
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
      "code-splitting": {
        title: "Code-splitting y lazy",
        intro:
          "Dividir el código reduce el tamaño inicial del bundle: React.lazy y Suspense permiten cargar componentes bajo demanda.",
        theory: [
          "React.lazy carga componentes solo cuando se renderizan por primera vez; Suspense permite mostrar un fallback mientras carga.",
          "Haz code-splitting por rutas o por componentes pesados (ej. librerías de visualización).",
        ],
        example: `// lazy import de un componente pesado
const Heavy = React.lazy(() => import('./Heavy'))

function App(){
  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <Heavy/>
    </React.Suspense>
  )
}
`,
        bestPractices: [
          "Coloca boundaries de Suspense en un nivel donde un fallback sea aceptable para la UX.",
          "Prefetch/ preload cuando esperes que el usuario necesite el módulo pronto.",
        ],
      },
      "state-management": {
        title: "State management (Redux / Zustand)",
        intro:
          "Estrategias para manejar estado compartido: elegir entre Context, Redux, Zustand u otras librerías según complejidad y requisitos.",
        theory: [
          "Context API es ideal para datos de configuración o tema; evita usarlo para cambios de alta frecuencia que afecten a muchos componentes.",
          "Redux ofrece predictibilidad y herramientas de depuración pero añade boilerplate; Zustand ofrece una API minimal y rendimiento.",
        ],
        example: `// ejemplo simple con Context
import { createContext, useContext, useState } from 'react'
const CountCtx = createContext(null)
function Provider({children}){
  const state = useState(0)
  return <CountCtx.Provider value={state}>{children}</CountCtx.Provider>
}
function Display(){
  const [count] = useContext(CountCtx)
  return <div>{count}</div>
}
`,
        bestPractices: [
          "Evalúa la complejidad y el tamaño del equipo antes de introducir Redux en un proyecto pequeño.",
          "Prefiere soluciones más simples (Context + hooks o Zustand) si cubren tus necesidades.",
        ],
      },
      accessibility: {
        title: "Accesibilidad en React",
        intro:
          "Buenas prácticas para accesibilidad: semantic HTML, roles, aria-attributes y navegación por teclado para crear aplicaciones inclusivas.",
        theory: [
          "Usa elementos semánticos (button, nav, header) y evita reemplazarlos por divs sin role.",
          "Asegura el foco visible y orden lógico del tab index.",
          "Añade atributos ARIA cuando el HTML semántico no sea suficiente (aria-label, aria-hidden, role).",
        ],
        example: `<button aria-label="Cerrar" onClick={onClose}>✕</button>

// ejemplo de lista con navegación por teclado
<ul role="list">
  <li tabIndex={0}>Ítem 1</li>
  <li tabIndex={0}>Ítem 2</li>
</ul>`,
        bestPractices: [
          "Prueba con lectores de pantalla y tab-navigation.",
          "Asegura contraste de color suficiente y objetivos táctiles adecuados.",
        ],
      },
      "react-router": {
        title: "Routing con React Router",
        intro:
          "Configuración básica de rutas, Link, useParams y nested routes con React Router v6.",
        example: `import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App(){
  return <BrowserRouter><Routes><Route path='/' element={<Home/>} /><Route path='/about' element={<About/>} /></Routes></BrowserRouter>
}
`,
      },
      graphql: {
        title: "GraphQL y Apollo",
        intro:
          "Introducción a consultas GraphQL y el uso de Apollo Client para fetch, cache y actualizaciones locales.",
      },
      "profiling-tools": {
        title: "Profiling y DevTools",
        intro:
          "Cómo usar React DevTools Profiler y herramientas de navegador para detectar cuellos de botella y renders innecesarios.",
      },
      deployment: {
        title: "Despliegue y optimizaciones",
        intro:
          "Estrategias de despliegue para aplicaciones React: build optimizado, code-splitting, caching y CDN.",
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
        example: `function Hello({ name }) { 
  return <div>Hola {name}</div>;
} 
// En SSR se renderiza con ReactDOMServer.renderToString`,
      },
    },
  };

  if (!currentLevel || !currentSlug) {
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
  const entry = (contentMap as any)[currentLevel as string]?.[
    currentSlug as string
  ];

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

  // calcular prev / next basados en el orden de las claves dentro del mismo nivel
  // (si el slug no está presente, prev/next serán null)
  const levelMap = (contentMap as any)[level as string] || {};
  const levelKeys: string[] = Object.keys(levelMap);
  const currentIndex = levelKeys.indexOf(slug as string);
  const prevSlug = currentIndex > 0 ? levelKeys[currentIndex - 1] : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < levelKeys.length - 1
      ? levelKeys[currentIndex + 1]
      : null;

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
              {entry.title || `${currentLevel} / ${currentSlug}`}
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
        <div className={`fade-wrapper ${visible ? "visible" : "hidden"}`}>
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
                      <Markdown>{sec}</Markdown>
                    ))}
                </section>
              );
            }

            // Si la sección es un array, mostrarlo como lista
            if (Array.isArray(sec)) {
              // renderizar arrays como listas Markdown para un render más rico
              const md = sec.map((it: any) => `- ${String(it)}`).join("\n");
              return (
                <section
                  id={`sec-${secKey}`}
                  key={secKey}
                  className="lesson-section spec-card"
                >
                  <h3>{title}</h3>
                  <Markdown>{md}</Markdown>
                </section>
              );
            }

            // Si es un objeto, iterar sus subsecciones (intro, theory, example...)
            const subsectionKeys = Object.keys(sec).filter(
              (k) => k !== "title"
            );
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
                        // renderizar arrays de subsecciones como Markdown (listas)
                        <Markdown>
                          {content.map((it: string) => `- ${it}`).join("\n")}
                        </Markdown>
                      ) : (
                        typeof content === "string" && (
                          <Markdown>{content}</Markdown>
                        )
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </main>
      <nav
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          marginTop: 18,
        }}
        aria-label="Navegación de lecciones"
      >
        {prevSlug ? (
          <Link
            to={`/${level}/${prevSlug}`}
            className="btn ghost"
            aria-label="Lección anterior"
          >
            ← Anterior
          </Link>
        ) : (
          <div />
        )}

        {nextSlug ? (
          <Link
            to={`/${level}/${nextSlug}`}
            className="btn primary"
            aria-label="Siguiente lección"
          >
            Siguiente →
          </Link>
        ) : (
          <div />
        )}
      </nav>
      <div style={{ display: "none" }} />
    </div>
  );
}
