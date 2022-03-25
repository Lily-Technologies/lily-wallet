import React from 'react';
import { Link } from 'react-router-dom';
import { AddCircleOutline } from '@styled-icons/material';

export const AddNewAccountListItem = () => {
  return (
    <li>
      <Link to={'/setup'} className='group block dark:hover:bg-gray-700 hover:bg-gray-50'>
        <div className='flex items-center py-3 px-3'>
          <div className='min-w-0 flex-1 flex items-center'>
            <div className='flex-shrink-0 px-1'>
              <AddCircleOutline className='h-6 w-6 text-yellow-500' />
            </div>
            <div className='min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4'>
              <div>
                <p className='text-sm font-medium text-green-600 dark:text-green-500 truncate'>
                  Add a new account
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
