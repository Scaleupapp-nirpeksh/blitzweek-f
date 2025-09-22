// src/components/Hero.jsx
import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useMotionValue, useTransform } from 'framer-motion';

/* ───────── Ambient FX (subtle) ───────── */
const aurora = keyframes`
  0%   { transform: translate3d(-8%, -8%, 0) scale(1);   opacity: .75; }
  50%  { transform: translate3d( 6%,  4%, 0) scale(1.05); opacity: .95; }
  100% { transform: translate3d(-8%, -8%, 0) scale(1);   opacity: .75; }
`;
const sweep = keyframes`
  from { transform: translateX(-120%) }
  to   { transform: translateX(120%) }
`;

/* ───────── Layout ───────── */
const Wrap = styled.header`
  position: relative;
  overflow: clip;
  padding: 92px 0 64px;
  background:
    radial-gradient(1100px 460px at 8% -10%, rgba(245,188,0,.18), transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,.03), transparent 34%);

  &::before, &::after {
    content: '';
    position: absolute;
    inset: auto -18% -30% auto;
    width: 68vw; height: 68vw;
    background: radial-gradient(55% 60% at 50% 50%,
      rgba(255,211,77,.20) 0%,
      rgba(255,211,77,.10) 35%,
      rgba(255,211,77,.05) 60%,
      transparent 72%);
    filter: blur(42px);
    animation: ${aurora} 24s ease-in-out infinite;
    pointer-events: none;
  }
  &::after {
    right: auto; left: -16%; bottom: -26%;
    background: radial-gradient(55% 60% at 50% 50%,
      rgba(73,182,255,.18) 0%,
      rgba(73,182,255,.10) 35%,
      rgba(73,182,255,.05) 60%,
      transparent 72%);
    animation-duration: 28s; animation-direction: reverse;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 44px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

/* ───────── Left: ultra-compact content ───────── */

const LogoPlate = styled(motion.div)`
  width: clamp(280px, 42vw, 520px);
  height: clamp(84px, 12vw, 120px);
  border-radius: 22px;
  padding: 1px;
  background:
    linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,.04)) padding-box,
    linear-gradient(135deg, #ffd34d 0%, #f5bc00 45%, #d29c00 72%, rgba(73,182,255,.6) 100%) border-box;
  box-shadow: 0 22px 60px rgba(0,0,0,.28);
  display: grid; place-items: center;
  margin: 0 0 18px;

  & > div {
    width: 100%; height: 100%;
    border-radius: 21px;
    background: #fff;
    display: grid; place-items: center;
    position: relative; overflow: hidden;
  }
  & > div::after {
    content:'';
    position:absolute; inset:0;
    background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.16) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-120%);
    animation: ${sweep} 4.4s ease-in-out infinite 1.1s;
    pointer-events:none;
  }
  img { height: clamp(48px, 8.2vw, 90px); display: block; }
`;

const Heading = styled.h1`
  font-size: clamp(34px, 4.8vw, 64px);
  line-height: 1.04;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
`;
const Accent = styled.span`
  background: linear-gradient(90deg, #ffd34d 0%, #f5bc00 55%, #d29c00 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
`;

const OneLine = styled.p`
  margin: 6px 0 14px;
  font-size: clamp(15px, 1.9vw, 18px);
  color: ${({theme})=> theme.colors.subtext};
`;

const Sash = styled.div`
  display:flex; flex-wrap: wrap; gap: 8px 10px; align-items:center;
  margin: 10px 0 16px;
`;
const Pill = styled.span`
  display:inline-flex; align-items:center; gap:8px;
  padding: 8px 12px; border-radius: 999px;
  background: rgba(245,188,0,.10);
  border: 1px solid ${({theme})=> theme.colors.accent};
  color: ${({theme})=> theme.colors.text}; font-weight: 800; font-size: 12px;
  box-shadow: ${({theme})=> theme.shadows.glow};
`;
const Dot = styled.span`
  display:inline-block; width:4px; height:4px; border-radius:50%;
  background: ${({theme})=> theme.colors.subtext}; opacity:.7;
`;

const Meta = styled.div`
  display:flex; flex-wrap: wrap; gap: 10px 12px; margin: 8px 0 18px;
`;
const Chip = styled.span`
  display:inline-flex; align-items:center; gap:8px;
  padding:8px 12px; border-radius:999px; font-size:12px;
  background: rgba(255,255,255,.06);
  border: 1px solid ${({theme})=> theme.colors.line};
  color: ${({theme})=> theme.colors.text};
`;

const Ctas = styled.div` display:flex; gap: 10px; flex-wrap: wrap; `;
const CTA = styled.a`
  display:inline-flex; align-items:center; justify-content:center;
  min-width: 170px; gap:8px;
  background:${({theme})=> theme.colors.accent};
  color:#0b2230; padding:12px 18px; border-radius:14px; font-weight:900;
  box-shadow:${({theme})=> theme.shadows.glow};
  transition: transform .15s ease, background .2s ease;
  &:hover{ transform: translateY(-1px); background:${({theme})=> theme.colors.accentDark}; }
`;
const Ghost = styled.a`
  display:inline-flex; align-items:center; justify-content:center;
  min-width: 140px; gap:8px;
  padding:10px 16px; border-radius:12px; font-weight:800;
  border:1px solid ${({theme})=> theme.colors.line};
  background:rgba(255,255,255,.06); color:${({theme})=> theme.colors.text};
  transition: transform .15s ease, background .2s ease;
  &:hover{ transform: translateY(-1px); background: rgba(255,255,255,.08); }
`;

/* ───────── Right: Poster with subtle tilt ───────── */
const Card = styled(motion.div)`
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03));
  border: 1px solid ${({theme})=> theme.colors.line};
  border-radius: 22px;
  padding: 14px;
  box-shadow: ${({theme})=> theme.shadows.card};
  transform-style: preserve-3d;
`;
const BannerFrame = styled.div`
  position: relative; border-radius: 16px; overflow: hidden;
  &::after{
    content:''; position:absolute; inset:0;
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 16px; pointer-events:none;
  }
`;
const Poster = styled.img`
  width: 100%; display:block; border-radius: 14px;
`;

/* ───────── tiny inline icons ───────── */
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M3 9h18" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

export default function Hero() {
  const eventISO = useMemo(
    () => '2025-09-27T13:00:00+05:30',
    []
  );
  const eventLabelIST = useMemo(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    return fmt.format(new Date(eventISO)) + ' IST';
  }, [eventISO]);

  // Parallax for the poster
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useTransform(y, [-60, 60], [5, -5]);
  const ry = useTransform(x, [-60, 60], [-7, 7]);
  const track = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (r.left + r.width/2));
    y.set(e.clientY - (r.top + r.height/2));
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <Wrap id="top" aria-label="ScaleUp Blitz Week hero">
      <div className="container">
        <Grid>
          {/* Left: minimal, bold */}
          <div>
           

            <Heading>
              IIT Bombay × <Accent>ScaleUp</Accent> Blitz Week
            </Heading>

            <OneLine>Compete. Build. Win.</OneLine>

            <Sash aria-label="Highlights">
              <Pill>₹1,00,000+ prizes</Pill>
              <Dot />
              <Pill>ScaleUp merch</Pill>
              <Dot />
              <Pill>Internship opportunity</Pill>
            </Sash>

            <Meta aria-label="Event quick facts">
              <Chip><CalendarIcon /> {eventLabelIST}</Chip>
              <Chip><MapPinIcon /> IIT Bombay</Chip>
              <Chip><BoltIcon /> Blitz • Ignite</Chip>
            </Meta>

            <Ctas>
              <CTA href="#register">Register Now</CTA>
              <Ghost href="#details">Event Details</Ghost>
            </Ctas>
          </div>

          {/* Right: Poster */}
          <Card
            style={{ rotateX: rx, rotateY: ry }}
            onMouseMove={track}
            onMouseLeave={reset}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .55, delay: .06 }}
            aria-hidden="true"
          >
            <BannerFrame>
              <Poster src="/banner.png" alt="" />
            </BannerFrame>
          </Card>
        </Grid>
      </div>
    </Wrap>
  );
}
