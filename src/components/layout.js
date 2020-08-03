import React from 'react';
import styled, { css } from 'styled-components';

import { mobile } from '../utils/media';
import { black } from '../utils/colors';

export const PageWrapper = ({ children }) => {
  return (
    <Wrapper>
      <Content>
        {children}
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  display: flex;
  flex: 1;
  display: flex;
  min-height: 400px;
  flex-direction: column;
  align-items: center;
  padding: 0em 3em;
  overflow: hidden;

  ${mobile(css`
    padding: 0em 1em;
  `)};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.25em 2em;
  overflow: scroll;
  flex: 1;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
`;

export const GridArea = styled.div`
  display: grid;
  background: #f2f7fe;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 1.5em;
  padding: 1.5em;
  justify-items: center;
  align-items: flex-start;
`;

export const PageTitle = styled.div`
  font-size: 2em;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  flex-wrap: wrap;
`;
export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
export const HeaderRight = styled.div`
  display: flex;
`;