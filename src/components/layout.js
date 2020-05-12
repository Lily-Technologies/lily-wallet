import React from 'react';
import styled from 'styled-components';

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
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  display: flex;
  flex: 1;
  display: flex;
  min-height: 400px;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.25em 2em;
  overflow: scroll;
  flex: 1;
  max-width: 1200px;
  width: 100%;
`;

export const GridArea = styled.div`
  display: grid;
  background: #f2f7fe;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 24px;
  padding: 1.5em;
`;

export const PageTitle = styled.div`
  font-size: 2em;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`;
export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
export const HeaderRight = styled.div`
  display: flex;
`;