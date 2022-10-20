import React, { useContext } from 'react';
import { XIcon } from '@heroicons/react/outline';

import { Unit, Price } from 'src/components';

import { TransactionDescription } from './TransactionDescription';

import { AccountMapContext } from 'src/context';

import { createMap } from 'src/utils/accountMap';
import { LilyOnchainAccount, Transaction } from '@lily/types';

interface Props {
  transaction: Transaction;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const TxDetailsSlideover = ({ transaction, setOpen, description, setDescription }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const { addresses } = currentAccount as LilyOnchainAccount;

  const addressMap = createMap(addresses, 'address');

  return (
    <>
      <div className='flex justify-between bg-white px-5 py-4 sm:px-6  dark:bg-slate-800 border-b border-gray-700/20 dark:border-slate-500/20'>
        <div className='space-y-1 '>
          <h2
            className='text-xl font-medium text-gray-900 dark:text-slate-100'
            id='slide-over-title'
          >
            Transaction details
          </h2>
        </div>
        <div className='ml-3 flex h-7 items-center'>
          <button
            className='rounded-md text-gray-400 hover:text-gray-500 dark:text-white dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
            onClick={() => setOpen(false)}
          >
            <span className='sr-only'>Close panel</span>
            <XIcon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
      </div>

      <div className='pb-4'>
        <div className='px-5 py-4 sm:px-6 space-y-8'>
          <div>
            <h2 className='text-md font-medium text-gray-500 dark:text-slate-400'>
              Transaction ID
            </h2>
            <p className='text-gray-800 dark:text-slate-200 font-medium'>{transaction.txid}</p>
          </div>

          <div className=''>
            <h2 className='text-md font-medium text-gray-500 dark:text-slate-400'>Status:</h2>

            <p className='text-gray-900 dark:text-slate-200 font-medium'>
              {transaction.status.confirmed
                ? `Confirmed ${transaction.status.block_height} blocks ago`
                : 'Unconfirmed'}
            </p>
          </div>

          <TransactionDescription
            txid={transaction.txid}
            description={description}
            setDescription={setDescription}
          />

          <div className=''>
            <div className='flex items-center pb-2'>
              <h2 className='text-md font-medium text-gray-500 dark:text-slate-400 flex items-center'>
                Inputs
              </h2>
              <span className='bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-400 hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'>
                {transaction.vin.length}
              </span>
            </div>
            <ul className='max-h-[50vh] overflow-auto space-y-4 py-1'>
              {transaction.vin.map((input) => {
                return (
                  <li className='border-gray-800/15 bg-white dark:bg-slate-800 dark:border-slate-800 shadow flex items-center justify-between w-full p-4 border dark:highlight-white/10 rounded-2xl group'>
                    <span className='text-sm dark:text-slate-400 truncate'>
                      {input.txid}:{input.vout}
                    </span>
                    <span className='font-medium dark:text-slate-200'>
                      <Unit className='whitespace-nowrap' value={input.prevout.value} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <div className='flex items-center pb-2'>
              <h2 className='text-md font-medium text-gray-500 dark:text-slate-400 flex items-center'>
                Outputs
              </h2>
              <span className='bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-400 hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'>
                {transaction.vout.length}
              </span>
            </div>
            <ul className='space-y-4 py-1 max-h-36 overflow-y-scroll'>
              {transaction.vout.map((output) => (
                <li className='border-gray-800/15 bg-white dark:bg-slate-800 dark:border-slate-800 shadow flex items-center justify-between w-full p-4 border dark:highlight-white/10 rounded-2xl group'>
                  <span className='text-sm dark:text-slate-400 truncate'>
                    {output.scriptpubkey_address}
                  </span>{' '}
                  <span className='text-right font-medium ml-8 grow-0 whitespace-nowrap dark:text-slate-200'>
                    <Unit value={output.value} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex justify-between'>
            <h2 className='text-md font-medium text-gray-500 dark:text-slate-400'>Fees:</h2>

            <span className='text-gray-900 dark:text-slate-200 font-medium'>
              <Unit value={transaction.fee} /> (<Price value={transaction.fee} />)
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TxDetailsSlideover;
