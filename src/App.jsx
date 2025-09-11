
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE; // ex: https://scoutlay-backend.onrender.com

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const url = `${API_BASE}/matches`;
        const { data } = await axios.get(url);
        setMatches(data.matches || []);
      } catch (e) {
        setError(e?.response?.data?.error || e.message);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Inter, system-ui, Arial" }}>
      <h1>⚽ ScoutLay</h1>
      <p>Fonte: Football-Data.org (via seu backend)</p>

      {!API_BASE && (
        <p style={{ color: "crimson" }}>
          Defina a variável de ambiente <code>VITE_API_BASE</code> no Vercel apontando para o backend.
        </p>
      )}

      {loading && <p>Carregando partidas...</p>}
      {error && <p style={{ color: "crimson" }}>Erro: {String(error)}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 10 }}>
          {matches.length === 0 && <p>Nenhuma partida retornada.</p>}
          {matches.map((m) => (
            <div key={m.id} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
              <div style={{ fontSize: 14, opacity: 0.7 }}>{m.competition}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                {m.homeTeam} x {m.awayTeam}
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                {new Date(m.utcDate).toLocaleString()} — status: {m.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
