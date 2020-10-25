import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline';
import { CheckCircle } from '@styled-icons/material';

import {
  blockExplorerAPIURL,
  blockExplorerTransactionURL,
  satoshisToBitcoins,
  MAINNET, TESTNET
} from "unchained-bitcoin";

import { address, Psbt } from 'bitcoinjs-lib';

import { cloneBuffer } from '../../utils/other';
import { StyledIcon, Button, SidewaysShake, Dropdown } from '../../components';

import { gray, green800, darkGray, white, darkOffWhite, green, darkGreen, lightGray, red, lightRed, orange, lightOrange } from '../../utils/colors';
import { downloadFile, formatFilename, combinePsbts } from '../../utils/files';
import { createUtxoMapFromUtxoArray } from './utils';
import { FeeSelector } from './FeeSelector';

import { getUnchainedNetworkFromBjslibNetwork } from '../../utils/files';

const ABSURD_FEE = 1000000; // 0.01 BTC

const TransactionDetails = ({
  finalPsbt,
  feeEstimate,
  importTxFromFileError,
  feeRates,
  currentAccount,
  txImportedFromFile,
  signedDevices,
  recipientAddress,
  sendAmount,
  setStep,
  availableUtxos,
  signedPsbts,
  signThreshold,
  currentBitcoinPrice,
  createTransactionAndSetState,
  currentBitcoinNetwork,
  openInModal,
  closeModal
}) => {
  const [broadcastedTxId, setBroadcastedTxId] = useState('');
  const [txError, setTxError] = useState(null);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);

  const broadcastTransaction = async (currentAccount, psbt, currentBitcoinNetwork) => {
    if (currentAccount.nodeConfig.provider !== 'Blockstream') {
      const data = await window.ipcRenderer.invoke('/broadcastTx', {
        walletName: currentAccount.name,
        txHex: psbt.extractTransaction().toHex()
      });
      return data;
    } else {
      const txBody = psbt.extractTransaction().toHex();
      const network = currentBitcoinNetwork.bech32 === 'bc' ? MAINNET : TESTNET;
      const { data } = await axios.post(blockExplorerAPIURL('/tx', network), txBody);
      return data;
    }
  }

  const sendTransaction = async () => {
    if (signedDevices.length === signThreshold) {
      try {
        if (signThreshold > 1) {
          const combinedPsbt = combinePsbts(finalPsbt, signedPsbts)

          combinedPsbt.finalizeAllInputs();

          const broadcastId = await broadcastTransaction(currentAccount, combinedPsbt, currentBitcoinNetwork);
          setBroadcastedTxId(broadcastId);
          openInModal(<TransactionSuccess broadcastedTxId={broadcastId} />);

        } else {
          let broadcastPsbt;
          if (typeof signedPsbts[0] === 'string') { // if hww signs, then signedPsbt[0] is a string and we need to turn it into a hex to broadcast
            broadcastPsbt = Psbt.fromBase64(signedPsbts[0]);
            broadcastPsbt.finalizeAllInputs();
          } else {
            broadcastPsbt = signedPsbts[0];
          }

          const broadcastId = await broadcastTransaction(currentAccount, broadcastPsbt, currentBitcoinNetwork);
          setBroadcastedTxId(broadcastId);
          openInModal(<TransactionSuccess broadcastedTxId={broadcastId} />);
        }
      } catch (e) {
        if (e.response) {
          setTxError(e.response.data);
        } else {
          setTxError(e.message);
        }
      }
    }
  }

  const downloadPsbt = async () => {
    const combinedPsbt = combinePsbts(finalPsbt, signedPsbts);
    const psbtForDownload = combinedPsbt.toBase64();
    await downloadFile(psbtForDownload, formatFilename('tx', currentBitcoinNetwork, 'psbt'));
    openInModal(<PsbtDownloadDetails />)
  }

  const TransactionOptionsDropdown = () => {
    const dropdownItems = [
      { label: 'Download PSBT', onClick: () => { downloadPsbt() } },
    ];

    if (!signedDevices.length || currentAccount.config.mnemonic) {
      dropdownItems.unshift(
        {
          label: 'Adjust Fee', onClick: () => {
            openInModal(<FeeSelector
              currentAccount={currentAccount}
              feeEstimate={feeEstimate}
              finalPsbt={finalPsbt}
              feeRates={feeRates}
              availableUtxos={availableUtxos}
              recipientAddress={recipientAddress}
              sendAmount={sendAmount}
              closeModal={closeModal}
              createTransactionAndSetState={createTransactionAndSetState}
              currentBitcoinPrice={currentBitcoinPrice}
            />)
          }
        }
      )
    }

    // if we are creating the transaction ourselves, give options for adjustment
    if (!txImportedFromFile) {
      dropdownItems.unshift(
        { label: 'View more details', onClick: () => { openInModal(<TransactionDetails />); } }
      );
    }

    if (!signedDevices.length || currentAccount.config.mnemonic) {
      dropdownItems.unshift(
        { label: 'Edit Transaction', onClick: () => setStep(0) }
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

  const TransactionSummary = () => (
    <Fragment>
      <ModalHeaderContainer>
        <span>Transaction Summary</span>
        <TransactionOptionsDropdown />
      </ModalHeaderContainer>
      <MainTxData>
        <SendingHeader style={{ padding: 0 }}>{`Sending ${sendAmount} BTC`}</SendingHeader>
        <ToField>to</ToField>
        <RecipientAddressRow style={{ paddingTop: 0, textAlign: 'right' }}>{recipientAddress}</RecipientAddressRow>
      </MainTxData>
      <div>
        <TransactionFeeField>Transaction Fee: <span>{satoshisToBitcoins(feeEstimate).toNumber()} BTC (${satoshisToBitcoins(feeEstimate).multipliedBy(currentBitcoinPrice).toFixed(2)})</span></TransactionFeeField>
        {feeEstimate >= ABSURD_FEE && <WarningBox>Warning: transaction fee is very high</WarningBox>}
      </div>
    </Fragment>
  )

  const TransactionSuccess = ({ broadcastedTxId }) => (
    <Fragment>
      <ModalHeaderContainer>
        Transaction Success
      </ModalHeaderContainer>
      <ModalBody>
        <IconWrapper style={{ color: green }}>
          <StyledIcon as={CheckCircle} size={100} />
        </IconWrapper>
        <ModalSubtext>Your transaction has been broadcast.</ModalSubtext>
        <ViewTransactionButton color={white} background={green} href={blockExplorerTransactionURL(broadcastedTxId, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork))} target="_blank">View Transaction</ViewTransactionButton>
      </ModalBody>
    </Fragment>
  )

  const TransactionDetails = () => {
    let utxosMap;
    if (availableUtxos) {
      utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
    }
    return (
      <Fragment>
        <ModalHeaderContainer>
          <span>Transaction Details</span>
          {txImportedFromFile && <TransactionOptionsDropdown />}
        </ModalHeaderContainer>
        <MoreDetailsContainer>
          <MoreDetailsSection>
            <MoreDetailsHeader>Inputs</MoreDetailsHeader>
            {finalPsbt.__CACHE.__TX.ins.map(input => {
              const inputBuffer = cloneBuffer(input.hash);
              const utxo = utxosMap.get(`${inputBuffer.reverse().toString('hex')}:${input.index}`);
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
            {finalPsbt.__CACHE.__TX.outs.map(output => (
              <OutputItem>
                <OutputAddress>{address.fromOutputScript(output.script, finalPsbt.opts.network)}</OutputAddress> <OutputAmount>{satoshisToBitcoins(output.value).toNumber()} BTC</OutputAmount>
              </OutputItem>
            ))}

            <MoreDetailsHeader style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2em' }}>Fees: {<span>{satoshisToBitcoins(feeEstimate).toNumber()} BTC (${satoshisToBitcoins(feeEstimate).multipliedBy(currentBitcoinPrice).toFixed(2)})</span>}</MoreDetailsHeader>
          </MoreDetailsSection>
        </MoreDetailsContainer>
      </Fragment>
    )
  };

  let screen = null;

  if (!txImportedFromFile) {
    screen = TransactionSummary()
  } else {
    screen = TransactionDetails()
  }

  return (
    <Fragment>
      <AccountSendContentRight>
        <SendDetailsContainer>
          {screen}
          {txError && <ErrorBox>{txError}</ErrorBox>}
          {importTxFromFileError && <ErrorBox>{importTxFromFileError}</ErrorBox>}
          {!broadcastedTxId && <SendButton background={green} color={white} loaded={signedDevices.length === signThreshold} onClick={sendTransaction}>
            {signedDevices.length < signThreshold ? `Confirm on Devices (${signedDevices.length}/${signThreshold})` : 'Send Transaction'}
            {signedDevices.length < signThreshold ? null : (
              <SendButtonCheckmark loaded={signedDevices.length}>
                <StyledIcon as={ArrowIosForwardOutline} size={16} />
              </SendButtonCheckmark>
            )}
          </SendButton>}
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

const SendButton = styled.div`
  ${Button};
  pointer-events: ${p => p.loaded ? 'auto' : 'none'};
  box-shadow: ${p => p.loaded ? `inset 500px 0 0 0 ${darkGreen}` : `inset 0 0 0 0 ${darkGreen}`};
  transition: ease-out 0.4s;
  position: relative;
  font-size: 1.5em;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;

  &:hover {
    box-shadow: inset 500px 0 0 0 ${darkGreen};
  }
`;

const SendButtonCheckmark = styled.div`
  animation: 1s ease infinite ${SidewaysShake};
`;

const ErrorBox = styled.div`
  padding: 1.5em;
  background: ${lightRed};
  color: ${red};
  border: 1px solid ${red};
  margin: 1.5em 0;
`;

const WarningBox = styled.div`
  padding: 1.5em;
  background: ${lightOrange};
  color: ${orange};
  border: 1px solid ${orange};
  margin: 1.5em 0;
`;

const ViewTransactionButton = styled.a`
  ${Button}
  margin-top: 1em;
`;

export default TransactionDetails;