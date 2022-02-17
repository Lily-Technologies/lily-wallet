import React from 'react';
import styled from 'styled-components';

import { TableRow, TableColumn } from 'src/components/Table';
import { Badge } from 'src/components';

import {
  gray50,
  gray500,
  gray900,
  green100,
  green800,
  red100,
  red800,
  yellow100,
  yellow800
} from 'src/utils/colors';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  alias: string;
  capacity: number;
  status: 'active' | 'inactive' | 'pending';
  onClick: () => void;
}

const ChannelRow = ({ alias, capacity, status, onClick }: Props) => (
  <TableRowNoBorder
    className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
    onClick={() => onClick()}
  >
    <TableColumnNoPadding>
      <ChannelHeader className='text-gray-900 dark:text-gray-300'>{alias}</ChannelHeader>
      <ChannelSubheader>{capacity.toLocaleString()} sats capacity</ChannelSubheader>
    </TableColumnNoPadding>
    <RightAlignColumn>
      <Badge
        className={classNames(
          status === 'active'
            ? 'bg-green-100 dark:bg-green-600 text-green-800 dark:text-green-100'
            : 'bg-red-100 dark:bg-red-600 text-red-800 dark:text-red-100'
        )}
        style={{ marginRight: '1em' }}
      >
        {status === 'active' ? 'online' : status === 'inactive' ? 'offline' : 'pending'}
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

const ChannelHeader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
`;

const ChannelSubheader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 500;
`;

export default ChannelRow;
