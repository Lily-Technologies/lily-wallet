import React, { useState, useContext } from 'react';
import moment from 'moment';

import { Modal, SettingsTable } from 'src/components';

import DeleteAccountModal from '../DeleteAccountModal';
import EditAccountNameModal from '../EditAccountNameModal';

import DeezyToggle from './DeezyToggle';

import { AccountMapContext, ConfigContext, PlatformContext } from 'src/context';

import { red500 } from 'src/utils/colors';

const GeneralView = () => {
  const { currentAccount } = useContext(AccountMapContext);
  const { password } = useContext(ConfigContext);
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
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-200'>
          Account Information
        </h3>
        <p className='max-w-2xl text-sm text-gray-500 dark:text-gray-400'>
          This information is private and only seen by you.
        </p>
      </SettingsTable.HeaderSection>

      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Name</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn style={{ paddingTop: 0, paddingBottom: 0 }}>
          <SettingsTable.ValueText>{currentAccount.config.name}</SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              onClick={() =>
                openInModal(
                  <EditAccountNameModal
                    password={password}
                    closeModal={() => setModalIsOpen(false)}
                  />
                )
              }
            >
              Edit
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Created</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText>
            {moment(currentAccount.config.created_at).format('MMMM Do YYYY')}
          </SettingsTable.ValueText>
          <SettingsTable.ValueAction></SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>

      <SettingsTable.HeaderSection>
        <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-200'>
          Connection Information
        </h3>
        <p className='max-w-2xl text-sm text-gray-500 dark:text-gray-400'>
          Information about the lightning node
        </p>
      </SettingsTable.HeaderSection>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Status</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText>Connected</SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
            // onClick={() => openInModal(<DeviceDetailsModal item={item} />)}
            >
              View details
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>

      <div className='mt-10 divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-1'>
          <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-200'>
            Integrations
          </h3>
          <p className='max-w-2xl text-sm text-gray-500 dark:text-gray-400'>
            Manage 3rd party integrations and features for your lightning node.
          </p>
        </div>
        <div className='mt-6'>
          <DeezyToggle />
        </div>
      </div>

      <SettingsTable.HeaderSection>
        <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-200'>
          Danger Zone
        </h3>
        <p className='max-w-2xl text-sm text-gray-500 dark:text-gray-400'>
          Remove this account from Lily Wallet.
        </p>
      </SettingsTable.HeaderSection>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Delete Account</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              style={{ color: red500 }}
              onClick={() =>
                openInModal(<DeleteAccountModal password={password} closeModal={closeModal} />)
              }
            >
              Delete
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>

      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </SettingsTable.Wrapper>
  );
};

export default GeneralView;
