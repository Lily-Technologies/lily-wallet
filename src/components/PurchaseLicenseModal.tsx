import React, { useState, Fragment, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Psbt, Network } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';

import { Modal, PricingPlanTable, PurchaseLicenseSuccess } from '.';

import ConfirmTxPage from '../pages/Send/ConfirmTxPage';

import { AccountMapContext } from '../AccountMapContext';

import { broadcastTransaction, createTransaction } from '../pages/Send/utils';
import { saveConfig } from '../utils/files';
import { black, white, gray100, gray300 } from '../utils/colors';

import { SetStatePsbt, FeeRates, LicenseLevels, LilyConfig, NodeConfig } from '../types'
interface Props {
  isOpen: boolean
  onRequestClose: () => void
  currentBitcoinNetwork: Network
  currentBitcoinPrice: any
  config: LilyConfig
  password: string
  nodeConfig: NodeConfig
  setConfig: React.Dispatch<React.SetStateAction<LilyConfig>>
}

export const PurchaseLicenseModal = ({
  isOpen,
  onRequestClose,
  currentBitcoinNetwork,
  currentBitcoinPrice,
  config,
  setConfig,
  password,
  nodeConfig
}: Props) => {
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState<Psbt | undefined>(undefined);
  const [feeRates, setFeeRates] = useState<FeeRates>({ fastestFee: 0, halfHourFee: 0, hourFee: 0 });
  const [childPath, setChildPath] = useState('');
  const { currentAccount } = useContext(AccountMapContext);

  const closeModal = () => {
    setStep(0);
    onRequestClose();
  }

  const createLicenseTransaction = async (_recipientAddress: string, _sendAmount: string, _fee: BigNumber) => {
    try {
      const { psbt, feeRates } = await createTransaction(currentAccount, _sendAmount, _recipientAddress, _fee, currentBitcoinNetwork);
      setFinalPsbt(psbt);
      setFeeRates(feeRates);
      setStep(1);
      return psbt;
    } catch (e) {
      throw new Error(e.message)
    }
  }

  const clickRenewLicense = async (level: LicenseLevels) => {
    console.log('hits clickRenewLicense:  ', level);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_LILY_ENDPOINT}/payment-address`);
      createLicenseTransaction(data.address, data[level], new BigNumber(0));
      setChildPath(data.childPath);
    } catch (e) {
      console.log('e: ', e);
    }
  }

  const confirmTxWithLilyThenSend = async () => {
    try {
      finalPsbt!.finalizeAllInputs();
      const reqBody = { childPath, tx: finalPsbt!.toBase64() };
      const { data } = await axios.post(`${process.env.REACT_APP_LILY_ENDPOINT}/tx`, reqBody);
      const configCopy = { ...config };
      const [expires, txId] = data.license.split(':');
      configCopy.license = {
        ...data,
        trial: false,
        expires,
        txId
      }
      await broadcastTransaction(currentAccount, finalPsbt!, nodeConfig, currentBitcoinNetwork);
      await saveConfig(configCopy, password);
      setConfig(configCopy);
      setStep(2);
    } catch (e) {
      console.log('e: ', e);
    }
  }


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{ content: { maxWidth: '90vw' } }}
    >
      <Fragment>
        <ModalHeader>
          <HeaderText>Purchase a license</HeaderText>
        </ModalHeader>
        <ModalContent step={step}>
          {step === 0 && (
            <PricingPlanTable
              clickRenewLicense={clickRenewLicense}
            />
          )}
          {step === 1 && (
            <ConfirmTxPage
              finalPsbt={finalPsbt!}
              sendTransaction={confirmTxWithLilyThenSend}
              setFinalPsbt={setFinalPsbt as SetStatePsbt}
              feeRates={feeRates}
              setStep={setStep}
              currentBitcoinPrice={currentBitcoinPrice}
              currentBitcoinNetwork={currentBitcoinNetwork}
              createTransactionAndSetState={createLicenseTransaction}
            />
          )}
          {step === 2 && (
            <PurchaseLicenseSuccess config={config} nodeConfig={nodeConfig} />
          )}
        </ModalContent>
      </Fragment>
    </Modal >
  )
}

const ModalHeader = styled.div`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-top: -.5rem;
  justify-content: space-between;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${gray300};
`;

const HeaderText = styled.div`
  margin-top: .5rem;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: ${black};
`;

const ModalContent = styled.div<{ step: number }>`
  padding: 2em;
  background: ${p => p.step === 1 ? gray100 : white};
`;