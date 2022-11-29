import React from 'react';
import DeadFlowerImage from 'src/assets/dead-flower.svg';

const NoTransactionsEmptyState = () => (
  <div className='h-96 w-full bg-white dark:bg-gray-800 space-y-6 flex flex-col items-center justify-center rounded-2xl shadow dark:highlight-white/10'>
    <h3 className='text-2xl text-gray-600 dark:text-gray-300 font-medium'>No Transactions</h3>
    <img className='text-gray-600 w-24 h-24' src={DeadFlowerImage} />
    <p className='text-gray-600 dark:text-gray-400 font-sm font-medium'>
      No activity has been detected on this account yet.
    </p>
  </div>
);

export default NoTransactionsEmptyState;
