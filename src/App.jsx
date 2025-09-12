import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

function StrategyBadge({ strat }){
  const color = strat.code && strat.code.startsWith('UNDER') ? '#ff9800' : '#1a73e8';
  return (
    <div style={{ background: color + '20', color, padding: '6px 10px', borderRadius: 6, display: 'inline-block', marginRight:8 }}>
      {strat.label}
    </div>
  );
}

function MatchDetails({ match }){
  const [homeStats, setHomeStats] = useState(null);
  const [awayStats, setAwayStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let mounted = true;
    async function load(){
      setLoading(true);
      try{
        const [h, a] = await Promise.all([
          axios.get(`${API_BASE}/stats/${match.homeTeam.id}`),
          axios.get(`${API_BASE}/stats/${match.awayTeam.id}`)
        ]);
        if(!mounted) return;
        setHomeStats(h.data);
        setAwayStats(a.data);
      }catch(e){ console.error('stats load error', e); }
      finally{ setLoading(false); }
    }
    load();
    return ()=> mounted = false;
  }, [match]);

  return (
    <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid #eee' }}>
      <h4>📊 Estatísticas</h4>
      {loading && <div>Carregando estatísticas...</div>}
      {!loading && homeStats && awayStats && (
        <div style={{ display:'flex', gap:20 }}>
          <div style={{ flex:1 }}>
            <h5>{match.homeTeam.name}</h5>
            <div>Últimos 5 (avg gols): {homeStats.last5.avgGoalsFor.toFixed(2)}</div>
            <div>Últimos 10 (avg gols): {homeStats.last10.avgGoalsFor.toFixed(2)}</div>
            <div>Temporada (avg gols): {homeStats.temporada.avgGoalsFor.toFixed(2)}</div>
          </div>
          <div style={{ flex:1 }}>
            <h5>{match.awayTeam.name}</h5>
            <div>Últimos 5 (avg gols): {awayStats.last5.avgGoalsFor.toFixed(2)}</div>
            <div>Últimos 10 (avg gols): {awayStats.last10.avgGoalsFor.toFixed(2)}</div>
            <div>Temporada (avg gols): {awayStats.temporada.avgGoalsFor.toFixed(2)}</div>
          </div>
        </div>
      )}

      <h4 style={{ marginTop:12 }}>🎯 Possíveis entradas</h4>
      {match.estrategias && match.estrategias.length>0 ? (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {match.estrategias.map((s, idx) => <StrategyBadge strat={s} key={idx} />)}
        </div>
      ) : <div>Nenhuma sugestão no momento.</div>}
    </div>
  );
}

export default function App(){
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [expanded, setExpanded] = useState(null);

  useEffect(()=>{
    let mounted = true;
    async function load(){
      setLoading(true);
      try{
        const res = await axios.get(`${API_BASE}/matches`);
        if(!mounted) return;
        setMatches(res.data.matches || []);
      }catch(e){ console.error(e); }
      finally{ setLoading(false); }
    }
    load();
    const it = setInterval(load, 60000);
    return ()=> { mounted = false; clearInterval(it); }
  },[]);

  const filtered = matches.filter(m=>{
    if(filter==='LIVE') return m.status==='LIVE';
    if(filter==='SCHEDULED') return m.status==='SCHEDULED';
    if(filter==='WITH_STRATEGY') return (m.estrategias && m.estrategias.length>0);
    return true;
  });

  return (
    <div style={{ fontFamily:'Inter, Arial', padding:20, background:'#f4f6f9', minHeight:'100vh' }}>
      <h1 style={{ textAlign:'center', color:'#1a73e8' }}>⚽ ScoutLay</h1>
      <p style={{ textAlign:'center' }}>Ao vivo e próximos — sinais combinando live + histórico</p>

      {/* Filtros */}
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <button onClick={()=>setFilter('ALL')} style={filter==='ALL'?activeBtn:btn}>📊 Todos</button>
        <button onClick={()=>setFilter('LIVE')} style={filter==='LIVE'?activeBtn:btn}>🔴 Ao Vivo</button>
        <button onClick={()=>setFilter('SCHEDULED')} style={filter==='SCHEDULED'?activeBtn:btn}>📅 Próximos</button>
        <button onClick={()=>setFilter('WITH_STRATEGY')} style={filter==='WITH_STRATEGY'?activeBtn:btn}>🎯 Com Estratégia</button>
      </div>

      {loading && <div style={{ textAlign:'center' }}>Carregando partidas...</div>}

      <div style={{ display:'grid', gap:20, gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))' }}>
        {filtered.map(m=>(
          <div key={m.id} style={cardStyle} onClick={()=>setExpanded(expanded===m.id?null:m.id)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:18, fontWeight:700 }}>
                  {m.homeTeam.name} <span style={{ color:'#888', fontWeight:600 }}>vs</span> {m.awayTeam.name}
                </div>
                <div style={{ color:'#666', marginTop:6 }}>{m.competition || ''} • {new Date(m.utcDate).toLocaleString()}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                {m.score?.fullTime ? <div style={{ fontSize:18, fontWeight:700 }}>{m.score.fullTime.home} - {m.score.fullTime.away}</div> : <div style={{ color:'#999' }}>{m.status}</div>}
                <div style={{ marginTop:6 }}>{m.estrategias && m.estrategias.length>0? (m.estrategias.length+' sinais') : 'Sem sinais'}</div>
              </div>
            </div>

            {expanded===m.id && <MatchDetails match={m} />}
          </div>
        ))}
      </div>
    </div>
  );
}

const btn = { margin:'0 6px', padding:'8px 14px', borderRadius:6, border:'1px solid #1a73e8', background:'#fff', color:'#1a73e8', cursor:'pointer' }
const activeBtn = { ...btn, background:'#1a73e8', color:'#fff', fontWeight:700 }
const cardStyle = { background:'#fff', borderRadius:12, padding:16, boxShadow:'0 6px 18px rgba(0,0,0,0.06)', cursor:'pointer' }

