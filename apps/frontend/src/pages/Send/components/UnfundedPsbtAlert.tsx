import React, { useState } from 'react';
import { Psbt } from 'bitcoinjs-lib';
import { ExclamationIcon } from '@heroicons/react/solid';

import { classNames } from 'src/utils/other';

interface Props {
  addInputs: () => Promise<Psbt>;
  hidden: boolean;
}

const UnfundedPsbtAlert = ({ addInputs, hidden }: Props) => {
  const [displayAlert, setDisplayAlert] = useState(!hidden);
  return (
    <div
      className={classNames(
        displayAlert ? '' : 'hidden',
        'bg-yellow-50 p-4 border-l-4 border-yellow-400'
      )}
    >
      <div className='flex'>
        <div className='flex-shrink-0'>
          <ExclamationIcon className='h-5 w-5 text-yellow-400' aria-hidden='true' />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-yellow-800'>This transaction is not funded.</h3>
          <div className='mt-2 text-sm text-yellow-700'>
            <p>
              This transaction does not have any inputs. Add inputs in order to sign the transaction
              and broadcast it to the bitcoin network.
            </p>
          </div>
          <div className='mt-4'>
            <div className='-mx-2 -my-1.5 flex'>
              <button
                type='button'
                onClick={() => {
                  addInputs();
                  setDisplayAlert(false);
                }}
                className='bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600'
              >
                Fix issue
              </button>
              <button
                type='button'
                onClick={() => setDisplayAlert(false)}
                className='ml-3 bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600'
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnfundedPsbtAlert;
