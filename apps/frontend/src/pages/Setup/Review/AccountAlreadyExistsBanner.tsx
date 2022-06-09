import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ExclamationIcon } from '@heroicons/react/solid';

import { AccountMapContext } from 'src/context';
import { AccountId } from '@lily/types';

interface Props {
  accountId: AccountId;
}

export default function AccountAlreadyExistsBanner({ accountId }: Props) {
  const { setCurrentAccountId } = useContext(AccountMapContext);

  return (
    <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <ExclamationIcon className='h-5 w-5 text-yellow-400' aria-hidden='true' />
        </div>
        <div className='ml-3 flex-1 md:flex md:justify-between'>
          <p className='text-sm text-yellow-700'>This account already exists. </p>
          <p className='mt-3 text-sm md:mt-0 md:ml-6'>
            <Link
              onClick={() => setCurrentAccountId(accountId)}
              to={`/vault/${accountId}`}
              className='whitespace-nowrap font-medium text-yellow-700 hover:text-yellow-600'
            >
              View account <span aria-hidden='true'>&rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
