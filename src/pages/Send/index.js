import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const Send = ({ caravanFile, currentBitcoinPrice }) => {
  const [currentAccount, setCurrentAccount] = useState(caravanFile.extendedPublicKeys[0] || null);
  const [transactionsFromBlockstream, setTransactionsFromBlockstream] = useState([]);
  const [unusedAddresses, setUnusedAddresses] = useState([]); // will need to use these when creating change
  const [availableUtxos, setAvailableUtxos] = useState([]); // will need to use these when creating change
  const [totalValue, setTotalValue] = useState(BigNumber(0));
  const [loadingDataFromBlockstream, setLoadingDataFromBlockstream] = useState(true);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState(null);

  document.title = `Send - Coldcard Kitchen`;

  const createTransaction = async (amountInBitcoins, recipientAddress, availableUtxos, transactionsFromBlockstream) => {
    const transactionMap = createTransactionMapFromTransactionArray(transactionsFromBlockstream);
    console.log('transactionMap: ', transactionMap);

    const feeEstimate = await getFeeForMultisig(caravanFile.addressType, 1, 2, caravanFile.quorum.requiredSigners, caravanFile.quorum.totalSigners);
    console.log('feeEstimate: ', feeEstimate.toFixed(8));
    const outputTotal = bitcoinsToSatoshis(amountInBitcoins).toNumber() + feeEstimate;
    const [spendingUtxos, spendingUtxosTotal] = coinSelection(outputTotal, availableUtxos);
    console.log('spendingUtxos: ', spendingUtxos, spendingUtxosTotal.toFixed(8));

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
      // script: address.toOutputScript(recipientAddress, networks.testnet),
      address: recipientAddress,
      value: bitcoinsToSatoshis(amountInBitcoins).toNumber(),
    });

    if (spendingUtxosTotal > outputTotal) {
      psbt.addOutput({
        address: unusedAddresses[0].address,
        value: spendingUtxosTotal.minus(outputTotal).toFixed(8)
      })
    }

    setFinalPsbt(psbt);
    setStep(1);
  }


  useEffect(() => {
    async function fetchTransactionsFromBlockstream() {
      setLoadingDataFromBlockstream(true);
      let transactions, totalValue, unusedAddresses, availableUtxos;
      if (currentAccount.name === caravanFile.name) {
        [transactions, totalValue, unusedAddresses, availableUtxos] = await getTransactionsFromMultisig(currentAccount);
      } else {
        [transactions, totalValue, unusedAddresses, availableUtxos] = await getTransactionsAndTotalValueFromXPub(currentAccount);
      }
      console.log('transactions, totalValue, unusedAddresses: ', transactions, totalValue, unusedAddresses, availableUtxos);
      setUnusedAddresses(unusedAddresses);
      setTransactionsFromBlockstream(transactions);
      setTotalValue(totalValue);
      setAvailableUtxos(availableUtxos);
      setLoadingDataFromBlockstream(false);
    }
    fetchTransactionsFromBlockstream();
  }, [currentAccount]);

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
                setTotalValue(BigNumber(0));
              }}>
                <StyledIcon as={Wallet} size={48} />
                <AccountMenuItemName>{xpub.name}</AccountMenuItemName>
              </AccountMenuItemWrapper>
            ))}
            <AccountMenuItemWrapper active={currentAccount.name === caravanFile.name} onClick={() => {
              setCurrentAccount(caravanFile);
              setTransactionsFromBlockstream([]);
              setTotalValue(BigNumber(0));
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
                  <CopyAddressButton onClick={() => createTransaction(sendAmount, recipientAddress, availableUtxos, transactionsFromBlockstream)}>Send Payment</CopyAddressButton>
                  <CopyAddressButton background="transparent" color={darkGray}>Advanced Options</CopyAddressButton>
                </SendButtonContainer>
              </AccountSendContentLeft>
            )}

            {step === 1 && (
              <AccountSendContentLeft>
                <SignWithDevice psbt={finalPsbt} />
              </AccountSendContentLeft>
            )}


            <AccountSendContentRight>
              <CurrentBalanceWrapper>
                <CurrentBalanceText>
                  Current Balance:
              </CurrentBalanceText>
                <CurrentBalanceValue>
                  {satoshisToBitcoins(totalValue.toFixed(8)).toNumber()} BTC
              </CurrentBalanceValue>
              </CurrentBalanceWrapper>

              <RecentTransactions
                transactions={transactionsFromBlockstream}
                loading={loadingDataFromBlockstream}
                flat={true}
                maxItems={5} />


            </AccountSendContentRight>
          </AccountSendContent>


        </SendWrapper>
      </SendContent>
    </Wrapper>
  )
}

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
  padding: 36px 64px;
  overflow: scroll;
  flex: 1;
`;

const SendButtonContainer = styled.div`
  margin: 24px;
`;

const CopyAddressButton = styled.div`
  ${Button};
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

const Input = styled.input`
  position: relative;
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
  text-align: right;

  ::placeholder {
    color: ${gray};
  }

  :active, :focused {
    outline: 0;
    border: none;
  }
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