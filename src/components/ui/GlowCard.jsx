import styled, { keyframes } from 'styled-components';

const sweep = keyframes`
  from { background-position: 0% 50%; }
  to   { background-position: 200% 50%; }
`;

export const GlowCard = styled.div`
  position: relative;
  border-radius: ${({theme})=> theme.radii.lg};
  padding: 1px;
  background: linear-gradient(120deg,
    rgba(255,255,255,.12),
    rgba(245,188,0,.35),
    rgba(255,255,255,.12),
    rgba(100,181,246,.28),
    rgba(255,255,255,.12));
  background-size: 200% 100%;
  animation: ${sweep} 8s linear infinite;
  box-shadow: ${({theme})=> theme.shadows.elevation2};

  & > .inner {
    border-radius: inherit;
    background: ${({theme})=> theme.colors.surface};
    border: 1px solid ${({theme})=> theme.colors.border};
    padding: 16px;
  }

  &:hover { box-shadow: ${({theme})=> theme.shadows.cardHover}; }
`;
