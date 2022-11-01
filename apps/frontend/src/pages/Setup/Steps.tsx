import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';

interface Props {
  step: number;
  setupOption: number;
}

const Steps = ({ step, setupOption }: Props) => {
  const steps = [
    {
      id: '01',
      name: `Give your ${setupOption === 1 ? 'vault' : 'wallet'} a name`,

      status: step === 1 ? 'current' : 'complete'
    },
    { id: '02', name: '', status: step === 1 ? 'upcoming' : step === 2 ? 'current' : 'complete' },
    {
      id: '03',
      name: 'Review details',
      status: step < 3 ? 'upcoming' : step === 3 ? 'current' : 'complete'
    }
  ];

  if (setupOption === 1 || setupOption === 3) {
    steps[1].name = 'Add signing devices';
  } else if (setupOption === 2) {
    steps[1].name = 'Write down recovery words';
  } else if (setupOption === 4) {
    steps[1].name = 'Input your node connection information';
  }

  return (
    <nav aria-label='Progress' className='w-full'>
      <ol
        role='list'
        className='border-l border-r border-b border-gray-300 dark:border-gray-500 rounded-b-md divide-y divide-gray-300 dark:divide-gray-500 md:flex md:divide-y-0 mb-6 md:mb-12'
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className='relative md:flex-1 md:flex'>
            {step.status === 'complete' ? (
              <span className='group flex items-center w-full'>
                <span className='px-6 py-4 flex items-center text-sm font-medium'>
                  <span className='flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-600 rounded-full'>
                    <CheckIcon className='w-6 h-6 text-white' aria-hidden='true' />
                  </span>
                  <span className='ml-4 text-sm font-medium text-gray-900 dark:text-gray-300'>
                    {step.name}
                  </span>
                </span>
              </span>
            ) : step.status === 'current' ? (
              <span className='px-6 py-4 flex items-center text-sm font-medium' aria-current='step'>
                <span className='flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-green-600 rounded-full'>
                  <span className='text-green-600 dark:text-green-500'>{step.id}</span>
                </span>
                <span className='ml-4 text-sm font-medium text-green-600 dark:text-green-500'>
                  {step.name}
                </span>
              </span>
            ) : (
              <span className='group flex items-center'>
                <span className='px-6 py-4 flex items-center text-sm font-medium'>
                  <span className='flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 dark:border-gray-400 rounded-full'>
                    <span className='text-gray-500 dark:text-gray-400'>{step.id}</span>
                  </span>
                  <span className='ml-4 text-sm font-medium text-gray-500 dark:text-gray-400'>
                    {step.name}
                  </span>
                </span>
              </span>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div
                  className='hidden md:block absolute top-0 right-0 h-full w-5'
                  aria-hidden='true'
                >
                  <svg
                    className='h-full w-full text-gray-300'
                    viewBox='0 0 22 80'
                    fill='none'
                    preserveAspectRatio='none'
                  >
                    <path
                      d='M0 -2L20 40L0 82'
                      vectorEffect='non-scaling-stroke'
                      stroke='currentcolor'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Steps;
