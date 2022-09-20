import { Fragment, useContext } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router-dom';

import { DeviceImage } from 'src/components';

import { AccountMapContext } from 'src/context';

import { mailto } from 'src/utils/files';

import { ExtendedPublicKey, OnChainConfig } from '@lily/types';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  extendedPublicKey: ExtendedPublicKey;
  hideActionButtons: boolean;
}

const DeviceDetailsHeader = ({ extendedPublicKey, hideActionButtons }: Props) => {
  const history = useHistory();
  const { currentAccount } = useContext(AccountMapContext);
  return (
    <div className='pb-6 border-b border-gray-200 dark:border-slate-500'>
      <div className='h-24 bg-yellow-400 sm:h-20 lg:h-28' />
      <div className='lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6'>
        <div>
          <div className='-m-1 flex'>
            <div className='inline-flex overflow-hidden rounded-lg border-4 border-white dark:border-slate-600 bg-gray-100 dark:bg-slate-700 px-4 py-2'>
              <DeviceImage
                device={extendedPublicKey.device}
                className='h-24 w-18 flex-shrink-0 sm:h-40 sm:w-28 lg:h-48 lg:w-32'
              />
            </div>
          </div>
        </div>
        <div className='mt-6 sm:ml-6 sm:flex-1'>
          <div className='mb-4'>
            <div className='flex items-center'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-slate-200 sm:text-2xl capitalize'>
                {extendedPublicKey.device.type}
              </h3>
              <span className='ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400'>
                <span className='sr-only'>Online</span>
              </span>
            </div>
            <p className='text-sm text-gray-500 dark:text-slate-400 uppercase'>
              {extendedPublicKey.device.fingerprint}
            </p>
          </div>
          <Transition
            as={Fragment}
            show={!hideActionButtons}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <div className='mt-1 flex flex-wrap space-y-3 sm:space-y-0 sm:space-x-3'>
              <button
                type='button'
                className='inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:flex-1'
                onClick={() =>
                  history.push({
                    pathname: '/setup',
                    search: `?status=replace&config=${JSON.stringify({
                      ...currentAccount.config,
                      extendedPublicKeys: (
                        currentAccount.config as OnChainConfig
                      ).extendedPublicKeys.filter(
                        (item) => item.parentFingerprint !== extendedPublicKey.parentFingerprint
                      )
                    })}`
                  })
                }
              >
                Replace device
              </button>
              <a
                href={mailto([extendedPublicKey.device.owner?.email || ''])}
                type='button'
                className='inline-flex w-full flex-1 disabled:pointer-events-none disabled:cursor-no-drop items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              >
                Email owner
              </a>
              <div className='ml-3 inline-flex sm:ml-0'>
                <Menu as='div' className='relative inline-block text-left'>
                  <Menu.Button className='inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
                    <span className='sr-only'>Open options menu</span>
                    <DotsVerticalIcon className='h-5 w-5' aria-hidden='true' />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      <div className='py-1'>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href='#'
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Export to file
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsHeader;
