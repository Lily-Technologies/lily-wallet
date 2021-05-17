import styled from "styled-components";

import {
  gray500,
  gray600,
  gray800,
  white,
  black,
  green600,
} from "../../utils/colors";

export const HeaderWrapper = styled.div`
  color: ${black};
`;

export const InnerWrapper = styled.div`
  max-width: 46.875em;
  width: 100%;
`;

export const PageTitleSubtext = styled.div`
  font-size: 1em;
  color: ${gray600};
`;

export const CancelButton = styled.div`
  color: ${gray500};
  padding: 1em;
  cursor: pointer;
`;

export const XPubHeaderWrapper = styled.div`
  color: ${gray800};
  background: ${white};
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 1.25em;
  border-bottom: 1px solid #e4e7eb;
  align-items: flex-start;
`;

export const SetupHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  align-items: flex-start;
`;

export const SetupHeader = styled.span`
  font-size: 1.25em;
  margin: 4px 0;
  color: ${black};
`;

export const SetupExplainerText = styled.div`
  color: ${gray800};
  font-size: 0.8em;
  margin: 8px 0;
  padding: 0 3em 0 0;
`;

export const FormContainer = styled.div`
  min-height: 33em;
`;

export const BoxedWrapper = styled.div`
  background: ${white};
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 11px solid ${green600};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;
