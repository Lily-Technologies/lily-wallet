import React from 'react';
import styled from 'styled-components';

import { Badge, Unit } from 'src/components';

import { gray500 } from 'src/utils/colors';
import { classNames } from 'src/utils/other';

interface Props {
  alias: string;
  capacity: number;
  status: 'active' | 'inactive' | 'pending';
  onClick: () => void;
}

const ChannelRow = ({ alias, capacity, status, onClick }: Props) => (
  <tr className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' onClick={() => onClick()}>
    <td className='py-2 px-4 rounded-l-2xl'>
      <ChannelHeader className='text-gray-900 dark:text-gray-300'>{alias}</ChannelHeader>
      <ChannelSubheader>
        <Unit value={capacity} /> capacity
      </ChannelSubheader>
    </td>
    <td className='text-right rounded-r-2xl'>
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
    </td>
  </tr>
);

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
