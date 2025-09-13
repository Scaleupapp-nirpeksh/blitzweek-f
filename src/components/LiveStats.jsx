import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence, useReducedMotion, animate } from 'framer-motion';
import api, { endpoints } from '../api/client';

/* ────────── styles ────────── */
const Wrap = styled.section`
  margin: 12px 0 24px;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.subtext};
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ ok }) => (ok ? '#5dd39e' : '#94a3ad')};
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .05);
`;

const Meta = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  gap: 10px;
  align-items: center;
  justify-content: end;
  @media (max-width: 720px) { justify-content: start; }
`;

const Chip = styled.button`
  background: rgba(255,255,255,0.06);
  border: 1px solid ${({ theme }) => theme.colors.line};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition: background .2s ease, border-color .2s ease, transform .1s ease;
  &:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); }
`;

const Muted = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtext};
`;

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  @media (max-width: 720px){ grid-template-columns: repeat(2, 1fr); }
`;

const Card = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid ${({theme})=> theme.colors.line };
  border-radius: 16px;
  padding: 14px 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const BigRow = styled.div`
  display: grid;
  justify-items: center;
  gap: 6px;
`;

const Big = styled.div`
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0.5px;
  line-height: 1;
`;

const Label = styled.div`
  font-size: 12px;
  color: ${({theme})=> theme.colors.subtext};
`;

const Delta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  color: ${({dir}) => dir >= 0 ? '#0b3324' : '#3a0b0b'};
  background: ${({dir}) => dir >= 0 ? 'rgba(93,211,158,.25)' : 'rgba(255,107,107,.25)'};
  border: 1px solid ${({dir}) => dir >= 0 ? 'rgba(93,211,158,.45)' : 'rgba(255,107,107,.45)'};
`;

const shimmer = keyframes`
  0%{ background-position: -200% 0; } 100%{ background-position: 200% 0; }
`;

const Skeleton = styled.div`
  width: 100%;
  height: 46px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06));
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

/* tiny sparkline for Total */
const Sparkline = ({ points = [], width = 80, height = 28, accent = '#f5bc00' }) => {
  if (!points.length) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(1, max - min);
  const step = points.length > 1 ? width / (points.length - 1) : width;

  const d = points
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * height;
      return `${i ? 'L' : 'M'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', right: 8, bottom: 8, opacity: .8 }}>
      <path d={d} fill="none" stroke={accent} strokeWidth="2" />
      <circle cx={ (points.length-1) * step } cy={ height - ((points[points.length-1]-min)/span)*height } r="2.5" fill={accent} />
    </svg>
  );
};

/* format “Updated 25s ago” */
function useRelativeTicker(targetMs) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, Math.floor((now - (targetMs || now)) / 1000));
  if (!targetMs) return '—';
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  return `${m}m ago`;
}

/* animated count helper */
function AnimatedCount({ value }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const latest = useRef(value);

  useEffect(() => {
    if (reduced) { setDisplay(value); return; }
    const controls = animate(latest.current, value, {
      duration: 0.5,
      onUpdate: (v) => setDisplay(Math.round(v)),
      ease: 'easeOut',
    });
    latest.current = value;
    return () => controls.stop();
  }, [value, reduced]);

  return <span>{Number(display).toLocaleString('en-IN')}</span>;
}

/* ────────── component ────────── */
export default function LiveStats() {
  const [data, setData] = useState({ total: 0, blitz: 0, ignite: 0, both: 0 });
  const [prev, setPrev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [synced, setSynced] = useState(false);
  const [lastUpdatedMs, setLastUpdatedMs] = useState(null);
  const [error, setError] = useState(null);
  const [seriesTotal, setSeriesTotal] = useState([]); // for sparkline

  const ago = useRelativeTicker(lastUpdatedMs);

  const fetchStats = async () => {
    try {
      setError(null);
      const res = await api.get(endpoints.statsLive);  // GET /stats/live-count
      const body = res.data?.data;
      if (body) {
        setPrev(data);
        setData(body);
        setSeriesTotal((s) => {
          const next = [...s, Number(body.total || 0)];
          return next.slice(-30); // keep last 30 points
        });
      }
      const serverDate = res.headers?.date || res.headers?.Date;
      if (serverDate) { setSynced(true); setLastUpdatedMs(new Date(serverDate).getTime()); }
      else { setSynced(false); setLastUpdatedMs(Date.now()); }
    } catch (e) {
      setError('Could not fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const id = setInterval(() => { if (!paused) fetchStats(); }, 30000); // every 30s
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const deltas = useMemo(() => {
    if (!prev) return { total: 0, blitz: 0, ignite: 0, both: 0 };
    return {
      total: (data.total ?? 0) - (prev.total ?? 0),
      blitz: (data.blitz ?? 0) - (prev.blitz ?? 0),
      ignite: (data.ignite ?? 0) - (prev.ignite ?? 0),
      both: (data.both ?? 0) - (prev.both ?? 0),
    };
  }, [data, prev]);

  const cards = [
    { key: 'total',  label: 'Total Confirmed' },
    { key: 'blitz',  label: 'ScaleUp Blitz'  },
    { key: 'ignite', label: 'ScaleUp Ignite' },
    { key: 'both',   label: 'Both'           },
  ];

  return (
    <Wrap>
      <TopRow>
        <Title><Dot ok={synced} /> Live registrations</Title>
        <Meta>
          <Muted>Updated {ago}</Muted>
          <Chip onClick={() => { setPaused(p => !p); }}>{paused ? 'Auto-refresh: Off' : 'Auto-refresh: On'}</Chip>
          <Chip onClick={fetchStats}>Refresh now</Chip>
        </Meta>
      </TopRow>

      {error && (
        <div style={{ marginBottom: 8, fontSize: 12, color: '#ff9b9b' }}>
          {error} — try again.
        </div>
      )}

      <Strip>
        {cards.map((c) => {
          const value = Number(data[c.key] || 0);
          const delta = Number(deltas[c.key] || 0);
          const showDelta = !loading && delta !== 0;

          return (
            <Card
              key={c.key}
              initial={false}
              animate={{ scale: delta > 0 ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16, mass: 0.6 }}
            >
              {loading ? (
                <Skeleton />
              ) : (
                <BigRow>
                  <Big><AnimatedCount value={value} /></Big>
                  <Label>{c.label}</Label>
                  <AnimatePresence>
                    {showDelta && (
                      <motion.div
                        key={`d-${c.key}-${value}`}
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Delta dir={delta}>
                          {delta > 0 ? '▲' : '▼'} {delta > 0 ? `+${delta}` : delta}
                        </Delta>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </BigRow>
              )}

              {/* Tiny sparkline on Total */}
              {c.key === 'total' && !loading && seriesTotal.length > 1 && (
                <Sparkline points={seriesTotal} />
              )}
            </Card>
          );
        })}
      </Strip>
    </Wrap>
  );
}
