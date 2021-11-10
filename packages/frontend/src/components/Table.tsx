import styled from 'styled-components';

import { gray50, gray200, gray300, gray600, gray700 } from 'src/utils/colors';

export const TableContainer = styled.div`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-bottom-width: 1px;
  border-radius: 0.5rem;
  border-color: ${gray200};
`;

export const Table = styled.table`
  border: none;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead``;

export const TableHead = styled.th`
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  color: ${gray600};
  background: ${gray50};
  border: none;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border: 1px solid ${gray200};
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
  border-bottom: 1px solid ${gray300};
  border-width: thin;
`;

export const TableColumnBold = styled(TableColumn)`
  color: ${gray700};
  font-weight: 500;
`;
