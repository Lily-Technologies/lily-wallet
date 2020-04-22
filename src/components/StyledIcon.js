import styled, { keyframes } from 'styled-components';
import rem from '../utils/rem';

const spinning = keyframes`
  from {transform:rotate(0deg);}
  to {transform:rotate(360deg);
`;

export const StyledIcon = styled.div`
  && {
    width: ${p => rem(p.size || 20)};
    height: ${p => rem(p.size || 20)};
  }
`;

export const StyledIconSpinning = styled(StyledIcon)`
  animation-name: ${spinning};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
`;