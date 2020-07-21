import React from 'react';

import styled, { keyframes } from 'styled-components';
import { lightGreen, darkGray } from '../utils/colors';
// Loading State

export const Loading = ({ itemText, style = {} }) => (
  <LoadingWrapper style={style}>
    <img alt="loading placeholder" src={require('../assets/flower-loading.svg')} style={{ maxWidth: '6.25em' }} />
    <LoadingText>Loading {itemText}</LoadingText>
    <LoadingSubText>Please wait...</LoadingSubText>
  </LoadingWrapper>
);

const LoadingWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin: 18px 0;
  flex-direction: column;
  color: ${darkGray};
  padding: 1.5em;
`;

const LoadingText = styled.div`
  font-size: 1.5em;
  margin: 4px 0;
`;

const LoadingSubText = styled.div`
    font-size: .75em;
`;

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
  background-size: 50em 6.5em;
  position: relative;
  flex: 1;
`;

export const GreenAnimatedBackground = styled.div`
  animation: ${placeHolderShimmer} 1s linear infinite forwards;
  background: rgba(155,209,135, 0.95);
  background: linear-gradient(to right, rgba(155,209,135, 0.5) 8%, ${lightGreen} 18%, rgba(155,209,135, 0.5) 33%);
  background-size: 800px 104px;
  position: relative;
  flex: 0 0 90%;
  opacity: 0.95;
`;

export const GrayLoadingAnimation = styled(GrayAnimatedBackground)`
  height: 3em;
`;

export const GreenLoadingAnimation = styled(GreenAnimatedBackground)`
  height: 1em;
`;