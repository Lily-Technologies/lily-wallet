import React, { Fragment, useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

import FlowerHeroImage from 'src/assets/lily-image.jpg';
import LilyDecorativeTrim from 'src/assets/lily-trim.svg';

import { Loading } from 'src/components';

import { File } from '@lily/types';

import UnlockForm from './UnlockForm';
import SignupForm from './SignupForm';

const OnboardingItems = [
  {
    header: 'Self-custody made simple',
    subtext:
      'Take full control of your bitcoin by taking it off of exchanges and into a wallet you control.'
  },
  {
    header: 'All accounts in one place',
    subtext:
      'Manage hardware wallets, lightning network accounts, and multisignature vaults all in one place.'
  },
  {
    header: 'World class support',
    subtext:
      'Get access to bitcoin experts who are available to help when you have questions or need help.'
  }
];

interface Props {
  encryptedConfigFile: File | null;
  setEncryptedConfigFile: React.Dispatch<React.SetStateAction<File | null>>;
  currentBlockHeight: number | undefined;
  fetchingEncryptedConfig: boolean;
}

const Login = ({
  encryptedConfigFile,
  setEncryptedConfigFile,
  currentBlockHeight,
  fetchingEncryptedConfig
}: Props) => {
  const [mode, setMode] = useState<'unlock' | 'create'>('unlock');

  useEffect(() => {
    if (!fetchingEncryptedConfig && !encryptedConfigFile) {
      onClickCreateNew();
    }
  }, [fetchingEncryptedConfig, encryptedConfigFile]);

  const onClickCreateNew = () => {
    setMode('create');
  };

  return (
    <div className='flex-auto min-h-full flex bg-white dark:bg-gray-900'>
      <div className='flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        {fetchingEncryptedConfig ? <Loading message='Initializing...' /> : null}
        {!fetchingEncryptedConfig && mode === 'unlock' ? (
          <UnlockForm
            encryptedConfigFile={encryptedConfigFile}
            fetchingEncryptedConfig={fetchingEncryptedConfig}
            setEncryptedConfigFile={setEncryptedConfigFile}
            currentBlockHeight={currentBlockHeight}
            onClickCreateNew={onClickCreateNew}
          />
        ) : null}
        {!fetchingEncryptedConfig && mode === 'create' ? (
          <SignupForm encryptedConfigFile={encryptedConfigFile} cancel={() => setMode('unlock')} />
        ) : null}
      </div>
      <div className='hidden lg:block relative w-0 flex-1'>
        <img
          className='absolute inset-0 h-full w-full object-cover'
          src={FlowerHeroImage}
          alt='Lily hero image'
        />
        <Transition
          as={Fragment}
          show={!fetchingEncryptedConfig && mode === 'create'}
          enter='transition transform ease-in-out duration-500'
          enterFrom='transform opacity-0 scale-50'
          enterTo='transform opacity-100 scale-100'
          leave='transition transform ease-in-out duration-500'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-50'
        >
          <div className='inset-center w-[30rem] xl:w-[34rem]'>
            <div className='opacity-[95] overflow-hidden relative animate-float bg-gradient-to-br from-white to-pink-50 flex flex-col justify-center rounded-2xl max-w-prose'>
              <div className='py-12 xl:px-10 px-10'>
                <h2 className='text-2xl font-semibold text-slate-900'>Welcome to Lily Wallet</h2>
                <p className='text-md font-medium leading- mt-2 text-slate-700 max-w-md'>
                  Lily Wallet is a secure bitcoin wallet designed for everyone on their journey
                  towards financial freedom.
                </p>
                <div className='space-y-6 py-6 max-w-md'>
                  {OnboardingItems.map((item) => (
                    <div className='flex'>
                      <svg
                        aria-hidden='true'
                        viewBox='0 0 32 32'
                        className='h-8 w-8 flex-none text-green-500 fill-current'
                      >
                        <path d='M11.83 15.795a1 1 0 0 0-1.66 1.114l1.66-1.114Zm9.861-4.072a1 1 0 1 0-1.382-1.446l1.382 1.446ZM14.115 21l-.83.557a1 1 0 0 0 1.784-.258L14.115 21Zm.954.3c1.29-4.11 3.539-6.63 6.622-9.577l-1.382-1.446c-3.152 3.013-5.704 5.82-7.148 10.424l1.908.598Zm-4.9-4.391 3.115 4.648 1.661-1.114-3.114-4.648-1.662 1.114Z'></path>
                      </svg>
                      <div className='ml-2'>
                        <h2 className='text-lg font-semibold'>{item.header}</h2>
                        <p className='text-sm font-medium text-slate-700'>{item.subtext}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='group mt-4'>
                  <span>
                    <a href='https://lily-wallet.com/setup-walkthrough' target='_blank'>
                      <a
                        target='_blank'
                        className='w-max text-base font-medium text-yellow-600 group-hover:text-yellow-700 dark:text-yellow-500 dark:group-hover:text-yellow-400 flex items-center rounded-md focus:ring-1 focus:ring-yellow-600 dark:focus:ring-yellow-500 outline-none'
                      >
                        Schedule a setup walkthrough with an expert
                        <ArrowNarrowRightIcon className='h-5 w-5 fill-current ml-4' />
                      </a>
                    </a>
                  </span>
                </div>
              </div>

              <img
                className='transform rotate-[-150deg] absolute -top-5 -right-14 w-64 mx-auto py-4 opacity-50'
                src={LilyDecorativeTrim}
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default Login;
