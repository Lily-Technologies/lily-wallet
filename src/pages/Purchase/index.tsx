import React, { useState, useContext, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { Psbt, Network } from "bitcoinjs-lib";
import BigNumber from "bignumber.js";

import {
  PricingTable,
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

import ConfirmTxPage from "../Send/Onchain/ConfirmTxPage";

import { AccountMapContext } from "../../AccountMapContext";
import { requireOnchain } from "../../hocs";

import { broadcastTransaction, createTransaction } from "../../utils/send";
import { saveLicenseToVault } from "../../utils/files";
import { white, gray400, gray900 } from "../../utils/colors";

import { ConfigContext } from "../../ConfigContext";

import {
  SetStatePsbt,
  FeeRates,
  LicenseTiers,
  LicenseResponseTiers,
  NodeConfig,
  PaymentAddressResponse,
  LilyLicense,
  AddressType,
  VaultConfig,
  LilyOnchainAccount,
} from "../../types";

interface Props {
  currentAccount: LilyOnchainAccount;
  currentBitcoinNetwork: Network;
  currentBitcoinPrice: any;
  password: string;
  nodeConfig: NodeConfig;
}

const PurchasePage = ({
  currentAccount,
  currentBitcoinNetwork,
  currentBitcoinPrice,
  password,
  nodeConfig,
}: Props) => {
  const { config, setConfigFile } = useContext(ConfigContext);
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
  const { accountMap, setCurrentAccountId } = useContext(AccountMapContext);
  const [licenseResponse, setLicenseResponse] = useState<
    LilyLicense | undefined
  >(undefined);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = useCallback((component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  }, []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
    setModalContent(null);
  }, []);

  const clickRenewLicense = useCallback(
    async (tier: LicenseTiers, currentAccount: LilyOnchainAccount) => {
      try {
        let reqBody;
        if (Object.keys(currentAccount.config).length === 0) {
          throw Error(
            "You haven't created an account yet! Please add an account and deposit funds in order to purchase a license."
          );
        }

        if (currentAccount.loading) {
          throw Error(
            "Your current account is loading. Please wait for account to finish loading data or select a different account and try again."
          );
        }

        if (currentAccount.config.addressType === AddressType.p2sh) {
          throw Error(
            "An invalid account type (P2SH) was being used to create this payment transaction. Please try making the payment again."
          );
        }

        const {
          data: paymentAddressResponse,
        }: { data: PaymentAddressResponse } = await axios.get(
          `${process.env.REACT_APP_LILY_ENDPOINT}/get-payment-address`
        );

        const totalSigners =
          currentAccount.config.quorum.totalSigners === 3
            ? "Three"
            : currentAccount.config.quorum.totalSigners === 5
              ? "Five"
              : "";

        const tierAndTotalSigners =
          `${tier}${totalSigners}` as LicenseResponseTiers;

        const { psbt, feeRates } = await createTransaction(
          currentAccount,
          paymentAddressResponse[tierAndTotalSigners].toString(),
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

        const { data: licenseResponse }: { data: LilyLicense } =
          await axios.post(
            `${process.env.REACT_APP_LILY_ENDPOINT}/get-license`,
            reqBody
          );
        setLicenseResponse(licenseResponse);
        setStep(1);
      } catch (e: any) {
        console.log("e: ", e);
        openInModal(
          <ErrorModal message={`${e.message}`} closeModal={closeModal} />
        );
      }
    },
    [currentBitcoinNetwork, config, password, setConfigFile, openInModal]
  );

  const confirmTxWithLilyThenSend = async () => {
    if (licenseResponse && finalPsbt) {
      try {
        finalPsbt.finalizeAllInputs();
        await broadcastTransaction(finalPsbt);

        const newConfig = await saveLicenseToVault(
          currentAccount.config as VaultConfig,
          licenseResponse,
          config,
          password
        );
        setStep(2);
        setConfigFile(newConfig);
      } catch (e: any) {
        console.log("e: ", e);
        openInModal(<ErrorModal message={e.message} closeModal={closeModal} />);
      }
    }
  };

  useEffect(() => {
    if (step === 1) {
      clickRenewLicense(selectedLicenseTier, currentAccount);
    }
  }, [currentAccount, clickRenewLicense, selectedLicenseTier]);

  useEffect(() => {
    // make sure there is a currentAccount selected
    // currentAccount can be null if user goes from Home > Buy License without navigating to account
    if (
      (!currentAccount.config.id && Object.keys(accountMap).length > 0) ||
      currentAccount.config.addressType === AddressType.p2sh
    ) {
      for (let i = 0; i < Object.keys(accountMap).length; i++) {
        const tempCurrentAccount = Object.values(accountMap)[i];
        if (
          tempCurrentAccount.config.type === "onchain" &&
          tempCurrentAccount.config.addressType !== AddressType.p2sh &&
          !tempCurrentAccount.loading
        ) {
          setCurrentAccountId(tempCurrentAccount.config.id);
          break;
        }
      }
    }
  }, [
    accountMap,
    currentAccount.config.id,
    currentAccount.config.addressType,
    setCurrentAccountId,
  ]);

  return (
    <PageWrapper>
      <>
        <Header>
          <HeaderLeft>
            <PageTitle>Purchase a license</PageTitle>
          </HeaderLeft>
          <Buttons>
            <RenewButton
              color={gray900}
              background={white}
              href="https://lily-wallet.com/support"
              target="_blank"
            >
              Questions? Click here for support.
            </RenewButton>
          </Buttons>
        </Header>
        {step === 0 && (
          <PricingTable
            clickRenewLicense={clickRenewLicense}
            currentAccount={currentAccount}
          />
        )}
        {step === 1 && (
          <>
            <SelectAccountMenu
              config={config}
              setFinalPsbt={setFinalPsbt}
              excludeNonSegwitAccounts
            />
            {finalPsbt && (
              <ConfirmTxPage
                currentAccount={currentAccount}
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
          <PurchaseLicenseSuccess
            config={currentAccount.config as VaultConfig}
            nodeConfig={nodeConfig}
          />
        )}
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

const RenewButton = styled.a`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
  marginright: 1em;
`;

export default requireOnchain(PurchasePage);
