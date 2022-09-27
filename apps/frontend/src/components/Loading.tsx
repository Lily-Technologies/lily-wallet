import React from 'react';
import FlowerLoading from 'src/assets/flower-loading.svg';

import styled, { keyframes } from 'styled-components';
import { green200 } from 'src/utils/colors';
import { RequireOnlyOne } from 'src/types';

interface Props {
  style?: any;
  itemText?: string | undefined;
  message?: string | undefined;
}

type RequireItemTextOrMessage = RequireOnlyOne<Props, 'itemText' | 'message'>;

export const Loading = ({ itemText, style = {}, message }: RequireItemTextOrMessage) => (
  <LoadingWrapper style={style} className='text-gray-700 dark:text-gray-300'>
    <img alt='loading placeholder' src={FlowerLoading} style={{ maxWidth: '6.25em' }} />
    {itemText && <p className='text-lg whitespace-pre-wrap text-center'>Loading {itemText}</p>}
    {message && <p className='text-lg whitespace-pre-wrap text-center'>{message}</p>}
    <p className='text-sm text-gray-500 dark:text-gray-400'>Please wait...</p>
  </LoadingWrapper>
);

const LoadingWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  flex-direction: column;
  padding: 1.5em;
`;

const LoadingText = styled.p`
  font-size: 1.5em;
  white-space: pre-wrap;
  text-align: center;
`;

const LoadingSubText = styled.div`
  font-size: 0.75em;
`;

export const placeHolderShimmer = keyframes`
  0%{
      background-position: -468px 0;
  }
  100%{
      background-position: 468px 0;
  }
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
  background: rgba(155, 209, 135, 0.95);
  background: linear-gradient(
    to right,
    rgba(155, 209, 135, 0.5) 8%,
    ${green200} 18%,
    rgba(155, 209, 135, 0.5) 33%
  );
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
