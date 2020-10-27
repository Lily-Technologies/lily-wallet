import React, { useState, useRef, Fragment, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import BigNumber from 'bignumber.js';
import { mnemonicToSeed } from 'bip39';
import { satoshisToBitcoins } from "unchained-bitcoin";
import { QRCode } from "react-qr-svg";
import { Psbt, bip32, networks, Network } from 'bitcoinjs-lib';

import { StyledIcon, Button, PageWrapper, GridArea, PageTitle, Header, HeaderRight, HeaderLeft, Loading, FileUploader, Modal, Dropdown, Input } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import SignWithDevice from './SignWithDevice'
import TransactionDetails from './TransactionDetails';

import { AccountMapContext } from '../../AccountMapContext';

import { red, gray, green600, green800, darkGray, white, darkOffWhite, gray100, black, lightGray } from '../../utils/colors';
import { mobile } from '../../utils/media';
import { cloneBuffer, bufferToHex } from '../../utils/other';
import { bitcoinNetworkEqual } from '../../utils/files';

import { createTransaction, validateAddress, createUtxoMapFromUtxoArray, getFee, combinePsbts } from './utils'

import { LilyConfig, File, Device, NodeConfig, FeeRates } from '../../types';

interface Props {
  config: LilyConfig,
  currentBitcoinNetwork: Network,
  nodeConfig: NodeConfig,
  currentBitcoinPrice: any // KBC-TODO: more specific type
}

const Send = ({ config, currentBitcoinNetwork, nodeConfig, currentBitcoinPrice }: Props) => {
  document.title = `Send - Lily Wallet`;
  const [sendAmount, setSendAmount] = useState('');
  const [sendAmountError, setSendAmountError] = useState(false);
  const [txImportedFromFile, setTxImportedFromFile] = useState(false);
  const [importTxFromFileError, setImportTxFromFileError] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientAddressError, setRecipientAddressError] = useState(false);
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState<Psbt | null>(null);
  const [feeEstimate, setFeeEstimate] = useState(new BigNumber(0));
  const [signedPsbts, setSignedPsbts] = useState<string[]>([]);
  const [signedDevices, setSignedDevices] = useState<Device[]>([]);
  const [pastedPsbtValue, setPastedPsbtValue] = useState('');
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [feeRates, setFeeRates] = useState<FeeRates>({ fastestFee: 0, halfHourFee: 0, hourFee: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const fileUploadLabelRef = useRef<HTMLLabelElement>(null);

  const { setCurrentAccountId, currentAccount } = useContext(AccountMapContext);

  // Get account data
  const { transactions, availableUtxos, unusedChangeAddresses, currentBalance } = currentAccount;

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
    if (modalContent === <PastePsbtModalContent />) {
      setPastedPsbtValue('');
      setImportTxFromFileError('');
    }
  }

  // TODO: refactor this...ugly
  const createTransactionAndSetState = async (theFee: string | undefined) => {
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

  const signTransactionIfSingleSigner = async (psbt: Psbt) => {
    // if only single sign, then sign tx right away
    if (currentAccount.config.mnemonic) {
      const seed = await mnemonicToSeed(currentAccount.config.mnemonic);
      const root = bip32.fromSeed(seed, currentBitcoinNetwork);

      psbt.signAllInputsHD(root);
      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();

      setSignedDevices([{ // we need to set a signed device for flow to continue, so set it as lily
        model: 'lily',
        type: 'lily',
        fingerprint: 'whatever'
      }]) // this could probably have better information in it but
      setSignedPsbts([psbt.toBase64()]);
    }
  }

  const importTxFromFile = (file: string) => {
    if (importTxFromFileError) {
      setImportTxFromFileError('')
    }
    let tx: Psbt | undefined = undefined;
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
    if (tx !== undefined) { // transaction will be undefined if not created above
      try {
        if (!finalPsbt) {
          setFinalPsbt(tx);
        } else {
          try {
            tx = combinePsbts(finalPsbt, [...signedPsbts, tx.toBase64()])
          } catch (e) {
            console.log('error: ', e)
            throw new Error('Signature is for a different transaction')
          }
        }
        // validate psbt and make sure it belongs to the current account
        let sumInputs = new BigNumber(0);
        let utxosMap = createUtxoMapFromUtxoArray(availableUtxos)
        for (let i = 0; i < tx.txInputs.length; i++) {
          const currentInput = tx.txInputs[i];
          const inputBuffer = cloneBuffer(currentInput.hash);
          const currentUtxo = utxosMap[`${inputBuffer.reverse().toString('hex')}:${currentInput.index}`];
          if (!currentUtxo) {
            throw new Error('This transaction isn\'t associated with this wallet')
          };
          sumInputs = sumInputs.plus(currentUtxo.value);
        }
        const sumOutputs = tx.txOutputs.reduce((accum, curr) => accum + curr.value, 0);
        setFeeEstimate(sumInputs.minus(sumOutputs).integerValue(BigNumber.ROUND_CEIL));

        // check if any partial signatures already
        const signedFingerprints: string[] = [];
        const signedDevicesObjects: Device[] = [];
        for (let i = 0; i < tx.data.inputs.length; i++) {
          const currentInput = tx.data.inputs[i];
          // if there is, figure out what device it belongs to
          if (currentInput !== undefined && currentInput.partialSig) {
            for (let j = 0; j < currentInput.partialSig.length; j++) {
              currentInput.bip32Derivation!.forEach((bipItem) => {
                // and add device to list if it isn't already
                // KBC-TODO: reexamine this block of code...I think it can be more efficient and precise
                if (Buffer.compare(currentInput.partialSig![j].pubkey, bipItem.pubkey) === 0 && !signedFingerprints.includes(bufferToHex(bipItem.masterFingerprint))) {
                  signedFingerprints.push(bufferToHex(bipItem.masterFingerprint));
                  for (let k = 0; k < currentAccount.config.extendedPublicKeys!.length; k++) {
                    if (currentAccount.config.extendedPublicKeys![k].device.fingerprint.toLowerCase() === bufferToHex(bipItem.masterFingerprint).toLowerCase()) {
                      signedDevicesObjects.push(currentAccount.config.extendedPublicKeys![k].device);
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

    if (!satoshisToBitcoins(feeEstimate.plus(currentBalance)).isGreaterThan(sendAmount)) {
      setSendAmountError(true)
    }

    if (satoshisToBitcoins(feeEstimate.plus(currentBalance)).isGreaterThan(sendAmount) && sendAmountError) {
      setSendAmountError(false)
    }

    if (validateAddress(recipientAddress, currentBitcoinNetwork) && sendAmount && satoshisToBitcoins(new BigNumber(feeEstimate).plus(currentBalance)).isGreaterThan(sendAmount)) {
      await createTransactionAndSetState(undefined);
      setStep(1);
    }
  }

  const PsbtDetails = () => {
    return (
      <Fragment>
        <ModalHeaderContainer>
          Raw PSBT
          </ModalHeaderContainer>
        <div style={{ padding: '1.5em' }}>
          <OutputItem style={{ wordBreak: 'break-word' }}>
            <QRCode
              bgColor={white}
              fgColor={black}
              level="Q"
              style={{ width: 256 }}
              value={(finalPsbt as Psbt).toBase64()} // KBC-TODO: rexamine to avoid explicit type declaration
            />
          </OutputItem>
        </div>
      </Fragment>
    )
  }

  const PastePsbtModalContent = () => (
    <Fragment>
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
              setPastedPsbtValue('');
              setImportTxFromFileError('');
              setModalIsOpen(false);
            }}>Cancel</FromFileButton>
          <CopyAddressButton
            background={green600}
            color={white}
            onClick={() => {
              importTxFromFile(pastedPsbtValue)
            }}>Import Transaction</CopyAddressButton>
        </ImportButtons>
      </div>
    </Fragment>
  )

  const SelectAccountMenu = () => (
    <AccountMenu>
      {config.vaults.map((vault, index) => (
        <AccountMenuItemWrapper
          active={vault.id === currentAccount.config.id}
          borderRight={!!(index < config.vaults.length - 1) || !!config.wallets.length}
          onClick={() => setCurrentAccountId(vault.id)}>
          <StyledIcon as={Safe} size={48} />
          <AccountMenuItemName>{vault.name}</AccountMenuItemName>
        </AccountMenuItemWrapper>
      ))}
      {config.wallets.map((wallet, index) => (
        <AccountMenuItemWrapper
          key={index}
          active={wallet.id === currentAccount.config.id}
          borderRight={(index < config.wallets.length - 1)}
          onClick={() => setCurrentAccountId(wallet.id)}>
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
        onFileLoad={({ file }: File) => {
          importTxFromFile(file)
        }}
      />
      <label style={{ display: 'none' }} ref={fileUploadLabelRef} htmlFor="txFile"></label>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal()}>
        {modalContent as React.ReactChild}
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
                          if (txFileUploadButton !== null) {
                            txFileUploadButton.click()
                          }
                        }
                      },
                      {
                        label: 'Import from clipboard',
                        onClick: () => {
                          setImportTxFromFileError('')
                          setModalIsOpen(true)
                          setModalContent(<PastePsbtModalContent />)
                        }
                      }
                    ]}
                  />
                  <InputContainer>
                    <Input
                      label="Send bitcoin to"
                      type="text"
                      onChange={setRecipientAddress}
                      value={recipientAddress}
                      placeholder={bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) ?
                        "tb1q4h5xd5wsalmes2496y8dtphc609rt0un3gl69r" :
                        "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"}
                      error={recipientAddressError}
                    />
                  </InputContainer>
                  <InputContainer>
                    <Input
                      label="Amount of bitcoin to send"
                      type="text"
                      value={sendAmount}
                      onChange={setSendAmount}
                      placeholder="0.0025"
                      error={sendAmountError}
                      inputStaticText="BTC"
                    />
                  </InputContainer>
                  {sendAmountError && <SendAmountError>Not enough funds</SendAmountError>}
                  <SendButtonContainer>
                    {/* <CopyAddressButton background="transparent" color={darkGray}>Advanced Options</CopyAddressButton> */}
                    <CopyAddressButton background={green600} color={white} onClick={() => validateAndCreateTransaction()}>Preview Transaction</CopyAddressButton>
                    {importTxFromFileError && !modalIsOpen && <ErrorText style={{ paddingTop: '1em' }}>{importTxFromFileError}</ErrorText>}
                  </SendButtonContainer>
                </AccountSendContentLeft>
              )}

              {step === 1 && finalPsbt !== null && (
                <TransactionDetails
                  finalPsbt={finalPsbt}
                  nodeConfig={nodeConfig}
                  feeEstimate={getFee(finalPsbt as Psbt, transactions)} // KBC-TODO: rexamine to avoid explicit type declaration
                  recipientAddress={recipientAddress}
                  setStep={setStep}
                  sendAmount={sendAmount}
                  availableUtxos={availableUtxos}
                  signedPsbts={signedPsbts}
                  signedDevices={signedDevices}
                  txImportedFromFile={txImportedFromFile}
                  importTxFromFileError={importTxFromFileError}
                  signThreshold={currentAccount.config.quorum.requiredSigners}
                  currentBitcoinNetwork={currentBitcoinNetwork}
                  currentBitcoinPrice={currentBitcoinPrice}
                  currentAccount={currentAccount}
                  feeRates={feeRates}
                  createTransactionAndSetState={createTransactionAndSetState}
                  openInModal={openInModal}
                  closeModal={closeModal}
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
              {step === 1 && !currentAccount.config.mnemonic && finalPsbt && (
                <SignWithDevice
                  psbt={finalPsbt}
                  setSignedPsbts={setSignedPsbts}
                  signedPsbts={signedPsbts}
                  signedDevices={signedDevices}
                  setSignedDevices={setSignedDevices}
                  signThreshold={currentAccount.config.quorum.requiredSigners}
                  fileUploadLabelRef={fileUploadLabelRef}
                  phoneAction={currentAccount.config.extendedPublicKeys && currentAccount.config.extendedPublicKeys.filter((item) => item.device && item.device.type === 'phone').length ? () => openInModal(<PsbtDetails />) : undefined}
                />
              )}
            </AccountSendContentRight>
          </GridArea>
        )}
      </SendWrapper>
    </PageWrapper >
  )
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
`;

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

const FromFileButton = styled.button`
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

const CopyAddressButton = styled.button`
  ${Button};
  flex: 1;
`;

const SendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  border: 1px solid ${gray};
`;

const SendAmountError = styled.div`
  font-size: 0.5em;
  color: ${red};
  text-align: right;
`;

const AccountMenuItemWrapper = styled.div<{ active: boolean, borderRight: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.active ? gray100 : white};
  color: ${p => p.active ? darkGray : gray};
  padding: .75em;
  flex: 1;
  cursor: ${p => p.active ? 'auto' : 'pointer'};
  border-top: ${p => p.active ? `solid 11px ${green800}` : `none`};
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

const CurrentBalanceWrapper = styled.div<{ displayDesktop: boolean, displayMobile: boolean }>`
  padding: 1.5em;
  display: ${p => p.displayDesktop ? 'flex' : 'none'};
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  background: ${white};
  text-align: right;

  ${mobile(css<{ displayMobile: boolean }>`
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

const OutputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5em;
  margin: 12px 0;
  background: ${lightGray};
  border: 1px solid ${darkOffWhite};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

export const InputStaticText = styled.label<{ text: string, disabled: boolean }>`
  position: relative;
  display: flex;
  flex: 0 0;
  justify-self: center;
  align-self: center;
  margin-left: -87px;
  z-index: 1;
  margin-right: 40px;
  font-size: 1.5em;
  font-weight: 100;
  color: ${gray};

  &::after {
    content: ${p => p.text};
    position: absolute;
    top: 4px;
    left: 94px;
    font-family: arial, helvetica, sans-serif;
    font-size: .75em;
    display: block;
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
  }
`;

export default Send;