import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { blockExplorerTransactionURL } from 'unchained-bitcoin';
import { Psbt, Network } from 'bitcoinjs-lib';
import { CheckCircle, RemoveCircle } from '@styled-icons/material';

import { StyledIcon, Button, Modal } from 'src/components';
import { PageTitle, Header, HeaderRight, HeaderLeft } from 'src/components';

import SendTxForm from '../components/OnchainSendTxForm';
import ConfirmTxPage from './ConfirmTxPage';

import { white, gray500, gray800, green500, red500 } from 'src/utils/colors';
import {
  createTransaction,
  getSignedDevicesFromPsbt,
  broadcastTransaction,
  RecipientItem
} from 'src/utils/send';
import { getUnchainedNetworkFromBjslibNetwork } from 'src/utils/files';
import { classNames } from 'src/utils/other';

import {
  LilyConfig,
  NodeConfigWithBlockchainInfo,
  FeeRates,
  LilyOnchainAccount
} from '@lily/types';

import { SetStatePsbt } from 'src/types';

import { PlatformContext } from 'src/context';

interface Props {
  currentAccount: LilyOnchainAccount;
  config: LilyConfig;
  currentBitcoinNetwork: Network;
  nodeConfig: NodeConfigWithBlockchainInfo;
  currentBitcoinPrice: any; // KBC-TODO: more specific type
}

const SendOnchain = ({ currentAccount, currentBitcoinNetwork, currentBitcoinPrice }: Props) => {
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState<Psbt | undefined>(undefined);
  const [feeRates, setFeeRates] = useState<FeeRates>({
    fastestFee: 0,
    halfHourFee: 0,
    hourFee: 0
  });
  const [paymentSuccessful, setPaymentSuccess] = useState(false);
  const history = useHistory();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const { platform } = useContext(PlatformContext);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
    if (paymentSuccessful) {
      history.push('/');
    }
  };

  const createTransactionAndSetState = async (recipients: RecipientItem[], _feeRate: number) => {
    try {
      const { psbt, feeRates } = await createTransaction(
        currentAccount,
        recipients,
        _feeRate,
        () => platform.estimateFee(),
        currentBitcoinNetwork
      );
      setFinalPsbt(psbt);
      setFeeRates(feeRates);
      return psbt;
    } catch (e: any) {
      console.log('error: ', e);
      throw new Error(e);
    }
  };

  const BroadcastModalContent = ({
    broadcastedTxId,
    message
  }: {
    broadcastedTxId?: string;
    message: string;
  }) => (
    <>
      <ModalHeaderContainer>
        Transaction {broadcastedTxId ? `Success` : `Failure`}
      </ModalHeaderContainer>
      <ModalBody>
        <IconWrapper style={{ color: broadcastedTxId ? green500 : red500 }}>
          <StyledIcon as={broadcastedTxId ? CheckCircle : RemoveCircle} size={100} />
        </IconWrapper>
        <ModalSubtext>{message}</ModalSubtext>
        {broadcastedTxId && (
          <ViewTransactionButton
            color={white}
            background={green500}
            href={blockExplorerTransactionURL(
              broadcastedTxId,
              getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
            )}
            target='_blank'
          >
            View Transaction
          </ViewTransactionButton>
        )}
        {!broadcastedTxId && (
          <ViewTransactionButton color={white} background={red500} onClick={() => closeModal()}>
            Try Again
          </ViewTransactionButton>
        )}
      </ModalBody>
    </>
  );

  const sendTransaction = async () => {
    if (finalPsbt) {
      const signedDevices = getSignedDevicesFromPsbt(
        finalPsbt,
        currentAccount.config.extendedPublicKeys!
      );
      if (signedDevices.length === currentAccount.config.quorum.requiredSigners) {
        try {
          finalPsbt.finalizeAllInputs();
          const broadcastId = await broadcastTransaction(finalPsbt, platform);
          openInModal(
            <BroadcastModalContent
              broadcastedTxId={broadcastId}
              message={'Your transaction has been broadcast.'}
            />
          );
          setPaymentSuccess(true);
        } catch (e: any) {
          if (e.response) {
            // error from blockstream
            openInModal(<BroadcastModalContent message={e.response.data} />);
          } else {
            // error somewhere else
            openInModal(<BroadcastModalContent message={e.message} />);
          }
        }
      }
    }
  };

  return (
    <>
      <div className={classNames(step === 0 ? 'max-w-prose' : '', 'mx-auto')}>
        <Header className=''>
          <HeaderLeft>
            <PageTitle>Send bitcoin</PageTitle>
          </HeaderLeft>
          <HeaderRight></HeaderRight>
        </Header>
      </div>
      {step === 0 && (
        <SendTxForm
          currentAccount={currentAccount}
          finalPsbt={finalPsbt}
          setFinalPsbt={setFinalPsbt}
          createTransactionAndSetState={createTransactionAndSetState}
          setStep={setStep}
          currentBitcoinNetwork={currentBitcoinNetwork}
        />
      )}
      {finalPsbt && step === 1 && (
        <ConfirmTxPage
          currentAccount={currentAccount}
          finalPsbt={finalPsbt}
          setFinalPsbt={setFinalPsbt as SetStatePsbt}
          sendTransaction={sendTransaction}
          feeRates={feeRates}
          setStep={setStep}
          currentBitcoinPrice={currentBitcoinPrice}
          currentBitcoinNetwork={currentBitcoinNetwork}
          createTransactionAndSetState={createTransactionAndSetState}
        />
      )}
      <Modal isOpen={modalIsOpen} closeModal={() => closeModal()}>
        {modalContent}
      </Modal>
    </>
  );
};

export const InputStaticText = styled.label<{
  text: string;
  disabled: boolean;
}>`
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
  color: ${gray500};

  &::after {
    content: ${(p) => p.text};
    position: absolute;
    top: 4px;
    left: 94px;
    font-family: arial, helvetica, sans-serif;
    font-size: 0.75em;
    display: block;
    color: rgba(0, 0, 0, 0.6);
    font-weight: bold;
  }
`;

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
  height: 90px;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div``;

const ModalSubtext = styled.div`
  color: ${gray800};
  margin-top: 1rem;
`;

const ViewTransactionButton = styled.a`
  ${Button}
  margin-top: 1em;
`;

export default SendOnchain;
