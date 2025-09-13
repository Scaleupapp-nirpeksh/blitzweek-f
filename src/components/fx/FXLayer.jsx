import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const Layer = styled.div`
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
`;
const Canvas = styled.canvas`
  position: absolute; inset: 0;
  filter: blur(18px) saturate(1.08);
  opacity: .55;
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const Rays = styled.div`
  position: absolute; inset: -20% -20% -20% -20%;
  background:
    conic-gradient(from 0deg,
      transparent 0 12%, rgba(255,255,255,.06) 12% 13%,
      transparent 13% 25%, rgba(255,255,255,.06) 25% 26%,
      transparent 26% 38%, rgba(255,255,255,.06) 38% 39%,
      transparent 39% 51%);
  mix-blend-mode: overlay;
  opacity: .20;
  animation: ${spin} 120s linear infinite;
`;

export default function FXLayer(){
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) return;

    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const ctx = c.getContext('2d');

    let w = c.clientWidth, h = c.clientHeight;
    c.width = Math.floor(w * dpr); c.height = Math.floor(h * dpr);
    ctx.scale(dpr, dpr);

    const orbs = [
      { x: 0.2, y: 0.35, r: 360, hue: 48 },   // gold
      { x: 0.75, y: 0.25, r: 420, hue: 200 }, // blue
      { x: 0.6, y: 0.7,  r: 380, hue: 48 },   // gold
    ];
    const vel = orbs.map(() => ({ dx: (Math.random()*0.0015+0.0007) * (Math.random()<0.5?-1:1),
                                  dy: (Math.random()*0.0015+0.0007) * (Math.random()<0.5?-1:1) }));

    let raf;
    const step = () => {
      ctx.clearRect(0,0,w,h);
      ctx.globalCompositeOperation = 'lighter';
      orbs.forEach((o,i)=>{
        o.x += vel[i].dx; o.y += vel[i].dy;
        if (o.x < 0.05 || o.x > 0.95) vel[i].dx *= -1;
        if (o.y < 0.05 || o.y > 0.95) vel[i].dy *= -1;

        const grad = ctx.createRadialGradient(o.x*w, o.y*h, 0, o.x*w, o.y*h, o.r);
        grad.addColorStop(0, `hsla(${o.hue}, 95%, 60%, .32)`);
        grad.addColorStop(1, 'hsla(0,0%,0%,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(o.x*w, o.y*h, o.r, 0, Math.PI*2); ctx.fill();
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const onResize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = Math.floor(w * dpr); c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <Layer aria-hidden>
      <Canvas ref={ref} />
      <Rays />
    </Layer>
  );
}
