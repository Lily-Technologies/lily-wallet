import { useContext, useEffect, useState } from 'react';
import { PencilIcon, CheckIcon } from '@heroicons/react/outline';

import { PlatformContext } from 'src/context';

interface Props {
  txid: string;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const TransactionDescription = ({ txid, description, setDescription }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const { platform } = useContext(PlatformContext);

  const onSave = async () => {
    await platform.addTransactionDescription(txid, description);
    setIsEditing(false);
  };

  return (
    <div className=''>
      <h3 className='text-sm font-medium text-gray-500 dark:text-slate-400'>Description</h3>
      <div className='flex items-center justify-between'>
        {isEditing ? (
          <div className='relative mt-1 rounded-2xl shadow-sm w-full'>
            <input
              type='text'
              name='description'
              id='description'
              autoFocus
              className='block w-full rounded-2xl border-gray-300 dark:border-slate-700 dark:text-slate-200 dark:highlight-white/10 dark:hover:bg-slate-600 dark:bg-slate-800 focus:border-green-500 focus:ring-green-500 sm:text-sm'
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSave();
                }
              }}
            />
            <div className='absolute inset-y-0 right-0 flex items-center'>
              <button
                onClick={() => onSave()}
                className='p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-600 focus:border-green-500 focus:ring-green-500 active:bg-gray-100 active:ring-green-500 active:border-green-500 active:border-2 focus:border-2 outline-none'
              >
                <CheckIcon className='h-5 w-5 dark:text-slate-200' aria-hidden='true' />
              </button>
            </div>
          </div>
        ) : description ? (
          <p className='text-gray-900 dark:text-slate-200 font-medium'>{description}</p>
        ) : (
          <p className='text-sm italic text-gray-500'>Add a description to this transaction.</p>
        )}
        {!isEditing ? (
          <button
            type='button'
            className='-mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500'
            onClick={() => setIsEditing(!isEditing)}
          >
            <PencilIcon className='h-5 w-5' aria-hidden='true' />
            <span className='sr-only'>Add description</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
