import { Header } from 'src/components/';

import { SetStateNumber } from 'src/types';

interface Props {
  headerText: string;
  setStep: SetStateNumber;
  showCancel: boolean;
}

const PageHeader = ({ headerText, setStep, showCancel }: Props) => {
  return (
    <div className='flex justify-between items-center mb-6 px-1'>
      <div className='flex flex-col'>
        <h3 className='text-gray-600 text-lg'>New Account</h3>
        <h1 className='text-gray-900 dark:text-gray-200 font-medium text-3xl'>{headerText}</h1>
      </div>
      <div className='flex'>
        {showCancel ? (
          <button
            type='button'
            className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2  focus:ring-green-500'
            onClick={() => {
              setStep(0);
            }}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default PageHeader;
