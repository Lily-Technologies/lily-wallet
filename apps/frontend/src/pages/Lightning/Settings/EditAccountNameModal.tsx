// @ts-ignore
import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { EditAlt } from '@styled-icons/boxicons-regular';

import { Input, ModalContentWrapper } from 'src/components';

import { mobile } from 'src/utils/media';
import { gray500 } from 'src/utils/colors';
import { saveConfig } from 'src/utils/files';

import { AccountMapContext, ConfigContext, PlatformContext } from 'src/context';
import { VaultConfig, OnChainConfig } from '@lily/types';

interface Props {
  password: string;
  closeModal: () => void;
}

const EditAccountNameModal = ({ password, closeModal }: Props) => {
  const { config, setConfigFile } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const { currentAccount } = useContext(AccountMapContext);
  const [accountNameConfirm, setAccountNameConfirm] = useState('');
  const [accountNameConfirmError, setAccountNameConfirmError] = useState('');

  const onInputEnter = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      editNameAndUpdateConfig();
    }
  };

  const editNameAndUpdateConfig = () => {
    try {
      if (accountNameConfirm === '') {
        throw Error('Invalid account name');
      }
      const currentAccountConfigCopy = { ...currentAccount.config };
      currentAccountConfigCopy.name = accountNameConfirm;
      const configCopy = { ...config };
      if ((currentAccount.config as OnChainConfig).quorum.totalSigners === 1) {
        configCopy.wallets = configCopy.wallets.filter(
          (wallet) => wallet.id !== currentAccount.config.id
        );
        configCopy.wallets.push(currentAccountConfigCopy as OnChainConfig);
      } else {
        configCopy.vaults = configCopy.vaults.filter(
          (vault) => vault.id !== currentAccount.config.id
        );
        configCopy.vaults.push(currentAccountConfigCopy as VaultConfig);
      }

      saveConfig(configCopy, password, platform);
      setConfigFile({ ...configCopy });
      closeModal();
    } catch (e) {
      if (e instanceof Error) {
        setAccountNameConfirmError(e.message);
      }
    }
  };

  return (
    <ModalContentWrapper>
      <DangerIconContainer>
        <StyledIconCircle className='bg-green-100 dark:bg-green-800'>
          <EditAlt className='text-green-600 dark:text-green-200' size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <TextContainer>
        <HeaderText className='text-gray-900 dark:text-gray-200'>Edit Account Name</HeaderText>
        <Subtext>This information is private and only viewable within the Lily App.</Subtext>
        <div className='w-full grid grid-cols-4 gap-6'>
          <div className='col-span-4'>
            <Input
              className='w-full'
              label='Account Name'
              autoFocus
              type='text'
              value={accountNameConfirm}
              onChange={setAccountNameConfirm}
              onKeyDown={(e) => onInputEnter(e)}
              error={accountNameConfirmError}
            />
          </div>
        </div>
        <div className='flex w-full justify-end mt-6 flex-col flex-col-reverse  md:flex-row'>
          <button
            type='button'
            className='justify-center inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-green-500'
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </button>
          <button
            type='button'
            className='justify-center mb-2 md:mb-0 ml-0 sm:ml-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'
            onClick={() => {
              editNameAndUpdateConfig();
            }}
          >
            Save
          </button>
        </div>
      </TextContainer>
    </ModalContentWrapper>
  );
};

const TextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 1rem;

  ${mobile(css`
    margin-top: 0.75rem;
    margin-left: 0;
  `)};
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

const Subtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;

export default EditAccountNameModal;
