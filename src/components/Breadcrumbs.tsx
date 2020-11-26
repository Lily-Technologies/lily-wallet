import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { ChevronRight } from '@styled-icons/boxicons-regular'
import { Home } from '@styled-icons/heroicons-solid';
import { gray400, gray500, gray700 } from '../utils/colors';

interface Props {
  homeLink: string
  items: {
    text: string
    link: string
  }[]
  className?: string
}

export const Breadcrumbs = ({ items, homeLink, className }: Props) => {
  return (
    <Wrapper className={className}>
      <ItemsWrapper>
        <HomeLinkContainer to={homeLink}>
          <HomeIcon />
        </HomeLinkContainer>
        {items.map((item) => (
          <Item>
            <ItemIcon />
            <ItemLink to={item.link}>
              {item.text}
            </ItemLink>
          </Item>
        ))}
      </ItemsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  display: flex;
`;

const ItemsWrapper = styled.ol`
  display: flex;
  align-items: center;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`;

const ItemIcon = styled(ChevronRight)`
  width: 1.25rem;
  height: 1.25rem;
  color: ${gray400};
`;

const HomeLinkContainer = styled(Link)``;

const HomeIcon = styled(Home)`
  width: 1.25rem;
  height: 1.25rem;
  color: ${gray400};
  cursor: pointer;

  &:hover {
    color: ${gray700};
  }
`;

const ItemLink = styled(Link)`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: ${gray500};
  cursor: pointer;
  margin-left: 1rem;
  text-decoration: none;

  &:hover {
    color: ${gray700};
  }
`;