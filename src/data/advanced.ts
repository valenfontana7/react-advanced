// Advanced React lessons content
import { LessonLevel } from "./types";

export const advancedContent: LessonLevel = {
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </BrowserRouter>
  )
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
function User(){ 
  const user = resource.read();
  return <div>Usuario: {user.name}</div>;
}`,
  },
  performance: {
    title: "Rendimiento y optimizaciones",
    intro:
      "Estrategias para optimizar el rendimiento: React.memo, useMemo, useCallback, lazy loading y profiling.",
    theory: [
      "React.memo previene re-renders innecesarios cuando las props no cambian",
      "useMemo y useCallback memoizan valores y funciones costosas",
      "Lazy loading y code-splitting reducen el bundle inicial",
    ],
    example: `import { memo, useMemo, useCallback } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    data.map(item => ({ ...item, processed: true })), 
    [data]
  );
  
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);
  
  return (
    <div>
      {processedData.map(item => 
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </div>
      )}
    </div>
  );
});
`,
    bestPractices: [
      "Usa React.memo solo cuando sea necesario - no optimices prematuramente",
      "Profila antes de optimizar para identificar cuellos de botella reales",
      "Considera el contexto de uso antes de aplicar memoización",
    ],
  },
  testing: {
    title: "Testing en React",
    intro:
      "Estrategias de testing: unit tests con Jest, integration tests con React Testing Library, y end-to-end con Cypress.",
    theory: [
      "Unit tests para lógica de componentes y custom hooks",
      "Integration tests para interacciones de usuario",
      "End-to-end tests para flujos críticos completos",
    ],
    example: `import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

test('increments counter on button click', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });
  const counter = screen.getByText(/count: 0/i);
  
  fireEvent.click(button);
  
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
`,
    bestPractices: [
      "Testea comportamiento, no implementación",
      "Usa queries por accesibilidad (getByRole, getByLabelText)",
      "Mockea dependencias externas apropiadamente",
    ],
  },
  "ssr-hydration": {
    title: "SSR y hydration",
    intro:
      "Server-side rendering (SSR) mejora la carga inicial; React hydration conecta el HTML prerenderizado con la interactividad del cliente.",
    theory: [
      "SSR renderiza componentes en el servidor y envía HTML completo",
      "Hydration 'hidrata' el HTML estático con event listeners y estado",
      "Next.js y Remix proporcionan SSR out-of-the-box",
    ],
    example: `// En Next.js
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

export default function Page({ data }) {
  return <div>{data.title}</div>;
}
`,
    bestPractices: [
      "Evita hydration mismatches manteniendo consistencia servidor-cliente",
      "Usa getServerSideProps o getStaticProps según necesidades",
      "Considera performance vs SEO al elegir CSR vs SSR",
    ],
  },
};
