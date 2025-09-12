import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMatches() {
    try {
      const res = await fetch(`${API_BASE}/matches`);
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Erro ao buscar jogos", err);
    }
  }

  const filteredMatches = matches.filter((m) => {
    if (filter === "LIVE") return m.status === "LIVE";
    if (filter === "SCHEDULED") return m.status === "SCHEDULED";
    if (filter === "ESTRATEGIAS") return m.estrategias?.length > 0;
    return true;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">⚽ ScoutLay</h1>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {["ALL", "LIVE", "SCHEDULED", "ESTRATEGIAS"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {f === "ALL" ? "Todos" : f === "LIVE" ? "Ao Vivo" : f === "SCHEDULED" ? "Próximos" : "Com Estratégia"}
          </button>
        ))}
      </div>

      {/* Lista de jogos */}
      <div className="grid gap-4">
        {filteredMatches.map((m) => (
          <div
            key={m.id}
            className="p-4 border rounded shadow cursor-pointer bg-white"
            onClick={() => setExpanded(expanded === m.id ? null : m.id)}
          >
            <div className="flex justify-between items-center">
              <span>
                {m.homeTeam.name} vs {m.awayTeam.name}
              </span>
              <span>
                {m.score.fullTime.home} - {m.score.fullTime.away}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {m.status === "LIVE"
                ? `🔴 Ao Vivo — ${m.liveStats.minute}'`
                : m.status === "SCHEDULED"
                ? `⏳ Agendado para ${new Date(m.utcDate).toLocaleString()}`
                : m.status}
            </p>

            {expanded === m.id && (
              <div className="mt-4 text-sm">
                <h3 className="font-semibold mb-2">📊 Estatísticas ao vivo</h3>
                <ul className="mb-4">
                  <li>Minuto: {m.liveStats.minute}'</li>
                  <li>Total de gols: {m.liveStats.goalsTotal}</li>
                  {m.liveStats.lastGoalTime && <li>Último gol: {m.liveStats.lastGoalTime}'</li>}
                </ul>

                <h3 className="font-semibold mb-2">📈 Estatísticas recentes</h3>
                <ul className="mb-4">
                  <li>Mandante (últimos 5): {m.homeStats.last5.goalsFor} gols</li>
                  <li>Visitante (últimos 5): {m.awayStats.last5.goalsFor} gols</li>
                </ul>

                {m.estrategias?.length > 0 ? (
                  <div>
                    <h3 className="font-semibold mb-2">🎯 Estratégias sugeridas</h3>
                    <ul>
                      {m.estrategias.map((e, idx) => (
                        <li key={idx} className="mb-1">
                          <strong>{e.label}</strong> → {e.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="italic text-gray-500">Nenhuma estratégia sugerida.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const btn = { margin:'0 6px', padding:'8px 14px', borderRadius:6, border:'1px solid #1a73e8', background:'#fff', color:'#1a73e8', cursor:'pointer' }
const activeBtn = { ...btn, background:'#1a73e8', color:'#fff', fontWeight:700 }
const cardStyle = { background:'#fff', borderRadius:12, padding:16, boxShadow:'0 6px 18px rgba(0,0,0,0.06)', cursor:'pointer' }

