import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://scoutlay-backend-wxnl.onrender.com/matches";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("todos");

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

    const interval = setInterval(fetchMatches, 60000); // atualiza a cada 1 min
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("pt-BR", options);
  };

  const filteredMatches = matches.filter((match) => {
    if (filter === "ao_vivo") return match.status === "LIVE" || match.status === "IN_PLAY";
    if (filter === "proximos")
      return match.status === "TIMED" || match.status === "SCHEDULED";
    if (filter === "estrategia") return match.suggestedStrategy;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
        ⚽ <span>ScoutLay</span>
      </h1>

      {/* Botões de filtro */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setFilter("todos")}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("ao_vivo")}
          className="px-4 py-2 bg-red-200 text-red-700 font-semibold rounded-lg hover:bg-red-300"
        >
          🔥 Ao Vivo
        </button>
        <button
          onClick={() => setFilter("proximos")}
          className="px-4 py-2 bg-green-200 text-green-700 font-semibold rounded-lg hover:bg-green-300"
        >
          ⏳ Próximos
        </button>
        <button
          onClick={() => setFilter("estrategia")}
          className="px-4 py-2 bg-blue-200 text-blue-700 font-semibold rounded-lg hover:bg-blue-300"
        >
          🎯 Com Estratégia
        </button>
      </div>

      {/* Lista de partidas */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMatches.length === 0 && (
          <p className="text-gray-500 text-lg">
            Nenhuma partida encontrada no momento.
          </p>
        )}
        {filteredMatches.map((match, index) => (
          <div
            key={index}
            className="p-5 border rounded-xl shadow-lg hover:shadow-2xl transition bg-white"
          >
            <h2 className="text-lg font-bold mb-2">
              {match.homeTeam?.name} <span className="text-gray-500">vs</span>{" "}
              {match.awayTeam?.name}
            </h2>
            <p className="text-sm text-gray-600">
              {match.utcDate ? formatDate(match.utcDate) : "Sem data definida"}
            </p>

            <p
              className={`mt-2 font-bold ${
                match.status === "LIVE" || match.status === "IN_PLAY"
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              {match.status === "LIVE" || match.status === "IN_PLAY"
                ? "🔥 AO VIVO"
                : match.status === "TIMED"
                ? "⏳ Agendado"
                : match.status}
            </p>

            {match.suggestedStrategy && (
              <p className="mt-3 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Estratégia sugerida: {match.suggestedStrategy}
              </p>
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

