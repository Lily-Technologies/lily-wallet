import React, { useContext, useState } from 'react';
import ChannelRow from 'src/pages/Lightning/Channels/ChannelView/ChannelRow';

import { AccountMapContext } from 'src/context';
import { LilyLightningAccount } from '@lily/types';

interface Props {
  onSave: (outgoingChanId: string) => void;
}

export const ChannelSlideover = ({ onSave }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const [outgoingChanId, setOutgoingChanId] = useState('');

  return (
    <div className='py-6 px-2 flex flex-col h-full'>
      <h2 className='text-xl font-medium text-slate-900 dark:text-slate-100 pb-4'>
        Select a channel
      </h2>
      <div className='flex-grow overflow-y-auto shadow-inner'>
        {(currentAccount as LilyLightningAccount).channels.map((channel) => (
          <ChannelRow
            {...channel}
            selected={outgoingChanId === channel.chanId}
            status={channel.active ? 'active' : 'inactive'}
            onClick={() => setOutgoingChanId(channel.chanId)}
          />
        ))}
      </div>

      <div className='text-right flex items-center justify-end pt-4'>
        <button
          onClick={() => setOutgoingChanId('')}
          className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
        >
          Clear
        </button>
        <button
          onClick={() => onSave(outgoingChanId)}
          className='ml-3 inline-flex justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-md border border-transparent bg-gray-800 dark:bg-slate-700 disabled:hover:bg-gray-800 dark:disabled:hover:bg-slate-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
        >
          Save
        </button>
      </div>
    </div>
  );
};
