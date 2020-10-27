import React, { useState, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { useHistory } from "react-router-dom";
import { QRCode } from "react-qr-svg";
import { ExclamationDiamond } from '@styled-icons/bootstrap'

import { MnemonicWordsDisplayer, Modal, Input, StyledIcon, Button } from '../../components';

import { black, white, green800, darkGray, darkOffWhite, gray100, red, lightGray, darkGreen, red100, red500, red600, gray500 } from '../../utils/colors';
import { mobile } from '../../utils/media';
import { createColdCardBlob, downloadFile, formatFilename, saveConfig } from '../../utils/files';
import { getMultisigDeriationPathForNetwork } from '../../utils/files';

import { LilyConfig, LilyAccount, CaravanConfig } from '../../types';
import { Network } from 'bitcoinjs-lib';
interface Props {
  config: LilyConfig,
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>,
  password: string,
  currentAccount: LilyAccount,
  setViewAddresses: React.Dispatch<React.SetStateAction<boolean>>,
  setViewUtxos: React.Dispatch<React.SetStateAction<boolean>>,
  currentBitcoinNetwork: Network
}

const VaultSettings = ({ config, setConfigFile, password, currentAccount, setViewAddresses, setViewUtxos, currentBitcoinNetwork }: Props) => {
  const [viewXpub, setViewXpub] = useState(false);
  const [viewExportQRCode, setViewExportQRCode] = useState(false);
  const [viewMnemonic, setViewMnemonic] = useState(false);
  const [viewDeleteAccount, setViewDeleteAccount] = useState(false);
  const [accountNameConfirm, setAccountNameConfirm] = useState('');
  const [accountNameConfirmError, setAccountNameConfirmError] = useState(false);
  const history = useHistory();

  const downloadColdcardMultisigFile = () => {
    if (currentAccount.config.extendedPublicKeys) {
      const ccFile = createColdCardBlob(currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners, currentAccount.config.name, currentAccount.config.extendedPublicKeys, currentBitcoinNetwork);
      downloadFile(ccFile, formatFilename(`${currentAccount.config.name}-lily-coldcard-file`, currentBitcoinNetwork, 'txt'));
    }
  }

  const downloadCaravanFile = () => {
    // need to add some properties to our config to use with Caravan
    const configCopy = { ...currentAccount.config } as CaravanConfig;
    configCopy.client = { type: 'public' };
    // need to have a name for each pubkey, so just use parentFingerprint
    if (configCopy.extendedPublicKeys !== undefined) {
      for (let i = 0; i < configCopy.extendedPublicKeys.length; i++) {
        configCopy.extendedPublicKeys[i].name = configCopy.extendedPublicKeys[i].parentFingerprint;

        // we need to populate the method field for caravan. if the device is of type trezor or ledger, put that in. else just put xpub.
        if (configCopy.extendedPublicKeys[i].device && (configCopy.extendedPublicKeys[i].device.type === 'trezor' || configCopy.extendedPublicKeys[i].device.type === 'ledger')) {
          configCopy.extendedPublicKeys[i].method = configCopy.extendedPublicKeys[i].device.type;
          configCopy.extendedPublicKeys[i].bip32Path = getMultisigDeriationPathForNetwork(currentBitcoinNetwork);
        } else {
          configCopy.extendedPublicKeys[i].method = 'xpub';
        }
      }
    }
    const caravanFile = JSON.stringify(configCopy);
    downloadFile(caravanFile, formatFilename('lily-caravan-file', currentBitcoinNetwork, 'json'));
  }

  const getMnemonicQrCode = () => {
    return (
      <div>
        <QRCode
          bgColor={white}
          fgColor={black}
          level="Q"
          style={{ width: 256 }}
          value={currentAccount.config.mnemonic as string}
        />
      </div>
    )
  }

  const getXpubQrCode = () => {
    return (
      <div>
        <QRCode
          bgColor={white}
          fgColor={black}
          level="Q"
          style={{ width: 256 }}
          value={currentAccount.config.xpub as string}
        />
      </div>
    )
  }

  const getMnemonic = () => {
    return (
      <WordsContainer>
        <MnemonicWordsDisplayer mnemonicWords={currentAccount.config.mnemonic} />
      </WordsContainer>
    )
  }

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

    <Wrapper>
      <TotalValueHeader>Settings</TotalValueHeader>
      <SettingsHeadingItem>Vault Data</SettingsHeadingItem>
      <SettingsSection>
        <SettingsSectionLeft>
          <SettingsHeader>Addresses</SettingsHeader>
          <SettingsSubheader>View the addresses associated with this vault</SettingsSubheader>
        </SettingsSectionLeft>
        <SettingsSectionRight>
          <ViewAddressesButton onClick={() => { setViewAddresses(true); }}>View Addresses</ViewAddressesButton>
        </SettingsSectionRight>
      </SettingsSection>
      <SettingsSection>
        <SettingsSectionLeft>
          <SettingsHeader>UTXOs</SettingsHeader>
          <SettingsSubheader>View the UTXOs associated with this vault</SettingsSubheader>
        </SettingsSectionLeft>
        <SettingsSectionRight>
          <ViewAddressesButton onClick={() => { setViewUtxos(true); }}>View UTXOs</ViewAddressesButton>
        </SettingsSectionRight>
      </SettingsSection>
      {/* KBC-TODO: design a good way to display xpubs and fingerprint data here */}
      {currentAccount.config.quorum.totalSigners === 1 && (
        <SettingsSection>
          <SettingsSectionLeft>
            <SettingsHeader>View XPub</SettingsHeader>
            <SettingsSubheader>View the xpub associated with this vault. This can be given to other services to deposit money into your account or create a read-only wallet.</SettingsSubheader>
          </SettingsSectionLeft>
          <SettingsSectionRight>
            <ViewAddressesButton onClick={() => { setViewXpub(true); }}>View XPub</ViewAddressesButton>
          </SettingsSectionRight>

          <Modal
            isOpen={viewXpub}
            onRequestClose={() => setViewXpub(false)}>
            <ModalContentWrapper>
              {getXpubQrCode()}
              <XpubWellWrapper>{currentAccount.config.xpub}</XpubWellWrapper>
            </ModalContentWrapper>
          </Modal>
        </SettingsSection>
      )}

      {currentAccount.config.mnemonic && (
        <Fragment>
          <SettingsHeadingItem>Export Wallet</SettingsHeadingItem>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>Connect to BlueWallet</SettingsHeader>
              <SettingsSubheader>View a QR code to import this wallet into BlueWallet</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { setViewExportQRCode(true); }}>View QR Code</ViewAddressesButton>
            </SettingsSectionRight>

            <Modal
              isOpen={viewExportQRCode}
              onRequestClose={() => setViewExportQRCode(false)}>
              <ModalContentWrapper>
                {getMnemonicQrCode()}
                <ScanInstructions>Scan this QR code to import this wallet into BlueWallet</ScanInstructions>
              </ModalContentWrapper>
            </Modal>
          </SettingsSection>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>View Mnemonic Seed</SettingsHeader>
              <SettingsSubheader>View the mnemonic phrase for this wallet. This can be used to import this wallet data into another application.</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { setViewMnemonic(true); }}>View Wallet Mnemonic</ViewAddressesButton>
            </SettingsSectionRight>

            <Modal
              isOpen={viewMnemonic}
              onRequestClose={() => setViewMnemonic(false)}>
              <ModalContentWrapper>
                {getMnemonic()}
              </ModalContentWrapper>
            </Modal>
          </SettingsSection>
        </Fragment>
      )}
      {currentAccount.config.quorum.totalSigners > 1 && (
        <Fragment>
          <SettingsHeadingItem>Export Wallet</SettingsHeadingItem>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>Download Coldcard File</SettingsHeader>
              <SettingsSubheader>
                Download the multisig wallet import file for Coldcard and place on microsd card. <br />
              Import via Settings &gt; Multisig &gt; Import from SD.
            </SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { downloadColdcardMultisigFile(); }}>Download Coldcard File</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>Download Caravan File</SettingsHeader>
              <SettingsSubheader>
                <span>Download this vault's configuration file to use in <UCLink href="https://unchained-capital.com/" target="_blank" rel="noopener noreferrer">Unchained Capital's</UCLink> <UCLink href="https://unchained-capital.github.io/caravan/#/" target="_blank" rel="noopener noreferrer">Caravan</UCLink> multisig coordination software.</span>
              </SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton onClick={() => { downloadCaravanFile(); }}>Download Caravan File</ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
        </Fragment>
      )}
      <SettingsHeadingItem>Danger Zone</SettingsHeadingItem>
      <SettingsSection>
        <SettingsSectionLeft>
          <SettingsHeader>Delete Account</SettingsHeader>
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
    </Wrapper>
  )
}

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

const Wrapper = styled.div`
  background: ${gray100};
  padding: 1.5em;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  border-top: solid 11px ${green800};
`;

const UCLink = styled.a`
  color: ${darkGray};
  font-weight: 400;
  text-decoration: none;

  &:visited {
    color: ${darkGray};
  }
`;

const SettingsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  grid-gap: 5em;
  margin: 1em 0;
  justify-content: space-between;
  padding: 1.5em;
  background: ${white};
  border: 1px solid ${darkGray};
  align-items: center;

  ${mobile(css`
    grid-gap: 2em;
  `)};
`;

const SettingsSectionLeft = styled.div`
  grid-column: span 2;

  ${mobile(css`
    grid-column: span 1;
  `)};
`;

const WordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
  justify-content: center;
`;

const ScanInstructions = styled.div`
  font-size: 0.5em;
  padding: 1.5em 0;
`

const SettingsSectionRight = styled.div``;

const SettingsSubheader = styled.div`
  display: flex;
  font-size: 0.875em;
  color: ${darkGray};
  margin: 8px 0;
`;

const SettingsHeader = styled.div`
  display: flex;
  font-size: 1.125em;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 64px 0 0;
  font-weight: 400;
  color: ${darkGray};
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${green800};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
`;

const TotalValueHeader = styled.div`
  font-size: 36px;
`;

const XpubWellWrapper = styled.div`
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 1.5em;
  color: ${darkGreen};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border-radius: 4px;
  word-break: break-all;
`;

export default VaultSettings;