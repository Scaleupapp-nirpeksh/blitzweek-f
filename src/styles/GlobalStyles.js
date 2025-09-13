import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    --accent: ${({theme}) => theme?.colors?.accent || '#f5bc00'};
    --line:   ${({theme}) => theme?.colors?.line   || 'rgba(255,255,255,.14)'};
    --bg:     ${({theme}) => theme?.colors?.bg     || '#0c2b39'};
    --text:   ${({theme}) => theme?.colors?.text   || '#eaf4f7'};
  }

  *, *::before, *::after { box-sizing: border-box; }

  html {
    height: 100%;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }

  html, body, #root { min-height: 100%; }

  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
    line-height: 1.5;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-tap-highlight-color: transparent;
  }

  /* move gradients to a paint-friendly fixed layer */
  body::before{
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(1200px 600px at 10% 10%, rgba(245,188,0,0.12), transparent 55%),
      radial-gradient(1200px 600px at 90% 20%, rgba(245,188,0,0.10), transparent 55%);
    opacity: .9;
    z-index: -1;
  }

  a { color: inherit; text-decoration: none; }

  /* media + forms normalize */
  img, svg, video, canvas { display: block; max-width: 100%; height: auto; }
  button, input, select, textarea { font: inherit; color: inherit; }

  /* focus ring (keyboard only) */
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  ::selection { background: rgba(245,188,0,.24); }

  /* container */
  .container { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

  /* optional: nicer scrollbars (webkit) */
  *::-webkit-scrollbar { width: 10px; height: 10px; }
  *::-webkit-scrollbar-track { background: rgba(255,255,255,.05); }
  *::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,.18);
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  /* prefer Inter variable if available */
  @supports (font-variation-settings: normal) {
    body { font-family: 'Inter var', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial; }
  }
`
