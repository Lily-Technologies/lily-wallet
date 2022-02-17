import styled, { css } from 'styled-components';

import { Button } from '.';
import { gray200, gray600, gray700, gray900 } from 'src/utils/colors';
import { mobile } from 'src/utils/media';

const Wrapper = styled.div``;

const HeaderSection = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 1em;
`;

const HeaderTitle = styled.h3.attrs({ className: 'text-gray-900 dark:text-gray-200' })`
  line-height: 1.5rem;
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
  margin-bottom: 0.25em;
`;

const HeaderSubtitle = styled.span.attrs({
  className: 'text-gray-500 dark:text-gray-400'
})`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  max-width: 42rem;
`;

const Row = styled.div.attrs({ className: 'border-t border-gray-200 dark:border-gray-700' })`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;

  ${mobile(css`
    display: block;
  `)}
`;

const KeyColumn = styled.div.attrs({
  className: 'text-gray-500 dark:text-gray-400'
})`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  align-items: center;
  display: flex;
`;

const ValueColumn = styled.div.attrs({
  className: 'text-gray-900 dark:text-gray-200'
})`
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  display: flex;
  align-items: center;
`;

const ValueText = styled.span.attrs({
  className: 'text-gray-900 dark:text-gray-300'
})`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const ValueAction = styled.span.attrs({
  className: 'text-gray-700 dark:text-gray-300'
})`
  margin-left: 1rem;
  font-weight: 500;
`;

const ActionButton = styled.button.attrs({
  className:
    'bg-white dark:bg-gray-800 rounded-md font-medium text-green-500 hover:text-green-400 focus:outline-none focus:ring-2  focus:ring-green-300'
})``;

export const SettingsTable = {
  Wrapper,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  Row,
  KeyColumn,
  ValueColumn,
  ValueText,
  ValueAction,
  ActionButton
};
