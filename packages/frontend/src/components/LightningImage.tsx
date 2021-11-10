import React from "react";
import styled from "styled-components";

import { gray100, purple700 } from "src/utils/colors";

const IconSvg = styled.svg`
  color: ${purple700};
  margin-right: 0.65rem;
  flex-shrink: 0;
  border-radius: 0.375rem;
  object-position: center;
  object-fit: cover;
  background: ${gray100};
  flex: none;
  width: 6rem;
  height: 6rem;
  max-width: 100%;
  display: block;
  vertical-align: middle;
  border-style: solid;
  padding: 1em;
`;

export const LightningImage = () => (
  <IconSvg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </IconSvg>
);
