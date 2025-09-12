import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await axios.get(
          "https://scoutlay-backend-wxnl.onrender.com/matches"
        );
        setMatches(res.data.matches || []);
      } catch (err) {
        console.error("Erro ao buscar partidas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
    const interval = setInterval(fetchMatches, 60000); // atualiza a cada 1min
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.loading}>⏳ Carregando partidas...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚽ ScoutLay</h1>
      <p style={styles.subtitle}>
        Jogos ao vivo e próximos + estratégias de trading
      </p>

      {matches.length === 0 ? (
        <p style={styles.noData}>Nenhuma partida encontrada.</p>
      ) : (
        <div style={styles.grid}>
          {matches.map((m) => (
            <div key={m.id} style={styles.card}>
              <h2 style={styles.match}>
                {m.homeTeam} <span style={styles.vs}>vs</span> {m.awayTeam}
              </h2>
              <p style={styles.info}>
                <strong>Status:</strong> {m.status} <br />
                <strong>Data:</strong>{" "}
                {new Date(m.utcDate).toLocaleString("pt-BR")}
              </p>

              {m.score?.fullTime && (
                <p style={styles.score}>
                  {m.score.fullTime.home ?? 0} - {m.score.fullTime.away ?? 0}
                </p>
              )}

              <h3 style={styles.strategyTitle}>📌 Estratégias</h3>
              {m.estrategias?.length > 0 ? (
                <ul style={styles.strategyList}>
                  {m.estrategias.map((e, idx) => (
                    <li key={idx} style={styles.strategyItem}>
                      ✅ {e}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={styles.noStrategy}>Sem estratégias no momento.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 🎨 Estilos inline
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "10px",
    color: "#1a73e8",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: "30px",
  },
  loading: {
    textAlign: "center",
    color: "#666",
  },
  noData: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#999",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
  },
  match: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    color: "#333",
  },
  vs: {
    color: "#888",
    fontWeight: "bold",
  },
  info: {
    color: "#555",
    marginBottom: "10px",
  },
  score: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#222",
    marginBottom: "15px",
  },
  strategyTitle: {
    marginTop: "10px",
    marginBottom: "5px",
    color: "#1a73e8",
  },
  strategyList: {
    listStyle: "none",
    paddingLeft: "0",
  },
  strategyItem: {
    backgroundColor: "#e8f0fe",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "5px",
    color: "#1a237e",
  },
  noStrategy: {
    color: "#999",
    fontStyle: "italic",
  },
};

export default App;
