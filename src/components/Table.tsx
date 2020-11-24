import React from 'react';
import styled from 'styled-components';

import { gray50, gray100, gray300, gray600, gray700 } from '../utils/colors';

export const Table = styled.table`
  border: none;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`

`;

export const TableHead = styled.th`
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  color: ${gray600};
  background: ${gray50};
  border: none;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border: 1px solid ${gray100};
`;

export const TableColumn = styled.td`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray600};

  border: none;
  // padding-top: 1.25rem;
  // padding-bottom: 1.25rem;
  // padding-left: 1.5rem;
  // padding-right: 1.5rem;
  border-bottom: 1px solid ${gray300};
  border-width: thin;
`;

export const TableColumnBold = styled(TableColumn)`
  color: ${gray700};
  font-weight: 600;
`;