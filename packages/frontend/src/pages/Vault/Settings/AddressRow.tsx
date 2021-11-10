import React from 'react';
import styled from 'styled-components';

import { TableRow, TableColumn } from 'src/components/Table';
import { Badge } from 'src/components';

import {
  gray100,
  gray500,
  gray800,
  gray900,
  green100,
  green800,
  yellow100,
  yellow800
} from 'src/utils/colors';

import { Address } from '@lily/types';

interface Props {
  address: Address;
  status: 'used' | 'unused';
  type: 'external' | 'change';
}

const AddressRow = ({ address, status, type }: Props) => (
  <TableRowNoBorder>
    <TableColumnNoPadding>
      <UtxoHeader>{address.address}</UtxoHeader>
      <UtxoSubheader>Derivation path: {address.bip32derivation[0].path}</UtxoSubheader>
    </TableColumnNoPadding>
    <RightAlignColumn>
      <Badge
        background={status === 'used' ? yellow100 : green100}
        color={status === 'used' ? yellow800 : green800}
        style={{ marginRight: '1em' }}
      >
        {status}
      </Badge>
      <Badge background={gray100} color={gray800}>
        {type}
      </Badge>
    </RightAlignColumn>
  </TableRowNoBorder>
);

const TableColumnNoPadding = styled(TableColumn)`
  padding-left: 0;
  padding-right: 0;
`;

const TableRowNoBorder = styled(TableRow)`
  border-left: none;
  border-right: none;
  border-top: none;
`;

const RightAlignColumn = styled(TableColumn)`
  text-align: right;
  color: ${green800};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  padding-left: 0;
  padding-right: 0;
`;

const UtxoHeader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  font-weight: 500;
`;

const UtxoSubheader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 500;
`;

export default AddressRow;
