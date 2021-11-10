import styled, { css } from 'styled-components';

import { Button } from '.';
import { gray200, gray600, gray700, gray900 } from 'src/utils/colors';
import { mobile } from 'src/utils/media';

const Wrapper = styled.div`
  padding: 0.5em 1.5em;
`;

const HeaderSection = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 1em;
`;

const HeaderTitle = styled.h3`
  color: ${gray900};
  line-height: 1.5rem;
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
  margin-bottom: 0.5em;
`;

const HeaderSubtitle = styled.span`
  color: ${gray600};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  max-width: 42rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-top: 1px solid ${gray200};

  ${mobile(css`
    display: block;
  `)}
`;

const KeyColumn = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray600};
  font-weight: 500;
  align-items: center;
  display: flex;
`;

const ValueColumn = styled.div`
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  display: flex;
  align-items: center;
`;

const ValueText = styled.span`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 500;
  color: ${gray700};
`;

const ValueAction = styled.span`
  margin-left: 1rem;
  font-weight: 500;
  color: ${gray700};
`;

const ActionButton = styled.button`
  ${Button};
  font-weight: 500;
`;

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
