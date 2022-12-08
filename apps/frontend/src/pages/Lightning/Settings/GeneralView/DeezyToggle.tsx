import React, { useContext, useState } from 'react';
import { Switch } from '@headlessui/react';
import { ExternalLinkIcon } from '@heroicons/react/outline';

import FlowerLoading from 'src/assets/flower-loading.svg';

import { PlatformContext } from 'src/context';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DeezyToggle() {
  const { platform } = useContext(PlatformContext);
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDeezy = async () => {
    try {
      setIsLoading(true);
      if (enabled) {
        const macaroon = await platform.bakeMacaroon();
        setEnabled(false);
      } else {
        const { deleted } = await platform.revokeMacaroon();
        setEnabled(true);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <dl className='divide-y divide-gray-200 dark:divide-gray-700'>
      <Switch.Group as='div' className='py-4 md:grid lg:grid-cols-3 lg:gap-4 lg:py-5'>
        <Switch.Label
          as='dt'
          className='text-sm font-medium text-gray-500 dark:text-gray-400'
          passive
        >
          <a
            href='https://deezy.io/'
            target='_blank'
            className='hover:text-green-500 flex items-center justify-start'
          >
            Deezy.io <ExternalLinkIcon className='h-3 w-3 ml-1' />
          </a>
        </Switch.Label>
        <dd className='mt-1 flex text-sm text-gray-900 dark:text-gray-300 sm:col-span-2 sm:mt-0'>
          <Switch.Description as='span' className='flex-grow'>
            <span className='flex-grow'>Automatic Channel Management</span>
          </Switch.Description>
          <span className='ml-4 flex-shrink-0'>
            <Switch
              checked={enabled}
              onChange={toggleDeezy}
              className={classNames(
                enabled ? 'bg-green-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              )}
            >
              <span
                className={classNames(
                  enabled ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              >
                <span
                  className={classNames(
                    enabled
                      ? 'opacity-0 ease-out duration-100'
                      : 'opacity-100 ease-in duration-200',
                    'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                  )}
                  aria-hidden='true'
                >
                  {isLoading ? (
                    <img className='h-3 w-3' src={FlowerLoading} />
                  ) : (
                    <svg className='h-3 w-3 text-gray-400' fill='none' viewBox='0 0 12 12'>
                      <path
                        d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                        stroke='currentColor'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={classNames(
                    enabled
                      ? 'opacity-100 ease-in duration-200'
                      : 'opacity-0 ease-out duration-100',
                    'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                  )}
                  aria-hidden='true'
                >
                  {isLoading ? (
                    <img className='h-3 w-3' src={FlowerLoading} />
                  ) : (
                    <svg className='h-3 w-3 text-green-600' fill='currentColor' viewBox='0 0 12 12'>
                      <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                    </svg>
                  )}
                </span>
              </span>
            </Switch>
          </span>
        </dd>
      </Switch.Group>
    </dl>
  );
}
