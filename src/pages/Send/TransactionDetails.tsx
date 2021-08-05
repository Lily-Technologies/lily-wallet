import React, { useState, Fragment } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { ArrowIosForwardOutline } from "@styled-icons/evaicons-outline";
import { CheckCircle } from "@styled-icons/material";
import { satoshisToBitcoins } from "unchained-bitcoin";
import { Psbt, Network } from "bitcoinjs-lib";

import {
  StyledIcon,
  Button,
  SidewaysShake,
  Dropdown,
  Modal,
} from "../../components";

import {
  gray500,
  gray800,
  white,
  green500,
  green600,
  orange500,
  orange200,
} from "../../utils/colors";
import { downloadFile, formatFilename } from "../../utils/files";
import { getFee } from "../../utils/send";
import { FeeSelector } from "./FeeSelector";
import AddSignatureFromQrCode from "./AddSignatureFromQrCode";
import TransactionUtxoDetails from "./TxUtxoDetails";

import { LilyAccount, Device, FeeRates } from "../../types";

const ABSURD_FEE = 1000000; // 0.01 BTC

interface Props {
  finalPsbt: Psbt;
  sendTransaction: () => void;
  feeRates: FeeRates;
  currentAccount: LilyAccount;
  signedDevices: Device[];
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  currentBitcoinPrice: any; // KBC-TODO: change to be more specific
  createTransactionAndSetState?: (
    _recipientAddress: string,
    _sendAmount: string,
    _fee: BigNumber
  ) => Promise<Psbt>;
  currentBitcoinNetwork: Network;
}

const TransactionDetails = ({
  finalPsbt,
  sendTransaction,
  feeRates,
  currentAccount,
  signedDevices,
  setStep,
  currentBitcoinPrice,
  createTransactionAndSetState,
  currentBitcoinNetwork,
}: Props) => {
  const signThreshold = currentAccount.config.quorum.requiredSigners;
  const { availableUtxos, transactions } = currentAccount;
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

  const _fee = getFee(finalPsbt, transactions);

  const downloadPsbt = async () => {
    try {
      const psbtForDownload = finalPsbt.toBase64();
      await downloadFile(
        psbtForDownload,
        formatFilename("tx", currentBitcoinNetwork, "psbt")
      );
      openInModal(<PsbtDownloadDetails />);
    } catch (e) {}
  };

  const viewTxQrCode = () => {
    openInModal(
      <AddSignatureFromQrCode
        importSignatureFromFile={() => {}}
        psbt={finalPsbt}
        currentBitcoinPrice={currentBitcoinPrice}
        currentBitcoinNetwork={currentBitcoinNetwork}
      />
    );
  };

  const TransactionOptionsDropdown = () => {
    const dropdownItems = [
      {
        label: "Save transaction to file",
        onClick: () => {
          downloadPsbt();
        },
      },
      {
        label: "View transaction QR code",
        onClick: () => {
          viewTxQrCode();
        },
      },
    ];

    if (
      setStep !== undefined &&
      createTransactionAndSetState &&
      (!signedDevices.length || currentAccount.config.mnemonic)
    ) {
      dropdownItems.unshift({
        label: "Adjust transaction fee",
        onClick: () => {
          openInModal(
            <FeeSelector
              currentAccount={currentAccount}
              finalPsbt={finalPsbt}
              feeRates={feeRates}
              availableUtxos={availableUtxos}
              recipientAddress={finalPsbt.txOutputs[0].address!}
              sendAmount={satoshisToBitcoins(
                finalPsbt.txOutputs[0].value
              ).toString()}
              closeModal={closeModal}
              createTransactionAndSetState={createTransactionAndSetState}
              currentBitcoinPrice={currentBitcoinPrice}
            />
          );
        },
      });
    }

    // if we are creating the transaction ourselves, give options for adjustment
    if (setStep !== undefined) {
      dropdownItems.unshift({
        label: "View transaction details",
        onClick: () => {
          openInModal(
            <TransactionUtxoDetails
              psbt={finalPsbt}
              currentBitcoinPrice={currentBitcoinPrice}
              currentBitcoinNetwork={currentBitcoinPrice}
            />
          );
        },
      });
    }

    if (
      (setStep !== undefined && !signedDevices.length) ||
      currentAccount.config.mnemonic
    ) {
      // eslint-disable-line
      dropdownItems.unshift({
        label: "Edit transaction",
        onClick: () => setStep && setStep(0),
      });
    }

    return (
      <Fragment>
        <Dropdown
          data-cy="send-options-dropdown"
          minimal={true}
          dropdownItems={dropdownItems}
        />
      </Fragment>
    );
  };

  const PsbtDownloadDetails = () => (
    <>
      <ModalHeaderContainer>Download Complete</ModalHeaderContainer>
      <ModalBody>
        <IconWrapper style={{ color: green500 }}>
          <StyledIcon as={CheckCircle} size={100} />
        </IconWrapper>
        <ModalSubtext>Your PSBT file has been saved successfully.</ModalSubtext>
      </ModalBody>
    </>
  );

  return (
    <>
      <AccountSendContentRight>
        <SendDetailsContainer>
          <ModalHeaderContainer>
            <span>Transaction Summary</span>
            <TransactionOptionsDropdown />
          </ModalHeaderContainer>
          <MainTxData>
            <SendingHeader
              style={{ padding: 0 }}
            >{`Sending ${satoshisToBitcoins(
              finalPsbt.txOutputs[0].value
            )} BTC`}</SendingHeader>
            <ToField>to</ToField>
            <RecipientAddressRow style={{ paddingTop: 0, textAlign: "right" }}>
              {finalPsbt.txOutputs[0].address}
            </RecipientAddressRow>
          </MainTxData>
          <div>
            <TransactionFeeField>
              <>
                Transaction Fee:{" "}
                <span>
                  <span data-cy="transactionFeeBtc">
                    {satoshisToBitcoins(_fee).toNumber()}
                  </span>
                  <span>
                    {" "}
                    BTC ($
                    <span data-cy="transactionFeeUsd">
                      {satoshisToBitcoins(_fee)
                        .multipliedBy(currentBitcoinPrice)
                        .toFixed(2)}
                    </span>
                    )
                  </span>
                </span>
              </>
            </TransactionFeeField>
            {_fee >= ABSURD_FEE && (
              <WarningBox>Warning: transaction fee is very high</WarningBox>
            )}
          </div>
          <SendButton
            sendable={signedDevices.length === signThreshold}
            background={green500}
            color={white}
            onClick={() => sendTransaction()}
          >
            {signedDevices.length < signThreshold
              ? `Confirm on Devices (${signedDevices.length}/${signThreshold})`
              : "Broadcast Transaction"}
            {signedDevices.length < signThreshold ? null : (
              <SendButtonCheckmark>
                <StyledIcon as={ArrowIosForwardOutline} size={16} />
              </SendButtonCheckmark>
            )}
          </SendButton>
        </SendDetailsContainer>
      </AccountSendContentRight>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </>
  );
};

const IconWrapper = styled.div``;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5em;
`;

const ModalSubtext = styled.div`
  color: ${gray800};
  margin-top: 1rem;
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

const SendingHeader = styled.div`
  font-size: 1.75em;
`;

const MainTxData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4em 0 3em;
  padding-left: 3.5rem;
  padding-right: 3.5rem;
`;

const RecipientAddressRow = styled.div`
  word-break: break-all;
  font-size: 1.2em;
  align-self: center;
`;

const AccountSendContentRight = styled.div`
  min-height: 400px;
  padding: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const SendDetailsContainer = styled.div`
  background: ${white};
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 0.375rem;
`;

const ToField = styled.div`
  font-size: 1em;
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
`;

const TransactionFeeField = styled.div`
  font-size: 1em;
  padding: 1em 0;
  display: flex;
  justify-content: space-between;
  color: ${gray500};
  flex-direction: column;
  align-items: center;
`;

const SendButton = styled.div<{
  sendable: boolean;
  background: string;
  color: string;
}>`
  ${Button};
  transition: ease-out 0.4s;
  position: relative;
  font-size: 1.5em;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  box-shadow: ${(p) =>
    p.sendable ? `inset 1000px 0 0 0 ${green600}` : "none"};
`;

const SendButtonCheckmark = styled.div`
  animation: 1s ease infinite ${SidewaysShake};
`;

const WarningBox = styled.div`
  padding: 1.5em;
  background: ${orange200};
  color: ${orange500};
  border: 1px solid ${orange500};
  margin: 1.5em 0;
`;

export default TransactionDetails;
