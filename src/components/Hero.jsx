import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useMotionValue, useTransform } from 'framer-motion';

/* ───────── Visual FX (subtle, classy) ───────── */
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

  /* ambient aurora */
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
  grid-template-columns: minmax(360px, 0.95fr) 1.05fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 1100px) { gap: 38px; }
  @media (max-width: 980px)  { grid-template-columns: 1fr; gap: 28px; }
`;

/* ───────── Left: Logo first, bigger, perfect contrast ───────── */
const LogoCard = styled(motion.div)`
  /* gradient border trick */
  position: relative;
  --w: clamp(340px, 36vw, 560px);
  --h: clamp(96px, 11vw, 140px);
  border-radius: 22px;
  padding: 1px; /* border thickness */
  background:
    linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.02)) padding-box,
    linear-gradient(135deg, #ffd34d 0%, #f5bc00 45%, #d29c00 70%, rgba(73,182,255,.6) 100%) border-box;
  box-shadow: 0 22px 60px rgba(0,0,0,.28);
  width: var(--w);
  height: var(--h);
  display: grid;
  place-items: center;
  margin-bottom: 16px;

  /* white plate inside for dark logo */
  & > div {
    width: 100%;
    height: 100%;
    border-radius: 21px;
    background: #fff;
    display: grid;
    place-items: center;
    position: relative;
    overflow: hidden;
  }

  /* subtle glossy sweep over the plate */
  & > div::after {
    content:'';
    position:absolute; inset:0;
    background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.16) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-120%);
    animation: ${sweep} 4.4s ease-in-out infinite 1.1s;
    pointer-events:none;
  }

  /* soft golden halo under the card */
  &::after{
    content:'';
    position:absolute; inset:-22%;
    border-radius: 32px;
    background: radial-gradient(60% 55% at 50% 50%, rgba(245,188,0,.22), transparent 70%);
    filter: blur(18px);
    z-index:-1;
  }

  img { height: clamp(64px, 7.4vw, 110px); display:block; }
`;

const Heading = styled.h1`
  font-size: clamp(40px, 5.2vw, 76px);
  line-height: 1.04;
  margin: 4px 0 10px;
  letter-spacing: -0.02em;
`;

const Accent = styled.span`
  background: linear-gradient(90deg, #ffd34d 0%, #f5bc00 55%, #d29c00 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  font-size: clamp(16px, 2vw, 20px);
  color: ${({theme})=> theme.colors.subtext};
`;

const MetaRow = styled.div`
  display:flex; flex-wrap:wrap; gap:10px 12px; margin: 10px 0 24px;
`;

const Chip = styled.span`
  display:inline-flex; align-items:center; gap:8px;
  padding:8px 12px; border-radius:999px; font-size:12px;
  background: rgba(255,255,255,.06);
  border: 1px solid ${({theme})=> theme.colors.line};
  color: ${({theme})=> theme.colors.text};
`;

const Ctas = styled.div` display:flex; gap:12px; flex-wrap:wrap; `;
const CTA = styled.a`
  display:inline-flex; align-items:center; justify-content:center;
  min-width: 180px; gap:8px;
  background:${({theme})=> theme.colors.accent};
  color:#0b2230; padding:14px 22px; border-radius:14px; font-weight:800;
  box-shadow:${({theme})=> theme.shadows.glow};
  transition: transform .15s ease, background .2s ease;
  &:hover{ transform: translateY(-1px); background:${({theme})=> theme.colors.accentDark}; }
`;
const Ghost = styled.a`
  display:inline-flex; align-items:center; justify-content:center;
  min-width:150px; gap:8px;
  padding:12px 18px; border-radius:12px; font-weight:700;
  border:1px solid ${({theme})=> theme.colors.line};
  background:rgba(255,255,255,.06); color:${({theme})=> theme.colors.text};
  transition: transform .15s ease, background .2s ease;
  &:hover{ transform: translateY(-1px); background: rgba(255,255,255,.08); }
`;

/* ───────── Right: Cinematic banner frame ───────── */
const Card = styled(motion.div)`
  --r: 22px;
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03));
  border: 1px solid ${({theme})=> theme.colors.line};
  border-radius: var(--r);
  padding: 16px;
  box-shadow: ${({theme})=> theme.shadows.card};
  transform-style: preserve-3d;
`;

const BannerFrame = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;

  /* thin inner stroke */
  &::after{
    content:''; position:absolute; inset:0;
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 16px; pointer-events:none;
  }
`;

const Poster = styled.img`
  width: 100%; display:block; border-radius: 14px;
`;

/* tiny inline icons */
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M3 9h18" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

export default function Hero(){
  // Date from env (IST label)
  const eventISO = useMemo(() => import.meta.env.VITE_EVENT_START_ISO || '2025-10-20T10:00:00+05:30', []);
  const eventLabelIST = useMemo(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      timeZone:'Asia/Kolkata', weekday:'short', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit'
    });
    return fmt.format(new Date(eventISO)) + ' IST';
  }, [eventISO]);

  // soft parallax for right banner
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
          {/* Left: Logo is the hero */}
          <div>
            <LogoCard
              initial={{ opacity: 0, y: 18, scale: .98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: .55, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div>
                <img src="/logo.png" alt="ScaleUp logo" />
              </div>
            </LogoCard>

            <Heading>
              IIT Bombay × <Accent>ScaleUp</Accent> Blitz Week
            </Heading>

            <MetaRow aria-label="Event quick facts">
              <Chip><CalendarIcon /> {eventLabelIST}</Chip>
              <Chip><MapPinIcon /> IIT Bombay</Chip>
              <Chip><BoltIcon /> Blitz &nbsp;•&nbsp; Ignite</Chip>
            </MetaRow>

            <Sub>
              Two high-energy events, one mission: discover, learn, and build at speed.
              Secure your spot — seats are limited.
            </Sub>

            <Ctas>
              <CTA href="#register" aria-label="Register now">Register Now</CTA>
              <Ghost href="#details" aria-label="Learn more">Event Details</Ghost>
            </Ctas>
          </div>

          {/* Right: Cinematic banner with subtle tilt */}
          <Card
            style={{ rotateX: rx, rotateY: ry }}
            onMouseMove={track}
            onMouseLeave={reset}
            initial={{opacity:0, y:24}}
            animate={{opacity:1, y:0}}
            transition={{duration:.55, delay:.06}}
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
