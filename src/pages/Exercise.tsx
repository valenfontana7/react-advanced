import React from "react";
import Counter from "../components/Counter";

export default function Exercise() {
  return (
    <section>
      <h3>Ejercicio práctico</h3>
      <p>Usa el contador para practicar state y props.</p>
      <Counter initial={5} />
    </section>
  );
}
