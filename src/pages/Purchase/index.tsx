import React, { useState, useContext, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { Psbt, Network } from "bitcoinjs-lib";
import BigNumber from "bignumber.js";

import {
  PricingPlanTable,
  PurchaseLicenseSuccess,
  ErrorModal,
  PageWrapper,
  PageTitle,
  Header,
  Button,
  HeaderLeft,
  SelectAccountMenu,
  Modal,
} from "../../components";

import ConfirmTxPage from "../../pages/Send/ConfirmTxPage";

import { AccountMapContext } from "../../AccountMapContext";

import { broadcastTransaction, createTransaction } from "../../utils/send";
import { saveLicenseToConfig } from "../../utils/files";
import { white, gray400, gray900 } from "../../utils/colors";

import { ConfigContext } from "../../ConfigContext";

import {
  SetStatePsbt,
  FeeRates,
  LicenseTiers,
  NodeConfig,
  PaymentAddressResponse,
  LicenseResponse,
  LilyAccount,
} from "../../types";

interface Props {
  currentBitcoinNetwork: Network;
  currentBitcoinPrice: any;
  password: string;
  nodeConfig: NodeConfig;
}

const PurchasePage = ({
  currentBitcoinNetwork,
  currentBitcoinPrice,
  password,
  nodeConfig,
}: Props) => {
  const { config, setConfigFile } = useContext(ConfigContext);
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState<Psbt | undefined>(undefined);
  const [selectedLicenseTier, setSelectedLicenseTier] = useState<LicenseTiers>(
    LicenseTiers.free
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

  const openInModal = useCallback((component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  }, []);

  const clickRenewLicense = useCallback(
    async (tier: LicenseTiers, currentAccount: LilyAccount) => {
      try {
        let reqBody;
        if (tier !== LicenseTiers.free) {
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
          reqBody = {
            childPath: paymentAddressResponse.childPath,
            tx: psbt!.toBase64(),
            tier: tier,
          };
        } else {
          reqBody = {
            tier: tier,
          };
        }

        const {
          data: licenseResponse,
        }: { data: LicenseResponse } = await axios.post(
          `${process.env.REACT_APP_LILY_ENDPOINT}/get-license`,
          reqBody
        );
        setLicenseResponse(licenseResponse);
        if (tier === LicenseTiers.free) {
          const newConfig = await saveLicenseToConfig(
            licenseResponse,
            config,
            password
          );
          setConfigFile(newConfig);
          setStep(2);
        } else {
          setStep(1);
        }
      } catch (e) {
        console.log("e: ", e);
        openInModal(<ErrorModal message={`${e.message}. Please try again.`} />);
      }
    },
    [currentBitcoinNetwork, config, password, setConfigFile, openInModal]
  );

  const confirmTxWithLilyThenSend = async () => {
    if (licenseResponse) {
      try {
        finalPsbt!.finalizeAllInputs();
        await broadcastTransaction(
          currentAccount,
          finalPsbt!,
          nodeConfig,
          currentBitcoinNetwork
        );
        const newConfig = await saveLicenseToConfig(
          licenseResponse,
          config,
          password
        );
        setStep(2);
        setConfigFile(newConfig);
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
      <>
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
        <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
          {modalContent}
        </Modal>
      </>
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
