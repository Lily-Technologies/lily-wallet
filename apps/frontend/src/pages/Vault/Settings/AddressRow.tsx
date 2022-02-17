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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  address: Address;
  status: 'used' | 'unused';
  type: 'external' | 'change';
}

const AddressRow = ({ address, status, type }: Props) => (
  <TableRowNoBorder>
    <TableColumnNoPadding>
      <UtxoHeader className='text-gray-900 dark:text-gray-200'>{address.address}</UtxoHeader>
      <UtxoSubheader>Derivation path: {address.bip32derivation[0].path}</UtxoSubheader>
    </TableColumnNoPadding>
    <RightAlignColumn>
      <Badge
        className={classNames(
          status === 'used'
            ? 'bg-yellow-100 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100'
            : 'bg-green-100 dark:bg-green-600 text-green-800 dark:text-green-100'
        )}
        style={{ marginRight: '1em' }}
      >
        {status}
      </Badge>
      <Badge className='text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200'>
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
  overflow-x: auto;
`;

const RightAlignColumn = styled(TableColumn)`
  text-align: right;
  color: ${green800};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  padding-left: 0;
  padding-right: 0;
  white-space: nowrap;
`;

const UtxoHeader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
`;

const UtxoSubheader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 500;
`;

export default AddressRow;
