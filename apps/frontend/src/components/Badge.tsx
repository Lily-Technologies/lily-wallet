import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactChild;
  style?: React.CSSProperties;
  className?: string;
}

export const Badge = ({ children, style, className }: Props) => (
  <BadgeContainer style={style} className={className}>
    {children}
  </BadgeContainer>
);

const BadgeContainer = styled.span`
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
  padding-left: 0.625rem;
  padding-right: 0.625rem;
  border-radius: 0.375rem;
  align-items: center;
  display: inline-flex;
  text-transform: capitalize;
`;
