import React from "react";
import styled from "styled-components";

interface Props {
  color: string;
  background: string;
  children: React.ReactChild;
  style?: React.CSSProperties;
}

export const Badge = ({ color, background, children, style }: Props) => (
  <BadgeContainer color={color} background={background} style={style}>
    {children}
  </BadgeContainer>
);

const BadgeContainer = styled.span<{ background: string }>`
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
  padding-left: 0.625rem;
  padding-right: 0.625rem;
  border-radius: 0.375rem;
  align-items: center;
  display: inline-flex;
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  text-transform: capitalize;
`;
