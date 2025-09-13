// src/components/QRCard.jsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────── Styled Components ────────── */
const Container = styled.div`
  margin: 40px auto;
  width: 100%;
  max-width: 320px;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 22px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};

  /* subtle top accent */
  &::before {
    content: '';
    position: absolute; inset: 0 0 auto 0; height: 3px;
    background: ${({ theme }) => theme.colors.accent};
    opacity: .5;
  }

  @media (max-width: 480px) { padding: 20px; }
`;

const Header = styled.div`
  margin-bottom: 14px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 4px;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.subtext};
`;

const QRLink = styled.a`
  display: inline-block;
  text-decoration: none;
  outline: none;
`;

const QRWrapper = styled.div`
  background: #ffffff;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radii.lg};
  position: relative;
  transition: transform .18s ${({ theme }) => theme.transitions?.easings?.standard || 'ease'};
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.08);

  ${QRLink}:hover & { transform: translateY(-2px); }
  ${QRLink}:active & { transform: translateY(0); }
`;

const QROverlay = styled(motion.div)`
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.85);
  border-radius: ${({ theme }) => theme.radii.lg};
  display: grid; place-items: center;
  color: white;
  backdrop-filter: blur(3px);
`;

const spinner = keyframes`to { transform: rotate(360deg); }`;
const LoadingSpinner = styled.div`
  width: 34px; height: 34px; border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.22);
  border-top-color: ${({ theme }) => theme.colors.accent};
  animation: ${spinner} 1s linear infinite;
`;

const URLCaption = styled.div`
  margin: 12px auto 0;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.06);
  border: 1px solid ${({ theme }) => theme.colors.line};
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 0.8rem;
`;

/* ────────── Component ────────── */
export default function QRCard() {
  const url = import.meta.env.VITE_QR_URL || 'https://scaleupapp.club/';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        aria-label="Quick access QR"
      >
        <Header>
          <Title>Quick Access</Title>
          <Subtitle>Scan or tap to visit</Subtitle>
        </Header>

        <QRLink href={url} target="_blank" rel="noopener noreferrer" aria-label="Open scaleupapp.club">
          <QRWrapper>
            <QRCode
              id="qr-code"
              value={url}
              size={168}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
              style={{ display: 'block', height: 'auto', width: '100%', maxWidth: 168 }}
            />
            <AnimatePresence>
              {loading && (
                <QROverlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingSpinner />
                </QROverlay>
              )}
            </AnimatePresence>
          </QRWrapper>
        </QRLink>

        <URLCaption>{url.replace(/^https?:\/\//, '')}</URLCaption>
      </Card>
    </Container>
  );
}
