import styled from 'styled-components';

import { gray500, gray600, black, green600 } from 'src/utils/colors';

export const HeaderWrapper = styled.div`
  color: ${black};
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

export const XPubHeaderWrapper = styled.div.attrs({
  className:
    'text-gray-900 bg-white dark:text-gray-200 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'
})`
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 1.25em;
  align-items: flex-start;
`;

export const SetupHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  align-items: flex-start;
`;

export const SetupHeader = styled.span.attrs({
  className: 'text-gray-900 dark:text-gray-200 font-medium'
})`
  font-size: 1.25em;
  margin: 4px 0;
`;

export const SetupExplainerText = styled.div.attrs({
  className: 'text-gray-800 dark:text-gray-300'
})`
  font-size: 0.8em;
  padding: 0 3em 0 0;
`;

export const FormContainer = styled.div`
  min-height: 33em;
`;

export const BoxedWrapper = styled.div.attrs({ className: 'bg-white dark:bg-gray-800' })`
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 11px solid ${green600};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;
