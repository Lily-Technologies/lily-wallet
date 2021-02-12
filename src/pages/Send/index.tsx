import React, { useState, useContext } from "react";
import styled, { css } from "styled-components";
import BigNumber from "bignumber.js";
import {
  satoshisToBitcoins,
  blockExplorerTransactionURL,
} from "unchained-bitcoin";
import { Psbt, Network } from "bitcoinjs-lib";
import { CheckCircle, RemoveCircle } from "@styled-icons/material";

import {
  PageWrapper,
  PageTitle,
  Header,
  HeaderRight,
  HeaderLeft,
  Loading,
  GridArea,
  Modal,
} from "../../components";
import {
  SelectAccountMenu,
  StyledIcon,
  Button,
  NoAccountsEmptyState,
} from "../../components";

import SendTxForm from "./SendTxForm";
import ConfirmTxPage from "./ConfirmTxPage";

import { AccountMapContext } from "../../AccountMapContext";

import {
  white,
  gray400,
  gray500,
  gray600,
  gray800,
  green500,
  red500,
} from "../../utils/colors";

import {
  createTransaction,
  getSignedDevicesFromPsbt,
  broadcastTransaction,
} from "../../utils/send";
import { getUnchainedNetworkFromBjslibNetwork } from "../../utils/files";
import { mobile } from "../../utils/media";

import { LilyConfig, NodeConfig, FeeRates, SetStatePsbt } from "../../types";

interface Props {
  config: LilyConfig;
  currentBitcoinNetwork: Network;
  nodeConfig: NodeConfig;
  currentBitcoinPrice: any; // KBC-TODO: more specific type
}

const Send = ({
  config,
  currentBitcoinNetwork,
  nodeConfig,
  currentBitcoinPrice,
}: Props) => {
  document.title = `Send - Lily Wallet`;
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState<Psbt | undefined>(undefined);
  const [feeRates, setFeeRates] = useState<FeeRates>({
    fastestFee: 0,
    halfHourFee: 0,
    hourFee: 0,
  });

  const { currentAccount, accountMap } = useContext(AccountMapContext);
  const { currentBalance } = currentAccount;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const createTransactionAndSetState = async (
    _recipientAddress: string,
    _sendAmount: string,
    _fee: BigNumber
  ) => {
    try {
      const { psbt, feeRates } = await createTransaction(
        currentAccount,
        _sendAmount,
        _recipientAddress,
        _fee,
        currentBitcoinNetwork
      );
      setFinalPsbt(psbt);
      setFeeRates(feeRates);
      return psbt;
    } catch (e) {
      console.log("error: ", e);
      throw new Error(e.message);
    }
  };

  const BroadcastModalContent = ({
    broadcastedTxId,
    message,
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
          <StyledIcon
            as={broadcastedTxId ? CheckCircle : RemoveCircle}
            size={100}
          />
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
            target="_blank"
          >
            View Transaction
          </ViewTransactionButton>
        )}
        {!broadcastedTxId && (
          <ViewTransactionButton
            color={white}
            background={red500}
            onClick={() => closeModal()}
          >
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
      if (
        signedDevices.length === currentAccount.config.quorum.requiredSigners
      ) {
        try {
          finalPsbt.finalizeAllInputs();
          const broadcastId = await broadcastTransaction(
            currentAccount,
            finalPsbt,
            nodeConfig,
            currentBitcoinNetwork
          );
          openInModal(
            <BroadcastModalContent
              broadcastedTxId={broadcastId}
              message={"Your transaction has been broadcast."}
            />
          );
        } catch (e) {
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
    <PageWrapper>
      <>
        <Header>
          <HeaderLeft>
            <PageTitle>Send from</PageTitle>
          </HeaderLeft>
          <HeaderRight></HeaderRight>
        </Header>
        {Object.keys(accountMap).length > 0 && (
          <SelectAccountMenu config={config} />
        )}
        {Object.keys(accountMap).length === 0 && <NoAccountsEmptyState />}
        {Object.keys(accountMap).length > 0 && currentAccount.loading && (
          <Loading itemText={"Send Information"} />
        )}
        {!currentAccount.loading && step === 0 && (
          <GridArea>
            <SendTxForm
              finalPsbt={finalPsbt}
              setFinalPsbt={setFinalPsbt}
              createTransactionAndSetState={createTransactionAndSetState}
              setStep={setStep}
              currentBitcoinNetwork={currentBitcoinNetwork}
            />
            <SendContentRight>
              <CurrentBalanceWrapper>
                <CurrentBalanceText>Current Balance:</CurrentBalanceText>
                <CurrentBalanceValue>
                  {satoshisToBitcoins(currentBalance).toNumber()} BTC
                </CurrentBalanceValue>
              </CurrentBalanceWrapper>
            </SendContentRight>
          </GridArea>
        )}
        {!currentAccount.loading && finalPsbt && step === 1 && (
          <ConfirmTxPage
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
        <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
          {modalContent}
        </Modal>
      </>
    </PageWrapper>
  );
};

const SendContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  width: 100%;

  ${mobile(css`
    order: -1;
    min-height: auto;
  `)};
`;

const CurrentBalanceWrapper = styled.div`
  padding: 1.5em;
  display: "flex";
  flex-direction: column;
  border-radius: 0.385em;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
  background: ${white};
  text-align: right;
`;

const CurrentBalanceText = styled.div`
  font-size: 1.5em;
  color: ${gray600};
`;

const CurrentBalanceValue = styled.div`
  font-size: 2em;
`;

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

export default Send;
