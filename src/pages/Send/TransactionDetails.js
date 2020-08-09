import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline';
import { CheckCircle } from '@styled-icons/material';
import { useHistory } from "react-router-dom";
import BigNumber from 'bignumber.js';

import {
  blockExplorerAPIURL,
  satoshisToBitcoins,
  estimateMultisigP2WSHTransactionVSize
} from "unchained-bitcoin";

import { address } from 'bitcoinjs-lib';

import { cloneBuffer } from '../../utils/other';
import { StyledIcon, Button, SidewaysShake, Dropdown, Modal } from '../../components';

import { gray, blue, darkGray, white, darkOffWhite, green, darkGreen, lightGray, red, lightRed, lightBlue, offWhite } from '../../utils/colors';
import { downloadFile, combinePsbts } from '../../utils/files';
import { getFeeForMultisig } from './utils';

const TransactionDetails = ({ finalPsbt, feeEstimate, importTxFromFileError, feeRates, currentAccount, toggleRefresh, fileUploadLabelRef, txImportedFromFile, signedDevices, recipientAddress, sendAmount, setStep, utxosMap, signedPsbts, signThreshold, currentBitcoinNetwork, currentBitcoinPrice }) => {
  const [broadcastedTxId, setBroadcastedTxId] = useState('');
  const [txError, setTxError] = useState(null);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const txSize = estimateMultisigP2WSHTransactionVSize({
    numInputs: finalPsbt.txInputs.length,
    numOutputs: finalPsbt.txOutputs.length,
    n: currentAccount.config.quorum.requiredSigners,
    m: currentAccount.config.quorum.totalSigners,
  });

  console.log('txSize: ', txSize);
  console.log('feerate: ', feeRates['1']);
  console.log('xxx: ', txSize * feeRates['1']);

  const history = useHistory();

  const openInModal = (component) => {
    setModalIsOpen(true);
    setModalContent(component);
  }

  const broadcastTransaction = async () => {
    if (signedPsbts.length === signThreshold) {
      try {
        if (signThreshold > 1) {
          const combinedPsbt = combinePsbts(finalPsbt, signedPsbts)

          combinedPsbt.finalizeAllInputs();

          const { data } = await axios.get(blockExplorerAPIURL(`/broadcast?tx=${combinedPsbt.extractTransaction().toHex()}`, currentBitcoinNetwork));
          setBroadcastedTxId(data);
          setModalIsOpen(true);
          setModalContent(<TransactionSuccess broadcastedTxId={data} />);

        } else {
          const { data } = await axios.get(blockExplorerAPIURL(`/broadcast?tx=${signedPsbts[0].extractTransaction().toHex()}`, currentBitcoinNetwork));
          setBroadcastedTxId(data);
          setModalIsOpen(true);
          setModalContent(<TransactionSuccess broadcastedTxId={data} />);
        }
      } catch (e) {
        setTxError(e.response.data);
      }
    }
  }

  const downloadPsbt = () => {
    const combinedPsbt = combinePsbts(finalPsbt, signedPsbts);
    const psbtForDownload = new Blob([combinedPsbt.toBase64()]);
    downloadFile(psbtForDownload, `tx-${moment().format('MMDDYY-hhmmss')}.psbt`);
  }

  const TransactionOptionsDropdown = () => {
    const dropdownItems = [
      { label: 'View PSBT', onClick: () => { openInModal(<PsbtDetails />) } },
      { label: 'Download PSBT', onClick: () => { downloadPsbt(); openInModal(<PsbtDownloadDetails />) } },
      {
        label: 'Add signature from file',
        onClick: () => {
          const txFileUploadButton = fileUploadLabelRef.current;
          txFileUploadButton.click()
        }
      }
    ];

    // if we are creating the transaction ourselves, give options for adjustment
    if (!txImportedFromFile) {
      dropdownItems.unshift(
        { label: 'Edit Transaction', onClick: () => setStep(0) },
        { label: 'View more details', onClick: () => { openInModal(<TransactionDetails />); } },
        { label: 'Adjust Fee', onClick: () => { openInModal(<FeeSelector />) } }
      );
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

  const FeeSelector = ({ feeArray }) => {
    console.log('finalPsbt: ', finalPsbt)
    const fastestFee = getFeeForMultisig(feeRates['1'], currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
    let normalFee = getFeeForMultisig(feeRates['3'], currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
    if (normalFee === fastestFee) {
      normalFee = getFeeForMultisig(feeRates['4'], currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
    }
    const slowFee = getFeeForMultisig(feeRates['6'], currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);

    console.log('feeRates[1]xx: ', feeRates[1]);
    console.log('fastestFee: ', fastestFee);
    console.log('normalFee: ', fastestFee);
    console.log('slowFee: ', slowFee);


    console.log('satoshisToBitcoins(fastestFee).multipliedBy(currentBitcoinPrice).toFixed(2): ', satoshisToBitcoins(fastestFee).multipliedBy(currentBitcoinPrice).toFixed(2));
    console.log('satoshisToBitcoins(fastestFee).toNumber(): ', satoshisToBitcoins(fastestFee).toNumber());

    return (
      <Fragment>
        <ModalHeaderContainer>
          Adjust Transaction Fee
      </ModalHeaderContainer>
        <div style={{ padding: '1.5em' }}>
          <FeeItem selected={true}>
            <FeeMainText>Fast: ~10 minutes</FeeMainText>
            <FeeSubtext>${satoshisToBitcoins(fastestFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(fastestFee).toNumber()} BTC</FeeSubtext>
          </FeeItem>
          <FeeItem>
            <FeeMainText>Normal: ~30 minutes</FeeMainText>
            <FeeSubtext>${satoshisToBitcoins(normalFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(normalFee).toNumber()} BTC</FeeSubtext>
          </FeeItem>
          <FeeItem>
            <FeeMainText>Slow: ~1 hour</FeeMainText>
            <FeeSubtext>${satoshisToBitcoins(slowFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(slowFee).toNumber()} BTC</FeeSubtext>
          </FeeItem>
          <FeeItem>
            <FeeMainText>Custom Fee</FeeMainText>
            <FeeSubtext>Enter a specific fee amount</FeeSubtext>
          </FeeItem>
        </div>
      </Fragment>
    )
  }

  const PsbtDetails = () => (
    <Fragment>
      <ModalHeaderContainer>
        Raw PSBT
      </ModalHeaderContainer>
      <div style={{ padding: '1.5em' }}>
        <OutputItem style={{ wordBreak: 'break-word' }}>
          {finalPsbt.toBase64()}
        </OutputItem>
      </div>
    </Fragment>
  )

  const PsbtDownloadDetails = () => (
    <Fragment>
      <ModalHeaderContainer>
        Download Complete
      </ModalHeaderContainer>
      <ModalBody>
        <IconWrapper style={{ color: green }}>
          <StyledIcon as={CheckCircle} size={100} />
        </IconWrapper>
        <ModalSubtext>Check your downloads folder for the PSBT file</ModalSubtext>
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
        <TransactionFeeField>Transaction Fee: <span>{satoshisToBitcoins(feeEstimate).toNumber()} BTC (${satoshisToBitcoins(feeEstimate.multipliedBy(currentBitcoinPrice)).toFixed(2)})</span></TransactionFeeField>
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
        <ViewTransactionButton color={white} background={green} href={`https://blockstream.info/tx/${broadcastedTxId}`} target="_blank">View Transaction</ViewTransactionButton>
      </ModalBody>
    </Fragment>
  )

  const TransactionDetails = () => (
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
            const utxo = utxosMap.get(inputBuffer.reverse().toString('hex'));
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

          <MoreDetailsHeader style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2em' }}>Fees: {<span>{satoshisToBitcoins(feeEstimate).toNumber()} BTC (${satoshisToBitcoins(feeEstimate.multipliedBy(currentBitcoinPrice)).toFixed(2)})</span>}</MoreDetailsHeader>
        </MoreDetailsSection>
      </MoreDetailsContainer>
    </Fragment>
  );

  let screen = null;

  if (!txImportedFromFile) {
    screen = TransactionSummary()
  } else {
    screen = TransactionDetails()
  }

  return (
    <Fragment>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setModalContent(null);

          if (broadcastedTxId) {
            toggleRefresh();
            history.push(`vault/${currentAccount.config.id}`)
          }
        }}
      >
        {modalContent}
      </Modal>
      <AccountSendContentRight>
        <SendDetailsContainer>
          {screen}
          {txError && <ErrorBox>{txError}</ErrorBox>}
          {importTxFromFileError && <ErrorBox>{importTxFromFileError}</ErrorBox>}
          {!broadcastedTxId && <SendButton background={green} color={white} loaded={signedDevices.length === signThreshold} onClick={broadcastTransaction}>
            {signedDevices.length < signThreshold && currentAccount.config.quorum.requiredSigners > 1 ? `Confirm on Devices (${signedDevices.length}/${signThreshold})` : 'Send Transaction'}
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

const FeeMainText = styled.div`
  font-size: 1em;
`;

const FeeSubtext = styled.div`
  color: ${darkGray};
  font-size: 0.75em;
`;

const FeeItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5em;
  margin: 12px 0;
  background: ${ p => p.selected ? lightBlue : lightGray};
  border: 1px solid ${p => p.selected ? blue : offWhite};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  transition-duration: .15s;

  &:hover {
    border: 1px solid ${p => p.selected ? blue : offWhite};
    background: ${ p => p.selected ? lightBlue : offWhite};
  }

  &:active {
    background: ${ p => p.selected ? lightBlue : gray};
  }
`;

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
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
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
  max-width: 500px;
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
  color: ${blue};
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

const ViewTransactionButton = styled.a`
  ${Button}
  margin-top: 1em;
`;

export default TransactionDetails;