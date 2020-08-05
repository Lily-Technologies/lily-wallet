import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';
import BigNumber from 'bignumber.js';
import { mnemonicToSeed } from 'bip39';
import {
  satoshisToBitcoins,
  bitcoinsToSatoshis,
  multisigWitnessScript,
  blockExplorerAPIURL,
  estimateMultisigTransactionFee
} from "unchained-bitcoin";

import { Psbt, address, bip32, networks } from 'bitcoinjs-lib';

import { StyledIcon, Button, PageWrapper, GridArea, PageTitle, Header, HeaderRight, HeaderLeft, Loading, FileUploader, Modal, Dropdown } from '../../components';
import RecentTransactions from '../../components/transactions/RecentTransactions';

import SignWithDevice from './SignWithDevice'
import TransactionDetails from './TransactionDetails';

import { red, gray, blue, darkGray, white, darkOffWhite, lightGray, lightBlue } from '../../utils/colors';
import { mobile } from '../../utils/media';
import { cloneBuffer, bufferToHex } from '../../utils/other';

const validateAddress = (recipientAddress) => {
  try {
    address.toOutputScript(recipientAddress)
    return true
  } catch (e) {
    return false
  }
}

const getUnchainedNetworkFromBjslibNetwork = (bitcoinJslibNetwork) => {
  if (bitcoinJslibNetwork === networks.bitcoin) {
    return 'mainnet';
  } else {
    return 'testnet';
  }
}

const getTxHex = async (txid, currentBitcoinNetwork) => {
  const txHex = await (await axios.get(blockExplorerAPIURL(`/tx/${txid}/hex`, getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)))).data;
  return txHex;
}

const getFeeForMultisig = async (addressType, numInputs, numOutputs, requiredSigners, totalSigners, currentBitcoinNetwork) => {
  const feeRate = await (await axios.get(blockExplorerAPIURL(`/fee-estimates`, currentBitcoinNetwork))).data;
  return estimateMultisigTransactionFee({
    addressType: addressType,
    numInputs: numInputs,
    numOutputs: numOutputs,
    m: requiredSigners,
    n: totalSigners,
    feesPerByteInSatoshis: feeRate[1].toString()
  })
}

const createTransactionMapFromTransactionArray = (transactionsArray) => {
  const transactionMap = new Map();
  transactionsArray.forEach((tx) => {
    transactionMap.set(tx.txid, tx)
  });
  return transactionMap
}

const createUtxoMapFromUtxoArray = (utxosArray) => {
  const utxoMap = new Map();
  utxosArray.forEach((utxo) => {
    utxoMap.set(utxo.txid, utxo)
  });
  return utxoMap
}

const coinSelection = (amountInSats, availableUtxos) => {
  availableUtxos.sort((a, b) => b.value - a.value); // sort available utxos from largest size to smallest size to minimize inputs
  let currentTotal = BigNumber(0);
  const spendingUtxos = [];
  let index = 0;
  while (currentTotal.isLessThan(amountInSats) && index < availableUtxos.length) {
    currentTotal = currentTotal.plus(availableUtxos[index].value);
    spendingUtxos.push(availableUtxos[index]);
    index++;
  }
  return [spendingUtxos, currentTotal];
}

const Send = ({ config, currentAccount, setCurrentAccount, loadingDataFromBlockstream, currentBitcoinNetwork, currentBitcoinPrice }) => {
  document.title = `Send - Lily Wallet`;
  const [sendAmount, setSendAmount] = useState('');
  const [sendAmountError, setSendAmountError] = useState(false);
  const [txImportedFromFile, setTxImportedFromFile] = useState(false);
  const [importTxFromFileError, setImportTxFromFileError] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientAddressError, setRecipientAddressError] = useState(false);
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState(null);
  const [feeEstimate, setFeeEstimate] = useState(BigNumber(0));
  const [outputTotal, setOutputTotal] = useState(BigNumber(0));
  const [signedPsbts, setSignedPsbts] = useState([]);
  const [signedDevices, setSignedDevices] = useState([]);
  const [pastePsbtModalOpen, setPastePsbtModalOpen] = useState(false);
  const [pastedPsbtValue, setPastedPsbtValue] = useState(null);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const fileUploadLabelRef = useRef(null);

  // Get account data
  const { transactions, availableUtxos, unusedChangeAddresses, currentBalance } = currentAccount;


  const createTransaction = async (amountInBitcoins, recipientAddress, availableUtxos, transactionsFromBlockstream) => {
    const transactionMap = createTransactionMapFromTransactionArray(transactionsFromBlockstream);

    let currentFeeEstimate = await (await getFeeForMultisig(currentAccount.config.addressType, 1, 2, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners, currentBitcoinNetwork)).integerValue(BigNumber.ROUND_CEIL);
    let outputTotal = BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(currentFeeEstimate.toNumber());
    let [spendingUtxos, spendingUtxosTotal] = coinSelection(outputTotal, availableUtxos);

    if (spendingUtxos.length > 1) {
      currentFeeEstimate = await (await getFeeForMultisig(currentAccount.config.addressType, spendingUtxos.length, 2, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners)).integerValue(BigNumber.ROUND_CEIL);
      outputTotal = BigNumber(bitcoinsToSatoshis(amountInBitcoins)).plus(currentFeeEstimate.toNumber());
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
        const prevTxHex = await getTxHex(utxo.txid, currentBitcoinNetwork);

        // KBC-TODO: eventually break this up into different functions depending on if Trezor or not, leave for now...I guess
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          sequence: 0xffffffff,
          witnessUtxo: {
            script: Buffer.from(transactionMap.get(utxo.txid).vout[utxo.vout].scriptpubkey, 'hex'),
            value: utxo.value
          },
          // nonWitnessUtxo: Buffer.from(prevTxHex, 'hex'),
          // redeemScript: utxo.address.redeem.output,
          witnessScript: Buffer.from(multisigWitnessScript(utxo.address).output),
          bip32Derivation: utxo.address.bip32derivation.map((derivation) => ({
            masterFingerprint: Buffer.from(derivation.masterFingerprint.buffer, derivation.masterFingerprint.byteOffset, derivation.masterFingerprint.byteLength),
            pubkey: Buffer.from(derivation.pubkey.buffer, derivation.pubkey.byteOffset, derivation.pubkey.byteLength),
            path: derivation.path
          }))
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
          bip32Derivation: [{
            masterFingerprint: Buffer.from(utxo.address.bip32derivation[0].masterFingerprint.buffer, utxo.address.bip32derivation[0].masterFingerprint.byteOffset, utxo.address.bip32derivation[0].masterFingerprint.byteLength),
            pubkey: Buffer.from(utxo.address.bip32derivation[0].pubkey.buffer, utxo.address.bip32derivation[0].pubkey.byteOffset, utxo.address.bip32derivation[0].pubkey.byteLength),
            path: utxo.address.bip32derivation[0].path
          }]
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

      psbt.signAllInputsHD(root);
      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();

      setSignedPsbts([psbt]);
    }
  }

  const importTxToForm = (file) => {
    {
      let tx;
      // try seeing if we are getting base64 encoded tx
      try {
        tx = Psbt.fromBase64(file);
      } catch (e) {
        try { // try getting hex encoded tx
          tx = Psbt.fromHex(file);
        } catch (e) {
          setImportTxFromFileError('Invalid Transaction')
        }
      }

      // if valid transaction, then continue parsing
      if (tx) { // transaction will be undefined if not created above
        try {
          // validate psbt and make sure it belongs to the current account
          let sumInputs = new BigNumber(0);
          for (let i = 0; i < tx.__CACHE.__TX.ins.length; i++) {
            const currentInput = tx.__CACHE.__TX.ins[i];
            const inputBuffer = cloneBuffer(currentInput.hash);
            const currentUtxo = utxosMap.get(inputBuffer.reverse().toString('hex'));
            if (!currentUtxo) {
              throw new Error('This transaction isn\'t associated with this wallet')
            };
            console.log('currentUtxo: ', currentUtxo);
            sumInputs = sumInputs.plus(currentUtxo.value);
          }
          const sumOutputs = tx.__CACHE.__TX.outs.reduce((accum, curr) => accum + curr.value, 0);
          setFeeEstimate(sumInputs.minus(sumOutputs).integerValue(BigNumber.ROUND_CEIL));
          if (!finalPsbt) {
            setFinalPsbt(tx);
          }

          // check if any partial signatures already
          const importedFingerprints = [];
          for (let i = 0; i < tx.data.inputs.length; i++) {
            const currentInput = tx.data.inputs[i];
            // if there is, figure out what device it belongs to
            if (currentInput.partialSig) {
              for (let j = 0; j < currentInput.partialSig.length; j++) {
                currentInput.bip32Derivation.forEach((bipItem) => {
                  // and add device to list if it isn't already
                  if (Buffer.compare(currentInput.partialSig[j].pubkey, bipItem.pubkey) === 0 && !importedFingerprints.includes(bufferToHex(bipItem.masterFingerprint))) {
                    importedFingerprints.push(bufferToHex(bipItem.masterFingerprint));
                    for (let k = 0; k < currentAccount.config.extendedPublicKeys.length; k++) {
                      if (currentAccount.config.extendedPublicKeys[k].device.fingerprint === bufferToHex(bipItem.masterFingerprint)) {
                        console.log('currentAccount.config.extendedPublicKeys[k].device: ', currentAccount.config.extendedPublicKeys[k].device);
                        console.log('signedDevices: ', signedDevices);
                        setSignedDevices([...signedDevices, currentAccount.config.extendedPublicKeys[k].device])
                      }
                    }
                  }
                })
              }
            }
          }

          // if there are any imported fingerprints, then add tx to signedPsbts array
          if (importedFingerprints.length) {
            const newlySignedPsbts = [];
            importedFingerprints.forEach(() => {
              newlySignedPsbts.push(tx.toBase64())
            })

            setSignedPsbts([...signedPsbts, ...newlySignedPsbts])
          }

          setTxImportedFromFile(true);
          setStep(1);
        } catch (e) {
          setImportTxFromFileError(e.message);
        }
      }
    }
  }

  let utxosMap;
  if (availableUtxos) {
    utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
  }

  const validateAndCreateTransaction = () => {
    if (!validateAddress(recipientAddress)) {
      setRecipientAddressError(true);
    }

    if (validateAddress(recipientAddress) && recipientAddressError) {
      setRecipientAddressError(false);
    }

    if (!satoshisToBitcoins(feeEstimate.plus(currentBalance)).isGreaterThan(sendAmount)) {
      setSendAmountError(true)
    }

    if (satoshisToBitcoins(feeEstimate.plus(currentBalance)).isGreaterThan(sendAmount) && sendAmountError) {
      setSendAmountError(false)
    }

    if (validateAddress(recipientAddress) && sendAmount && satoshisToBitcoins(feeEstimate.plus(currentBalance)).isGreaterThan(sendAmount)) {
      createTransaction(sendAmount, recipientAddress, availableUtxos, transactions)
    }
  }

  const PastePsbtModal = () => (
    <Modal
      isOpen={pastePsbtModalOpen}
      onRequestClose={() => {
        setPastedPsbtValue(null);
        setImportTxFromFileError(false);
        setPastePsbtModalOpen(false);
      }}>
      <div>Paste PSBT or Transaction Hex Below</div>
      <PastePsbtTextArea
        rows={20}
        onChange={(e) => {
          setPastedPsbtValue(e.target.value)
        }}
      />
      {importTxFromFileError && <ErrorText style={{ paddingBottom: '1em' }}>{importTxFromFileError}</ErrorText>}
      <ImportButtons>
        <FromFileButton
          style={{ marginRight: '1em' }}
          onClick={() => {
            setPastedPsbtValue(null);
            setImportTxFromFileError(false);
            setPastePsbtModalOpen(false);
          }}>Cancel</FromFileButton>
        <CopyAddressButton
          onClick={() => {
            importTxToForm(pastedPsbtValue)
          }}>Import Transaction</CopyAddressButton>
      </ImportButtons>
    </Modal>
  )

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
            <AccountMenuItemWrapper active={vault.name === currentAccount.name} borderRight={(index < config.vaults.length - 1) || config.wallets.length} onClick={() => setCurrentAccount(vault.id)}>
              <StyledIcon as={Safe} size={48} />
              <AccountMenuItemName>{vault.name}</AccountMenuItemName>
            </AccountMenuItemWrapper>
          ))}
          {config.wallets.map((wallet, index) => (
            <AccountMenuItemWrapper active={wallet.name === currentAccount.name} borderRight={(index < config.wallets.length - 1)} onClick={() => setCurrentAccount(wallet.id)}>
              <StyledIcon as={Wallet} size={48} />
              <AccountMenuItemName>{wallet.name}</AccountMenuItemName>
            </AccountMenuItemWrapper>
          ))}
        </AccountMenu>

        {currentAccount.loading && <Loading itemText={'Send Information'} />}
        {!currentAccount.loading && (
          <GridArea style={{ borderRadius: '0.375rem', alignItems: txImportedFromFile ? 'flex-start' : 'inherit' }}>
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
                  <Dropdown
                    isOpen={optionsDropdownOpen}
                    setIsOpen={setOptionsDropdownOpen}
                    minimal={true}
                    style={{ alignSelf: 'flex-end' }}
                    dropdownItems={[
                      {
                        label: 'Import from file',
                        onClick: () => {
                          console.log('fileUploadLabelRef: ', fileUploadLabelRef);
                          const txFileUploadButton = fileUploadLabelRef.current;
                          txFileUploadButton.click()
                        }
                      },
                      {
                        label: 'Import from clipboard',
                        onClick: () => {
                          setImportTxFromFileError(false)
                          setPastePsbtModalOpen(true)
                        }
                      }
                    ]}
                  />

                  {/* Stuff hidden in dropdown */}
                  <FileUploader
                    accept="*"
                    id="txFile"
                    onFileLoad={(file) => {
                      importTxToForm(file)
                    }}
                  />
                  <label style={{ display: 'none' }} ref={fileUploadLabelRef} htmlFor="txFile"></label>

                  <PastePsbtModal />

                  {/* Visible in form */}
                  <SendToAddressHeader style={{ marginTop: 0 }}>
                    Send bitcoin to
                  </SendToAddressHeader>

                  <Input
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    value={recipientAddress}
                    placeholder="bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"
                    style={{ marginBottom: 36 }}
                    error={recipientAddressError}
                  />

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

                  <SendButtonContainer>
                    {/* <CopyAddressButton background="transparent" color={darkGray}>Advanced Options</CopyAddressButton> */}
                    <CopyAddressButton onClick={() => validateAndCreateTransaction()}>Preview Transaction</CopyAddressButton>
                    {importTxFromFileError && !pastePsbtModalOpen && <ErrorText style={{ paddingTop: '1em' }}>{importTxFromFileError}</ErrorText>}
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
                utxosMap={utxosMap}
                signedPsbts={signedPsbts}
                txImportedFromFile={txImportedFromFile}
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
                  flat={true}
                  loading={currentAccount.loading}
                  maxItems={3} />
              </AccountSendContentRight>
            )}

            {step === 1 && currentAccount.config.quorum.requiredSigners > 1 && (
              <AccountSendContentRight
                style={{
                  background: white,
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)',
                  borderRadius: '0.375rem'
                }}>
                <SignWithDevice
                  psbt={finalPsbt}
                  setSignedPsbts={setSignedPsbts}
                  signedPsbts={signedPsbts}
                  signedDevices={signedDevices}
                  setSignedDevices={setSignedDevices}
                />
              </AccountSendContentRight>
            )}
          </GridArea>
        )}
      </SendWrapper>
    </PageWrapper >
  )
}

const PastePsbtTextArea = styled.textarea`
  width: 100 %;
                resize: none;
                border- color: #d2d6dc;
  border-width: 1px;
  border-radius: .375rem;
  padding: .5rem .75rem;
  box-sizing: border-box;
  margin: 2em 0;

  &:focus {
              outline: none;
    box-shadow: 0 0 0 3px rgba(164,202,254,.45);
    border-color: #a4cafe;
  }
`;

const ErrorText = styled.div`
  color: ${red};
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

const ImportButtons = styled.div`
  display: flex;
`;

const FromFileButton = styled.div`
  padding: 1em 1.25rem;
  border: 1px solid ${gray};
  border-radius: .375rem;
  flex: 1;
  text-align: center;
  font-family: 'Montserrat', sans-serif;

  &:hover {
              border: 1px solid ${darkGray};
    cursor: pointer;
  }
`;

const SendButtonContainer = styled.div`
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
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