import React from 'react';
import styled from 'styled-components';

import { Unit } from 'src/components';

import { gray500 } from 'src/utils/colors';
import { classNames } from 'src/utils/other';

interface Props {
  alias: string;
  capacity: number;
  status: 'active' | 'inactive' | 'pending';
  onClick: () => void;
  localBalance: string;
  remoteBalance: string;
}

const ChannelRow = ({ alias, capacity, status, onClick, localBalance, remoteBalance }: Props) => (
  <tr
    className='group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col md:flex-row justify-between items-center py-6 md:py-2 rounded-lg'
    onClick={() => onClick()}
  >
    <td className='py-2 px-4 rounded-l-2xl'>
      <ChannelHeader className='text-gray-900 dark:text-gray-300'>{alias}</ChannelHeader>
      <ChannelSubheader className='flex items-center'>
        <span className='relative flex'>
          <span
            className={classNames(
              'w-2 h-2 rounded-full relative mr-2 animate-pulse',
              status === 'active'
                ? 'bg-green-500'
                : status === 'inactive'
                ? 'bg-red-500'
                : 'bg-yellow-300'
            )}
          ></span>
        </span>
        <Unit value={capacity} />
      </ChannelSubheader>
    </td>

    <td>
      <span className='flex items-center justify-center w-full md:w-96 rounded-lg bg-gray-200 dark:bg-slate-700 dark:group-hover:bg-slate-600'>
        <span className='flex-1 flex justify-end'>
          <span
            className='bg-blue-500 rounded-l-lg text-blue-50 dark:text-white text-xs font-bold text-right whitespace-nowrap px-2 py-2'
            style={{ width: `${(Number(localBalance) / capacity) * 100}%` }}
          >
            <Unit value={Number(localBalance)} />
          </span>
        </span>
        <span className='flex-1 flex justify-start'>
          <span
            className='bg-green-500 rounded-r-lg text-green-50 dark:text-white text-xs font-bold whitespace-nowrap px-2 py-2'
            style={{ width: `${(Number(remoteBalance) / capacity) * 100}%` }}
          >
            <Unit value={Number(remoteBalance)} />
          </span>
        </span>
      </span>
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
