// KBC-TODO: either apply throughout entire project or remove
// There are some components that implement this in their own files
import React from 'react';
import styled, { css } from 'styled-components';

import { mobile } from '../utils/media';
import { white, black } from '../utils/colors';

interface Props {
  children: React.ReactChild
}

export const PageWrapper = ({ children }: Props) => {
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
  z-index: 1;

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
  max-width: 75rem;
  width: 100%;
`;

export const GridArea = styled.div`
  display: grid;
  background: transparent;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  grid-gap: 1.5em;
  padding: 1.5em;
  justify-items: center;
`;

export const PageTitle = styled.div`
  font-size: 2em;
  color: ${white};
  font-weight: 600;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  flex-wrap: wrap;
  color: ${white};
`;
export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
export const HeaderRight = styled.div`
  display: flex;
`;