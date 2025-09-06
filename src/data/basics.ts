// Basic React lessons content
import { LessonLevel } from "./types";

export const basicsContent: LessonLevel = {
  jsx: {
    title: "JSX y componentes",
    intro:
      "JSX es la sintaxis recomendada para describir la UI en React. Aunque parece HTML, es azúcar sintáctico para llamadas a React.createElement y la base de todo desarrollo en React.",
    theory: [
      "JSX permite interpolar expresiones JavaScript dentro de llaves: { } y se transforma a llamadas a React.createElement durante la compilación.",
      "Los componentes funcionales son funciones que reciben props y retornan JSX; son la unidad básica de composición en React moderna.",
      "Cada elemento JSX debe tener un contenedor raíz único, o usar React.Fragment (<>) para evitar divs innecesarios.",
      "Las props en JSX siguen convención camelCase: className, onClick, htmlFor en lugar de class, onclick, for del HTML tradicional.",
      "JSX es más estricto que HTML: elementos como <img>, <input>, <br> deben cerrarse con />.",
      "Puedes usar cualquier expresión JavaScript válida dentro de {}: variables, funciones, operaciones, ternarios, etc.",
    ],
    example: `function Hello({ name, age, isActive }) {
  return (
    <div className={isActive ? 'user-active' : 'user-inactive'}>
      <h1>Hola, {name}!</h1>
      <p>Edad: {age} años</p>
      {age >= 18 && <span>✅ Mayor de edad</span>}
    </div>
  )
}

// Componente con Fragment
function UserInfo({ user }) {
  return (
    <>
      <h2>{user.name.toUpperCase()}</h2>
      <p>Email: {user.email}</p>
      <p>Registrado: {new Date(user.createdAt).toLocaleDateString()}</p>
    </>
  )
}

// Uso:
<Hello name="María" age={25} isActive={true} />`,
    commonMistakes: [
      "Usar 'class' en lugar de 'className'",
      "No cerrar elementos self-closing: <img> en lugar de <img />",
      "Intentar renderizar objetos directamente: {user} debe ser {user.name}",
      "Múltiples elementos raíz sin Fragment: usar <> para envolver",
      "Usar 'for' en lugar de 'htmlFor' en labels",
    ],
    bestPractices: [
      "Mantén JSX legible: extrae lógica compleja a variables antes del return",
      "Usa fragmentos (<>) cuando no necesites un div contenedor",
      "Prefiere ternarios para condicionales simples: {condition ? 'Si' : 'No'}",
      "Para listas usa && para mostrar/ocultar: {items.length > 0 && <Lista />}",
    ],
    quiz: {
      id: "jsx-basics",
      title: "Quiz: JSX y Componentes",
      timeLimit: 5, // 5 minutos
      passingScore: 70,
      questions: [
        {
          id: "jsx-1",
          type: "multiple-choice",
          question:
            "¿Cuál es la sintaxis correcta para usar una expresión JavaScript en JSX?",
          options: [
            "{{ expression }}",
            "{ expression }",
            "[expression]",
            "<expression>",
          ],
          correctAnswer: 1,
          explanation:
            "En JSX, las expresiones JavaScript se envuelven con llaves simples: { expression }",
        },
        {
          id: "jsx-2",
          type: "multiple-choice",
          question:
            "¿Cuál es la forma correcta de especificar una clase CSS en JSX?",
          options: [
            "class='mi-clase'",
            "className='mi-clase'",
            "css='mi-clase'",
            "style='mi-clase'",
          ],
          correctAnswer: 1,
          explanation:
            "En JSX usamos 'className' en lugar de 'class' porque 'class' es una palabra reservada en JavaScript.",
        },
        {
          id: "jsx-3",
          type: "multiple-choice",
          question:
            "¿Qué elemento necesitas usar cuando quieres devolver múltiples elementos sin un div contenedor?",
          options: ["<container>", "<Fragment> o <>", "<div>", "<wrapper>"],
          correctAnswer: 1,
          explanation:
            "React.Fragment (o la sintaxis corta <>) permite agrupar elementos sin agregar nodos extra al DOM.",
        },
        {
          id: "jsx-4",
          type: "true-false",
          question: "Los elementos self-closing en JSX deben cerrarse con />",
          correctAnswer: true,
          explanation:
            "Sí, JSX es más estricto que HTML. Elementos como <img>, <input>, <br> deben cerrarse con />.",
        },
        {
          id: "jsx-5",
          type: "multiple-choice",
          question:
            "¿Cuál de estas expresiones JSX es válida para renderizado condicional?",
          code: "const isLoggedIn = true;\nconst user = { name: 'Ana' };",
          options: [
            "{isLoggedIn && <p>Bienvenido {user.name}</p>}",
            "{isLoggedIn ? <p>Bienvenido {user.name}</p> : null}",
            "{isLoggedIn && <p>Bienvenido {user.name}</p>}",
            "Todas son válidas",
          ],
          correctAnswer: 3,
          explanation:
            "Todas las opciones son formas válidas de renderizado condicional en React.",
        },
      ],
    },
  },
  lifecycle: {
    title: "Ciclo de vida y efectos (useEffect)",
    intro:
      "useEffect reemplaza los métodos de ciclo de vida en componentes funcionales y permite sincronizar efectos secundarios como peticiones API, suscripciones y manipulación del DOM.",
    theory: [
      "useEffect se ejecuta después del render y puede devolver una función de limpieza para prevenir memory leaks.",
      "Array de dependencias vacío [] simula componentDidMount (una sola ejecución).",
      "Array con dependencias [value] simula componentDidUpdate solo cuando esas dependencias cambian.",
      "Sin array de dependencias se ejecuta en cada render (equivale a componentDidMount + componentDidUpdate).",
      "La función de limpieza se ejecuta antes del siguiente efecto y cuando el componente se desmonta.",
      "Múltiples useEffect permiten separar diferentes responsabilidades.",
    ],
    example: `import { useEffect, useState } from 'react'

function Clock() {
  const [now, setNow] = useState(() => new Date());
  
  useEffect(() => {
    console.log('Componente montado')
    const t = setInterval(() => setNow(new Date()), 1000)
    
    // Función de limpieza
    return () => {
      console.log('Componente desmontado')
      clearInterval(t)
    }
  }, []) // Array vacío = solo una vez

  return <time>{now.toLocaleTimeString()}</time>
}

// Ejemplo con dependencias
function UserGreeting({ userId }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(setUser)
  }, [userId]) // Se ejecuta cuando userId cambia
  
  return user ? <h1>Hola, {user.name}!</h1> : <div>Cargando...</div>
}`,
    commonMistakes: [
      "Omitir dependencias en el array, causando bugs de sincronización",
      "No limpiar timers, suscripciones o event listeners",
      "Crear loops infinitos al no controlar las dependencias",
      "Usar objetos o arrays como dependencias sin memoización",
      "Hacer efectos muy complejos en lugar de separarlos",
    ],
    bestPractices: [
      "Usa el eslint-plugin-react-hooks para detectar errores de dependencias",
      "Separa efectos por responsabilidad: datos, suscripciones, DOM",
      "Siempre limpia recursos: timers, listeners, requests cancelables",
      "Considera custom hooks para lógica de efectos reutilizable",
      "Para efectos costosos, usa useMemo/useCallback para optimizar",
    ],
  },
  composition: {
    title: "Composición de componentes",
    intro:
      "Prefiere composición sobre herencia: combinar componentes pequeños para crear interfaces complejas y reutilizables. La composición es el patrón fundamental de React para crear arquitecturas escalables.",
    theory: [
      "Props children permite que componentes contengan y rendericen otros componentes de forma flexible.",
      "Render props y children as function patterns permiten compartir lógica entre componentes.",
      "Higher-Order Components (HOCs) envuelven componentes para agregar funcionalidad adicional.",
      "Compound components permiten crear APIs de componentes más expresivas y flexibles.",
      "La composición reduce acoplamiento y aumenta la reutilización de código.",
    ],
    example: `// Composición básica con children
function Card({ children, title, className = '' }) {
  return (
    <div className={\`card \${className}\`}>
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}

// Uso flexible
function UserProfile({ user }) {
  return (
    <Card title="Perfil de Usuario" className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <p>{user.bio}</p>
      <button>Seguir</button>
    </Card>
  )
}

// Compound components
function Tabs({ children, activeTab, onTabChange }) {
  return (
    <div className="tabs">
      {children}
    </div>
  )
}

function Tab({ id, label, isActive, onClick, children }) {
  return (
    <div className="tab">
      <button 
        className={isActive ? 'tab-button active' : 'tab-button'}
        onClick={() => onClick(id)}
      >
        {label}
      </button>
      {isActive && <div className="tab-content">{children}</div>}
    </div>
  )
}

// Layout components
function Layout({ children, sidebar }) {
  return (
    <div className="layout">
      <aside className="sidebar">{sidebar}</aside>
      <main className="main">{children}</main>
    </div>
  )
}`,
    commonMistakes: [
      "Crear jerarquías profundas de herencia en lugar de composición",
      "No usar children props cuando es apropiado",
      "Hacer componentes demasiado específicos en lugar de composables",
      "Duplicar lógica en lugar de extraerla a componentes reutilizables",
      "No pensar en la API del componente desde la perspectiva del usuario",
    ],
    bestPractices: [
      "Diseña componentes como 'cajas' que pueden contener cualquier contenido",
      "Usa render props para compartir lógica stateful entre componentes",
      "Crea compound components para APIs más expresivas",
      "Prefiere many small components sobre few large components",
      "Piensa en composición desde el diseño: ¿qué partes son reutilizables?",
    ],
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
      "Cómo mostrar u ocultar elementos en función de estado o props usando condicionales, operadores ternarios y técnicas avanzadas para crear interfaces dinámicas.",
    theory: [
      "Operador && para renderizado condicional simple: {condition && <Component />}",
      "Operador ternario para alternativas: {condition ? <A /> : <B />}",
      "Extraer lógica compleja a funciones para mantener JSX limpio y legible",
      "Usar variables para almacenar elementos complejos antes del return",
      "Early returns para simplificar componentes con muchas condiciones",
      "Null, undefined y false no se renderizan, pero 0 y strings vacías sí",
    ],
    example: `// Técnicas básicas
function UserStatus({ user, isLoggedIn }) {
  // Early return
  if (!user) {
    return <div>No hay usuario</div>
  }

  return (
    <div>
      {/* Operador && */}
      {isLoggedIn && <p>Bienvenido, {user.name}!</p>}
      
      {/* Operador ternario */}
      {user.isPremium ? (
        <span className="badge premium">⭐ Premium</span>
      ) : (
        <span className="badge">Usuario básico</span>
      )}
      
      {/* Múltiples condiciones */}
      {user.notifications.length > 0 && (
        <div className="notifications">
          Tienes {user.notifications.length} notificaciones
        </div>
      )}
    </div>
  )
}

// Lógica compleja extraída
function Dashboard({ user, permissions }) {
  const canEdit = permissions.includes('edit')
  const canDelete = permissions.includes('delete')
  const hasContent = user.posts.length > 0

  const renderActions = () => {
    if (!canEdit && !canDelete) return null
    
    return (
      <div className="actions">
        {canEdit && <button>Editar</button>}
        {canDelete && <button>Eliminar</button>}
      </div>
    )
  }

  const renderContent = () => {
    if (!hasContent) {
      return <EmptyState message="No hay contenido aún" />
    }

    return (
      <div className="content">
        {user.posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {renderActions()}
      {renderContent()}
    </div>
  )
}

// Renderizado por switch-case simulado
function StatusIndicator({ status }) {
  const statusComponents = {
    loading: <Spinner />,
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    pending: <PendingIcon />
  }
  
  return statusComponents[status] || <div>Estado desconocido</div>
}`,
    commonMistakes: [
      "Usar números como condición: {count && <div />} puede renderizar 0",
      "Operadores ternarios anidados que vuelven el código ilegible",
      "No manejar casos edge como null, undefined o arrays vacíos",
      "Crear componentes muy largos con muchas condiciones inline",
      "Olvidar que false, null, undefined no se renderizan pero 0 sí",
    ],
    bestPractices: [
      "Usa !! para convertir números a boolean: {!!count && <Component />}",
      "Extrae lógica condicional compleja a funciones separadas",
      "Considera early returns para simplificar el flujo",
      "Usa variables para almacenar JSX complejo antes del return",
      "Para muchas condiciones, considera usar objetos lookup o switch",
    ],
  },
  "lists-keys": {
    title: "Listas y keys",
    intro:
      "Renderizar listas dinámicas con map y usar keys estables para ayudar a React a reconciliar elementos eficientemente y mantener el estado correcto.",
    theory: [
      "Las keys ayudan a React a identificar qué elementos han cambiado, sido agregados o eliminados",
      "Usa IDs únicos y estables como keys, no índices del array cuando el orden puede cambiar",
      "Los índices como keys pueden causar bugs de rendimiento y estado incorrecto",
      "Keys deben ser únicas entre hermanos, pero pueden repetirse en diferentes niveles",
      "React usa keys para optimizar re-renders y mantener estado de componentes",
      "Para listas que no cambian de orden, los índices son aceptables como keys",
    ],
    example: `// Lista básica con keys apropiadas
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <input 
            type="checkbox" 
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  )
}

// Lista con componentes complejos
function UserList({ users, onUserSelect }) {
  return (
    <div className="user-grid">
      {users.map(user => (
        <UserCard 
          key={user.id}
          user={user}
          onClick={() => onUserSelect(user.id)}
        />
      ))}
    </div>
  )
}

// Manejo de listas vacías y loading
function ProductList({ products, loading, error }) {
  if (loading) return <div>Cargando productos...</div>
  if (error) return <div>Error: {error.message}</div>
  if (products.length === 0) return <div>No hay productos disponibles</div>

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">\${product.price}</p>
          <button>Agregar al carrito</button>
        </div>
      ))}
    </div>
  )
}

// Agrupación y listas anidadas
function OrderHistory({ orders }) {
  const groupedOrders = groupOrdersByMonth(orders)
  
  return (
    <div>
      {Object.entries(groupedOrders).map(([month, monthOrders]) => (
        <div key={month} className="month-group">
          <h2>{month}</h2>
          {monthOrders.map(order => (
            <div key={order.id} className="order-summary">
              <span>Orden #{order.number}</span>
              <span>{order.total}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Lista con filtrado
function FilterableList({ items, searchTerm }) {
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <p>Mostrando {filteredItems.length} de {items.length} elementos</p>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.description}
          </li>
        ))}
      </ul>
    </div>
  )
}`,
    commonMistakes: [
      "Usar índices como keys cuando el orden de la lista puede cambiar",
      "Crear keys dinámicas con Math.random() que cambian en cada render",
      "No manejar listas vacías o estados de loading/error",
      "Usar keys no únicas o duplicadas entre elementos hermanos",
      "Renderizar listas muy grandes sin virtualización",
    ],
    bestPractices: [
      "Siempre usa IDs únicos y estables como keys cuando estén disponibles",
      "Para listas generadas, crea IDs consistentes combinando datos únicos",
      "Maneja siempre los casos edge: listas vacías, loading, errores",
      "Para listas largas (>100 elementos), considera virtualización",
      "Usa useMemo para listas costosas de calcular o filtrar",
    ],
  },
  "lifting-state": {
    title: "Elevar estado (Lifting State Up)",
    intro:
      "Compartir estado entre componentes hermanos elevando el estado al ancestro común y pasando props y callbacks. Es un patrón fundamental para la comunicación entre componentes.",
    theory: [
      "Cuando dos componentes necesitan el mismo estado, muévelo al ancestor común más cercano",
      "El componente padre mantiene el estado y pasa tanto el valor como las funciones para actualizarlo",
      "Los componentes hijos reciben el estado como props y callbacks para modificarlo",
      "Este patrón mantiene un flujo de datos unidireccional y predecible",
      "Para estados complejos compartidos, considera Context API o librerías de estado global",
      "El estado debe vivir en el nivel más bajo posible donde todos los componentes que lo necesitan puedan acceder",
    ],
    example: `// Ejemplo básico: Filtro y lista compartiendo estado
function SearchableProductList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [products] = useState(MOCK_PRODUCTS)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'all' || product.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="product-page">
      <SearchFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
      />
      <ProductList products={filteredProducts} />
      <ResultsCount count={filteredProducts.length} total={products.length} />
    </div>
  )
}

function SearchFilters({ searchTerm, onSearchChange, category, onCategoryChange }) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="all">Todas las categorías</option>
        <option value="electronics">Electrónicos</option>
        <option value="clothing">Ropa</option>
        <option value="books">Libros</option>
      </select>
    </div>
  )
}

// Ejemplo avanzado: Shopping cart state
function ShoppingApp() {
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <div className="shopping-app">
      <Header user={user} cartItemsCount={cartItems.length} />
      <ProductCatalog onAddToCart={addToCart} />
      <ShoppingCart 
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
      />
    </div>
  )
}

// Comunicación entre componentes hermanos complejos
function ChatApp() {
  const [messages, setMessages] = useState([])
  const [activeRoom, setActiveRoom] = useState('general')
  const [onlineUsers, setOnlineUsers] = useState([])

  const sendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      room: activeRoom,
      timestamp: new Date(),
      user: 'current-user'
    }
    setMessages(prev => [...prev, newMessage])
  }

  const roomMessages = messages.filter(msg => msg.room === activeRoom)

  return (
    <div className="chat-app">
      <RoomList 
        activeRoom={activeRoom} 
        onRoomChange={setActiveRoom} 
      />
      <MessageList messages={roomMessages} />
      <UserList users={onlineUsers} />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  )
}`,
    commonMistakes: [
      "Pasar demasiadas props por múltiples niveles (prop drilling)",
      "No elevar el estado lo suficiente cuando múltiples componentes lo necesitan",
      "Elevar estado demasiado alto, haciendo re-renders innecesarios",
      "Mutar el estado directamente en lugar de usar las funciones setter",
      "No usar funciones callback para updates que dependen del estado previo",
    ],
    bestPractices: [
      "Mantén el estado en el nivel más bajo posible donde sea accesible por todos los que lo necesitan",
      "Usa Context API cuando tengas que pasar props por muchos niveles",
      "Considera bibliotecas de estado (Zustand, Redux) para estados complejos globales",
      "Usa callbacks con estado previo para updates que dependen del estado actual",
      "Agrupa estado relacionado en objetos o usa useReducer para lógica compleja",
    ],
  },
  styling: {
    title: "Estilos en React",
    intro:
      "Múltiples estrategias para estilos en React: CSS tradicional, módulos CSS, styled-components, Tailwind, y CSS-in-JS. Cada enfoque tiene sus trade-offs en mantenibilidad, rendimiento y developer experience.",
    theory: [
      "CSS tradicional: archivos .css externos, simple pero sin scoping automático",
      "CSS Modules: scoping automático, nombres de clase únicos, mejor para componentes",
      "Styled-components: CSS-in-JS con theming, props dinámicas y scoping automático",
      "Tailwind CSS: utility-first, rápido desarrollo, diseño consistente",
      "Inline styles: dinámicos pero limitados, no soportan pseudo-clases ni media queries",
      "CSS-in-JS libraries: emotion, stitches, styled-system para casos avanzados",
    ],
    example: `// 1. CSS Modules
import styles from './Button.module.css'

function Button({ variant, children }) {
  return (
    <button className={\`\${styles.button} \${styles[variant]}\`}>
      {children}
    </button>
  )
}

// 2. Styled Components
import styled from 'styled-components'

const StyledButton = styled.button\`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: \${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: \${props => props.primary ? '#0056b3' : '#545b62'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
\`

// 3. Tailwind CSS
function TailwindButton({ primary, children, ...props }) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200"
  const variantClasses = primary 
    ? "bg-blue-600 hover:bg-blue-700 text-white" 
    : "bg-gray-600 hover:bg-gray-700 text-white"
  
  return (
    <button 
      className={\`\${baseClasses} \${variantClasses}\`}
      {...props}
    >
      {children}
    </button>
  )
}

// 4. Dynamic inline styles
function ProgressBar({ progress, color = '#007bff' }) {
  return (
    <div style={{
      width: '100%',
      height: '8px',
      backgroundColor: '#e9ecef',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: \`\${progress}%\`,
        height: '100%',
        backgroundColor: color,
        transition: 'width 0.3s ease'
      }} />
    </div>
  )
}

// 5. CSS-in-JS con emotion
import { css } from '@emotion/react'

const buttonStyle = (theme, variant) => css\`
  padding: \${theme.spacing.md};
  border: none;
  border-radius: \${theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  \${variant === 'primary' && \`
    background: \${theme.colors.primary};
    color: white;
    &:hover {
      background: \${theme.colors.primaryDark};
    }
  \`}
  
  \${variant === 'secondary' && \`
    background: transparent;
    color: \${theme.colors.primary};
    border: 2px solid \${theme.colors.primary};
    &:hover {
      background: \${theme.colors.primary};
      color: white;
    }
  \`}
\`

// 6. Conditional classes with clsx
import clsx from 'clsx'

function Card({ className, highlighted, loading, children }) {
  return (
    <div className={clsx(
      'card',
      'p-4 rounded-lg shadow-sm border',
      {
        'border-blue-500 bg-blue-50': highlighted,
        'opacity-50 pointer-events-none': loading,
      },
      className
    )}>
      {children}
    </div>
  )
}`,
    commonMistakes: [
      "Mezclar diferentes estrategias de estilos sin criterio consistente",
      "Usar inline styles para todo, perdiendo capacidades de CSS",
      "No aprovechar CSS variables para theming dinámico",
      "Crear estilos no reutilizables o demasiado específicos",
      "No considerar el performance impact de CSS-in-JS libraries",
    ],
    bestPractices: [
      "Elige una estrategia principal y mantén consistencia en el proyecto",
      "Usa CSS Variables para theming y valores dinámicos",
      "Combina utility classes con componentes styled para mayor flexibilidad",
      "Considera el bundle size impact de CSS-in-JS libraries",
      "Usa herramientas como clsx para conditional classes complejas",
      "Implementa design tokens para mantener consistencia visual",
    ],
  },
  forms: {
    title: "Formularios y manejo de inputs",
    intro:
      "Manejo de formularios en React usando componentes controlados, validación, y técnicas avanzadas para crear experiencias de usuario fluidas y accesibles.",
    theory: [
      "Componentes controlados: React controla el valor del input através del state y onChange",
      "Componentes no controlados: el DOM mantiene el estado, acceso via refs (menos común)",
      "Validación en tiempo real vs validación al enviar el formulario",
      "Para formularios complejos, bibliotecas como React Hook Form optimizan rendimiento",
      "Manejo de archivos requiere técnicas especiales (FileReader API)",
      "Accesibilidad: labels apropiados, ARIA attributes, manejo de errores",
    ],
    example: `import { useState } from 'react'

// Formulario básico controlado
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido'
    } else if (formData.message.length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres'
    }
    
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    try {
      await submitContactForm(formData)
      alert('Formulario enviado exitosamente!')
      setFormData({ name: '', email: '', message: '', subscribe: false })
    } catch (error) {
      alert('Error enviando formulario: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Nombre *</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="error-message" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="error-message" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message">Mensaje *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={errors.message ? 'error' : ''}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span id="message-error" className="error-message" role="alert">
            {errors.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            name="subscribe"
            type="checkbox"
            checked={formData.subscribe}
            onChange={handleChange}
          />
          Suscribirse al newsletter
        </label>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}

// Custom hook para formularios
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (onSubmit) => {
    const validationErrors = validate(values)
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors
  }
}`,
    commonMistakes: [
      "No validar datos tanto en cliente como en servidor",
      "Usar índices como keys en formularios dinámicos",
      "No manejar el estado de loading durante el envío",
      "Olvidar preventDefault() en el handler onSubmit",
      "No proporcionar feedback visual para errores de validación",
      "No hacer formularios accesibles con labels y ARIA attributes",
    ],
    bestPractices: [
      "Siempre usa componentes controlados para mejor control del estado",
      "Implementa validación en tiempo real para mejor UX",
      "Usa custom hooks para lógica reutilizable de formularios",
      "Proporciona feedback claro sobre errores y estado de envío",
      "Hace formularios accesibles con labels, ARIA y navegación por teclado",
      "Considera librerías como React Hook Form para formularios complejos",
    ],
  },
  "props-state": {
    title: "Props y State",
    intro:
      "Props y state son los dos mecanismos fundamentales para manejar datos en React. Props fluyen hacia abajo desde componentes padre, mientras que state es local y mutable dentro del componente.",
    theory: [
      "Props: datos inmutables que vienen del componente padre; permiten parametrizar y personalizar componentes",
      "State: datos mutables locales al componente que pueden cambiar con el tiempo y triggear re-renders",
      "Props permiten la comunicación padre → hijo; callbacks en props permiten comunicación hijo → padre",
      "State debe ser mínimo y derivable; evita duplicar datos que se pueden calcular",
      "useState para state simple; useReducer para state complejo con múltiples acciones",
      "Immutabilidad: nunca mutes state directamente, siempre usa setters con nuevos valores",
    ],
    example: `import { useState } from 'react'

// Componente con props y state local
function UserProfile({ user, theme, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempData, setTempData] = useState({})

  const startEditing = () => {
    setIsEditing(true)
    setTempData({
      name: user.name,
      email: user.email,
      bio: user.bio
    })
  }

  const saveChanges = () => {
    onUserUpdate(tempData) // Comunicación hijo → padre
    setIsEditing(false)
    setTempData({})
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setTempData({})
  }

  return (
    <div className={\`profile \${theme}\`}>
      {!isEditing ? (
        // Modo visualización - solo props
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p>{user.bio}</p>
          <button onClick={startEditing}>Editar</button>
        </div>
      ) : (
        // Modo edición - state temporal
        <div>
          <input
            value={tempData.name}
            onChange={(e) => setTempData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre"
          />
          <input
            value={tempData.email}
            onChange={(e) => setTempData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
          />
          <textarea
            value={tempData.bio}
            onChange={(e) => setTempData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Biografía"
          />
          <button onClick={saveChanges}>Guardar</button>
          <button onClick={cancelEditing}>Cancelar</button>
        </div>
      )}
    </div>
  )
}

// Componente padre que maneja el estado y pasa props
function App() {
  const [user, setUser] = useState({
    id: 1,
    name: 'Ana García',
    email: 'ana@example.com',
    bio: 'Desarrolladora Frontend apasionada por React'
  })
  const [theme, setTheme] = useState('light')

  const handleUserUpdate = (updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }))
  }

  return (
    <div className="app">
      <header>
        <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
          Cambiar tema
        </button>
      </header>
      
      <UserProfile 
        user={user}           {/* Props: datos del usuario */}
        theme={theme}         {/* Props: configuración UI */}
        onUserUpdate={handleUserUpdate} {/* Props: callback */}
      />
    </div>
  )
}

// Ejemplo avanzado: Derived state y computed values
function ShoppingCart({ items }) {
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)

  // Computed values derivados de props y state
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = appliedDiscount ? subtotal * (appliedDiscount.percentage / 100) : 0
  const total = subtotal - discountAmount
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const applyDiscount = async () => {
    try {
      const discount = await validateDiscountCode(discountCode)
      setAppliedDiscount(discount)
    } catch (error) {
      alert('Código de descuento inválido')
    }
  }

  return (
    <div className="cart">
      <h2>Carrito ({itemCount} items)</h2>
      
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>{item.quantity} x \${item.price}</span>
        </div>
      ))}
      
      <div className="totals">
        <div>Subtotal: \${subtotal.toFixed(2)}</div>
        {appliedDiscount && (
          <div>Descuento ({appliedDiscount.percentage}%): -\${discountAmount.toFixed(2)}</div>
        )}
        <div className="total">Total: \${total.toFixed(2)}</div>
      </div>
      
      <div className="discount">
        <input
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          placeholder="Código de descuento"
        />
        <button onClick={applyDiscount}>Aplicar</button>
      </div>
    </div>
  )
}`,
    commonMistakes: [
      "Mutar props directamente en lugar de usar callbacks para comunicar cambios",
      "Duplicar datos de props en state local cuando no es necesario",
      "Crear state para valores que se pueden calcular/derivar de props o state existente",
      "No inicializar state correctamente con valores de props cuando es apropiado",
      "Usar state para datos que no afectan el render (usar useRef en su lugar)",
    ],
    bestPractices: [
      "Mantén state mínimo: solo datos que no se pueden derivar de otras fuentes",
      "Usa callbacks en props para comunicación hijo → padre",
      "Prefiere computed values sobre state adicional para datos derivados",
      "Inicializa state con props cuando necesites un valor 'editable' local",
      "Considera 'lifting state up' cuando múltiples componentes necesiten los mismos datos",
      "Usa useReducer para state complejo con múltiples acciones relacionadas",
    ],
    quiz: {
      id: "props-state",
      title: "Quiz: Props y State",
      timeLimit: 7, // 7 minutos
      passingScore: 75,
      questions: [
        {
          id: "props-1",
          type: "multiple-choice",
          question: "¿Cuál es la principal diferencia entre props y state?",
          options: [
            "Props son para estilos, state para datos",
            "Props son inmutables desde el componente, state es mutable",
            "Props solo aceptan strings, state cualquier tipo",
            "No hay diferencia, son sinónimos",
          ],
          correctAnswer: 1,
          explanation:
            "Props son datos que recibe un componente y no puede modificar. State es datos internos que el componente puede cambiar.",
        },
        {
          id: "props-2",
          type: "multiple-choice",
          question: "¿Cuál es la forma correcta de actualizar el state?",
          code: "const [count, setCount] = useState(0);",
          options: [
            "count = count + 1",
            "setCount(count + 1)",
            "count++",
            "useState(count + 1)",
          ],
          correctAnswer: 1,
          explanation:
            "Siempre usa la función setter (setCount) para actualizar el state. Nunca modifiques directamente la variable.",
        },
        {
          id: "props-3",
          type: "true-false",
          question:
            "Es buena práctica pasar una función como prop para que el componente hijo comunique cambios al padre.",
          correctAnswer: true,
          explanation:
            "Sí, es el patrón estándar de comunicación hijo → padre en React: 'lifting state up'.",
        },
        {
          id: "props-4",
          type: "multiple-choice",
          question: "¿Qué sucede cuando un componente recibe nuevas props?",
          options: [
            "Se destruye y crea uno nuevo",
            "Se re-renderiza automáticamente",
            "No pasa nada hasta que llames a render()",
            "Solo se actualiza el DOM, no el componente",
          ],
          correctAnswer: 1,
          explanation:
            "Cuando las props cambian, React automáticamente re-renderiza el componente con los nuevos valores.",
        },
        {
          id: "props-5",
          type: "multiple-choice",
          question:
            "¿Cuál es la mejor práctica para valores derivados/computados?",
          code: "const items = [...];\n// ¿Cómo obtener el total?",
          options: [
            "Guardar el total en state separado",
            "Calcular en useEffect y actualizar state",
            "Calcular directamente en el render",
            "Usar una variable global",
          ],
          correctAnswer: 2,
          explanation:
            "Para valores derivados, calcula directamente en el render en lugar de duplicar en state: const total = items.reduce(...).",
        },
        {
          id: "props-6",
          type: "multiple-choice",
          question: "¿Cuándo deberías 'levantar el state' (lifting state up)?",
          options: [
            "Cuando un componente tiene mucho state",
            "Cuando múltiples componentes necesitan compartir el mismo dato",
            "Cuando el state es muy complejo",
            "Siempre, en todos los casos",
          ],
          correctAnswer: 1,
          explanation:
            "Levanta el state al componente padre común más cercano cuando múltiples hermanos necesitan compartir datos.",
        },
      ],
    },
  },
};
