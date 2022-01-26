import { Fragment, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import { NavLinks } from 'src/components';
import { SidebarContext } from 'src/context/SidebarContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Sidebar = ({ currentBitcoinNetwork }) => {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 flex z-40 md:hidden' onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-75' />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white'>
              <Transition.Child
                as={Fragment}
                enter='ease-in-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in-out duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='absolute top-0 right-0 -mr-12 pt-2'>
                  <button
                    type='button'
                    className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className='sr-only'>Close sidebar</span>
                    <XIcon className='h-6 w-6 text-white' aria-hidden='true' />
                  </button>
                </div>
              </Transition.Child>
              <div className='flex-1 h-0 pb-4 overflow-y-auto'>
                <nav className=''>
                  <NavLinks currentBitcoinNetwork={currentBitcoinNetwork} />
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className='flex-shrink-0 w-14'></div>
        </Dialog>
      </Transition.Root>

      <div className='hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 shadow-sm border-r-2 border-gray-100 z-10'>
        <div className='flex-1 flex flex-col min-h-0 bg-white'>
          <div className='flex-1 flex flex-col pb-4 overflow-y-auto'>
            <nav
              className={classNames(
                process.env.REACT_APP_IS_ELECTRON ? 'mt-12' : 'mt-5',
                ' flex-1'
              )}
            >
              <NavLinks currentBitcoinNetwork={currentBitcoinNetwork} />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};
