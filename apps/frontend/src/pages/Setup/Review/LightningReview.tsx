import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Dropdown, Unit } from 'src/components';

import { ConfigContext, PlatformContext, AccountMapContext } from 'src/context';

import { createLightningConfigFile, saveConfig } from 'src/utils/files';

import { LightningConfig } from '@lily/types';
import { ChannelBalanceResponse, GetInfoResponse } from '@lily-technologies/lnrpc';

interface Props {
  newAccount: LightningConfig;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  tempLightningState: GetInfoResponse & ChannelBalanceResponse;
}

const LightningReview = ({ setStep, newAccount, tempLightningState }: Props) => {
  const { config, password, currentBitcoinNetwork, setConfigFile } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const { setCurrentAccountId } = useContext(AccountMapContext);
  const history = useHistory();

  const account = newAccount as LightningConfig;

  const confirmSave = async () => {
    const newAccountId = uuidv4();
    const updatedConfig = createLightningConfigFile(
      newAccountId,
      newAccount,
      config,
      currentBitcoinNetwork
    );
    await saveConfig(updatedConfig, password, platform);
    setConfigFile(updatedConfig);
    setCurrentAccountId(newAccountId);
    history.push(`/lightning/${newAccountId}`);
  };

  return (
    <div className='w-full justify-center text-gray-900 dark:text-gray-200 overflow-x-hidden px-2 pb-2'>
      <div className='flex flex-col mb-6'>
        <h3 className='text-gray-600 text-xl'>New Account</h3>
        <h1 className='text-gray-900 dark:text-gray-200 font-medium text-3xl'>
          Confirm lightning details
        </h1>
      </div>

      <div className='bg-white dark:bg-gray-800 border-t-8 border-green-600 shadow-sm rounded-t-lg'>
        <div className='flex items-center p-4 border-b border-gray-200 dark:border-gray-600 sm:p-6 sm:grid sm:grid-cols-4 sm:gap-x-6'>
          <dl className='flex-1 grid grid-cols-2 gap-x-6 text-sm sm:col-span-2 sm:grid-cols-2 lg:col-span-2'>
            <div>
              <dt className='font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap'>
                Account name
              </dt>
              <dd className='mt-1 text-gray-500 dark:text-gray-300'>{account.name}</dd>
            </div>
          </dl>

          <div className='hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4'>
            <button
              onClick={() => setStep(1)}
              className='flex items-center justify-center bg-white dark:bg-gray-700 py-2 px-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            >
              Edit
            </button>
          </div>

          <Dropdown
            className='relative flex justify-end lg:hidden'
            minimal={true}
            dropdownItems={[]}
          />
        </div>
        <div role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
          <div className='py-6 px-4 sm:px-6 flex items-center justify-between'>
            <dt className='text-gray-600'>Node alias</dt>
            <dd className='font-medium text-gray-900'>{tempLightningState.alias}</dd>
          </div>
          <div className='py-6 px-4 sm:px-6 flex items-center justify-between'>
            <dt className='text-gray-600'>Channels</dt>
            <dd className='font-medium text-gray-900'>
              {tempLightningState.numActiveChannels} channels
            </dd>
          </div>
          <div className='py-6 px-4 sm:px-6 flex items-center justify-between'>
            <dt className='text-gray-600'>Current balance</dt>
            <dd className='font-medium text-gray-900'>
              <Unit value={Number(tempLightningState.balance)} />
            </dd>
          </div>
        </div>
      </div>
      <button
        onClick={() => confirmSave()}
        className='w-full flex text-lg font-semibold items-center justify-center bg-green-600 py-4 px-6 rounded-b-lg shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Complete setup
      </button>
    </div>
  );
};

export default LightningReview;
