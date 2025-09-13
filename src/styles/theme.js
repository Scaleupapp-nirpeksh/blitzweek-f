// src/styles/theme.js
export const theme = {
  mode: 'dark',

  /* ============ COLOR SYSTEM ============ */
  colors: {
    // Background layers (kept original names)
    background: '#0c2b39',
    backgroundAlt: '#0f3545',
    surface: '#0f4154',
    surfaceHover: '#134a5f',

    // Text
    text: '#eaf4f7',
    subtext: '#c6d5db',
    mutedText: '#8b9ca5',

    // Accent
    accent: '#f5bc00',
    accentDark: '#d29c00',
    accentLight: '#ffd940',

    // UI
    line: 'rgba(255,255,255,0.08)',
    lineFocus: 'rgba(245,188,0,0.30)',

    // Status (base)
    success: '#5dd39e',
    error: '#ff6b6b',
    warning: '#ffb347',
    info: '#64b5f6',

    // Overlays
    overlay: 'rgba(12, 43, 57, 0.8)',
    overlayDark: 'rgba(0, 0, 0, 0.5)',

    // Gradients (kept)
    gradientGold: 'linear-gradient(90deg, #f5bc00 0%, #ffd940 50%, #f5bc00 100%)',
    gradientDark: 'linear-gradient(180deg, #0c2b39 0%, #0f3545 100%)',
    gradientSurface: 'linear-gradient(135deg, #0f4154 0%, #134a5f 100%)',

    /* ---- Semantic aliases (NEW) ---- */
    // Primary button/link
    primary: '#f5bc00',
    primaryHover: '#d29c00',
    primaryFg: '#0b2230',

    // Borders
    border: 'rgba(255,255,255,0.12)',
    borderStrong: 'rgba(255,255,255,0.22)',

    // Focus & ring
    focus: 'rgba(245,188,0,0.45)',
    ring: 'rgba(245,188,0,0.28)',

    // Status surfaces (for banners/chips)
    successBg: 'rgba(93,211,158,0.12)',
    successBorder: 'rgba(93,211,158,0.45)',
    successFg: '#77e2b4',

    errorBg: 'rgba(255,107,107,0.12)',
    errorBorder: 'rgba(255,107,107,0.45)',
    errorFg: '#ff9b9b',

    infoBg: 'rgba(100,181,246,0.12)',
    infoBorder: 'rgba(100,181,246,0.45)',
    infoFg: '#aee0ff',
  },

  /* ============ SURFACES (NEW) ============ */
  surfaces: {
    0: { bg: '#0c2b39', border: 'transparent' }, // page
    1: { bg: '#0f4154', border: 'rgba(255,255,255,0.08)' }, // cards
    2: { bg: 'linear-gradient(135deg, #0f4154 0%, #134a5f 100%)', border: 'rgba(255,255,255,0.12)' }, // featured
    glass: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.14)', blur: '8px' },
  },

  /* ============ RADII ============ */
  radii: {
    xl: '24px',
    lg: '18px',
    md: '12px',
    sm: '8px',
    xs: '4px',
    pill: '999px',
  },

  /* ============ SHADOWS ============ */
  shadows: {
    glow: '0 8px 40px rgba(245,188,0,0.25)',
    glowStrong: '0 12px 60px rgba(245,188,0,0.40)',
    card: '0 12px 40px rgba(0,0,0,0.25)',
    cardHover: '0 20px 60px rgba(0,0,0,0.35)',
    subtle: '0 2px 8px rgba(0,0,0,0.15)',
    inset: 'inset 0 2px 4px rgba(0,0,0,0.20)',

    // Elevations (NEW)
    elevation1: '0 6px 18px rgba(0,0,0,0.22)',
    elevation2: '0 10px 28px rgba(0,0,0,0.28)',
    elevation3: '0 16px 48px rgba(0,0,0,0.35)',
    ring: '0 0 0 3px rgba(245,188,0,0.28)', // for focus rings if needed
  },

  /* ============ LAYOUT ============ */
  layout: {
    maxWidth: '1200px',
    containerPadding: '20px',
    sectionPadding: '80px 0',
    sectionPaddingMobile: '40px 0',
    gutter: '12px', // NEW
  },

  /* ============ TYPOGRAPHY ============ */
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyHeading: "'Space Grotesk', 'Inter', sans-serif",

    fontSize: {
      xs: '0.75rem',   // 12
      sm: '0.875rem',  // 14
      base: '1rem',    // 16
      lg: '1.125rem',  // 18
      xl: '1.25rem',   // 20
      '2xl': '1.5rem', // 24
      '3xl': '2rem',   // 32
      '4xl': '2.5rem', // 40
      '5xl': '3rem',   // 48
      '6xl': '4rem',   // 64
    },

    // NEW
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
    },

    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.6,
      relaxed: 1.8,
    },

    // Helper: fluid clamp presets (consumed in components)
    fluid: {
      h1: 'clamp(34px, 4.8vw, 64px)',
      h2: 'clamp(28px, 3.8vw, 48px)',
      h3: 'clamp(22px, 2.6vw, 32px)',
      body: 'clamp(15px, 1.6vw, 18px)',
    },
  },

  /* ============ SPACING ============ */
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
  },

  /* ============ MOTION ============ */
  transitions: {
    // Durations
    durations: {
      fast: '120ms',
      base: '200ms',
      slow: '320ms',
      lazy: '500ms',
    },
    // Easings (NEW)
    easings: {
      standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      decel: 'cubic-bezier(0, 0, 0.2, 1)',
      accel: 'cubic-bezier(0.4, 0, 1, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    // Back-compat shorthands
    fast: 'all 0.15s ease',
    base: 'all 0.3s ease',
    slow: 'all 0.5s ease',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  /* ============ Z-INDEX ============ */
  zIndex: {
    base: 0,
    content: 1,
    dropdown: 10,
    sticky: 50,
    overlay: 100,
    modal: 200,
    popover: 300,
    tooltip: 400,
    notification: 500,
  },

  /* ============ BREAKPOINTS ============ */
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

/* ───────── helpers (optional, import from here) ───────── */

// Media helpers: theme-aware queries
export const media = {
  up: (key)   => `@media (min-width: ${theme.breakpoints[key]})`,
  down: (key) => `@media (max-width: calc(${theme.breakpoints[key]} - 0.02px))`,
  between: (a, b) =>
    `@media (min-width: ${theme.breakpoints[a]}) and (max-width: calc(${theme.breakpoints[b]} - 0.02px))`,
};

// Small mixins for common patterns
export const mixins = {
  focusRing: (color = theme.colors.accent, offset = 2, width = 2) =>
    `outline: ${width}px solid ${color}; outline-offset: ${offset}px;`,
  card: () => `
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.line};
    border-radius: ${theme.radii.lg};
    box-shadow: ${theme.shadows.card};
  `,
  glass: (alpha = 0.06, blur = 8) => `
    background: rgba(255,255,255,${alpha});
    border: 1px solid ${theme.colors.border};
    backdrop-filter: blur(${blur}px);
  `,
};
