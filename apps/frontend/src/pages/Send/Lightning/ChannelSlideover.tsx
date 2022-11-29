import React, { useContext, useState } from 'react';
import ChannelRow from 'src/pages/Lightning/Channels/ChannelView/ChannelRow';

import { AccountMapContext } from 'src/context';
import { LilyLightningAccount } from '@lily/types';

interface Props {
  onSave: (outgoingChanId: string) => void;
  onCancel: () => void;
  onClear: () => void;
  outgoingChanId: string;
}

export const ChannelSlideover = ({ onSave, outgoingChanId, onCancel, onClear }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const [pendingOutgoingChannelId, setPendingOutgoingChannelId] = useState(outgoingChanId);

  return (
    <div className='py-6 flex flex-col h-full'>
      <h2 className='px-4 text-xl font-medium text-slate-900 dark:text-slate-100 pb-4 border-b border-slate-200 dark:border-slate-700'>
        Select a channel
      </h2>
      <div className='px-2 py-2 flex-grow overflow-y-auto shadow-inner'>
        {(currentAccount as LilyLightningAccount).channels.map((channel) => (
          <ChannelRow
            {...channel}
            selected={pendingOutgoingChannelId === channel.chanId}
            status={channel.active ? 'active' : 'inactive'}
            onClick={() => setPendingOutgoingChannelId(channel.chanId)}
          />
        ))}
      </div>

      <div className='pt-4 border-t border-slate-200 dark:border-slate-700'>
        <div className='text-right flex items-center justify-end px-4'>
          <button
            onClick={() => {
              if (outgoingChanId) {
                onClear();
              } else {
                onCancel();
              }
            }}
            className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          >
            {outgoingChanId ? 'Clear selection' : 'Cancel'}
          </button>
          <button
            onClick={() => onSave(pendingOutgoingChannelId)}
            className='ml-3 inline-flex justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-md border border-transparent bg-gray-800 dark:bg-slate-700 disabled:hover:bg-gray-800 dark:disabled:hover:bg-slate-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
