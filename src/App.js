
import React, { useState } from "react";

function App() {
  const [flessen, setFlessen] = useState(0);
  const [lotAantal, setLotAantal] = useState(0);

  const planOphaalronde = () => {
    setFlessen(flessen + 20);
    setLotAantal(lotAantal + 1);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "green", fontSize: "2rem", textAlign: "center" }}>Statielot App</h1>
      <div style={{ background: "#f1f1f1", borderRadius: "12px", padding: "1.5rem", marginTop: "2rem" }}>
        <h2>Jouw Statistieken</h2>
        <p>Totaal flessen/blikjes ingeleverd: <strong>{flessen}</strong></p>
        <p>Totaal ontvangen Staatsloten: <strong>{lotAantal}</strong></p>
        <p>Geschatte CO2-besparing: <strong>{(flessen * 0.03).toFixed(2)} kg</strong></p>
        <button
          onClick={planOphaalronde}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Plan nieuwe ophaalronde
        </button>
      </div>
    </div>
  );
}

export default App;
