import React, { useState } from 'react';
import styled from 'styled-components';
import { Network } from 'bitcoinjs-lib';

import GeneralView from './GeneralView';
import ChannelsView from '../Channels';
import ExportView from './ExportView';
import SettingsTabs from './SettingsTabs';

import { white } from 'src/utils/colors';
import { NodeConfigWithBlockchainInfo } from '@lily/types';

interface Props {
  password: string;
  currentBitcoinNetwork: Network;
}

const LightningSettings = ({ password }: Props) => {
  const [currentTab, setCurrentTab] = useState('general');

  return (
    <div className='bg-white dark:bg-gray-800 shadow rounded-md px-8'>
      <div className='pt-10 pb-16'>
        <h2 className='text-3xl font-extrabold text-gray-900 dark:text-gray-300 mb-2'>Settings</h2>
        <SettingsTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {currentTab === 'general' && <GeneralView password={password} />}
        {currentTab === 'channels' && <ChannelsView />}
        {currentTab === 'export' && <ExportView />}
      </div>
    </div>
  );
};

export default LightningSettings;
