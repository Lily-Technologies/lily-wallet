import React, { Fragment, useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { ExclamationDiamond } from '@styled-icons/bootstrap'
import { useHistory } from "react-router-dom";

import { Modal, Input, StyledIcon, Button } from '../../../components';

import { AccountMapContext } from '../../../AccountMapContext';
import { LilyConfig } from '../../../types';

import { mobile } from '../../../utils/media';
import { saveConfig } from '../../../utils/files';
import { white, red, red100, red500, red600, green800, gray500, gray900 } from '../../../utils/colors';

interface Props {
  config: LilyConfig,
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>,
  password: string
}

const GeneralView = ({ config, setConfigFile, password }: Props) => {
  const [viewDeleteAccount, setViewDeleteAccount] = useState(false);
  const [accountNameConfirm, setAccountNameConfirm] = useState('');
  const [accountNameConfirmError, setAccountNameConfirmError] = useState(false);
  const { currentAccount } = useContext(AccountMapContext);
  const history = useHistory();

  const onInputEnter = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      removeAccountAndDownloadConfig();
    }
  }

  const removeAccountAndDownloadConfig = () => {
    if (accountNameConfirm === currentAccount.config.name) {
      const configCopy = { ...config };
      if (currentAccount.config.quorum.totalSigners === 1) {
        configCopy.wallets = configCopy.wallets.filter((wallet) => wallet.id !== currentAccount.config.id)
      } else {
        configCopy.vaults = configCopy.vaults.filter((vault) => vault.id !== currentAccount.config.id)
      }

      saveConfig(configCopy, password);
      setConfigFile({ ...configCopy });
      history.push('/');
    } else {
      setAccountNameConfirmError(true);
    }
  }

  return (
    <Fragment>
      <SettingsHeadingItem>Danger Zone</SettingsHeadingItem>
      <SettingsSection>
        <SettingsSectionLeft>
          <SettingsItemHeader>Delete Account</SettingsItemHeader>
          <SettingsSubheader>Remove this account from your list of accounts.</SettingsSubheader>
        </SettingsSectionLeft>
        <SettingsSectionRight>
          <ViewAddressesButton
            style={{ color: red, border: `1px solid ${red}` }}
            onClick={() => {
              setViewDeleteAccount(true)
            }}>Delete Account</ViewAddressesButton>
        </SettingsSectionRight>

        <Modal
          isOpen={viewDeleteAccount}
          onRequestClose={() => setViewDeleteAccount(false)}>
          <ModalContentWrapper>
            <DangerIconContainer>
              <StyledIconCircle>
                <StyledIcon style={{ color: red600 }} as={ExclamationDiamond} size={36} />
              </StyledIconCircle>
            </DangerIconContainer>
            <DangerTextContainer>
              <DangerText>Delete Account</DangerText>
              <DangerSubtext>
                You are about to delete an account from this configuration.
             <br />
             If there are any funds remaining in this account, they will be lost forever.
             </DangerSubtext>
              <Input
                label="Type in the account's name to delete"
                autoFocus
                type="text"
                value={accountNameConfirm}
                onChange={setAccountNameConfirm}
                onKeyDown={(e) => onInputEnter(e)}
                error={accountNameConfirmError}
              />
              {accountNameConfirmError && <ConfirmError>Account name doesn't match</ConfirmError>}

              <DeleteAccountButton
                background={red600}
                color={white}
                onClick={() => { removeAccountAndDownloadConfig() }}>
                Delete Account
              </DeleteAccountButton>
            </DangerTextContainer>
          </ModalContentWrapper>
        </Modal>
      </SettingsSection>
    </Fragment>
  )
}

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
  justify-content: space-between;
`;

const DeleteAccountButton = styled.button`
  ${Button}
  margin-top: 1rem;

  ${mobile(css`
  margin-top: 1.25rem;
  `)};
`;

const ConfirmError = styled.div`
  color: ${red500};
`;

const DangerTextContainer = styled.div`
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

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1.5em;
  align-items: flex-start;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    padding-top: 1.25em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    margin-left: 0;
  `)};  
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${red100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DangerText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

const DangerSubtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray500};
`;

const SettingsSectionLeft = styled.div`
  grid-column: span 2;

  ${mobile(css`
    grid-column: span 1;
  `)};
`;

const SettingsSectionRight = styled.div``;

const SettingsSubheader = styled.div`
  display: flex;
  font-size: 0.875em;
  color: ${gray500};
  margin: 8px 0;
`;

const SettingsItemHeader = styled.div`
  display: flex;
  font-size: 1.125em;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 64px 0 0;
  font-weight: 400;
  color: ${gray900};
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${green800};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
`;

export default GeneralView;