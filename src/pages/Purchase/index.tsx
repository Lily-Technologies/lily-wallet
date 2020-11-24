import React, { useState, Fragment, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Psbt, Network } from 'bitcoinjs-lib';
import BigNumber from 'bignumber.js';

import { PricingPlanTable, PurchaseLicenseSuccess, PageWrapper, PageTitle, Header, Button, HeaderLeft } from '../../components';

import ConfirmTxPage from '../../pages/Send/ConfirmTxPage';

import { AccountMapContext } from '../../AccountMapContext';

import { broadcastTransaction, createTransaction } from '../../pages/Send/utils';
import { saveConfig } from '../../utils/files';
import { black, white, gray100, gray400, gray900 } from '../../utils/colors';

import { SetStatePsbt, FeeRates, LicenseLevels, LilyConfig, NodeConfig } from '../../types'


interface Props {
  currentBitcoinNetwork: Network
  currentBitcoinPrice: any
  config: LilyConfig
  password: string
  nodeConfig: NodeConfig
  setConfig: React.Dispatch<React.SetStateAction<LilyConfig>>
}

const PurchasePage = ({
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
    <PageWrapper>
      <Fragment>
        <Header>
          <HeaderLeft>
            <PageTitle>Purchase a license</PageTitle>
          </HeaderLeft>
          <Buttons>
            <RenewButton
              color={gray900}
              background={white}>
              Questions? Call (970) 425-0282
          </RenewButton>
          </Buttons>
        </Header>
        {/* <ModalContent step={step}> */}
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
        {/* </ModalContent> */}
      </Fragment>
    </PageWrapper>
  )
}

// const ModalContent = styled.div<{ step: number }>`
//   padding: 2em 0;
//   background: ${p => p.step === 1 ? gray100 : white};
//   border-radius: 0.385em;
//   box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
// `;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
`;

const RenewButton = styled.button`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
  marginRight: 1em;
`;

export default PurchasePage;