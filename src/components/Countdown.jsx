// src/components/Countdown.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { differenceInSeconds, addHours, format } from 'date-fns';
import confetti from 'canvas-confetti';

/* ============== Styled Components ============== */
const Container = styled.section`
  padding: 48px 0;
  margin: 48px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: ${({ theme }) => theme.colors.accent};
    opacity: 0.5;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ $status, theme }) => {
    if ($status === 'live') return `${theme.colors.accent}20`;
    if ($status === 'ended') return `${theme.colors.subtext}20`;
    return 'transparent';
  }};
  border: 1px solid ${({ $status, theme }) => {
    if ($status === 'live') return theme.colors.accent;
    if ($status === 'ended') return theme.colors.subtext;
    return theme.colors.line;
  }};
  border-radius: 999px;
  margin-bottom: 16px;
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status, theme }) => {
    if ($status === 'live') return theme.colors.accent;
    if ($status === 'synced') return '#5dd39e';
    return theme.colors.subtext;
  }};
  ${({ $animated }) => $animated && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const Title = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.text};
  
  ${({ $status, theme }) => $status === 'live' && css`
    background: ${theme.colors.gradientGold || `linear-gradient(90deg, ${theme.colors.accent}, ${theme.colors.accentDark})`};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.subtext};
  margin: 0;
`;

const TimeDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 600px;
  margin: 0 auto 32px;
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

const TimeUnit = styled.div`
  text-align: center;
  position: relative;
`;

const TimeValue = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.card};
  border: 2px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px 16px;
  margin-bottom: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent}40;
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.line};
    opacity: 0.3;
  }
`;

const Number = styled(motion.div)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  z-index: 1;
`;

const TimeLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.subtext};
  font-weight: 600;
`;

const ProgressRing = styled.svg`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  transform: rotate(-90deg);
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${({ $primary, theme }) => 
    $primary ? theme.colors.accent : 'transparent'};
  color: ${({ $primary, theme }) => 
    $primary ? theme.colors.bg : theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.accent}40;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subtext};
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const TimezoneBadge = styled.button`
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 999px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.card};
    border-color: ${({ theme }) => theme.colors.accent}40;
  }
`;

const MilestoneAlert = styled(motion.div)`
  text-align: center;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.accent}10;
  border: 1px solid ${({ theme }) => theme.colors.accent}30;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
  margin-bottom: 24px;
`;

/* ============== Helper Functions ============== */
const pad2 = (n) => n.toString().padStart(2, '0');

const splitTime = (totalSeconds) => {
  const s = Math.max(0, totalSeconds);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60
  };
};

const toGCalDate = (iso) => {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`;
};

const makeICS = (title, startISO, endISO, desc = '', loc = 'IIT Bombay') => {
  const uid = Math.random().toString(36).slice(2) + '@theblitzweek.com';
  const dt = (z) => toGCalDate(z);
  const now = new Date().toISOString();
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ScaleUp//BlitzWeek//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dt(now)}`,
    `DTSTART:${dt(startISO)}`,
    `DTEND:${dt(endISO)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc.replace(/\n/g, '\\n')}`,
    `LOCATION:${loc}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

const downloadFile = (name, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/* ============== Main Component ============== */
export default function Countdown({
  targetISO = '2025-01-25T10:00:00+05:30',
  eventTitle = 'ScaleUp Blitz Week',
  durationHours = 48,
}) {
  const target = useMemo(() => new Date(targetISO), [targetISO]);
  const end = useMemo(() => addHours(target, durationHours), [target, durationHours]);
  
  const [synced, setSynced] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showLocalTime, setShowLocalTime] = useState(false);
  const offsetRef = useRef(0);
  const reducedMotion = useReducedMotion();
  
  // Sync with server time
  useEffect(() => {
    const syncTime = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE || '/api';
        const res = await fetch(`${base}/health`);
        const serverDate = res.headers.get('date');
        if (serverDate) {
          offsetRef.current = new Date(serverDate).getTime() - Date.now();
          setSynced(true);
        }
      } catch (error) {
        console.error('Time sync failed:', error);
      }
    };
    syncTime();
  }, []);
  
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const ms = Date.now() + offsetRef.current;
      setNow(new Date(ms));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const timeToStart = differenceInSeconds(target, now);
  const timeToEnd = differenceInSeconds(end, now);
  const phase = timeToStart > 0 ? 'pre' : timeToEnd > 0 ? 'live' : 'ended';
  
  const { days, hours, minutes, seconds } = splitTime(timeToStart);
  
  // Trigger confetti when event goes live
  const confettiTriggered = useRef(false);
  useEffect(() => {
    if (phase === 'live' && !confettiTriggered.current) {
      confettiTriggered.current = true;
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [phase]);
  
  // Milestone messages
  const milestone = useMemo(() => {
    if (timeToStart <= 60) return 'Starting in less than a minute!';
    if (timeToStart <= 3600) return 'Starting in less than an hour!';
    if (timeToStart <= 86400) return 'Less than 24 hours to go!';
    return null;
  }, [timeToStart]);
  
  // Format event time
  const eventTimeDisplay = useMemo(() => {
    if (showLocalTime) {
      return format(target, 'EEE, MMM dd • h:mm a zzz');
    }
    return format(target, 'EEE, MMM dd • h:mm a') + ' IST';
  }, [target, showLocalTime]);
  
  // Calendar links
  const googleCalendarLink = useMemo(() => {
    const startISO = target.toISOString();
    const endISO = end.toISOString();
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(eventTitle)}` +
      `&dates=${toGCalDate(startISO)}/${toGCalDate(endISO)}` +
      `&details=${encodeURIComponent('Join us for the IIT Bombay × ScaleUp Blitz Week!')}` +
      `&location=${encodeURIComponent('IIT Bombay')}`;
  }, [target, end, eventTitle]);
  
  const handleDownloadICS = useCallback(() => {
    const ics = makeICS(
      eventTitle,
      target.toISOString(),
      end.toISOString(),
      'Join us for the IIT Bombay × ScaleUp Blitz Week!',
      'IIT Bombay'
    );
    downloadFile('blitzweek.ics', ics, 'text/calendar;charset=utf-8');
  }, [eventTitle, target, end]);
  
  const handleShare = useCallback(async () => {
    const shareData = {
      title: eventTitle,
      text: `Join me at ${eventTitle}!`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [eventTitle]);
  
  // Render based on phase
  if (phase === 'ended') {
    return (
      <Container>
        <Header>
          <StatusBadge $status="ended">
            <StatusDot $status="ended" />
            Event Concluded
          </StatusBadge>
          <Title>Thank You for Joining!</Title>
          <Subtitle>Stay tuned for highlights and updates</Subtitle>
        </Header>
        <ActionBar>
          <Button onClick={() => window.location.hash = '#highlights'}>
            View Highlights
          </Button>
        </ActionBar>
      </Container>
    );
  }
  
  if (phase === 'live') {
    return (
      <Container>
        <Header>
          <StatusBadge $status="live">
            <StatusDot $status="live" $animated />
            Event is Live!
          </StatusBadge>
          <Title $status="live">Join Us Now!</Title>
          <Subtitle>The event is currently in progress</Subtitle>
        </Header>
        <ActionBar>
          <Link href="#register" $primary>
            Register & Check In
          </Link>
          <Button onClick={() => window.location.hash = '#livestream'}>
            Watch Livestream
          </Button>
        </ActionBar>
      </Container>
    );
  }
  
  return (
    <Container role="timer" aria-label="Event countdown">
      <Header>
        <StatusBadge>
          <StatusDot $status={synced ? 'synced' : 'default'} />
          {synced ? 'Time Synced' : 'Local Time'}
        </StatusBadge>
        <Title>Event Starts In</Title>
        <Subtitle>{eventTitle}</Subtitle>
      </Header>
      
      <AnimatePresence>
        {milestone && (
          <MilestoneAlert
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {milestone}
          </MilestoneAlert>
        )}
      </AnimatePresence>
      
      <TimeDisplay>
        <TimeUnit>
          <TimeValue>
            <Number
              key={days}
              initial={reducedMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {pad2(days)}
            </Number>
          </TimeValue>
          <TimeLabel>Days</TimeLabel>
        </TimeUnit>
        
        <TimeUnit>
          <TimeValue>
            <ProgressRing viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(hours / 24) * 62.8} 62.8`}
                strokeLinecap="round"
                opacity="0.6"
              />
            </ProgressRing>
            <Number
              key={hours}
              initial={reducedMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {pad2(hours)}
            </Number>
          </TimeValue>
          <TimeLabel>Hours</TimeLabel>
        </TimeUnit>
        
        <TimeUnit>
          <TimeValue>
            <ProgressRing viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(minutes / 60) * 62.8} 62.8`}
                strokeLinecap="round"
                opacity="0.6"
              />
            </ProgressRing>
            <Number
              key={minutes}
              initial={reducedMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {pad2(minutes)}
            </Number>
          </TimeValue>
          <TimeLabel>Minutes</TimeLabel>
        </TimeUnit>
        
        <TimeUnit>
          <TimeValue>
            <ProgressRing viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.2"
              />
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(seconds / 60) * 62.8} 62.8`}
                strokeLinecap="round"
                animate={{ strokeDasharray: `${(seconds / 60) * 62.8} 62.8` }}
                transition={{ duration: 0.2 }}
              />
            </ProgressRing>
            <Number
              key={seconds}
              initial={reducedMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {pad2(seconds)}
            </Number>
          </TimeValue>
          <TimeLabel>Seconds</TimeLabel>
        </TimeUnit>
      </TimeDisplay>
      
      <MetaInfo>
        <span>{eventTimeDisplay}</span>
        <TimezoneBadge onClick={() => setShowLocalTime(!showLocalTime)}>
          {showLocalTime ? 'Show IST' : 'Show Local Time'}
        </TimezoneBadge>
      </MetaInfo>
      
      <ActionBar>
        <Link href={googleCalendarLink} target="_blank" rel="noopener noreferrer">
          Add to Calendar
        </Link>
        <Button onClick={handleDownloadICS}>
          Download .ics
        </Button>
        <Button onClick={handleShare}>
          Share Event
        </Button>
      </ActionBar>
    </Container>
  );
}