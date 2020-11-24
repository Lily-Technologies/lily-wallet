import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline';
import { CheckCircle } from '@styled-icons/material';

import { satoshisToBitcoins } from "unchained-bitcoin";

import { address, Psbt, Network } from 'bitcoinjs-lib';

import { cloneBuffer } from '../../utils/other';
import { StyledIcon, Button, SidewaysShake, Dropdown, Modal } from '../../components';

import { gray, green800, darkGray, white, darkOffWhite, green, darkGreen, lightGray, red, lightRed, orange, lightOrange } from '../../utils/colors';
import { downloadFile, formatFilename } from '../../utils/files';
import { createUtxoMapFromUtxoArray, getFee } from '../../utils/send';
import { FeeSelector } from './FeeSelector';

import { LilyAccount, UtxoMap, Device, FeeRates } from '../../types';

const ABSURD_FEE = 1000000; // 0.01 BTC

interface Props {
  finalPsbt: Psbt,
  sendTransaction: () => void
  feeRates: FeeRates,
  currentAccount: LilyAccount,
  signedDevices: Device[],
  setStep?: React.Dispatch<React.SetStateAction<number>>,
  currentBitcoinPrice: any // KBC-TODO: change to be more specific
  createTransactionAndSetState: (_recipientAddress: string, _sendAmount: string, _fee: BigNumber) => Promise<Psbt>,
  currentBitcoinNetwork: Network
}

const TransactionDetails = ({
  finalPsbt,
  sendTransaction,
  feeRates,
  currentAccount,
  signedDevices,
  setStep,
  currentBitcoinPrice,
  createTransactionAndSetState,
  currentBitcoinNetwork,
}: Props) => {
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const signThreshold = currentAccount.config.quorum.requiredSigners;
  const { availableUtxos } = currentAccount;

  console.log('finalPsbt: ', finalPsbt);
  const _fee = getFee(finalPsbt, currentAccount.transactions);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  }

  const downloadPsbt = async () => {
    const psbtForDownload = finalPsbt.toBase64();
    await downloadFile(psbtForDownload, formatFilename('tx', currentBitcoinNetwork, 'psbt'));
    openInModal(<PsbtDownloadDetails />)
  }

  const TransactionOptionsDropdown = () => {
    const dropdownItems = [
      { label: 'Save transaction to file', onClick: () => { downloadPsbt() } },
    ];

    if (setStep !== undefined && (!signedDevices.length || currentAccount.config.mnemonic)) {
      dropdownItems.unshift(
        {
          label: 'Adjust Fee', onClick: () => {
            openInModal(
              <FeeSelector
                currentAccount={currentAccount}
                finalPsbt={finalPsbt}
                feeRates={feeRates}
                availableUtxos={availableUtxos}
                recipientAddress={finalPsbt.txOutputs[0].address!}
                sendAmount={satoshisToBitcoins(finalPsbt.txOutputs[0].value).toString()}
                closeModal={closeModal}
                createTransactionAndSetState={createTransactionAndSetState}
                currentBitcoinPrice={currentBitcoinPrice}
              />
            )
          }
        }
      )
    }

    // if we are creating the transaction ourselves, give options for adjustment
    if (setStep !== undefined) {
      dropdownItems.unshift(
        { label: 'View more details', onClick: () => { openInModal(<TransactionUtxoDetails />); } }
      );
    }

    if (setStep !== undefined && !signedDevices.length || currentAccount.config.mnemonic) {
      dropdownItems.unshift(
        { label: 'Edit Transaction', onClick: () => setStep && setStep(0) }
      )
    }

    return (
      <Fragment>
        <Dropdown
          isOpen={optionsDropdownOpen}
          setIsOpen={setOptionsDropdownOpen}
          minimal={true}
          dropdownItems={dropdownItems}
        />
      </Fragment>
    )
  }

  const PsbtDownloadDetails = () => (
    <Fragment>
      <ModalHeaderContainer>
        Download Complete
      </ModalHeaderContainer>
      <ModalBody>
        <IconWrapper style={{ color: green }}>
          <StyledIcon as={CheckCircle} size={100} />
        </IconWrapper>
        <ModalSubtext>Your PSBT file has been saved successfully.</ModalSubtext>
      </ModalBody>
    </Fragment>
  )

  const TransactionUtxoDetails = () => {
    let utxosMap: UtxoMap;
    if (availableUtxos) {
      utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
    }
    return (
      <Fragment>
        <ModalHeaderContainer>
          <span>Transaction Details</span>
        </ModalHeaderContainer>
        <MoreDetailsContainer>
          <MoreDetailsSection>
            <MoreDetailsHeader>Inputs</MoreDetailsHeader>
            {finalPsbt.txInputs.map(input => {
              const inputBuffer = cloneBuffer(input.hash);
              const utxo = utxosMap[`${inputBuffer.reverse().toString('hex')}:${input.index}`];
              return (
                <OutputItem>
                  <OutputAddress>{utxo.address.address}</OutputAddress>
                  <OutputAmount>{satoshisToBitcoins(utxo.value).toNumber()} BTC</OutputAmount>
                </OutputItem>
              )
            })}
          </MoreDetailsSection>
          <MoreDetailsSection>
            <MoreDetailsHeader style={{ marginTop: '1em' }}>Outputs</MoreDetailsHeader>
            {finalPsbt.txOutputs.map(output => (
              <OutputItem>
                <OutputAddress>{address.fromOutputScript(output.script, currentBitcoinNetwork)}</OutputAddress> <OutputAmount>{satoshisToBitcoins(output.value).toNumber()} BTC</OutputAmount>
              </OutputItem>
            ))}

            <MoreDetailsHeader style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2em' }}>Fees: {<span>{satoshisToBitcoins(_fee).toNumber()} BTC (${satoshisToBitcoins(_fee).multipliedBy(currentBitcoinPrice).toFixed(2)})</span>}</MoreDetailsHeader>
          </MoreDetailsSection>
        </MoreDetailsContainer>
      </Fragment>
    )
  };

  return (
    <Fragment>
      <AccountSendContentRight>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => closeModal()}>
          {modalContent as React.ReactChild}
        </Modal>
        <SendDetailsContainer>
          <ModalHeaderContainer>
            <span>Transaction Summary</span>
            <TransactionOptionsDropdown />
          </ModalHeaderContainer>
          <MainTxData>
            <SendingHeader style={{ padding: 0 }}>{`Sending ${satoshisToBitcoins(finalPsbt.txOutputs[0].value)} BTC`}</SendingHeader>
            <ToField>to</ToField>
            <RecipientAddressRow style={{ paddingTop: 0, textAlign: 'right' }}>{finalPsbt.txOutputs[0].address}</RecipientAddressRow>
          </MainTxData>
          <div>
            <TransactionFeeField>Transaction Fee: <span>{satoshisToBitcoins(_fee).toNumber()} BTC (${satoshisToBitcoins(_fee).multipliedBy(currentBitcoinPrice).toFixed(2)})</span></TransactionFeeField>
            {_fee >= ABSURD_FEE && <WarningBox>Warning: transaction fee is very high</WarningBox>}
          </div>
          <SendButton sendable={signedDevices.length === signThreshold} background={green} color={white} onClick={() => sendTransaction()}>
            {signedDevices.length < signThreshold ? `Confirm on Devices (${signedDevices.length}/${signThreshold})` : 'Broadcast Transaction'}
            {signedDevices.length < signThreshold ? null : (
              <SendButtonCheckmark>
                <StyledIcon as={ArrowIosForwardOutline} size={16} />
              </SendButtonCheckmark>
            )}
          </SendButton>
        </SendDetailsContainer>
      </AccountSendContentRight>
    </Fragment>
  )
}

const IconWrapper = styled.div`

`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  align-items: center;
  justify-content: center;
`;

const ModalSubtext = styled.div`
  color: ${darkGray};
  margin-top: 1rem;
`;

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229,231,235);
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
  height: 90px;
`;

const SendingHeader = styled.div`
  font-size: 1.75em;
`;

const MainTxData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4em 0 3em;
  padding-left: 3.5rem;
  padding-right: 3.5rem;
`;

const RecipientAddressRow = styled.div`
  word-break: break-all;
  font-size: 1.2em;
  align-self: center;
`;

const AccountSendContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
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

const OutputAddress = styled.span`
  color: ${green800};
  flex: 2;
  word-break: break-word;
`;

const OutputAmount = styled.span`
  flex: 1;
  text-align: right;
`;

const MoreDetailsSection = styled.div``;

const MoreDetailsContainer = styled.div`
  padding: 1.5rem;
`;

const MoreDetailsHeader = styled.div`
  color: ${darkGray};
  font-size: 1.5em;
`;


const SendDetailsContainer = styled.div`
  background: ${white};
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  border-radius: 0.375rem;
`;

const ToField = styled.div`
  font-size: 1em;
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
`;

const TransactionFeeField = styled.div`
  font-size: 1em;
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
  color: ${gray};
  flex-direction: column;
  align-items: center;
`;

const SendButton = styled.div<{ sendable: boolean, background: string, color: string }>`
  ${Button};
  transition: ease-out 0.4s;
  position: relative;
  font-size: 1.5em;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  box-shadow: ${p => p.sendable ? `inset 1000px 0 0 0 ${darkGreen}` : 'none'};
`;

const SendButtonCheckmark = styled.div`
  animation: 1s ease infinite ${SidewaysShake};
`;

const WarningBox = styled.div`
  padding: 1.5em;
  background: ${lightOrange};
  color: ${orange};
  border: 1px solid ${orange};
  margin: 1.5em 0;
`;

export default TransactionDetails;