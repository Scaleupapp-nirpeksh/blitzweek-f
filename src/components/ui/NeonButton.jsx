import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(245,188,0,.0); }
  50% { box-shadow: 0 0 0 10px rgba(245,188,0,.12); }
`;

const NeonButton = styled.a`
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  min-width: 180px; padding: 14px 22px; border-radius: 14px; font-weight: 800;
  color: ${({theme})=> theme.colors.primaryFg}; background: ${({theme})=> theme.colors.primary};
  box-shadow: ${({theme})=> theme.shadows.glow};
  transition: transform .15s ${({theme})=> theme.transitions.easings.standard};
  will-change: transform, box-shadow;
  &:hover{ transform: translateY(-1px); }
  &:active{ transform: translateY(0); }
  /* slow subtle pulse */
  animation: ${pulse} 4.8s ease-in-out infinite;
`;

export default NeonButton;
