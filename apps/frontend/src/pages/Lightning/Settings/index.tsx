import React, { useState } from 'react';

import { Tabs } from 'src/components';

import GeneralView from './GeneralView';
import ChannelsView from '../Channels';
import ExportView from './ExportView';

const LightningSettings = () => {
  const [currentTab, setCurrentTab] = useState('general');

  const tabItems = [
    { name: 'General', tabId: 'general' },
    { name: 'Channels', tabId: 'channels' }
  ];

  return (
    <div className='bg-white dark:bg-gray-800 shadow rounded-md px-8'>
      <div className='pt-10 pb-16'>
        <h2 className='text-3xl font-extrabold text-gray-900 dark:text-gray-300 mb-2'>Settings</h2>
        <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} items={tabItems} />
        {currentTab === 'general' && <GeneralView />}
        {currentTab === 'channels' && <ChannelsView />}
        {currentTab === 'export' && <ExportView />}
      </div>
    </div>
  );
};

export default LightningSettings;
