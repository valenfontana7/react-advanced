import React, { useState } from "react";

export default function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <div className="counter">
      <div>
        <p style={{ margin: 0, fontWeight: 700 }}>Contador</p>
        <div style={{ fontSize: 20 }}>{count}</div>
      </div>
      <div className="counter-controls">
        <button
          className="btn"
          aria-label="decrement"
          onClick={() => setCount((c) => c - 1)}
        >
          -
        </button>
        <button
          className="btn primary"
          aria-label="increment"
          onClick={() => setCount((c) => c + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
