// src/App.jsx
import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';

import Hero from './components/Hero';
import Countdown from './components/Countdown';
import LiveStats from './components/LiveStats';
import EventDetails from './components/EventDetails';
import QRCard from './components/QRCard';
import RegistrationForm from './components/RegistrationForm';

// ✨ new fx/ui helpers (from the components I shared earlier)
import FXLayer from './components/fx/FXLayer';
import Reveal from './components/fx/Reveal';
import AccentDivider from './components/ui/AccentDivider';
import { GlowCard } from './components/ui/GlowCard';
import NeonButton from './components/ui/NeonButton';

/* ───────────────── styled wrappers ───────────────── */
const AppShell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
`;

const Main = styled.main`
  position: relative;
  z-index: 1; /* sits above FXLayer */
`;

const Section = styled.section`
  background: transparent;
  position: relative;
  z-index: 1;
`;

const Container = styled.div`
  max-width: ${props => props.theme.layout?.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${props => props.theme.layout?.containerPadding || '20px'};
  position: relative;
`;

const DividerSpace = styled.div`
  height: 6px; /* small breathing space around animated divider */
`;

const CTABand = styled.section`
  padding: 28px 0 8px;
  display: grid;
  place-items: center;
`;

const GhostLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  color: ${({ theme }) => theme.colors.text};
  background: rgba(255,255,255,.06);
  font-weight: 700;
  text-decoration: none;
  transition: transform .12s ease, background .2s ease;
  &:hover{ transform: translateY(-1px); background: rgba(255,255,255,.08); }
`;

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.backgroundAlt || theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  padding: 28px 0 60px;
  text-align: center;
  color: ${({ theme }) => theme.colors.subtext};
  position: relative;
  z-index: 1;
  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    transition: opacity 0.3s ease;
    &:hover { opacity: 0.7; }
  }
`;

export default function App() {
  const eventISO = import.meta.env.VITE_EVENT_START_ISO || '2025-01-25T10:00:00+05:30';

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {/* ambient animated background */}
      <FXLayer />

      <AppShell>
        <Main>
          {/* Hero already has motion; keep it first so #top anchor works */}
          <Hero />

          {/* Content block 1 */}
          <Section>
            <Container>
              <Reveal>
                <Countdown targetISO={eventISO} />
              </Reveal>

              <DividerSpace />
              <AccentDivider />
              <DividerSpace />

              <Reveal delay={0.06}>
                <LiveStats />
              </Reveal>

              <DividerSpace />
              <AccentDivider />
              <DividerSpace />

              <Reveal delay={0.12}>
                <EventDetails />
              </Reveal>

              <DividerSpace />
              <AccentDivider />
              <DividerSpace />

              {/* QR inside a glow frame */}
              <Reveal delay={0.18}>
                <GlowCard>
                  <div className="inner">
                    <QRCard />
                  </div>
                </GlowCard>
              </Reveal>

              {/* CTA band */}
              <CTABand>
                <Reveal as="div" delay={0.22}>
                  <NeonButton href="#register">Register Now</NeonButton>
                </Reveal>
                <div style={{ height: 10 }} />
                <Reveal as="div" delay={0.26}>
                  <GhostLink href="#details" aria-label="See event details">See event details</GhostLink>
                </Reveal>
              </CTABand>
            </Container>
          </Section>

          {/* Registration form (already includes its own container) */}
          <Reveal delay={0.1}>
            <RegistrationForm />
          </Reveal>

          <Footer />
        </Main>
      </AppShell>
    </ThemeProvider>
  );
}

function Footer() {
  return (
    <FooterWrapper>
      Built with ♥ for IIT Bombay · <a href="#top">Back to top</a>
    </FooterWrapper>
  );
}
