import React, { useState, useRef, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/outline';

import { Address } from '@lily/types';

interface Props {
  address: Address;
  onSave: (address: string, labelText: string) => void;
}

export const AddLabelTag = ({ address, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState('');

  const saveLabel = async () => {
    if (labelText) {
      onSave(address.address, labelText);
      setIsEditing(false);
      setLabelText('');
    }
  };

  return (
    <>
      <button
        type='button'
        onClick={() => setIsEditing(true)}
        className='absolute top-0 right-0 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-400 hover:border-slate-900/15 dark:hover:border-gray-100  hover:text-gray-500 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
      >
        <span className='sr-only'>Add tag</span>
        <svg
          className='h-5 w-5'
          x-description='Heroicon name: mini/plus'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path d='M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'></path>
        </svg>
      </button>
      {isEditing ? (
        <span className='inline-flex overflow-visible items-center rounded-full border-2 border-dashed border-gray-300 dark:border-slate-500 bg-slate-100 dark:bg-slate-800 py-0.5 px-2 text-sm font-medium text-slate-700'>
          <input
            onChange={(e) => setLabelText(e.target.value)}
            value={labelText}
            autoFocus
            type='text'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveLabel();
              }
            }}
            size={labelText.length < 2 ? 2 : labelText.length}
            className='outline-none w-full inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-1 text-sm font-medium text-slate-700 dark:text-slate-200'
          />
          <button
            type='button'
            className='cursor-pointer ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-500 focus:bg-slate-500 focus:text-white focus:outline-none'
            onClick={() => saveLabel()}
          >
            <span className='sr-only'>Save tag</span>
            <CheckIcon className='h-4 w-4' />
          </button>
        </span>
      ) : null}
    </>
  );
};
