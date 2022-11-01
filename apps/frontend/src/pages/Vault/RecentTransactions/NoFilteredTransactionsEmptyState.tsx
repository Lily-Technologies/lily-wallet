import React from 'react';
import DeadFlowerImage from 'src/assets/dead-flower.svg';

const NoFilteredTransactionsEmptyState = () => (
  <div className='my-16 h-96 w-full bg-white dark:bg-gray-800 space-y-6 flex flex-col items-center justify-center rounded-2xl shadow dark:highlight-white/10'>
    <h3 className='text-2xl text-gray-600 dark:text-gray-300 font-medium'>No Transactions</h3>
    <img className='text-gray-600 w-24 h-24' src={DeadFlowerImage} />
    <p className='text-gray-600 dark:text-gray-400 font-sm font-medium'>
      No transactions match the search criteria.
    </p>
  </div>
);

export default NoFilteredTransactionsEmptyState;
