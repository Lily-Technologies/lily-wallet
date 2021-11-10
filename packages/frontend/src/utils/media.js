import { css } from "styled-components";

export const mobile = (inner) => css`
  @media (max-width: ${1000 / 16}em) {
    ${inner};
  }
`;

export const phone = (inner) => css`
  @media (max-width: ${650 / 16}em) {
    ${inner};
  }
`;

export const sm = (inner) => css`
  @media (min-width: 640px) {
    ${inner};
  }
`;

export const md = (inner) => css`
  @media (min-width: 768px) {
    ${inner};
  }
`;

export const lg = (inner) => css`
  @media (min-width: 1024px) {
    ${inner};
  }
`;
