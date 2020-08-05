import React from 'react';
import styled from 'styled-components';

// TODO: change this to accept colors as props eventually
import { white, darkGray, gray } from '../utils/colors'

export const DividerWithText = ({ children }) => (
  <DividerContainer>
    <LineContainer>
      <Line></Line>
    </LineContainer>
    <TextContainer>
      <Text>{children}</Text>
    </TextContainer>
  </DividerContainer>
);

const DividerContainer = styled.div`
  position: relative;
  text-align: center;
  margin: 2em 0 1em;
`;

const Text = styled.div`
  text-align: center;
  padding: 0 0.5em;
  background: ${white};
  color: ${darkGray};
`;

const LineContainer = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  display: flex;
`;

const Line = styled.div`
  border: 1px solid ${gray};
  width: 100%;
`;

const TextContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;