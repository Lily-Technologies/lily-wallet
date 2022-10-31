import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export const SlideOver = ({ open, setOpen, content, className = 'max-w-2xl' }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 overflow-hidden z-20'
        onClose={() => setOpen(false)}
      >
        <div className='absolute inset-0 overflow-hidden'>
          <Transition.Child
            as={Fragment}
            enter='ease-in-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in-out duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-y-0 right-0 pl-2 max-w-full flex sm:pl-16'>
            <Transition.Child
              as={Fragment}
              enter='transform transition ease-in-out duration-300 sm:duration-400'
              enterFrom='translate-x-full'
              enterTo='translate-x-0'
              leave='transform transition ease-in-out duration-300 sm:duration-400'
              leaveFrom='translate-x-0'
              leaveTo='translate-x-full'
            >
              <div className={`w-screen ${className}`}>
                <div className='h-screen flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-y-scroll'>
                  {content}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
