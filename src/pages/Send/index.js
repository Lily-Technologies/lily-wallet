import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { VerticalAlignBottom, ArrowUpward, Settings } from '@styled-icons/material';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import { QRCode } from "react-qr-svg";
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import BigNumber from 'bignumber.js';
import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  satoshisToBitcoins,
  bitcoinsToSatoshis,
  multisigWitnessScript,
  scriptToHex,
  TESTNET
} from "unchained-bitcoin";
import { payments, ECPair, networks, Psbt, address } from 'bitcoinjs-lib';

import { StyledIcon, Button } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import SignWithDevice from '../Spend/SignWithDevice'

import { getTransactionsAndTotalValueFromXPub, getTransactionsFromMultisig, createTransactionMapFromTransactionArray, coinSelection, getFeeForMultisig } from '../../utils/transactions';
import { black, gray, offWhite, blue, darkGray, white, darkOffWhite, green, lightGreen, darkGreen, lightGray, lightBlue } from '../../utils/colors';
import { cloneBuffer } from '../../utils/other';

import transactionsFixture from '../../fixtures/transactions';
import unusedAddressesFixture from '../../fixtures/unusedAddresses';
import unusedChangeAddressesFixture from '../../fixtures/unusedChangeAddresses';
import availableUtxosFixture from '../../fixtures/availableUtxos';

const Send = ({ caravanFile, currentBitcoinPrice }) => {
  const [currentAccount, setCurrentAccount] = useState(caravanFile || null);
  const [transactionsFromBlockstream, setTransactionsFromBlockstream] = useState([]);
  const [unusedAddresses, setUnusedAddresses] = useState([]); // will need to use these when creating change
  const [unusedChangeAddresses, setUnusedChangeAddresses] = useState([]);
  const [availableUtxos, setAvailableUtxos] = useState([]); // will need to use these when creating change
  const [currentBalance, setCurrentBalance] = useState(BigNumber(0));
  const [loadingDataFromBlockstream, setLoadingDataFromBlockstream] = useState(true);
  const [sendAmount, setSendAmount] = useState('0.0002');
  const [recipientAddress, setRecipientAddress] = useState('2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE');
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState(null);
  const [feeEstimate, setFeeEstimate] = useState(BigNumber(0));
  const [outputTotal, setOutputTotal] = useState(BigNumber(0));
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  document.title = `Send - Coldcard Kitchen`;

  const createTransaction = async (amountInBitcoins, recipientAddress, availableUtxos, transactionsFromBlockstream) => {
    const transactionMap = createTransactionMapFromTransactionArray(transactionsFromBlockstream);

    let feeEstimate = await getFeeForMultisig(caravanFile.addressType, 1, 2, caravanFile.quorum.requiredSigners, caravanFile.quorum.totalSigners);
    let outputTotal = BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(feeEstimate);
    let [spendingUtxos, spendingUtxosTotal] = coinSelection(outputTotal, availableUtxos);

    if (spendingUtxos.length > 1) {
      feeEstimate = await getFeeForMultisig(caravanFile.addressType, spendingUtxos.length, 2, caravanFile.quorum.requiredSigners, caravanFile.quorum.totalSigners);
      outputTotal = BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(feeEstimate);
      [spendingUtxos, spendingUtxosTotal] = coinSelection(outputTotal, availableUtxos);
    }

    setFeeEstimate(feeEstimate);
    setOutputTotal(outputTotal);

    const psbt = new Psbt({ network: networks.testnet });
    psbt.setVersion(2); // These are defaults. This line is not needed.
    psbt.setLocktime(0); // These are defaults. This line is not needed.

    spendingUtxos.forEach((utxo, index) => {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        sequence: 0xffffffff,
        witnessUtxo: {
          script: Buffer.from(transactionMap.get(utxo.txid).vout[utxo.vout].scriptpubkey, 'hex'),
          value: utxo.value
        },
        witnessScript: Buffer.from(scriptToHex(multisigWitnessScript(utxo.address)), 'hex'),
        bip32Derivation: utxo.address.bip32derivation
      })
    });

    // KBC-TODO: need to calc change if necessary
    psbt.addOutput({
      script: address.toOutputScript(recipientAddress, networks.testnet),
      // address: recipientAddress,
      value: bitcoinsToSatoshis(amountInBitcoins).toNumber(),
    });

    if (spendingUtxosTotal > outputTotal) {
      psbt.addOutput({
        script: address.toOutputScript(unusedChangeAddresses[0].address, networks.testnet),
        // address: unusedChangeAddresses[0].address,
        value: spendingUtxosTotal.minus(outputTotal).toNumber()
      })
    }

    setFinalPsbt(psbt);
    setStep(1);
  }

  useEffect(() => {
    async function fetchTransactionsFromBlockstream() {
      setLoadingDataFromBlockstream(true);
      let transactions, unusedAddresses, unusedChangeAddresses, availableUtxos;
      if (currentAccount.name === caravanFile.name) {
        [transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getTransactionsFromMultisig(currentAccount);
        console.log('transactions, unusedAddresses, unusedChangeAddresses, availableUtxos: ', transactions, unusedAddresses, unusedChangeAddresses, availableUtxos);
      } else {
        [transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getTransactionsAndTotalValueFromXPub(currentAccount);
      }

      const currentBalance = availableUtxos.reduce((accum, utxo) => accum.plus(utxo.value), BigNumber(0));

      setUnusedAddresses(unusedAddresses);
      setTransactionsFromBlockstream(transactions);
      setCurrentBalance(currentBalance);
      setAvailableUtxos(availableUtxos);
      setUnusedChangeAddresses(unusedChangeAddresses);
      setLoadingDataFromBlockstream(false);
    }
    fetchTransactionsFromBlockstream();
  }, [currentAccount]);

  const transactionsMap = createTransactionMapFromTransactionArray(transactionsFromBlockstream);

  return (
    <Wrapper>
      <SendContent>
        <WalletHeader>
          <WalletHeaderLeft>
            <PageTitle>Send from</PageTitle>
            {/* <DeviceXPub>{currentAccount.xpub}</DeviceXPub> */}
          </WalletHeaderLeft>
          <WalletHeaderRight>
            <SettingsButton background='transparent' color={darkGray}><StyledIcon as={Settings} size={36} /></SettingsButton>
          </WalletHeaderRight>
        </WalletHeader>

        <SendWrapper>
          <AccountMenu>
            {caravanFile.extendedPublicKeys.map((xpub) => (
              <AccountMenuItemWrapper key={xpub.name} active={currentAccount.name === xpub.name} onClick={() => {
                setCurrentAccount(xpub);
                setTransactionsFromBlockstream([]);
                setCurrentBalance(BigNumber(0));
              }}>
                <StyledIcon as={Wallet} size={48} />
                <AccountMenuItemName>{xpub.name}</AccountMenuItemName>
              </AccountMenuItemWrapper>
            ))}
            <AccountMenuItemWrapper active={currentAccount.name === caravanFile.name} onClick={() => {
              setCurrentAccount(caravanFile);
              setTransactionsFromBlockstream([]);
              setCurrentBalance(BigNumber(0));
            }}>
              <StyledIcon as={Safe} size={48} />
              <AccountMenuItemName>{caravanFile.name}</AccountMenuItemName>
            </AccountMenuItemWrapper>
          </AccountMenu>

          <AccountSendContent>
            {step === 0 && (
              <AccountSendContentLeft>
                <SendToAddressHeader>
                  Send bitcoin to
              </SendToAddressHeader>

                <Input
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  value={recipientAddress}
                  placeholder="tb1qy8glxuvc7nqqlxmuucnpv93fekyv4lth6k3v3p"
                  style={{ marginBottom: 36 }}
                />

                <SendToAddressHeader>
                  Amount of bitcoin to send
              </SendToAddressHeader>

                <AddressDisplayWrapper>
                  <Input
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.0025"
                    style={{ borderRight: 'none', paddingRight: 80, color: darkGray }}
                  />
                  <InputStaticText
                    disabled
                    text="BTC"
                  >BTC</InputStaticText>
                </AddressDisplayWrapper>

                <SendButtonContainer>
                  <CopyAddressButton onClick={() => createTransaction(sendAmount, recipientAddress, availableUtxos, transactionsFromBlockstream)}>Confirm Payment</CopyAddressButton>
                  <CopyAddressButton background="transparent" color={darkGray}>Advanced Options</CopyAddressButton>
                </SendButtonContainer>
              </AccountSendContentLeft>
            )}

            {step === 1 && (
              <AccountSendContentRight style={{ marginRight: 64, marginLeft: 0 }}>
                {!showMoreDetails ? (
                  <SendDetailsContainer>
                    <TransactionDetailsHeader>Transaction Details</TransactionDetailsHeader>
                    <div>
                      <ToField>Sending <span>{sendAmount} BTC</span></ToField>
                      <ToField>to <span>{recipientAddress}</span></ToField>
                      <ToField>Fee: <span>{satoshisToBitcoins(feeEstimate).toNumber()} BTC</span></ToField>
                      <ToField style={{ borderTop: `1px solid ${gray}` }}>Total: <span>{satoshisToBitcoins(outputTotal).toNumber()} BTC</span></ToField>
                    </div>

                    <SendButton>
                      Confirm on Devices to Send
                  </SendButton>

                    <MoreDetails>
                      <span onClick={() => setShowMoreDetails(!showMoreDetails)}>{showMoreDetails ? 'Less' : 'More'} Details ></span>
                      <span onClick={() => setStep(0)}>Edit Transaction</span>
                    </MoreDetails>
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
            )}

            {step === 0 && (
              <AccountSendContentRight>
                <CurrentBalanceWrapper>
                  <CurrentBalanceText>
                    Current Balance:
                  </CurrentBalanceText>
                  <CurrentBalanceValue>
                    {satoshisToBitcoins(currentBalance).toNumber()} BTC
                </CurrentBalanceValue>
                </CurrentBalanceWrapper>
                <RecentTransactions
                  transactions={transactionsFromBlockstream}
                  loading={loadingDataFromBlockstream}
                  flat={true}
                  maxItems={5} />
              </AccountSendContentRight>
            )}

            {step === 1 && (
              <AccountSendContentRight style={{ background: white, padding: 24 }}>
                <SignWithDevice psbt={finalPsbt} />
              </AccountSendContentRight>
            )}
          </AccountSendContent>
        </SendWrapper>
      </SendContent>
    </Wrapper >
  )
}

const OutputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px;
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
  font-size: 24px;
`;

const TransactionDetailsHeader = styled.div`
  font-size: 24px;
  color: ${darkGray};
  margin-bottom: 12px;
`;


const SendDetailsContainer = styled.div`
  background: ${white};
  // margin-top: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  border: solid 1px ${darkOffWhite};
`;

const ToField = styled.div`
  font-size: 24px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  // font-size: 16px;
`;

const MoreDetails = styled.div`
  color: ${gray};
  align-self: center;
  align-items: flex-end;
  display: flex;
  flex: 1;
  justify-content: space-around;
  width: 100%;
  padding: 12px;

  span:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  display: flex;
  flex: 1;
  display: flex;
  min-height: 400px;
  flex-direction: column;
`;

const SendContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 64px;
  overflow: scroll;
  flex: 1;
`;

const SendButtonContainer = styled.div`
  margin: 24px;
  margin-bottom: 0;
`;

const CopyAddressButton = styled.div`
  ${Button};
`;

const SendButton = styled.div`
  ${Button};

  opacity: .6;
`;

const SendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin-top: 24px;
`;

const WalletHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const WalletHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
const WalletHeaderRight = styled.div`
  display: flex;
`;

const SendToAddressHeader = styled.div`
  font-size: 16px;
  color: ${gray};
  margin: 12px;
  margin-bottom: 0px;
`;

const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
`;

const AddressDisplayWrapper = styled.div`
  display: flex;
`;

const InputStyles = css`
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 24px;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px;
  border-radius: 4px;
  font-size: 24px;
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

const Input = styled.input`
  position: relative;
  text-align: right;
  ${InputStyles}
`;

const TextArea = styled.textarea`
  ${InputStyles};
  font-size: 8px;
  padding: 10px;
  margin: 0;
`;

const InputStaticText = styled.label`
  position: relative;
  display: flex;
  flex: 0 0;
  justify-self: center;
  align-self: center;
  margin-left: -87px;
  z-index: 1;
  margin-right: 40px;
  font-size: 24px;
  font-weight: 100;
  color: ${gray};
  
  &::after {
    content: ${p => p.text};
    position: absolute;
    top: 4px;
    left: 94px;
    font-family: arial, helvetica, sans-serif;
    font-size: 12px;
    display: block;
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
  }
`;

const SettingsButton = styled.div`
  ${Button}
  // margin: 12px;
`;

const PageTitle = styled.div`
  font-size: 48px;
`;

const AccountMenuItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.active ? lightBlue : white};
  color: ${p => p.active ? darkGray : gray};
  padding: 12px;
  flex: 1;
  cursor: ${p => p.active ? 'auto' : 'pointer'};
  border-bottom: ${p => p.active ? 'none' : `solid 1px ${darkOffWhite}`};
  border-top: ${p => p.active ? `solid 11px ${blue}` : `none`};
`;

const AccountMenuItemName = styled.div``;

const AccountMenu = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AccountSendContent = styled.div`
  min-height: 400px;
  padding: 24px;
  display: flex;
  background: ${lightBlue};
`;

const AccountSendContentLeft = styled.div`
  min-height: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${white};
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  justify-content: center;
`;

const AccountSendContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  margin-left: 64px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const CurrentBalanceWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  text-align: right;
  background: ${white};
`;


const CurrentBalanceText = styled.div`
  font-size: 24px;
  color: ${darkGray};
`;


const CurrentBalanceValue = styled.div`
  font-size: 36px;
`;



export default Send;