import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { differenceInSeconds, addHours } from 'date-fns';
import confetti from 'canvas-confetti';

/* ============== Polished styles ============== */
const Wrap = styled.section`
  padding: 28px 0 18px;
  border-top: 1px dashed ${({ theme }) => theme.colors.line};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.line};
  margin: 32px 0 18px;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  letter-spacing: .2px;
  color: ${({ theme }) => theme.colors.subtext};
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const SyncDot = styled.span`
  width: 8px; height: 8px; border-radius: 50%;
  background: ${({ ok }) => (ok ? '#5dd39e' : '#94a3ad')};
  box-shadow: 0 0 0 3px rgba(255,255,255,.05);
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
  background: #0f3a4b;
  border: 1px solid ${({ theme }) => theme.colors.line};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  line-height: 1;
  transition: background .2s ease, border-color .2s ease, transform .1s ease;
  &:hover { background: #0f4154; border-color: rgba(255,255,255,.18); transform: translateY(-1px); }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 18px;
  justify-items: center;
  @media (max-width: 900px) { grid-template-columns: repeat(4, minmax(130px, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: repeat(2, minmax(130px, 1fr)); }
`;

const Box = styled.div`
  width: 100%;
  max-width: 260px;
  height: 140px;
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03));
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 20px;
  display: grid;
  grid-template-rows: 1fr auto;
  align-items: center;
  justify-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Gauge = styled.div`
  position: relative;
  width: 96px; height: 96px;
  display: grid; place-items: center;
`;

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtext};
  margin-bottom: 10px;
`;

const Actions = styled.div`
  display: flex; gap: 10px; margin-top: 14px;
  justify-content: center; flex-wrap: wrap;
`;

const CTA = styled.a`
  display:inline-flex; align-items:center; gap:8px;
  background:${({theme})=>theme.colors.accent}; color:#0b2230;
  padding:10px 14px; border-radius:12px; font-weight:800;
  text-decoration:none; box-shadow:${({theme})=>theme.shadows.glow};
  transition:transform .12s ease; &:hover{ transform: translateY(-1px); }
`;

const Ghost = styled.button`
  background: rgba(255,255,255,.06);
  color: ${({theme})=>theme.colors.text};
  border: 1px solid ${({theme})=>theme.colors.line};
  padding:10px 14px; border-radius:12px; font-weight:700; cursor:pointer;
  &:hover{ background: rgba(255,255,255,.08); }
`;

const glint = keyframes`
  from { transform: translateX(-150%); }
  to   { transform: translateX(150%); }
`;

const Shine = styled.div`
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
  &::before{
    content:''; position:absolute; top:0; bottom:0; width:40%;
    background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.12) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-150%); animation: ${glint} 3.5s linear infinite;
  }
`;

/* ============== helpers ============== */
const pad2 = (n)=> n.toString().padStart(2,'0');
const splitTime = (t)=>{
  const s = Math.max(0,t);
  const d = Math.floor(s/86400);
  const h = Math.floor((s%86400)/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return {days:d, hrs:h, mins:m, secs:sec};
};
const toGCalDate = (iso)=>{
  const d=new Date(iso);
  return `${d.getUTCFullYear()}${pad2(d.getUTCMonth()+1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`;
};
const makeICS = (title, startISO, endISO, desc='', loc='IIT Bombay')=>{
  const uid=Math.random().toString(36).slice(2)+'@theblitzweek.com';
  const dt=z=>toGCalDate(z); const now=new Date().toISOString();
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ScaleUp//BlitzWeek//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
    'BEGIN:VEVENT',`UID:${uid}`,`DTSTAMP:${dt(now)}`,`DTSTART:${dt(startISO)}`,`DTEND:${dt(endISO)}`,
    `SUMMARY:${title}`,`DESCRIPTION:${desc.replace(/\n/g,'\\n')}`,`LOCATION:${loc}`,
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
};
const downloadFile=(name,content,type)=>{
  const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
};
const useLocalStorage = (key, initial) => {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(v)); } catch {} },[key,v]);
  return [v,setV];
};

/* ============== Flip digits ============== */
const DigitWrap = styled.div`
  perspective: 800px; position: relative; width: 64px; height: 64px;
`;
const Face = styled(motion.div)`
  position:absolute; inset:0; display:grid; place-items:center;
  font-weight: 900; font-size: 36px; letter-spacing:.5px;
  border-radius: 12px;
  background: #0f3a4b;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: inset 0 -2px 0 rgba(255,255,255,.04);
`;

function FlipDigit({ value }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <Face
        key={value}
        initial={reduced ? { opacity: 0 } : { rotateX: -90, opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
        exit={reduced ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {value}
      </Face>
    </AnimatePresence>
  );
}

function FlipPair({ value }) {
  const s = pad2(value);
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gap: 8 }}>
      <DigitWrap><FlipDigit value={s[0]} /></DigitWrap>
      <DigitWrap><FlipDigit value={s[1]} /></DigitWrap>
    </div>
  );
}

/* ============== Segmented halo ring ============== */
function SegRing({ progress=0, size=96, stroke=6, segments=60 }) {
  const r=(size-stroke)/2, c=2*Math.PI*r;
  const dash=Math.max(0,Math.min(1,progress))*c;
  const rest=c-dash;
  const ticks=[...Array(segments)].map((_,i)=>{
    const angle=(i/segments)*2*Math.PI;
    const inner=r-8, outer=r-3;
    const x1=size/2 + inner*Math.cos(angle);
    const y1=size/2 + inner*Math.sin(angle);
    const x2=size/2 + outer*Math.cos(angle);
    const y2=size/2 + outer*Math.sin(angle);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.12)" strokeWidth="1" />;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position:'absolute', inset:0, margin:'auto', pointerEvents:'none' }} aria-hidden>
      <defs>
        <linearGradient id="halo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#ffd34d"/><stop offset="50%" stopColor="#f5bc00"/><stop offset="100%" stopColor="#d29c00"/>
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g>{ticks}</g>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#halo)" strokeWidth={stroke} strokeLinecap="round"
        filter="url(#softGlow)"
        strokeDasharray={`${dash} ${rest}`} strokeDashoffset="0"
        initial={false} animate={{ strokeDasharray: `${dash} ${rest}` }} transition={{ duration:.25 }}
      />
    </svg>
  );
}

/* ============== Main component ============== */
export default function Countdown({
  targetISO,
  title='Event starts in',
  eventTitle='IITB × ScaleUp Blitz Week',
  durationHours=2,
}) {
  const target = useMemo(()=> new Date(targetISO), [targetISO]);
  const end    = useMemo(()=> addHours(target, durationHours), [target, durationHours]);

  // optional server-time sync
  const offsetRef = useRef(0);
  const [synced, setSynced] = useState(false);
  useEffect(()=>{
    const base = import.meta.env.VITE_API_BASE || '/api';
    fetch(base + '/stats/live-count').then(res=>{
      const d = res.headers.get('date'); // expose 'Date' header in CORS
      if (!d) return;
      offsetRef.current = new Date(d).getTime() - Date.now();
      setSynced(true);
    }).catch(()=>{});
  },[]);

  // second-aligned tick
  const [now, setNow] = useState(new Date());
  useEffect(()=>{
    let t;
    const tick = ()=>{
      const ms = Date.now() + offsetRef.current;
      setNow(new Date(ms));
      const next = 1000 - (ms % 1000) + 4;
      t = setTimeout(tick, next);
    };
    tick(); return ()=> clearTimeout(t);
  },[]);

  const [showIST, setShowIST] = useLocalStorage('bw_tz_pref', true);
  const tToStart = differenceInSeconds(target, now);
  const tToEnd   = differenceInSeconds(end, now);
  const phase    = tToStart > 0 ? 'pre' : tToEnd > 0 ? 'live' : 'ended';

  // celebratory confetti
  const firedRef = useRef(false);
  useEffect(()=>{
    if (phase==='live' && !firedRef.current){
      firedRef.current = true;
      confetti({ particleCount: 220, spread: 70, origin: { y: .7 } });
    }
  },[phase]);

  const { days, hrs, mins, secs } = splitTime(Math.max(0, tToStart));
  const secP = secs/60, minP = mins/60, hrP = hrs/24;

  // milestone messages
  const milestone =
    tToStart <= 60*60 ? 'Kicking off in under an hour' :
    tToStart <= 24*60*60 ? 'Less than 24 hours to go' : null;

  const eventStartIST = useMemo(()=>{
    const fmt = new Intl.DateTimeFormat('en-IN',{ timeZone:'Asia/Kolkata', weekday:'short', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    return fmt.format(target) + ' IST';
  },[target]);
  const eventStartLocal = useMemo(()=>{
    const fmt = new Intl.DateTimeFormat(undefined,{ weekday:'short', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    const tz  = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local time';
    return fmt.format(target) + ` (${tz})`;
  },[target]);

  const startISO = target.toISOString(), endISO = end.toISOString();
  const gcalLink =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(eventTitle)}` +
    `&dates=${toGCalDate(startISO)}/${toGCalDate(endISO)}` +
    `&details=${encodeURIComponent('Join the IIT Bombay × ScaleUp Blitz Week.')}` +
    `&location=${encodeURIComponent('IIT Bombay')}&trp=false`;

  const share = async ()=>{
    const data = { title: eventTitle, text:`Join me at ${eventTitle}!`, url: location.origin + location.pathname + '#register' };
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(data.url); alert('Link copied!'); } } catch {}
  };

  const Unit = ({ value, label, progress }) => (
    <Box role="group" aria-label={`${value} ${label}`}>
      <Gauge>
        {label !== 'Days' && <SegRing progress={progress} />}
        {/* flip pair */}
        <FlipPair value={value} />
      </Gauge>
      <Label>{label}</Label>
      <Shine />
    </Box>
  );

  /* ============== Phase renders ============== */
  if (phase === 'live') {
    return (
      <Wrap aria-live="polite">
        <TopRow>
          <Title><SyncDot ok={synced} /> We’re live!</Title>
          <Meta><Chip onClick={()=> (location.hash='#register')}>Register / Check-in</Chip></Meta>
        </TopRow>
        <Row>
          <Box style={{ borderColor:'rgba(245,188,0,.5)' }}>
            <Gauge><FlipPair value={0} /></Gauge>
            <Label>Happening</Label><Shine/>
          </Box>
        </Row>
      </Wrap>
    );
  }

  if (phase === 'ended') {
    return (
      <Wrap aria-live="polite">
        <TopRow>
          <Title><SyncDot ok={synced} /> Event has ended</Title>
          <Meta><Chip onClick={()=> (location.hash='#details')}>Highlights (soon)</Chip></Meta>
        </TopRow>
        <Row>
          <Unit value={0} label="Days"  progress={0} />
          <Unit value={0} label="Hours" progress={0} />
          <Unit value={0} label="Mins"  progress={0} />
          <Unit value={0} label="Secs"  progress={0} />
        </Row>
      </Wrap>
    );
  }

  return (
    <Wrap aria-label="Event countdown" aria-live="polite" role="timer">
      <TopRow>
        <Title><SyncDot ok={synced} /> {title}</Title>
        <Meta>
          <Chip onClick={()=> setShowIST(s=>!s)}>{showIST ? 'Show in my timezone' : 'Show in IST'}</Chip>
          <span style={{ fontSize:12, color:'#9fb2ba' }}>{showIST ? eventStartIST : eventStartLocal}</span>
        </Meta>
      </TopRow>

      {milestone && (
        <div style={{
          textAlign:'center', margin:'-6px 0 10px', fontSize:13,
          color:'#ffd34d', opacity:.95
        }}>
          {milestone}
        </div>
      )}

      <Row>
        <Unit value={days} label="Days"  progress={0} />
        <Unit value={hrs}  label="Hours" progress={hrP} />
        <Unit value={mins} label="Mins"  progress={minP} />
        <Unit value={secs} label="Secs"  progress={secP} />
      </Row>

      <Actions>
        <CTA href={gcalLink} target="_blank" rel="noreferrer">Add to Google Calendar</CTA>
        <Ghost onClick={()=> downloadFile('BlitzWeek.ics', makeICS(eventTitle, startISO, endISO, 'Join the IIT Bombay × ScaleUp Blitz Week.', 'IIT Bombay'), 'text/calendar;charset=utf-8')}>
          Download .ics
        </Ghost>
        <Ghost onClick={share}>Share</Ghost>
      </Actions>
    </Wrap>
  );
}
