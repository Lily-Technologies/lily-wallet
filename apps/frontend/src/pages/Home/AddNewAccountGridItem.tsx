import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AddCircleOutline } from '@styled-icons/material';

import { AccountMapContext } from 'src/context/AccountMapContext';

export const AddNewAccountGridItem = () => {
  const { accountMap } = useContext(AccountMapContext);
  return (
    <li className='col-span-12 lg:col-span-6 h-36'>
      <Link
        className='h-36 flex align-center dark:bg-gray-800 bg-white overflow-hidden shadow rounded-lg dark:hover:bg-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-offset-gray-100 focus:ring-green-500'
        to={`/setup`}
      >
        <div className='flex align-center p-5'>
          <div className='flex items-center'>
            <AddCircleOutline className='h-12 w-12 text-yellow-500' />
            <div className='flex flex-col p-4'>
              <h4 className='text-md font-semibold dark:text-green-500 text-green-600 truncate'>
                Add a new account
              </h4>
              <span className='text-xs font-medium dark:text-gray-300 text-gray-500'>
                Create a new account to send, receive, and manage bitcoin
              </span>
            </div>
          </div>
        </div>
      </Link>
      {!accountMap.size && <div className='h-0 w-0'></div>}
    </li>
  );
};
