import React, { useState, useContext, useEffect, useRef } from 'react';
import { Psbt, Network, bip32 } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';
import { mnemonicToSeed } from "bip39";

import SignWithDevice from './SignWithDevice'
import TransactionDetails from './TransactionDetails';
import AddSignatureFromQrCode from './AddSignatureFromQrCode';

import { AccountMapContext } from '../../AccountMapContext';

import { GridArea, Modal, FileUploader, ErrorModal } from '../../components';

import { SetStateNumber, SetStatePsbt, Device, File, FeeRates, AddressType } from '../../types';

import { getPsbtFromText, getSignedDevicesFromPsbt, combinePsbts, validateTxForAccount } from '../../utils/send';

interface Props {
  finalPsbt: Psbt
  setFinalPsbt: SetStatePsbt
  sendTransaction: () => void
  feeRates: FeeRates
  setStep?: SetStateNumber
  currentBitcoinPrice: any
  currentBitcoinNetwork: Network
  createTransactionAndSetState?: (_recipientAddress: string, _sendAmount: string, _fee: BigNumber) => Promise<Psbt> // if not passed in, then no adjusting fee
}

const ConfirmTxPage = ({
  finalPsbt,
  setFinalPsbt,
  sendTransaction,
  feeRates,
  setStep,
  currentBitcoinPrice,
  currentBitcoinNetwork,
  createTransactionAndSetState,
}: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const [signedDevices, setSignedDevices] = useState<Device[]>([]);
  const fileUploadLabelRef = useRef<HTMLLabelElement>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  // if the finalPsbt has signatures on it already, update signed device view
  useEffect(() => {
    setPreSignedDevices()
    signTransactionIfSingleSigner(finalPsbt);
  }, [finalPsbt, currentAccount.config.extendedPublicKeys, currentAccount.config.quorum.requiredSigners])

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  }

  const setPreSignedDevices = () => {
    if (currentAccount.config.addressType !== AddressType.P2WPKH) { // KBC-TODO: this needs to handle the single hww case
      const signedDevicesObjects = getSignedDevicesFromPsbt(finalPsbt, currentAccount.config.extendedPublicKeys!);
      setSignedDevices(signedDevicesObjects);
    }
  }

  // KBC-TODO: add test
  const signTransactionIfSingleSigner = async (psbt: Psbt) => {
    // if only single sign, then sign tx right away
    if (currentAccount.config.mnemonic) {
      const seed = await mnemonicToSeed(currentAccount.config.mnemonic);
      const root = bip32.fromSeed(seed, currentBitcoinNetwork);

      psbt.signAllInputsHD(root);
      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();

      setSignedDevices([{ // we need to set a signed device for flow to continue, so set it as lily
        model: 'lily',
        type: 'lily',
        fingerprint: 'whatever'
      }]) // this could probably have better information in it but...
      setFinalPsbt(psbt);
    }
  }

  const importSignatureFromFile = (file: string) => {
    try {
      const psbt = getPsbtFromText(file);
      const combinedPsbt = combinePsbts(finalPsbt, psbt);
      validateTxForAccount(combinedPsbt, currentAccount)
      const signedDevicesObjects = getSignedDevicesFromPsbt(finalPsbt, currentAccount.config.extendedPublicKeys!);
      setSignedDevices(signedDevicesObjects);
      setFinalPsbt(combinedPsbt);
      closeModal();
    } catch (e) {
      console.log('e: ', e);
      openInModal(<ErrorModal message={e.message} />)
    }
  }

  const phoneAction = currentAccount.config.extendedPublicKeys && currentAccount.config.extendedPublicKeys.filter((item) => item.device && item.device.type === 'phone' || item.device.type === 'cobo').length ? () => openInModal(<AddSignatureFromQrCode importSignatureFromFile={importSignatureFromFile} psbt={finalPsbt} currentBitcoinPrice={currentBitcoinPrice} currentBitcoinNetwork={currentBitcoinNetwork} />) : undefined;

  return (
    <GridArea>
      <FileUploader
        accept="*"
        id="txFile"
        onFileLoad={({ file }: File) => {
          importSignatureFromFile(file)
        }}
      />
      <label style={{ display: 'none' }} ref={fileUploadLabelRef} htmlFor="txFile"></label>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal()}>
        {modalContent as React.ReactChild}
      </Modal>
      <TransactionDetails
        finalPsbt={finalPsbt}
        sendTransaction={sendTransaction}
        feeRates={feeRates}
        setStep={setStep}
        signedDevices={signedDevices}
        currentBitcoinNetwork={currentBitcoinNetwork}
        currentBitcoinPrice={currentBitcoinPrice}
        currentAccount={currentAccount}
        createTransactionAndSetState={createTransactionAndSetState}
      />

      {!currentAccount.config.mnemonic && finalPsbt && (
        <SignWithDevice
          finalPsbt={finalPsbt}
          setFinalPsbt={setFinalPsbt}
          signedDevices={signedDevices}
          signThreshold={currentAccount.config.quorum.requiredSigners}
          fileUploadLabelRef={fileUploadLabelRef}
          phoneAction={phoneAction}
        />
      )}
    </GridArea>
  )
}

export default ConfirmTxPage;