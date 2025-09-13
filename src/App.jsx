import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://SEU_BACKEND.onrender.com/matches";

function App() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(API_URL);
        setMatches(response.data.matches || []);
      } catch (error) {
        console.error("Erro ao buscar partidas:", error);
      }
    };
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (filter === "LIVE") return m.status === "LIVE" || m.status === "IN_PLAY";
    if (filter === "UPCOMING") return m.status === "TIMED" || m.status === "SCHEDULED";
    if (filter === "STRATEGY") return m.estrategias && m.estrategias.length > 0;
    return true;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "30px", marginRight: "10px" }}>⚽</span>
        ScoutLay
      </h1>

      {/* Botões de filtro */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilter("ALL")}>Todos</button>
        <button onClick={() => setFilter("LIVE")}>Ao Vivo</button>
        <button onClick={() => setFilter("UPCOMING")}>Próximos</button>
        <button onClick={() => setFilter("STRATEGY")}>Com Estratégia</button>
      </div>

      {/* Lista de partidas */}
      {filteredMatches.length === 0 ? (
        <p>Nenhuma partida encontrada.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                background: "#f9f9f9",
              }}
            >
              <h3>
                {match.homeTeam} vs {match.awayTeam}
              </h3>
              <p>
                <b>Status:</b> {match.status}
              </p>
              <p>
                <b>Data/Hora:</b>{" "}
                {new Date(match.utcDate).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>

              {match.estrategias && match.estrategias.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <b>📊 Estratégias sugeridas:</b>
                  <ul>
                    {match.estrategias.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
