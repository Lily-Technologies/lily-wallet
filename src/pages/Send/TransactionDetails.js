import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline';
import { CheckCircle } from '@styled-icons/material';
import { useHistory } from "react-router-dom";
import BigNumber from 'bignumber.js';
import coinSelect from 'coinselect';

import {
  blockExplorerAPIURL,
  blockExplorerTransactionURL,
  satoshisToBitcoins,
  bitcoinsToSatoshis
} from "unchained-bitcoin";

import { address, Psbt, networks } from 'bitcoinjs-lib';

import { cloneBuffer } from '../../utils/other';
import { bitcoinNetworkEqual } from '../../utils/transactions';
import { StyledIcon, Button, SidewaysShake, Dropdown, Modal } from '../../components';

import { gray, blue, darkGray, white, darkOffWhite, green, darkGreen, lightGray, red, lightRed, orange, lightOrange, lightBlue, offWhite } from '../../utils/colors';
import { downloadFile, formatFilename, combinePsbts } from '../../utils/files';
import { getFeeForMultisig, createUtxoMapFromUtxoArray } from './utils';
import { AddressDisplayWrapper, Input, InputStaticText } from './styles';

const ABSURD_FEE = 1000000; // 0.01 BTC

const TransactionDetails = ({
  finalPsbt,
  feeEstimate,
  importTxFromFileError,
  feeRates,
  currentAccount,
  toggleRefresh,
  fileUploadLabelRef,
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
}) => {
  const [broadcastedTxId, setBroadcastedTxId] = useState('');
  const [txError, setTxError] = useState(null);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const history = useHistory();

  const openInModal = (component) => {
    setModalIsOpen(true);
    setModalContent(component);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  }

  const getUnchainedNetworkFromBjslibNetwork = (bitcoinJslibNetwork) => {
    if (bitcoinNetworkEqual(bitcoinJslibNetwork, networks.bitcoin)) {
      return 'mainnet';
    } else {
      return 'testnet';
    }
  }

  const broadcastTransaction = async () => {
    if (signedDevices.length === signThreshold) {
      try {
        if (signThreshold > 1) {
          const combinedPsbt = combinePsbts(finalPsbt, signedPsbts)

          combinedPsbt.finalizeAllInputs();

          const { data } = await axios.get(blockExplorerAPIURL(`/broadcast?tx=${combinedPsbt.extractTransaction().toHex()}`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)));
          setBroadcastedTxId(data);
          setModalIsOpen(true);
          setModalContent(<TransactionSuccess broadcastedTxId={data} />);

        } else {
          let broadcastPsbt;
          if (typeof signedPsbts[0] === 'string') { // if hww signs, then signedPsbt[0] is a string and we need to turn it into a hex to broadcast
            broadcastPsbt = Psbt.fromBase64(signedPsbts[0]);
            broadcastPsbt.finalizeAllInputs();
          } else {
            broadcastPsbt = signedPsbts[0];
          }

          const { data } = await axios.get(blockExplorerAPIURL(`/broadcast?tx=${broadcastPsbt.extractTransaction().toHex()}`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)));
          setBroadcastedTxId(data);
          setModalIsOpen(true);
          setModalContent(<TransactionSuccess broadcastedTxId={data} />);
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

  const downloadPsbt = () => {
    const combinedPsbt = combinePsbts(finalPsbt, signedPsbts);
    const psbtForDownload = new Blob([combinedPsbt.toBase64()]);
    downloadFile(psbtForDownload, formatFilename('tx', currentBitcoinNetwork, 'psbt'));
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

    if (!signedDevices.length || currentAccount.config.mnemonic) {
      dropdownItems.unshift(
        { label: 'Adjust Fee', onClick: () => { openInModal(<FeeSelector />) } }
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

  const FeeSelector = () => {
    let fastestFee;
    let normalFee;
    let slowFee;
    if (currentAccount.config.quorum.totalSigners > 1) {
      fastestFee = getFeeForMultisig(feeRates.fastestFee, currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
      normalFee = getFeeForMultisig(feeRates.halfHourFee, currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
      slowFee = getFeeForMultisig(feeRates.hourFee, currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
    } else {
      fastestFee = coinSelect(availableUtxos, [{ address: recipientAddress, value: bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.fastestFee).fee;
      normalFee = coinSelect(availableUtxos, [{ address: recipientAddress, value: bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.halfHourFee).fee;
      slowFee = coinSelect(availableUtxos, [{ address: recipientAddress, value: bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.hourFee).fee;
    }
    const [customFee, setCustomFee] = useState(feeEstimate);
    const [customFeeError, setCustomFeeError] = useState(false);
    const [customFeeBtc, setCustomFeeBtc] = useState(satoshisToBitcoins(feeEstimate));

    const validateCustomFee = () => {
      if (!satoshisToBitcoins(BigNumber(customFee)).isGreaterThan(0)) {
        setCustomFeeError(true);
        return false;
      }
      if (satoshisToBitcoins(BigNumber(customFee)).isGreaterThan(0) && customFeeError) {
        setCustomFeeError(false)
      }
      return true;
    }

    return (
      <Fragment>
        <ModalHeaderContainer>
          Adjust Transaction Fee
      </ModalHeaderContainer>
        <div style={{ padding: '1.5em' }}>
          <FeeItem
            onClick={() => {
              createTransactionAndSetState(fastestFee);
              closeModal();
            }}
            selected={fastestFee === feeEstimate}>
            <FeeMainText>Fast: ~10 minutes</FeeMainText>
            <FeeSubtext>${satoshisToBitcoins(fastestFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(fastestFee).toNumber()} BTC</FeeSubtext>
          </FeeItem>
          <FeeItem
            onClick={() => {
              createTransactionAndSetState(normalFee);
              closeModal();
            }}
            selected={normalFee === feeEstimate}>
            <FeeMainText>Normal: ~30 minutes</FeeMainText>
            <FeeSubtext>${satoshisToBitcoins(normalFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(normalFee).toNumber()} BTC</FeeSubtext>
          </FeeItem>
          <FeeItem
            onClick={() => {
              createTransactionAndSetState(slowFee);
              closeModal();
            }}
            selected={slowFee === feeEstimate}>
            <FeeMainText>Slow: ~1 hour</FeeMainText>
            <FeeSubtext>${satoshisToBitcoins(slowFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(slowFee).toNumber()} BTC</FeeSubtext>
          </FeeItem>
          <FeeItem
            onClick={() => {
              if (validateCustomFee()) {
                createTransactionAndSetState(customFee);
                closeModal();
              }
            }}
            selected={customFee === feeEstimate}>
            <FeeMainText>Custom Fee</FeeMainText>
            <FeeSubtext>
              { customFee ?
                `$${satoshisToBitcoins(customFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, ${satoshisToBitcoins(customFee).toNumber()} BTC` :
                "Enter a specific fee amount"
              }
            </FeeSubtext>
          </FeeItem>
          <AddressDisplayWrapper>
            <Input
              onChange={(e) => {
                setCustomFeeBtc(e.target.value);
                setCustomFee(bitcoinsToSatoshis(e.target.value));
                validateCustomFee();
              }}
              value={customFeeBtc}
              placeholder={"0.00001"}
              style={{ paddingRight: 80, color: darkGray, flex: 1 }}
              error={customFeeError}
            />
            <InputStaticText
              disabled
              text="BTC"
            >BTC</InputStaticText>
          </AddressDisplayWrapper>
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
        <TransactionFeeField>Transaction Fee: <span>{satoshisToBitcoins(feeEstimate).toNumber()} BTC (${satoshisToBitcoins(feeEstimate).multipliedBy(currentBitcoinPrice).toFixed(2)})</span></TransactionFeeField>
        { feeEstimate >= ABSURD_FEE && <WarningBox>Warning: transaction fee is very high</WarningBox> }
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