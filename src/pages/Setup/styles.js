import styled from 'styled-components';

import { darkGray, gray, white, black, blue500 } from '../../utils/colors';

export const HeaderWrapper = styled.div`
`;

export const InnerWrapper = styled.div`
  max-width: 46.875em;
  width: 100%;
`;

export const PageTitleSubtext = styled.div`
  font-size: 1em;
  color: ${darkGray};
`;

export const CancelButton = styled.div`
  color: ${gray};
  padding: 1em;
  cursor: pointer;
`;

export const XPubHeaderWrapper = styled.div`
  color: ${darkGray};
  background: ${white};
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 1.25em;
  border-bottom: 1px solid #E4E7EB;
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
  color: ${darkGray};
  font-size: .8em;
  margin: 8px 0;
  padding: 0 3em 0 0;
`;

export const FormContainer = styled.div`
  min-height: 33em;
`;

export const BoxedWrapper = styled.div`
  background: ${white};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-top: 11px solid ${blue500};
  box-shadow: rgba(43, 48, 64, 0.2) 0px 0.1rem 0.5rem 0px;
`;