import React from 'react';
import moment from 'moment';
import { ChevronRightIcon } from '@heroicons/react/solid';

import { Unit } from 'src/components';

import PaymentTypeIcon from './PaymentTypeIcon';

import { getFriendlyType } from 'src/pages/Lightning/utils';

import { LightningEvent } from '@lily/types';

interface Props {
  creation_date?: number;
  title: string;
  value_sat: number;
  type: LightningEvent['type'];
  onClick: () => void;
}

const AcvitityRow = ({ onClick, type, creation_date, title, value_sat }: Props) => {
  return (
    <li
      className='list-none last:border-none border-b border-gray-100 dark:border-gray-700 shadow'
      onClick={() => onClick()}
    >
      <button className='block bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 w-full'>
        <div className='flex items-center px-4 py-4 sm:px-6'>
          <div className='min-w-0 flex-1 flex items-center'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <PaymentTypeIcon type={type} />
              </div>
            </div>
            <div className='hidden sm:flex flex-col items-start text-gray-900 dark:text-gray-300'>
              <p className='text-sm capitalize text-left w-16'>{getFriendlyType(type)}</p>
              <p className='text-xs whitespace-nowrap'>
                {creation_date && moment.unix(creation_date).format('h:mm A')}
              </p>
            </div>
            <div className='sm:flex sm:justify-between flex-wrap w-full items-center px-4 truncate'>
              <p className='text-left text-sm font-medium text-yellow-600 truncate'>{title}</p>
              <p className='hidden sm:flex items-center text-sm text-gray-900 dark:text-gray-300'>
                {value_sat ? <Unit value={value_sat} /> : null}
              </p>
              <p className='flex sm:hidden items-center text-sm text-gray-900 dark:text-gray-300'>
                {type === 'PAYMENT_RECEIVE' || type === 'PAYMENT_SEND'
                  ? getFriendlyType(type)
                  : null}{' '}
                <Unit value={value_sat} />{' '}
                {creation_date ? `at ${moment.unix(creation_date).format('h:mm A')}` : ''}
              </p>
            </div>
            <div>
              <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </div>
          </div>
        </div>
      </button>
    </li>
  );
};

export default AcvitityRow;
