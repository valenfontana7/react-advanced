import React, { useState } from "react";

export default function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
