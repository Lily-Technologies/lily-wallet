import React, {
  useState,
  Fragment,
  useContext,
  useEffect,
  useCallback,
} from "react";
import styled from "styled-components";
import axios from "axios";
import { Psbt, Network } from "bitcoinjs-lib";
import BigNumber from "bignumber.js";

import {
  PricingPlanTable,
  PurchaseLicenseSuccess,
  Modal,
  ErrorModal,
  PageWrapper,
  PageTitle,
  Header,
  Button,
  HeaderLeft,
  SelectAccountMenu,
} from "../../components";

import ConfirmTxPage from "../../pages/Send/ConfirmTxPage";

import { AccountMapContext } from "../../AccountMapContext";

import { broadcastTransaction, createTransaction } from "../../utils/send";
import { saveConfig } from "../../utils/files";
import { white, gray400, gray900 } from "../../utils/colors";

import {
  SetStatePsbt,
  FeeRates,
  LicenseTiers,
  LilyConfig,
  NodeConfig,
  PaymentAddressResponse,
  LicenseResponse,
  LilyAccount,
} from "../../types";

interface Props {
  currentBitcoinNetwork: Network;
  currentBitcoinPrice: any;
  config: LilyConfig;
  password: string;
  nodeConfig: NodeConfig;
  setConfig: React.Dispatch<React.SetStateAction<LilyConfig>>;
}

const PurchasePage = ({
  currentBitcoinNetwork,
  currentBitcoinPrice,
  config,
  setConfig,
  password,
  nodeConfig,
}: Props) => {
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState<Psbt | undefined>(undefined);
  const [selectedLicenseTier, setSelectedLicenseTier] = useState<LicenseTiers>(
    LicenseTiers.basic
  );
  const [feeRates, setFeeRates] = useState<FeeRates>({
    fastestFee: 0,
    halfHourFee: 0,
    hourFee: 0,
  });
  const { currentAccount, accountMap, setCurrentAccountId } = useContext(
    AccountMapContext
  );
  const [licenseResponse, setLicenseResponse] = useState<
    LicenseResponse | undefined
  >(undefined);
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

  const clickRenewLicense = useCallback(
    async (tier: LicenseTiers, currentAccount: LilyAccount) => {
      try {
        const {
          data: paymentAddressResponse,
        }: { data: PaymentAddressResponse } = await axios.get(
          `${process.env.REACT_APP_LILY_ENDPOINT}/get-payment-address`
        );

        const { psbt, feeRates } = await createTransaction(
          currentAccount,
          paymentAddressResponse[tier].toString(),
          paymentAddressResponse.address,
          new BigNumber(0),
          currentBitcoinNetwork
        );
        setSelectedLicenseTier(tier);
        setFinalPsbt(psbt);
        setFeeRates(feeRates);
        setStep(1);
        const reqBody = {
          childPath: paymentAddressResponse.childPath,
          tx: psbt!.toBase64(),
          tier: tier,
        };
        const {
          data: licenseResponse,
        }: { data: LicenseResponse } = await axios.post(
          `${process.env.REACT_APP_LILY_ENDPOINT}/get-license`,
          reqBody
        );
        setLicenseResponse(licenseResponse);
      } catch (e) {
        console.log("e: ", e);
        openInModal(<ErrorModal message={e.message} />);
      }
    },
    [currentBitcoinNetwork]
  );

  const confirmTxWithLilyThenSend = async () => {
    if (licenseResponse) {
      try {
        finalPsbt!.finalizeAllInputs();
        const configCopy = { ...config };
        configCopy.license = licenseResponse;
        await broadcastTransaction(
          currentAccount,
          finalPsbt!,
          nodeConfig,
          currentBitcoinNetwork
        );
        await saveConfig(configCopy, password);
        setConfig(configCopy);
        setStep(2);
      } catch (e) {
        console.log("e: ", e);
        openInModal(<ErrorModal message={e.message} />);
      }
    }
  };

  useEffect(() => {
    if (step === 1) {
      clickRenewLicense(selectedLicenseTier, currentAccount);
    }
  }, [currentAccount, step, clickRenewLicense, selectedLicenseTier]);

  useEffect(() => {
    if (!currentAccount.config.id && Object.keys(accountMap).length > 0) {
      setCurrentAccountId(Object.values(accountMap)[0].config.id);
    }
  }, [accountMap, currentAccount.config.id, setCurrentAccountId]);

  return (
    <PageWrapper>
      <Fragment>
        <Modal isOpen={modalIsOpen} onRequestClose={() => closeModal()}>
          {modalContent as React.ReactChild}
        </Modal>
        <Header>
          <HeaderLeft>
            <PageTitle>Purchase a license</PageTitle>
          </HeaderLeft>
          <Buttons>
            <RenewButton color={gray900} background={white}>
              Questions? Call (970) 425-0282
            </RenewButton>
          </Buttons>
        </Header>
        {/* <ModalContent step={step}> */}
        {step === 0 && (
          <PricingPlanTable
            clickRenewLicense={clickRenewLicense}
            currentAccount={currentAccount}
          />
        )}
        {step === 1 && (
          <>
            <SelectAccountMenu config={config} setFinalPsbt={setFinalPsbt} />
            {finalPsbt && (
              <ConfirmTxPage
                finalPsbt={finalPsbt!}
                sendTransaction={confirmTxWithLilyThenSend}
                setFinalPsbt={setFinalPsbt as SetStatePsbt}
                feeRates={feeRates}
                setStep={setStep}
                currentBitcoinPrice={currentBitcoinPrice}
                currentBitcoinNetwork={currentBitcoinNetwork}
              />
            )}
          </>
        )}
        {step === 2 && (
          <PurchaseLicenseSuccess config={config} nodeConfig={nodeConfig} />
        )}
        {/* </ModalContent> */}
      </Fragment>
    </PageWrapper>
  );
};

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
`;

const RenewButton = styled.button`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
  marginright: 1em;
`;

export default PurchasePage;
