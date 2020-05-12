import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Settings } from '@styled-icons/material';
import { Safe } from '@styled-icons/crypto';
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
import { networks, Psbt, address } from 'bitcoinjs-lib';

import { StyledIcon, Button, PageWrapper, GridArea, PageTitle, Header, HeaderRight, HeaderLeft } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import SignWithDevice from '../Spend/SignWithDevice'

import TransactionDetails from './TransactionDetails';

import { getTransactionsAndTotalValueFromXPub, getTransactionsFromMultisig, createTransactionMapFromTransactionArray, coinSelection, getFeeForMultisig } from '../../utils/transactions';
import { red, gray, offWhite, blue, darkGray, white, darkOffWhite, green, lightGreen, darkGreen, lightGray, lightBlue } from '../../utils/colors';

import transactionsFixture from '../../fixtures/transactions';
import unusedAddressesFixture from '../../fixtures/unusedAddresses';
import unusedChangeAddressesFixture from '../../fixtures/unusedChangeAddresses';
import availableUtxosFixture from '../../fixtures/availableUtxos';

const signedPsbt1 = "cHNidP8BAH4CAAAAAaL+89cOLWJTdZMEWoXbrN5ffsxPmbpjJ9Yc1NL9jZ3jAAAAAAD/////AiBOAAAAAAAAF6kU/9DbtEQC1fjxLZultISiwbtH2kKHAfIOAAAAAAAiACAbzdx36FFxcvXFh/V5ZEsGIQi6H50aqwcU7qWnnxS+5AAAAAAAAQErQEIPAAAAAAAiACCCFDYExwmHHpAtYcn30+iVZPuQJEAjvYHFtv4a0XXmViICAyIEErL0BQQffuTOA9kTjyEC+eybnl5zNuAf6pdxUq06RzBEAiAKchg0x7lj7cnHh8FrThyg8AdDwMxAaGBEz5LoEOOqDQIgWXUNdLIGlNhiTNmgN6VVKIIhiolpy5Wz4KuqgFTl904BAQMEAQAAAAEFaVIhAyIEErL0BQQffuTOA9kTjyEC+eybnl5zNuAf6pdxUq06IQPZs2BhKxwQyn6qpiv+VcRihe//FftBBqQk8H+YLmaO3CED5COMlBMA/fsBELla1MfIEB6gGi5qERqdqQsCA8I8FFdTriIGAyIEErL0BQQffuTOA9kTjyEC+eybnl5zNuAf6pdxUq06HE9g0ckwAACAAQAAgAAAAIACAACAAAAAAAAAAAAiBgPZs2BhKxwQyn6qpiv+VcRihe//FftBBqQk8H+YLmaO3ByRMMPWMAAAgAEAAIAAAACAAgAAgAAAAAAAAAAAIgYD5COMlBMA/fsBELla1MfIEB6gGi5qERqdqQsCA8I8FFccNOz1azAAAIABAACAAAAAgAIAAIAAAAAAAAAAAAAAAA==";
const signedPsbt2 = "cHNidP8BAH4CAAAAAaL+89cOLWJTdZMEWoXbrN5ffsxPmbpjJ9Yc1NL9jZ3jAAAAAAD/////AiBOAAAAAAAAF6kU/9DbtEQC1fjxLZultISiwbtH2kKHAfIOAAAAAAAiACAbzdx36FFxcvXFh/V5ZEsGIQi6H50aqwcU7qWnnxS+5AAAAAAAAQErQEIPAAAAAAAiACCCFDYExwmHHpAtYcn30+iVZPuQJEAjvYHFtv4a0XXmViICA9mzYGErHBDKfqqmK/5VxGKF7/8V+0EGpCTwf5guZo7cRzBEAiAG10YX6lmrV5GtrRrCjsedcDHg4ksFF6G9LNDCAJYeUgIgELP/AlibkDYtoJm03+bDnk4rNGwzDvv7ypwEdU3/gx4BAQMEAQAAAAEFaVIhAyIEErL0BQQffuTOA9kTjyEC+eybnl5zNuAf6pdxUq06IQPZs2BhKxwQyn6qpiv+VcRihe//FftBBqQk8H+YLmaO3CED5COMlBMA/fsBELla1MfIEB6gGi5qERqdqQsCA8I8FFdTriIGAyIEErL0BQQffuTOA9kTjyEC+eybnl5zNuAf6pdxUq06HE9g0ckwAACAAQAAgAAAAIACAACAAAAAAAAAAAAiBgPZs2BhKxwQyn6qpiv+VcRihe//FftBBqQk8H+YLmaO3ByRMMPWMAAAgAEAAIAAAACAAgAAgAAAAAAAAAAAIgYD5COMlBMA/fsBELla1MfIEB6gGi5qERqdqQsCA8I8FFccNOz1azAAAIABAACAAAAAgAIAAIAAAAAAAAAAAAAAAA==";

const Send = ({ caravanFile, transactions, availableUtxos, unusedChangeAddresses, loadingDataFromBlockstream, currentBalance }) => {
  const [sendAmount, setSendAmount] = useState('0.02');
  const [sendAmountError, setSendAmountError] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('2NGZrVvZG92qGYqzTLjCAewvPZ7JE8S8VxE');
  const [recipientAddressError, setRecipientAddressError] = useState(false);
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState(null);
  const [feeEstimate, setFeeEstimate] = useState(BigNumber(0));
  const [outputTotal, setOutputTotal] = useState(BigNumber(0));
  const [signedPsbts, setSignedPsbts] = useState([signedPsbt1]);

  document.title = `Send - Coldcard Kitchen`;

  const createTransaction = async (amountInBitcoins, recipientAddress, availableUtxos, transactionsFromBlockstream) => {
    const transactionMap = createTransactionMapFromTransactionArray(transactionsFromBlockstream);

    let feeEstimate = await getFeeForMultisig(caravanFile.addressType, 1, 2, caravanFile.quorum.requiredSigners, caravanFile.quorum.totalSigners);
    let outputTotal = BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(feeEstimate.integerValue(BigNumber.ROUND_CEIL).toNumber());
    let [spendingUtxos, spendingUtxosTotal] = coinSelection(outputTotal, availableUtxos);

    if (spendingUtxos.length > 1) {
      feeEstimate = await getFeeForMultisig(caravanFile.addressType, spendingUtxos.length, 2, caravanFile.quorum.requiredSigners, caravanFile.quorum.totalSigners);
      outputTotal = BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(feeEstimate.integerValue(BigNumber.ROUND_CEIL).toNumber());
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

    console.log('feeEstimate: ', feeEstimate.integerValue(BigNumber.ROUND_CEIL).toNumber());
    console.log('spendingUtxosTotal: ', spendingUtxosTotal.toNumber());
    console.log('outputTotal: ', outputTotal.toNumber());
    console.log('spendingUtxosTotal.isLessThan(outputTotal): ', spendingUtxosTotal.isLessThan(outputTotal));
    if (spendingUtxosTotal.isGreaterThan(outputTotal)) {
      psbt.addOutput({
        script: address.toOutputScript(unusedChangeAddresses[0].address, networks.testnet),
        // address: unusedChangeAddresses[0].address,
        value: spendingUtxosTotal.minus(outputTotal).toNumber()
      })
    }

    setFinalPsbt(psbt);
    setStep(1);
  }

  const transactionsMap = createTransactionMapFromTransactionArray(transactions);

  console.log('signedPsbts: ', signedPsbts);

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <PageTitle>Send from</PageTitle>
          {/* <DeviceXPub>{currentAccount.xpub}</DeviceXPub> */}
        </HeaderLeft>
        <HeaderRight>
          <SettingsButton background='transparent' color={darkGray}><StyledIcon as={Settings} size={36} /></SettingsButton>
        </HeaderRight>
      </Header>

      <SendWrapper>
        <AccountMenu>
          <AccountMenuItemWrapper active={true}>
            <StyledIcon as={Safe} size={48} />
            <AccountMenuItemName>{caravanFile.name}</AccountMenuItemName>
          </AccountMenuItemWrapper>
        </AccountMenu>

        <GridArea>
          {step === 0 && (
            <AccountSendContentLeft>

              <SendToAddressHeader>
                Amount of bitcoin to send
              </SendToAddressHeader>

              <AddressDisplayWrapper>
                <Input
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.0025"
                  style={{ paddingRight: 80, color: darkGray, flex: 1 }}
                  error={sendAmountError}
                />
                <InputStaticText
                  disabled
                  text="BTC"
                >BTC</InputStaticText>
              </AddressDisplayWrapper>

              <SendToAddressHeader>
                Send bitcoin to
              </SendToAddressHeader>

              <Input
                onChange={(e) => setRecipientAddress(e.target.value)}
                value={recipientAddress}
                placeholder="tb1qy8glxuvc7nqqlxmuucnpv93fekyv4lth6k3v3p"
                style={{ marginBottom: 36 }}
                error={recipientAddressError}
              />

              <SendButtonContainer>
                <CopyAddressButton background="transparent" color={darkGray}>Advanced Options</CopyAddressButton>
                <CopyAddressButton onClick={() => {
                  if (!recipientAddress) {
                    setRecipientAddressError(true);
                  }
                  if (!sendAmount) {
                    setSendAmountError(true);
                  }

                  if (recipientAddress && sendAmount) {
                    createTransaction(sendAmount, recipientAddress, availableUtxos, transactions)
                  }
                }
                }>Preview Transaction</CopyAddressButton>
              </SendButtonContainer>
            </AccountSendContentLeft>
          )}

          {step === 1 && (
            <TransactionDetails
              finalPsbt={finalPsbt}
              feeEstimate={feeEstimate}
              outputTotal={outputTotal}
              recipientAddress={recipientAddress}
              setStep={setStep}
              sendAmount={sendAmount}
              transactionsMap={transactionsMap}
              signedPsbts={signedPsbts}
            />
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
                transactions={transactions}
                loading={loadingDataFromBlockstream}
                flat={true}
                maxItems={3} />
            </AccountSendContentRight>
          )}

          {step === 1 && (
            <AccountSendContentRight style={{ background: white, padding: 24, border: `1px solid ${darkOffWhite}` }}>
              <SignWithDevice
                psbt={finalPsbt}
                setSignedPsbts={setSignedPsbts}
                signedPsbts={signedPsbts}
              />
            </AccountSendContentRight>
          )}
        </GridArea>
      </SendWrapper>
    </PageWrapper >
  )
}

const SendButtonContainer = styled.div`
  margin: 24px;
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
`;

const CopyAddressButton = styled.div`
  ${Button};
`;

const SendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
`;

const SendToAddressHeader = styled.div`
  font-size: 1em;
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
  border: ${p => p.error ? `1px solid ${red}` : `1px solid ${darkOffWhite}`};
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

const InputStaticText = styled.label`
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

const SettingsButton = styled.div`
  ${Button}
  // margin: 12px;
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
  padding: 1.5em;
  display: flex;
  background: ${lightBlue};
`;

const AccountSendContentLeft = styled.div`
  min-height: 400px;
  padding: 1.5em;
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
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const CurrentBalanceWrapper = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  text-align: right;
  background: ${white};
`;


const CurrentBalanceText = styled.div`
  font-size: 1.5em;
  color: ${darkGray};
`;


const CurrentBalanceValue = styled.div`
  font-size: 2em;
`;



export default Send;