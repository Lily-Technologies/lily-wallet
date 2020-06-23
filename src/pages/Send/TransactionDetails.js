import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline'

import {
  blockExplorerAPIURL,
  satoshisToBitcoins,
} from "unchained-bitcoin";

import { Psbt, address } from 'bitcoinjs-lib';

import { cloneBuffer } from '../../utils/other';
import { StyledIcon, Button, SidewaysShake } from '../../components';

import { gray, blue, darkGray, white, darkOffWhite, green, darkGreen, lightGray, red, lightRed } from '../../utils/colors';

const TransactionDetails = ({ finalPsbt, feeEstimate, outputTotal, recipientAddress, sendAmount, setStep, transactionsMap, signedPsbts, signThreshold, currentBitcoinNetwork, currentBitcoinPrice }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [broadcastedTxId, setBroadcastedTxId] = useState('');
  const [txError, setTxError] = useState(null);

  const broadcastTransaction = async () => {
    if (signedPsbts.length === signThreshold) {
      try {
        // TODO: support combining more than 2 PSBTs
        if (signThreshold > 1) {
          const psbt = finalPsbt;
          const psbt1 = Psbt.fromBase64(signedPsbts[0]);
          const psbt2 = Psbt.fromBase64(signedPsbts[1]);

          psbt.combine(psbt1, psbt2);

          psbt.finalizeAllInputs();

          const { data } = await axios.get(blockExplorerAPIURL(`/broadcast?tx=${psbt.extractTransaction().toHex()}`, currentBitcoinNetwork));
          setBroadcastedTxId(data);

        } else {
          const { data } = await axios.get(blockExplorerAPIURL(`/broadcast?tx=${signedPsbts[0].extractTransaction().toHex()}`, currentBitcoinNetwork));
          setBroadcastedTxId(data);
        }
      } catch (e) {
        console.log('e.message: ', e.message);
        setTxError(e.message);
      }
    }
  }


  return (
    <AccountSendContentRight>
      {!showMoreDetails ? (
        <SendDetailsContainer>
          <TransactionDetailsHeader>Transaction Details</TransactionDetailsHeader>
          <MainTxData>
            <SendingHeader style={{ padding: 0 }}>{`Sending ${sendAmount} BTC`}</SendingHeader>
            <ToField>to</ToField>
            <RecipientAddressRow style={{ paddingTop: 0, textAlign: 'right' }}>{recipientAddress}</RecipientAddressRow>
          </MainTxData>
          <div>
            <TransactionFeeField>Transaction Fee: <span>{satoshisToBitcoins(feeEstimate).toNumber()} BTC (${satoshisToBitcoins(feeEstimate.multipliedBy(currentBitcoinPrice)).toFixed(2)})</span></TransactionFeeField>
            {txError && <ErrorBox>{txError}</ErrorBox>}

            {!broadcastedTxId && <SendButton background={green} color={white} loaded={signedPsbts.length === signThreshold} onClick={broadcastTransaction}>
              {signedPsbts.length < signThreshold ? `Confirm on Devices (${signedPsbts.length}/${signThreshold})` : 'Send Transaction'}
              {signedPsbts.length < signThreshold ? null : (
                <SendButtonCheckmark loaded={signedPsbts.length}>
                  <StyledIcon as={ArrowIosForwardOutline} size={16} />
                </SendButtonCheckmark>
              )}
            </SendButton>}

            {broadcastedTxId && <ViewTransactionButton href={`https://blockstream.info/tx/${broadcastedTxId}`} target="_blank">View Transaction</ViewTransactionButton>}
            <MoreDetails>
              <span onClick={() => setShowMoreDetails(!showMoreDetails)}>{showMoreDetails ? 'Less' : 'More'} Details ></span>
              <span onClick={() => setStep(0)}>Edit Transaction</span>
            </MoreDetails>
          </div>


        </SendDetailsContainer>
      ) : (
          <SendDetailsContainer>
            <MoreDetailsSection>
              <MoreDetailsHeader>Inputs</MoreDetailsHeader>
              {finalPsbt.__CACHE.__TX.ins.map(input => {
                const inputBuffer = cloneBuffer(input.hash);
                const txInput = transactionsMap.get(inputBuffer.reverse().toString('hex'));
                return (
                  <OutputItem>
                    <OutputAddress>{txInput.vout[input.index].scriptpubkey_address}</OutputAddress>
                    <OutputAmount>{satoshisToBitcoins(txInput.vout[input.index].value).toNumber()} BTC</OutputAmount>
                  </OutputItem>
                )
              })}
            </MoreDetailsSection>
            <MoreDetailsSection>
              <MoreDetailsHeader>Outputs</MoreDetailsHeader>
              {finalPsbt.__CACHE.__TX.outs.map(output => (
                <OutputItem>
                  {/* script: {output.script.toString('hex')}, */}
                  <OutputAddress>{address.fromOutputScript(output.script, finalPsbt.opts.network)}</OutputAddress> <OutputAmount>{satoshisToBitcoins(output.value).toNumber()} BTC</OutputAmount>
                </OutputItem>
              ))}

            </MoreDetailsSection>
            <MoreDetailsSection>
              <MoreDetailsHeader>PSBT</MoreDetailsHeader>
              <div style={{ display: 'flex' }}>
                <TextArea rows={8} value={finalPsbt.toHex()} />
              </div>
            </MoreDetailsSection>
            <MoreDetails>
              <span onClick={() => setShowMoreDetails(!showMoreDetails)}>{showMoreDetails ? 'Less' : 'More'} Details ></span>
              <span onClick={() => setStep(0)}>Manual Transaction</span>
            </MoreDetails>
          </SendDetailsContainer>
        )}
    </AccountSendContentRight>
  )
}

const SendingHeader = styled.div`
  font-size: 1.75em;
`;

const MainTxData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4em 0 3em;
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

const MoreDetailsSection = styled.div`

`;

const MoreDetailsHeader = styled.div`
  color: ${darkGray};
  font-size: 1.5em;
`;

const TransactionDetailsHeader = styled.div`
  font-size: 1.5em;
  color: ${darkGray};
  margin-bottom: 12px;
`;


const SendDetailsContainer = styled.div`
  background: ${white};
  // margin-top: 1.5em;
  padding: 2em 2.25em;
  display: flex;
  flex-direction: column;
  flex: 1;
  border: solid 1px ${darkGray};
  justify-content: space-between;
`;

const ToField = styled.div`
  font-size: 1em;
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
`;

const TransactionFeeField = styled.div`
  font-size: 0.75em;
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
  color: ${gray};
`;

const MoreDetails = styled.div`
  color: ${gray};
  align-self: center;
  align-items: flex-end;
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 1.25em 0;

  span:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const SendButton = styled.div`
  ${Button};
  pointer-events: ${p => p.loaded ? 'auto' : 'none'};
  box-shadow: ${p => p.loaded ? `inset 500px 0 0 0 ${darkGreen}` : `inset 0 0 0 0 ${darkGreen}`};
  transition: ease-out 0.4s;
  position: relative;
  font-size: 1.5em;
  margin-top: 2em;

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

const InputStyles = css`
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 1.5em;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border-radius: 4px;
  font-size: 1.5em;
  z-index: 1;
  flex: 1;

  ::placeholder {
    color: ${gray};
  }

  :active, :focused {
    outline: 0;
    border: none;
  }
`;

const TextArea = styled.textarea`
  ${InputStyles};
  font-size: 8px;
  padding: 10px;
  margin: 0;
`;

const ViewTransactionButton = styled.a`
  ${Button}
  margin-top: 1em;
`;

export default TransactionDetails;