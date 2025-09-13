// src/components/LiveStats.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence, useReducedMotion, animate } from 'framer-motion';
import api, { endpoints } from '../api/client';

/* ────────── Styled Components ────────── */
const Container = styled.section`
  margin: 48px 0;
  padding: 32px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.line};
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: 640px) {
    padding: 24px 16px;
    margin: 32px 0;
  }

  /* subtle corner glow */
  &::after{
    content:''; position:absolute; right:-20%; top:-40%;
    width: 60%; height: 120%;
    background: radial-gradient(40% 40% at 50% 50%, rgba(245,188,0,.12), transparent 70%);
    pointer-events:none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 640px) { flex-direction: column; }
`;

const TitleGroup = styled.div`
  display: flex; align-items: center; gap: 10px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.85; }
`;

const StatusIndicator = styled.span`
  display: inline-flex; align-items:center; justify-content:center;
  width: 10px; height: 10px; border-radius: 50%;
  background: ${({ $status, theme }) => {
    switch($status) {
      case 'synced': return theme.colors.success || '#5dd39e';
      case 'error': return theme.colors.error || '#ff6b6b';
      case 'loading': return theme.colors.accent;
      default: return theme.colors.subtext;
    }
  }};
  box-shadow: 0 0 0 4px ${({ $status, theme }) => {
    switch($status) {
      case 'synced': return (theme.colors.successBg || 'rgba(93,211,158,0.12)');
      case 'error': return (theme.colors.errorBg || 'rgba(255,107,107,0.12)');
      default: return 'rgba(255,255,255,0.06)';
    }
  }};
  ${({ $animated }) => $animated && css`animation: ${pulse} 2s ease-in-out infinite;`}
`;

const Controls = styled.div`
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
`;

const UpdateInfo = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subtext};
  display: flex; align-items: center; gap: 6px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.accent : 'transparent'};
  color: ${({ $variant, theme }) =>
    $variant === 'primary' ? (theme.colors.primaryFg || '#0b2230') : theme.colors.text};
  border: 1px solid ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.accent : theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem; font-weight: 700; cursor: pointer;
  transition: transform .12s ease, background .2s ease, box-shadow .2s ease;
  display: inline-flex; align-items: center; gap: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $variant, theme }) =>
      $variant === 'primary' ? theme.colors.accentDark : theme.colors.surfaceHover};
    box-shadow: ${({ theme }) => theme.shadows.subtle};
  }
  &:disabled { opacity: .55; cursor: not-allowed; }
  &:active:not(:disabled) { transform: translateY(0); }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ $highlight, theme }) => $highlight ? theme.colors.accent : theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px;
  position: relative; overflow: hidden;
  transition: transform .2s ease, box-shadow .2s ease;

  /* top colored bar per type */
  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: ${({ $type, theme }) => {
      switch($type) {
        case 'total':  return theme.colors.accent;
        case 'blitz':  return theme.colors.info || '#64b5f6';
        case 'ignite': return theme.colors.warning || '#ffb347';
        case 'both':   return '#9575cd';
        default:       return theme.colors.line;
      }
    }};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

const StatContent = styled.div`
  display: flex; flex-direction: column; gap: 8px;
`;

const StatValue = styled.div`
  font-size: 2rem; font-weight: 900; line-height: 1;
  font-variant-numeric: tabular-nums; letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 640px) { font-size: 1.75rem; }
`;

const StatLabel = styled.div`
  font-size: 0.875rem; color: ${({ theme }) => theme.colors.subtext}; font-weight: 600;
`;

const StatChange = styled(motion.div)`
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 0.75rem; font-weight: 800; margin-top: 4px;
  padding: 4px 8px; border-radius: 999px;

  color: ${({ $positive, theme }) => $positive ? (theme.colors.successFg || '#77e2b4') : (theme.colors.errorFg || '#ff9b9b')};
  background: ${({ $positive, theme }) => $positive ? (theme.colors.successBg || 'rgba(93,211,158,0.12)') : (theme.colors.errorBg || 'rgba(255,107,107,0.12)')};
  border: 1px solid ${({ $positive, theme }) => $positive ? (theme.colors.successBorder || 'rgba(93,211,158,0.45)') : (theme.colors.errorBorder || 'rgba(255,107,107,0.45)')};
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonLoader = styled.div`
  height: ${({ $height }) => $height || '40px'};
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.backgroundAlt} 25%,
    ${({ theme }) => theme.colors.surface} 50%,
    ${({ theme }) => theme.colors.backgroundAlt} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.errorBg || 'rgba(255, 107, 107, 0.12)'};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder || 'rgba(255, 107, 107, 0.45)'};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.error || '#ff6b6b'};
  font-size: 0.875rem;
  margin-bottom: 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
`;

const SuccessMessage = styled(motion.div)`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.successBg || 'rgba(93,211,158,0.12)'};
  border: 1px solid ${({ theme }) => theme.colors.successBorder || 'rgba(93,211,158,0.45)'};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.successFg || '#77e2b4'};
  font-size: 0.875rem;
  margin-bottom: 16px;
`;

/* ────────── Sparkline Component ────────── */
const SparklineContainer = styled.div`
  position: absolute; bottom: 16px; right: 16px;
  opacity: 0.65; transition: opacity .2s ease;
  ${StatCard}:hover & { opacity: 0.95; }
`;

const Sparkline = ({ points = [], width = 80, height = 32 }) => {
  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const pathData = points
    .map((value, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaData = `${pathData} L ${width} ${height} L 0 ${height} Z`;

  return (
    <SparklineContainer aria-hidden>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5bc00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f5bc00" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaData} fill="url(#sparkGradient)" />
        <path d={pathData} fill="none" stroke="#f5bc00" strokeWidth="2" />
        <circle
          cx={width}
          cy={height - ((points[points.length - 1] - min) / range) * height}
          r="3"
          fill="#f5bc00"
        />
      </svg>
    </SparklineContainer>
  );
};

/* ────────── Helper Functions ────────── */
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Never';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

/* ────────── Animated Counter ────────── */
function AnimatedCount({ value, format = true }) {
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    if (reducedMotion || value === previousValue.current) {
      setDisplayValue(value);
      return;
    }
    const controls = animate(previousValue.current, value, {
      duration: 0.5,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    previousValue.current = value;
    return () => controls.stop();
  }, [value, reducedMotion]);

  const formatted = format ? displayValue.toLocaleString('en-IN') : String(displayValue);
  return <span>{formatted}</span>;
}

/* ────────── Main Component ────────── */
export default function LiveStats() {
  const [stats, setStats] = useState({ total: 0, blitz: 0, ignite: 0, both: 0 });
  const [previousStats, setPreviousStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [synced, setSynced] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [history, setHistory] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get(endpoints.statsLive);

      if (response.data?.data) {
        setPreviousStats(stats);
        setStats(response.data.data);
        setHistory((prev) => [...prev.slice(-29), response.data.data.total || 0]);

        const serverDate = response.headers?.date || response.headers?.Date;
        if (serverDate) {
          setSynced(true);
          setLastUpdated(new Date(serverDate).getTime());
        } else {
          setSynced(false);
          setLastUpdated(Date.now());
        }

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1800);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Unable to load registration data');
      setSynced(false);
    } finally {
      setLoading(false);
    }
  }, [stats]);

  useEffect(() => {
    fetchStats();
    if (autoRefresh) {
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchStats]);

  const deltas = useMemo(() => {
    if (!previousStats) return {};
    return {
      total:  (stats.total  || 0) - (previousStats.total  || 0),
      blitz:  (stats.blitz  || 0) - (previousStats.blitz  || 0),
      ignite: (stats.ignite || 0) - (previousStats.ignite || 0),
      both:   (stats.both   || 0) - (previousStats.both   || 0),
    };
  }, [stats, previousStats]);

  const statsConfig = [
    { key: 'total',  label: 'Total Registrations', type: 'total' },
    { key: 'blitz',  label: 'ScaleUp Blitz',       type: 'blitz' },
    { key: 'ignite', label: 'ScaleUp Ignite',      type: 'ignite' },
    { key: 'both',   label: 'Both Events',         type: 'both' },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    await fetchStats();
  };

  const getStatusIndicator = () => {
    if (loading) return 'loading';
    if (error)   return 'error';
    if (synced)  return 'synced';
    return 'default';
    };

  return (
    <Container aria-live="polite">
      <Header>
        <TitleGroup>
          <StatusIndicator
            $status={getStatusIndicator()}
            $animated={loading}
            aria-label={`Status: ${getStatusIndicator()}`}
          />
          <Title>Live Registration Stats</Title>
        </TitleGroup>

        <Controls>
          <UpdateInfo>
            <span>Updated {formatRelativeTime(lastUpdated)}</span>
          </UpdateInfo>
          <Button
            $variant={autoRefresh ? 'default' : 'primary'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            aria-pressed={autoRefresh}
          >
            {autoRefresh ? '⏸ Pause' : '▶ Resume'}
          </Button>
          <Button onClick={handleRefresh} disabled={loading} aria-label="Refresh statistics">
            {loading ? '⟳ Loading…' : '⟳ Refresh'}
          </Button>
        </Controls>
      </Header>

      <AnimatePresence>
        {showSuccess && (
          <SuccessMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ✓ Statistics updated successfully
          </SuccessMessage>
        )}
      </AnimatePresence>

      {error && (
        <ErrorMessage role="alert">
          <span>⚠ {error}</span>
          <Button onClick={handleRefresh} $variant="primary">Try Again</Button>
        </ErrorMessage>
      )}

      <StatsGrid>
        {statsConfig.map(({ key, label, type }) => {
          const value = stats[key] || 0;
          const delta = deltas[key] || 0;
          const showDelta = !loading && delta !== 0 && previousStats;

          return (
            <StatCard
              key={key}
              $type={type}
              $highlight={delta > 0}
              initial={false}
              animate={{ scale: delta > 0 ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.25 }}
            >
              {loading ? (
                <StatContent>
                  <SkeletonLoader $height="36px" />
                  <SkeletonLoader $height="20px" />
                </StatContent>
              ) : (
                <StatContent>
                  <StatValue><AnimatedCount value={value} /></StatValue>
                  <StatLabel>{label}</StatLabel>

                  <AnimatePresence>
                    {showDelta && (
                      <StatChange
                        $positive={delta > 0}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                      >
                        <span>{delta > 0 ? '↑' : '↓'}</span>
                        <span>{Math.abs(delta)}</span>
                      </StatChange>
                    )}
                  </AnimatePresence>
                </StatContent>
              )}

              {key === 'total' && history.length > 1 && !loading && (
                <Sparkline points={history} />
              )}
            </StatCard>
          );
        })}
      </StatsGrid>
    </Container>
  );
}
