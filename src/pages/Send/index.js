import React, { useState, useRef, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import BigNumber from 'bignumber.js';
import { mnemonicToSeed } from 'bip39';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { Psbt, bip32, networks } from 'bitcoinjs-lib';

import { StyledIcon, Button, PageWrapper, GridArea, PageTitle, Header, HeaderRight, HeaderLeft, Loading, FileUploader, Modal, Dropdown } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import SignWithDevice from './SignWithDevice'
import TransactionDetails from './TransactionDetails';

import { red, gray, blue, darkGray, white, darkOffWhite, lightBlue } from '../../utils/colors';
import { mobile } from '../../utils/media';
import { cloneBuffer, bufferToHex } from '../../utils/other';
import { combinePsbts } from '../../utils/files';

import { createTransaction, validateAddress, createUtxoMapFromUtxoArray, getFee } from './utils'
import { AddressDisplayWrapper, Input, InputStaticText } from './styles';
import { bitcoinNetworkEqual } from '../../utils/files';

const Send = ({ config, currentAccount, setCurrentAccount, toggleRefresh, currentBitcoinNetwork, currentBitcoinPrice }) => {
  document.title = `Send - Lily Wallet`;
  const [sendAmount, setSendAmount] = useState('');
  const [sendAmountError, setSendAmountError] = useState(false);
  const [txImportedFromFile, setTxImportedFromFile] = useState(false);
  const [importTxFromFileError, setImportTxFromFileError] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientAddressError, setRecipientAddressError] = useState(false);
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState(null);
  const [feeEstimate, setFeeEstimate] = useState(BigNumber(0));
  const [signedPsbts, setSignedPsbts] = useState([]);
  const [signedDevices, setSignedDevices] = useState([]);
  const [pastePsbtModalOpen, setPastePsbtModalOpen] = useState(false);
  const [pastedPsbtValue, setPastedPsbtValue] = useState(null);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [feeRates, setFeeRates] = useState(null);
  const fileUploadLabelRef = useRef(null);

  // Get account data
  const { transactions, availableUtxos, unusedChangeAddresses, currentBalance } = currentAccount;

  // TODO: refactor this...ugly
  const createTransactionAndSetState = async (theFee) => {
    try {
      const { psbt, fee, feeRates } = await createTransaction(currentAccount, sendAmount, recipientAddress, theFee, availableUtxos, unusedChangeAddresses, currentBitcoinNetwork);
      setFinalPsbt(psbt);
      setFeeEstimate(fee);
      setFeeRates(feeRates);
      signTransactionIfSingleSigner(psbt);
      return psbt
    } catch (e) {
      throw new Error(e.message)
    }
  }

  const signTransactionIfSingleSigner = async (psbt) => {
    // if only single sign, then sign tx right away
    if (currentAccount.config.mnemonic) {
      const seed = await mnemonicToSeed(currentAccount.config.mnemonic);
      const root = bip32.fromSeed(seed, currentBitcoinNetwork);

      psbt.signAllInputsHD(root);
      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();

      setSignedDevices([currentAccount]) // this could probably have better information in it but
      setSignedPsbts([psbt]);
    }
  }

  const importTxFromFile = (file) => {
    if (importTxFromFileError) {
      setImportTxFromFileError(null)
    }
    let tx;
    // try seeing if we are getting base64 encoded tx
    try {
      tx = Psbt.fromBase64(file);
    } catch (e) {
      try { // try getting hex encoded tx
        tx = Psbt.fromHex(file);
      } catch (e) {
        setImportTxFromFileError('Invalid Transaction');
      }
    }

    // if valid transaction, then continue parsing
    if (tx) { // transaction will be undefined if not created above
      try {
        if (!finalPsbt) {
          setFinalPsbt(tx);
        } else {
          try {
            tx = combinePsbts(finalPsbt, [...signedPsbts, tx])
          } catch (e) {
            console.log('error: ', e)
            throw new Error('Signature is for a different transaction')
          }
        }
        // validate psbt and make sure it belongs to the current account
        let sumInputs = new BigNumber(0);
        let utxosMap;
        if (availableUtxos) {
          utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
        }
        for (let i = 0; i < tx.__CACHE.__TX.ins.length; i++) {
          const currentInput = tx.__CACHE.__TX.ins[i];
          const inputBuffer = cloneBuffer(currentInput.hash);
          const currentUtxo = utxosMap.get(`${inputBuffer.reverse().toString('hex')}:${currentInput.index}`);
          if (!currentUtxo) {
            throw new Error('This transaction isn\'t associated with this wallet')
          };
          sumInputs = sumInputs.plus(currentUtxo.value);
        }
        const sumOutputs = tx.__CACHE.__TX.outs.reduce((accum, curr) => accum + curr.value, 0);
        setFeeEstimate(sumInputs.minus(sumOutputs).integerValue(BigNumber.ROUND_CEIL));

        // check if any partial signatures already
        const signedFingerprints = [];
        const signedDevicesObjects = [];
        for (let i = 0; i < tx.data.inputs.length; i++) {
          const currentInput = tx.data.inputs[i];
          // if there is, figure out what device it belongs to
          if (currentInput.partialSig) {
            for (let j = 0; j < currentInput.partialSig.length; j++) {
              currentInput.bip32Derivation.forEach((bipItem) => {
                // and add device to list if it isn't already
                if (Buffer.compare(currentInput.partialSig[j].pubkey, bipItem.pubkey) === 0 && !signedFingerprints.includes(bufferToHex(bipItem.masterFingerprint))) {
                  signedFingerprints.push(bufferToHex(bipItem.masterFingerprint));
                  for (let k = 0; k < currentAccount.config.extendedPublicKeys.length; k++) {
                    if (currentAccount.config.extendedPublicKeys[k].device.fingerprint.toLowerCase() === bufferToHex(bipItem.masterFingerprint).toLowerCase()) {
                      signedDevicesObjects.push(currentAccount.config.extendedPublicKeys[k].device);
                    }
                  }
                }
              })
            }
          }
        }

        // if there are any imported fingerprints, then add tx to signedPsbts array
        if (signedFingerprints.length) {
          setSignedPsbts([...signedPsbts, tx.toBase64()]);
          setSignedDevices(signedDevicesObjects);
        }

        setTxImportedFromFile(true);
        setStep(1);
      } catch (e) {
        setImportTxFromFileError(e.message);
      }
    }
  }

  const validateAndCreateTransaction = async () => {
    if (!validateAddress(recipientAddress, currentBitcoinNetwork)) {
      setRecipientAddressError(true);
    }

    if (validateAddress(recipientAddress, currentBitcoinNetwork) && recipientAddressError) {
      setRecipientAddressError(false);
    }

    if (!satoshisToBitcoins(BigNumber(feeEstimate).plus(currentBalance)).isGreaterThan(sendAmount)) {
      setSendAmountError(true)
    }

    if (satoshisToBitcoins(BigNumber(feeEstimate).plus(currentBalance)).isGreaterThan(sendAmount) && sendAmountError) {
      setSendAmountError(false)
    }

    if (validateAddress(recipientAddress, currentBitcoinNetwork) && sendAmount && satoshisToBitcoins(BigNumber(feeEstimate).plus(currentBalance)).isGreaterThan(sendAmount)) {
      await createTransactionAndSetState(undefined);
      setStep(1);
    }
  }

  const SelectAccountMenu = () => (
    <AccountMenu>
      {config.vaults.map((vault, index) => (
        <AccountMenuItemWrapper active={vault.id === currentAccount.config.id} borderRight={(index < config.vaults.length - 1) || config.wallets.length} onClick={() => setCurrentAccount(vault.id)}>
          <StyledIcon as={Safe} size={48} />
          <AccountMenuItemName>{vault.name}</AccountMenuItemName>
        </AccountMenuItemWrapper>
      ))}
      {config.wallets.map((wallet, index) => (
        <AccountMenuItemWrapper key={index} active={wallet.id === currentAccount.config.id} borderRight={(index < config.wallets.length - 1)} onClick={() => setCurrentAccount(wallet.id)}>
          <StyledIcon as={Wallet} size={48} />
          <AccountMenuItemName>{wallet.name}</AccountMenuItemName>
        </AccountMenuItemWrapper>
      ))}
    </AccountMenu>
  )

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <PageTitle>Send from</PageTitle>
        </HeaderLeft>
        <HeaderRight>
        </HeaderRight>
      </Header>

      {/* Stuff hidden in dropdown */}
      <FileUploader
        accept="*"
        id="txFile"
        onFileLoad={({ file }) => {
          importTxFromFile(file)
        }}
      />
      <label style={{ display: 'none' }} ref={fileUploadLabelRef} htmlFor="txFile"></label>

      <Modal
        isOpen={pastePsbtModalOpen}
        onRequestClose={() => {
          setPastedPsbtValue(null);
          setImportTxFromFileError(false);
          setPastePsbtModalOpen(false);
        }}>
        <ModalHeaderContainer>
          Paste PSBT or Transaction Hex Below
                    </ModalHeaderContainer>
        <div style={{ padding: '1.5em' }}>
          <PastePsbtTextArea
            rows={20}
            onChange={(e) => {
              setPastedPsbtValue(e.target.value)
            }}
          />
          {importTxFromFileError && <ErrorText style={{ paddingBottom: '1em' }}>{importTxFromFileError}</ErrorText>}
          <ImportButtons>
            <FromFileButton
              style={{ marginRight: '1em' }}
              onClick={() => {
                setPastedPsbtValue(null);
                setImportTxFromFileError(false);
                setPastePsbtModalOpen(false);
              }}>Cancel</FromFileButton>
            <CopyAddressButton
              onClick={() => {
                importTxFromFile(pastedPsbtValue)
              }}>Import Transaction</CopyAddressButton>
          </ImportButtons>
        </div>
      </Modal>

      <SendWrapper>
        <SelectAccountMenu />

        {currentAccount.loading && <Loading itemText={'Send Information'} />}
        {!currentAccount.loading && (
          <GridArea>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CurrentBalanceWrapper displayDesktop={false} displayMobile={true} style={{ marginBottom: '1em' }}>
                <CurrentBalanceText>
                  Current Balance:
                  </CurrentBalanceText>
                <CurrentBalanceValue>
                  {satoshisToBitcoins(currentBalance).toNumber()} BTC
                  </CurrentBalanceValue>
              </CurrentBalanceWrapper>
              {step === 0 && (
                <AccountSendContentLeft>
                  <Dropdown
                    isOpen={optionsDropdownOpen}
                    setIsOpen={setOptionsDropdownOpen}
                    minimal={true}
                    style={{ alignSelf: 'flex-end' }}
                    dropdownItems={[
                      {
                        label: 'Import from file',
                        onClick: () => {
                          const txFileUploadButton = fileUploadLabelRef.current;
                          txFileUploadButton.click()
                        }
                      },
                      {
                        label: 'Import from clipboard',
                        onClick: () => {
                          setImportTxFromFileError(false)
                          setPastePsbtModalOpen(true)
                        }
                      }
                    ]}
                  />

                  {/* Visible in form */}
                  <SendToAddressHeader style={{ marginTop: 0 }}>
                    Send bitcoin to
                  </SendToAddressHeader>

                  <Input
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    value={recipientAddress}
                    placeholder={bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) ?
                      "tb1q4h5xd5wsalmes2496y8dtphc609rt0un3gl69r" :
                      "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"}
                    style={{ marginBottom: 36 }}
                    error={recipientAddressError}
                  />

                  <SendToAddressHeader>
                    Amount of bitcoin to send
                  </SendToAddressHeader>
                  <AddressDisplayWrapper>
                    <Input
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.0025"
                      style={{ paddingRight: 80, color: darkGray, flex: 1 }}
                      error={sendAmountError}
                    />
                    <InputStaticText disabled text="BTC">BTC</InputStaticText>
                  </AddressDisplayWrapper>
                  {sendAmountError && <SendAmountError>Not enough funds</SendAmountError>}
                  <SendButtonContainer>
                    {/* <CopyAddressButton background="transparent" color={darkGray}>Advanced Options</CopyAddressButton> */}
                    <CopyAddressButton onClick={() => validateAndCreateTransaction()}>Preview Transaction</CopyAddressButton>
                    {importTxFromFileError && !pastePsbtModalOpen && <ErrorText style={{ paddingTop: '1em' }}>{importTxFromFileError}</ErrorText>}
                  </SendButtonContainer>
                </AccountSendContentLeft>
              )}

              {step === 1 && (
                <TransactionDetails
                  finalPsbt={finalPsbt}
                  feeEstimate={getFee(finalPsbt, transactions)}
                  recipientAddress={recipientAddress}
                  setStep={setStep}
                  sendAmount={sendAmount}
                  availableUtxos={availableUtxos}
                  signedPsbts={signedPsbts}
                  signedDevices={signedDevices}
                  txImportedFromFile={txImportedFromFile}
                  fileUploadLabelRef={fileUploadLabelRef}
                  importTxFromFileError={importTxFromFileError}
                  signThreshold={currentAccount.config.quorum.requiredSigners}
                  currentBitcoinNetwork={currentBitcoinNetwork}
                  currentBitcoinPrice={currentBitcoinPrice}
                  toggleRefresh={toggleRefresh}
                  currentAccount={currentAccount}
                  feeRates={feeRates}
                  createTransactionAndSetState={createTransactionAndSetState}
                />
              )}
            </div>



            <AccountSendContentRight>
              {(step === 0 || (step === 1 && currentAccount.config.mnemonic)) && (
                <Fragment>
                  <CurrentBalanceWrapper displayDesktop={true} displayMobile={false}>
                    <CurrentBalanceText>
                      Current Balance:
                    </CurrentBalanceText>
                    <CurrentBalanceValue>
                      {satoshisToBitcoins(currentBalance).toNumber()} BTC
                  </CurrentBalanceValue>
                  </CurrentBalanceWrapper>
                  <RecentTransactionContainer>
                    <RecentTransactions
                      transactions={transactions}
                      flat={true}
                      loading={currentAccount.loading}
                      maxItems={3} />
                  </RecentTransactionContainer>
                </Fragment>
              )}
              {step === 1 && !currentAccount.config.mnemonic && (
                <SignWithDevice
                  psbt={finalPsbt}
                  setSignedPsbts={setSignedPsbts}
                  signedPsbts={signedPsbts}
                  signedDevices={signedDevices}
                  setSignedDevices={setSignedDevices}
                  signThreshold={currentAccount.config.quorum.requiredSigners}
                />
              )}
            </AccountSendContentRight>
          </GridArea>
        )}
      </SendWrapper>
    </PageWrapper >
  )
}

const RecentTransactionContainer = styled.div`
  padding: 0 1em;
`;

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229,231,235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

const PastePsbtTextArea = styled.textarea`
  width: 100%;
  resize: none;
  border-color: #d2d6dc;
  border-width: 1px;
  border-radius: .375rem;
  padding: .5rem .75rem;
  box-sizing: border-box;
  margin: 2em 0;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(164,202,254,.45);
    border-color: #a4cafe;
  }
`;

const ErrorText = styled.div`
  color: ${red};
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

const ImportButtons = styled.div`
  display: flex;
`;

const FromFileButton = styled.div`
  padding: 1em 1.25rem;
  border: 1px solid ${gray};
  border-radius: .375rem;
  flex: 1;
  text-align: center;
  font-family: 'Montserrat', sans-serif;

  &:hover {
    border: 1px solid ${darkGray};
    cursor: pointer;
  }
`;

const SendButtonContainer = styled.div`
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const CopyAddressButton = styled.div`
  ${Button};
  flex: 1;
`;

const SendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  border: 1px solid ${gray};
`;

const SendToAddressHeader = styled.div`
  font-size: 1em;
  color: ${darkGray};
  margin: 12px;
  margin-bottom: 0px;
`;

const SendAmountError = styled.div`
  font-size: 0.5em;
  color: ${red};
  text-align: right;
`;

const AccountMenuItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.active ? lightBlue : white};
  color: ${p => p.active ? darkGray : gray};
  padding: .75em;
  flex: 1;
  cursor: ${p => p.active ? 'auto' : 'pointer'};
  border-top: ${p => p.active ? `solid 11px ${blue}` : `none`};
  border-bottom: ${p => p.active ? 'none' : `solid 1px ${gray}`};
  border-right: ${p => p.borderRight && `solid 1px ${gray}`};
`;

const AccountMenuItemName = styled.div``;

const AccountMenu = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AccountSendContentLeft = styled.div`
  min-height: 400px;
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${white};
  border: 1px solid ${darkGray};
  border-radius: 4px;
  justify-content: center;
`;

const AccountSendContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const CurrentBalanceWrapper = styled.div`
  padding: 1.5em;
  display: ${p => p.displayDesktop ? 'flex' : 'none'};
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  background: ${white};
  text-align: right;

  ${mobile(css`
    display: ${p => p.displayMobile ? 'flex' : 'none'}
  `)};

`;


const CurrentBalanceText = styled.div`
  font-size: 1.5em;
  color: ${darkGray};
`;


const CurrentBalanceValue = styled.div`
  font-size: 2em;
`;



export default Send;