import styled, { keyframes } from 'styled-components';

const glide = keyframes`to { background-position: 120% 0; }`;

const Line = styled.hr`
  border: none;
  height: 2px;
  border-radius: 999px;
  background:
    linear-gradient(90deg,
      rgba(255,255,255,.06),
      rgba(245,188,0,.6),
      rgba(255,255,255,.06));
  background-size: 200% 100%;
  animation: ${glide} 6s ease-in-out infinite;
  margin: 18px 0;
`;

export default Line;
