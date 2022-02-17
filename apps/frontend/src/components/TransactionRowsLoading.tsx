import React from 'react';
import styled from 'styled-components';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { GrayLoadingAnimation } from 'src/components';

import { white, gray50 } from 'src/utils/colors';

interface Props {
  flat: boolean;
}

const LoadingRow = () => (
  <div className='border border-gray-300 shadow rounded-md p-4 w-full mx-auto'>
    <div className='animate-pulse flex space-x-4'>
      <div className='flex items-center'>
        <div className='rounded-full bg-gray-400 h-10 w-10'></div>
        <div className='flex flex-col space-y-1 ml-2'>
          <div className='h-4 w-12 bg-gray-400 rounded col-span-3'></div>
          <div className='h-2 w-8 bg-gray-400 rounded col-span-3'></div>
        </div>
      </div>
      <div className='flex-1 space-y-6 py-1'>
        <div className='space-y-3'>
          <div className='grid grid-cols-5 grid-rows-2 gap-2 items-center'>
            <div className='h-3 bg-gray-400 rounded col-span-2'></div>
            <div className='h-2 bg-gray-400 rounded col-span-4'></div>
          </div>
        </div>
      </div>
      <div className='flex items-center space-y-6 py-1'>
        <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
      </div>
    </div>
  </div>
);

const LoadingSection = ({ numRows }: { numRows: number }) => (
  <div className='space-y-4 mt-4'>
    <div className='h-3 w-48 bg-gray-300 dark:bg-gray-700 rounded col-span-3 mt-4'></div>
    {Array.from(Array(numRows).keys()).map(() => (
      <LoadingRow />
    ))}
  </div>
);

export const TransactionRowsLoading = () => {
  const randomArray = Array.from({ length: 3 }, () => Math.ceil(Math.random() * 3));
  return (
    <>
      {randomArray.map((num) => (
        <LoadingSection numRows={num} />
      ))}
    </>
  );
};
