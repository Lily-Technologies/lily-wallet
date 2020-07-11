import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import BigNumber from 'bignumber.js';
import { mnemonicToSeed } from 'bip39';
import {
  satoshisToBitcoins,
  bitcoinsToSatoshis,
  multisigWitnessScript,
  scriptToHex,
} from "unchained-bitcoin";
import { Psbt, address, bip32 } from 'bitcoinjs-lib';

import { StyledIcon, Button, PageWrapper, GridArea, PageTitle, Header, HeaderRight, HeaderLeft } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import SignWithDevice from './SignWithDevice'
import TransactionDetails from './TransactionDetails';

import { createTransactionMapFromTransactionArray, coinSelection, getFeeForMultisig, getTxHex } from '../../utils/transactions';
import { red, gray, blue, darkGray, white, darkOffWhite, lightGray, lightBlue } from '../../utils/colors';
import { mobile } from '../../utils/media';

const validateAddress = (recipientAddress) => {
  try {
    address.toOutputScript(recipientAddress)
    return true
  } catch (e) {
    return false
  }
}

const Send = ({ config, currentAccount, setCurrentAccount, transactions, availableUtxos, unusedChangeAddresses, loadingDataFromBlockstream, currentBalance, currentBitcoinNetwork, currentBitcoinPrice }) => {
  const [sendAmount, setSendAmount] = useState('');
  const [sendAmountError, setSendAmountError] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientAddressError, setRecipientAddressError] = useState(false);
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState(null);
  const [feeEstimate, setFeeEstimate] = useState(BigNumber(0));
  const [outputTotal, setOutputTotal] = useState(BigNumber(0));
  const [signedPsbts, setSignedPsbts] = useState([]);

  document.title = `Send - Lily Wallet`;

  const createTransaction = async (amountInBitcoins, recipientAddress, availableUtxos, transactionsFromBlockstream) => {
    const transactionMap = createTransactionMapFromTransactionArray(transactionsFromBlockstream);

    let currentFeeEstimate = await (await getFeeForMultisig(currentAccount.config.addressType, 1, 2, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners, currentBitcoinNetwork)).integerValue(BigNumber.ROUND_CEIL);
    let outputTotal = BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(currentFeeEstimate.toNumber());
    let [spendingUtxos, spendingUtxosTotal] = coinSelection(outputTotal, availableUtxos);

    if (spendingUtxos.length > 1) {
      currentFeeEstimate = await (await getFeeForMultisig(currentAccount.config.addressType, spendingUtxos.length, 2, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners)).integerValue(BigNumber.ROUND_CEIL);
      outputTotal = BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(feeEstimate.toNumber());
      [spendingUtxos, spendingUtxosTotal] = coinSelection(outputTotal, availableUtxos);
    }

    setFeeEstimate(currentFeeEstimate);
    setOutputTotal(outputTotal);

    const psbt = new Psbt({ network: currentBitcoinNetwork });
    psbt.setVersion(2); // These are defaults. This line is not needed.
    psbt.setLocktime(0); // These are defaults. This line is not needed.

    for (let i = 0; i < spendingUtxos.length; i++) {
      const utxo = spendingUtxos[i];

      if (currentAccount.config.quorum.requiredSigners > 1) {

        // need to construct prevTx b/c of segwit fee vulnerability requires on trezor
        // const prevTxHex = await axios(`getblockstreamtx/tx/${utxo.txid}/hex`);
        const prevTxHex = await getTxHex(utxo.txid, currentBitcoinNetwork);

        // KBC-TODO: eventually break this up into different functions depending on if Trezor or not, leave for now...I guess
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          sequence: 0xffffffff,
          // witnessUtxo: {
          //   script: Buffer.from(transactionMap.get(utxo.txid).vout[utxo.vout].scriptpubkey, 'hex'),
          //   value: utxo.value
          // },
          nonWitnessUtxo: Buffer.from(prevTxHex, 'hex'),
          // redeemScript: utxo.address.redeem.output,
          witnessScript: Buffer.from(scriptToHex(multisigWitnessScript(utxo.address)), 'hex'),
          bip32Derivation: utxo.address.bip32derivation
        })
      } else {
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          sequence: 0xffffffff,
          witnessUtxo: {
            script: Buffer.from(transactionMap.get(utxo.txid).vout[utxo.vout].scriptpubkey, 'hex'),
            value: utxo.value
          },
          bip32Derivation: utxo.address.bip32derivation
        })
      }
    }

    psbt.addOutput({
      script: address.toOutputScript(recipientAddress, currentBitcoinNetwork),
      // address: recipientAddress,
      value: bitcoinsToSatoshis(amountInBitcoins).toNumber(),
    });

    if (spendingUtxosTotal.isGreaterThan(outputTotal)) {
      psbt.addOutput({
        script: address.toOutputScript(unusedChangeAddresses[0].address, currentBitcoinNetwork),
        value: spendingUtxosTotal.minus(outputTotal).toNumber()
      })
    }

    setFinalPsbt(psbt);
    setStep(1);

    // if only single sign, then sign tx right away
    if (currentAccount.config.quorum.requiredSigners === 1) {
      const seed = await mnemonicToSeed(currentAccount.config.mnemonic);
      const root = bip32.fromSeed(seed, currentBitcoinNetwork);

      psbt.signInputHD(0, root);
      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();

      setSignedPsbts([psbt]);
    }
  }

  const transactionsMap = createTransactionMapFromTransactionArray(transactions);

  const validateAndCreateTransaction = () => {
    if (!validateAddress(recipientAddress)) {
      setRecipientAddressError(true);
    }

    if (validateAddress(recipientAddress) && recipientAddressError) {
      setRecipientAddressError(false);
    }

    if (!satoshisToBitcoins(currentBalance.plus(feeEstimate)).isGreaterThan(sendAmount)) {
      setSendAmountError(true)
    }

    if (satoshisToBitcoins(currentBalance.plus(feeEstimate)).isGreaterThan(sendAmount) && sendAmountError) {
      setSendAmountError(false)
    }

    if (validateAddress(recipientAddress) && sendAmount && satoshisToBitcoins(currentBalance.plus(feeEstimate)).isGreaterThan(sendAmount)) {
      createTransaction(sendAmount, recipientAddress, availableUtxos, transactions)
    }
  }

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <PageTitle>Send from</PageTitle>
        </HeaderLeft>
        <HeaderRight>
        </HeaderRight>
      </Header>

      <SendWrapper>
        <AccountMenu>
          {config.vaults.map((vault, index) => (
            <AccountMenuItemWrapper active={vault.name === currentAccount.name} borderRight={(index < config.vaults.length - 1) || config.wallets.length} onClick={() => setCurrentAccount(vault)}>
              <StyledIcon as={Safe} size={48} />
              <AccountMenuItemName>{vault.name}</AccountMenuItemName>
            </AccountMenuItemWrapper>
          ))}
          {config.wallets.map((wallet, index) => (
            <AccountMenuItemWrapper active={wallet.name === currentAccount.name} borderRight={(index < config.wallets.length - 1)} onClick={() => setCurrentAccount(wallet)}>
              <StyledIcon as={Wallet} size={48} />
              <AccountMenuItemName>{wallet.name}</AccountMenuItemName>
            </AccountMenuItemWrapper>
          ))}
        </AccountMenu>

        <GridArea>
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <CurrentBalanceWrapper displayDesktop={false} displayMobile={true} style={{ marginBottom: '1em' }}>
                <CurrentBalanceText>
                  Current Balance:
              </CurrentBalanceText>
                <CurrentBalanceValue>
                  {satoshisToBitcoins(currentBalance).toNumber()} BTC
                </CurrentBalanceValue>
              </CurrentBalanceWrapper>

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
                {sendAmountError && <SendAmountError>Not enough funds</SendAmountError>}

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
                  {/* <CopyAddressButton background="transparent" color={darkGray}>Advanced Options</CopyAddressButton> */}
                  <CopyAddressButton onClick={() => validateAndCreateTransaction()}>Preview Transaction</CopyAddressButton>
                </SendButtonContainer>
              </AccountSendContentLeft>
            </div>
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
              signThreshold={currentAccount.config.quorum.requiredSigners}
              currentBitcoinNetwork={currentBitcoinNetwork}
              currentBitcoinPrice={currentBitcoinPrice}
            />
          )}

          {step === 0 && (
            <AccountSendContentRight>
              <CurrentBalanceWrapper displayDesktop={true} displayMobile={false}>
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

          {step === 1 && currentAccount.config.quorum.requiredSigners > 1 && (
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
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
`;

const CopyAddressButton = styled.div`
  ${Button};
  flex: 1;
`;

const SendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border: 1px solid ${gray};
`;

const SendToAddressHeader = styled.div`
  font-size: 1em;
  color: ${darkGray};
  margin: 12px;
  margin-bottom: 0px;
`;

const AddressDisplayWrapper = styled.div`
  display: flex;
`;

const SendAmountError = styled.div`
  font-size: 0.5em;
  color: ${red};
  text-align: right;
`;

const InputStyles = css`
  border: ${p => p.error ? `1px solid ${red}` : `1px solid ${darkOffWhite}`};
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
  border-top: ${p => p.active ? `solid 11px ${blue}` : `none`};
  border-bottom: ${p => p.active ? 'none' : `solid 1px ${gray}`};
  border-left: ${p => !p.active && p.borderLeft && `solid 1px ${gray}`};
  border-right: ${p => !p.active && p.borderRight && `solid 1px ${gray}`};
`;

const AccountMenuItemName = styled.div``;

const AccountMenu = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AccountSendContentLeft = styled.div`
  min-height: 400px;
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${white};
  border: 1px solid ${darkGray};
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
  display: ${p => p.displayDesktop ? 'flex' : 'none'};
  flex-direction: column;
  border: solid 1px ${darkOffWhite};
  border-radius: 4px;
  background: ${white};
  // box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  text-align: right;

  ${mobile(css`
    display: ${p => p.displayMobile ? 'flex' : 'none'}
  `)};

`;


const CurrentBalanceText = styled.div`
  font-size: 1.5em;
  color: ${darkGray};
`;


const CurrentBalanceValue = styled.div`
  font-size: 2em;
`;



export default Send;