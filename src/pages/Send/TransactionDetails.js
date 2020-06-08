import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline'

import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  satoshisToBitcoins,
  bitcoinsToSatoshis,
  multisigWitnessScript,
  scriptToHex,
  MAINNET
} from "unchained-bitcoin";

import { payments, ECPair, networks, Psbt, address } from 'bitcoinjs-lib';

import { cloneBuffer } from '../../utils/other';
import { StyledIcon, Button, SidewaysShake } from '../../components';

import { gray, blue, darkGray, white, darkOffWhite, green, darkGreen, lightGray, red, lightRed } from '../../utils/colors';

const TransactionDetails = ({ finalPsbt, feeEstimate, outputTotal, recipientAddress, sendAmount, setStep, transactionsMap, signedPsbts, signThreshold, currentBitcoinNetwork }) => {
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

          console.log('psbt1, psbt2: ', psbt1, psbt2);

          psbt.combine(psbt1, psbt2);

          psbt.finalizeAllInputs();

          console.log('psbt.extractTransaction(): ', psbt.extractTransaction());
          console.log('psbt.extractTransaction().toHex(): ', psbt.extractTransaction().toHex());
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
            <ToField>Fee: <span>{satoshisToBitcoins(feeEstimate).toNumber()} BTC</span></ToField>
            <ToField style={{ borderTop: `1px solid ${gray}` }}>Total: <span>{satoshisToBitcoins(outputTotal).toNumber()} BTC</span></ToField>
            {txError && <ErrorBox>{txError}</ErrorBox>}

            <SendButton background={green} color={white} loaded={signedPsbts.length === signThreshold} onClick={broadcastTransaction}>
              {signedPsbts.length < signThreshold ? `Confirm on Devices (${signedPsbts.length}/${signThreshold})` : 'Send Transaction'}
              {signedPsbts.length < signThreshold ? null : (
                <SendButtonCheckmark loaded={signedPsbts.length}>
                  <StyledIcon as={ArrowIosForwardOutline} size={16} />
                </SendButtonCheckmark>
              )}
            </SendButton>

            {broadcastedTxId && <ViewTransactionButton href={`https://blockstream.info/testnet/tx/${broadcastedTxId}`}>View Transaction</ViewTransactionButton>}
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
                console.log('input: ', input);
                console.log('transactionsMap: ', transactionsMap);
                const inputBuffer = cloneBuffer(input.hash);
                console.log('inputBuffer: ', inputBuffer);
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
`;

const SendAmountRow = styled.div`
  font-size: 1.5em;
  align-self: center;
  padding: 1.5em;
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

// /* Radial Out */
// .hvr - radial - out {
//   display: inline - block;
//   vertical - align: middle;
//   -webkit - transform: translateZ(0);
//   transform: translateZ(0);
//   box - shadow: 0 0 1px rgba(0, 0, 0, 0);
//   -webkit - backface - visibility: hidden;
//   backface - visibility: hidden;
//   -moz - osx - font - smoothing: grayscale;
//   position: relative;
//   overflow: hidden;
//   background: #e1e1e1;
//   -webkit - transition - property: color;
//   transition - property: color;
//   -webkit - transition - duration: 0.3s;
//   transition - duration: 0.3s;
// }
// &: before {
//   content: "";
//   position: absolute;
//   z - index: -1;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: #2098d1;
//   border - radius: 100 %;
//   -webkit - transform: scale(0);
//   transform: scale(0);
//   -webkit - transition - property: transform;
//   transition - property: transform;
//   -webkit - transition - duration: 0.3s;
//   transition - duration: 0.3s;
//   -webkit - transition - timing - function: ease- out;
//   transition - timing - function: ease- out;
// }
// .hvr - radial - out: hover, .hvr - radial - out: focus, .hvr - radial - out: active {
//   color: white;
// }
// .hvr - radial - out: hover: before, .hvr - radial - out: focus: before, .hvr - radial - out: active: before {
//   -webkit - transform: scale(2);
//   transform: scale(2);
// }

const InputStyles = css`
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 1.5em;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px;
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
`;

export default TransactionDetails;