import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // vamos criar um CSS simples para os estilos

const API_URL = "https://scoutlay-backend-wxnl.onrender.com/matches";

function App() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(API_URL);
        setMatches(res.data.matches || []);
      } catch (error) {
        console.error("Erro ao buscar partidas:", error);
      }
    };
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter((match) => {
    if (filter === "live") return match.status === "LIVE" || match.status === "IN_PLAY";
    if (filter === "upcoming") return match.status === "TIMED" || match.status === "SCHEDULED";
    if (filter === "strategy") return match.strategy; // só mostra se backend enviar sugestão
    return true;
  });

  return (
    <div className="container">
      <h1 className="title">⚽ ScoutLay</h1>

      <div className="filters">
        <button onClick={() => setFilter("all")}>📋 Todos</button>
        <button onClick={() => setFilter("live")}>🔥 Ao Vivo</button>
        <button onClick={() => setFilter("upcoming")}>⏳ Próximos</button>
        <button onClick={() => setFilter("strategy")}>🎯 Com Estratégia</button>
      </div>

      {filteredMatches.length === 0 ? (
        <p className="empty">Nenhuma partida encontrada no momento.</p>
      ) : (
        <div className="matches">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className={`match-card ${match.status.toLowerCase()}`}
            >
              <h3>
                {match.homeTeam?.name} vs {match.awayTeam?.name}
              </h3>
              <p>📅 {new Date(match.utcDate).toLocaleString()}</p>
              <p>
                {match.status === "LIVE" || match.status === "IN_PLAY"
                  ? "🔴 AO VIVO"
                  : match.status === "FINISHED"
                  ? "✅ Finalizado"
                  : "⏳ Agendado"}
              </p>

              {/* Estratégia sugerida pelo backend */}
              {match.strategy && (
                <div className="strategy">
                  <strong>🎯 Estratégia:</strong> {match.strategy.name}
                  <p>{match.strategy.reason}</p>
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
