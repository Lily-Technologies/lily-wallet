import React, { useState } from 'react';
import { OpenInFull } from '@styled-icons/material';

import ChannelRow from './ChannelRow';
import ChannelModal from './ChannelModal';

import { Table, TableBody } from 'src/components/Table';
import { SettingsTable, Modal } from 'src/components';

import { requireLightning } from 'src/hocs';
import { LilyLightningAccount } from '@lily/types';
import { SetStateBoolean } from 'src/types';

interface Props {
  currentAccount: LilyLightningAccount;
  setViewOpenChannelForm: SetStateBoolean;
}

const ChannelView = ({ currentAccount, setViewOpenChannelForm }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  return (
    <>
      <div className='flex justify-between flex-col sm:flex-row space-y-2 space-x-2 mb-4'>
        <SettingsTable.HeaderSection>
          <SettingsTable.HeaderTitle>Channel Information</SettingsTable.HeaderTitle>
          <SettingsTable.HeaderSubtitle>
            These are the channel associated with your account.
          </SettingsTable.HeaderSubtitle>
        </SettingsTable.HeaderSection>
        <div className='flex items-center'>
          <button
            className='w-full justify-center lg:w-min whitespace-nowrap text-center lg:ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:ring-2  focus:ring-green-500'
            onClick={() => setViewOpenChannelForm(true)}
          >
            <OpenInFull className='mr-2 -ml-1 h-4 w-4' aria-hidden='true' />
            Open new channel
          </button>
        </div>
      </div>

      <table className='border-collapse w-full'>
        <tbody className='divide-y dark:divide-slate-400/10'>
          {currentAccount.pendingChannels.map((channel) => (
            <ChannelRow
              localBalance={channel.localBalance}
              remoteBalance={channel.remoteBalance}
              key={channel.channelPoint}
              alias={channel.alias}
              capacity={Number(channel.capacity)}
              status={'pending'}
              onClick={() => openInModal(<ChannelModal channel={channel} />)}
            />
          ))}
          {currentAccount.channels.map((channel) => (
            <ChannelRow
              localBalance={channel.localBalance}
              remoteBalance={channel.remoteBalance}
              key={channel.channelPoint}
              alias={channel.alias}
              capacity={Number(channel.capacity)}
              status={channel.active ? 'active' : 'inactive'}
              onClick={() => openInModal(<ChannelModal channel={channel} />)}
            />
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalIsOpen} closeModal={() => closeModal()}>
        {modalContent}
      </Modal>
    </>
  );
};

export default requireLightning(ChannelView);
