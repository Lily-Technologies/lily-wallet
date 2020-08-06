import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline';
import { CheckCircle } from '@styled-icons/material';

import {
  blockExplorerAPIURL,
  satoshisToBitcoins,
} from "unchained-bitcoin";

import { address } from 'bitcoinjs-lib';

import { cloneBuffer } from '../../utils/other';
import { StyledIcon, Button, SidewaysShake, Dropdown, Modal } from '../../components';

import { gray, blue, darkGray, white, darkOffWhite, green, darkGreen, lightGray, red, lightRed } from '../../utils/colors';
import { downloadFile, combinePsbts } from '../../utils/files';

const TransactionDetails = ({ finalPsbt, feeEstimate, importTxFromFileError, fileUploadLabelRef, txImportedFromFile, signedDevices, recipientAddress, sendAmount, setStep, utxosMap, signedPsbts, signThreshold, currentBitcoinNetwork, currentBitcoinPrice }) => {
  const [broadcastedTxId, setBroadcastedTxId] = useState('');
  const [txError, setTxError] = useState(null);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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

        } else {
          const { data } = await axios.get(blockExplorerAPIURL(`/broadcast?tx=${signedPsbts[0].extractTransaction().toHex()}`, currentBitcoinNetwork));
          setBroadcastedTxId(data);
        }
      } catch (e) {
        setTxError(e.message);
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
        // { label: 'Adjust Fee', onClick: () => { openInModal(<FeeSelector />) } }
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

  const FeeSelector = () => (
    <div>fee selector</div>
  )

  const PsbtDetails = () => (
    <Fragment>
      <ModalHeaderContainer>
        PSBT
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
            {signedDevices.length < signThreshold ? `Confirm on Devices (${signedDevices.length}/${signThreshold})` : 'Send Transaction'}
            {signedDevices.length < signThreshold ? null : (
              <SendButtonCheckmark loaded={signedDevices.length}>
                <StyledIcon as={ArrowIosForwardOutline} size={16} />
              </SendButtonCheckmark>
            )}
          </SendButton>}
          {broadcastedTxId && <ViewTransactionButton href={`https://blockstream.info/tx/${broadcastedTxId}`} target="_blank">View Transaction</ViewTransactionButton>}
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