import styled, { keyframes } from 'styled-components';
import { green, lightGreen } from '../utils/colors';
// Loading State

export const placeHolderShimmer = keyframes`
  0%{
      background-position: -468px 0
  }
  100%{
      background-position: 468px 0
`;

export const GrayAnimatedBackground = styled.div`
  animation: ${placeHolderShimmer} 1s linear infinite forwards;
  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;
  position: relative;
  flex: 1;
`;

export const GreenAnimatedBackground = styled.div`
  animation: ${placeHolderShimmer} 1s linear infinite forwards;
  background: rgba(155,209,135, 0.95);
  background: linear-gradient(to right, rgba(155,209,135, 0.5) 8%, ${lightGreen} 18%, rgba(155,209,135, 0.5) 33%);
  background-size: 800px 104px;
  position: relative;
  flex: 0 0 400px;
  opacity: 0.95;
`;

export const GrayLoadingAnimation = styled(GrayAnimatedBackground)`
  height: 24px;
`;

export const GreenLoadingAnimation = styled(GreenAnimatedBackground)`
  height: 16px;
`;