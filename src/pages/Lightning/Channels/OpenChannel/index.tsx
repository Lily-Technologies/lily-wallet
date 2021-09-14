import React, { useState, useContext, useCallback } from "react";
import { Psbt } from "bitcoinjs-lib";
import BigNumber from "bignumber.js";
import styled, { css } from "styled-components";
import { satoshisToBitcoins } from "unchained-bitcoin";
import { EditAlt } from "@styled-icons/boxicons-regular";

import {
  StyledIcon,
  ModalContentWrapper,
  ErrorModal,
  Modal,
} from "src/components";

import { mobile } from "src/utils/media";
import { green100, green600, gray500 } from "src/utils/colors";
import { createTransaction } from "src/utils/send";

import {
  LilyLightningAccount,
  FeeRates,
  SetStatePsbt,
  LilyOnchainAccount,
  ShoppingItem,
  SetStateBoolean,
} from "src/types";
import { requireLightning } from "src/hocs";

import OpenChannelForm from "./OpenChannelForm";
import ConfirmTxPage from "src/pages/Send/ConfirmTxPage";
import LightningImage from "./LightningImage";
import OpenChannelSuccess from "./OpenChannelSuccess";

import { ConfigContext } from "src/ConfigContext";

interface Props {
  currentAccount: LilyLightningAccount;
  setViewOpenChannelForm: SetStateBoolean;
}

const OpenChannel = ({ currentAccount, setViewOpenChannelForm }: Props) => {
  const { currentBitcoinPrice, currentBitcoinNetwork } =
    useContext(ConfigContext);
  const [step, setStep] = useState(0);
  const [finalPsbt, setFinalPsbt] = useState<Psbt | undefined>(undefined);
  const [feeRates, setFeeRates] = useState<FeeRates>({
    fastestFee: 0,
    halfHourFee: 0,
    hourFee: 0,
  });
  const [pendingChannelId, setPendingChannelId] = useState("");
  const [fundingAccount, setFundingAccount] = useState(
    {} as LilyOnchainAccount
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [broadcastedTxId, setBroadcastedTxId] = useState("");
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

  const openChannel = async (
    lightningAddress: string,
    channelAmount: string
  ) => {
    setIsLoading(true);
    try {
      window.ipcRenderer.send("/open-channel", {
        lightningAddress: lightningAddress,
        channelAmount,
        lndConnectUri: currentAccount.config.connectionDetails.lndConnectUri,
      });

      window.ipcRenderer.on(
        "/open-channel",
        async (_event: any, ...args: any) => {
          try {
            console.log("args: ", args);
            const openChannelResponse = args[0];
            console.log("openChannelResponse: ", openChannelResponse);


            if (openChannelResponse.error) {
              setError(openChannelResponse.error.message);
            } else if (openChannelResponse.update === 'psbt_fund') {
              const { psbt_fund, pending_chan_id } = openChannelResponse;

              const { psbt, feeRates } = await createTransaction(
                fundingAccount,
                `${satoshisToBitcoins(psbt_fund.funding_amount).toNumber()}`,
                psbt_fund.funding_address,
                new BigNumber(0),
                currentBitcoinNetwork
              );

              window.ipcRenderer.send("/open-channel-verify", {
                finalPsbt: psbt.toBase64(),
                pendingChanId: openChannelResponse.pending_chan_id,
                lndConnectUri:
                  currentAccount.config.connectionDetails.lndConnectUri,
              });

              console.log("pending_chan_id: ", pending_chan_id);
              setPendingChannelId(pending_chan_id);
              setFinalPsbt(psbt);
              setFeeRates(feeRates);
              setShoppingItems([
                {
                  image: <LightningImage />,
                  title: `Lightning channel with ${openChannelResponse.alias}`,
                  price: psbt_fund.funding_amount,
                  extraInfo: [
                    {
                      label: "Outgoing capacity",
                      value: `${psbt_fund.funding_amount.toLocaleString()} sats`,
                    },
                    { label: "Incoming capacity", value: `0 sats` },
                  ],
                },
              ]);
              setStep(1);
            } else if (openChannelResponse.update === 'chan_pending') {
              setTimeout(() => {
                window.ipcRenderer.send("/lightning-account-data", {
                  config: currentAccount.config,
                });
              }, 200)
              setStep(2);
            }
            setIsLoading(false);
          } catch (e) {
            setError(e.message);
            setIsLoading(false);
          }
        }
      );
    } catch (e) {
      console.log("e: ", e.message);
      setError(e.message);
      setIsLoading(false);
    }
  };

  const confirmTxWithLilyThenSend = async () => {
    try {
      const finalizedPsbt = finalPsbt!.finalizeAllInputs();
      window.ipcRenderer.send("/open-channel-finalize", {
        finalPsbt: finalizedPsbt.toBase64(),
        pendingChanId: pendingChannelId,
        lndConnectUri: currentAccount.config.connectionDetails.lndConnectUri,
      });
    } catch (e) {
      console.log("e: ", e);
      openInModal(<ErrorModal message={e.message} closeModal={closeModal} />);
    }
  };

  return (
    <>
      {step === 0 && (
        <Wrapper>
          <DangerIconContainer>
            <StyledIconCircle>
              <StyledIcon style={{ color: green600 }} as={EditAlt} size={36} />
            </StyledIconCircle>
          </DangerIconContainer>
          <TextContainer>
            <HeadingText>Open a new channel</HeadingText>
            <Subtext>
              Channels allow you to send payments to other nodes on the
              lightning network with low fees.
            </Subtext>
            <OpenChannelForm
              openChannel={openChannel}
              setFundingAccount={setFundingAccount}
              isLoading={isLoading}
              error={error}
              setViewOpenChannelForm={setViewOpenChannelForm}
            />
          </TextContainer>
        </Wrapper>
      )}
      {step === 1 && (
        <FormWrapper>
          <FormHeaderWrapper>
            <DangerIconContainer>
              <StyledIconCircle>
                <StyledIcon
                  style={{ color: green600 }}
                  as={EditAlt}
                  size={36}
                />
              </StyledIconCircle>
            </DangerIconContainer>
            <TextContainer>
              <HeadingText>Open a new channel</HeadingText>
              <Subtext>
                Confirm your funding transaction on your hardware wallet(s).
              </Subtext>
            </TextContainer>
          </FormHeaderWrapper>
          {finalPsbt && (
            <ConfirmTxPage
              currentAccount={fundingAccount}
              finalPsbt={finalPsbt!}
              sendTransaction={confirmTxWithLilyThenSend}
              setFinalPsbt={setFinalPsbt as SetStatePsbt}
              feeRates={feeRates}
              setStep={setStep}
              currentBitcoinPrice={currentBitcoinPrice}
              currentBitcoinNetwork={currentBitcoinNetwork}
              shoppingItems={shoppingItems}
            />
          )}
        </FormWrapper>
      )}
      {step === 2 && <OpenChannelSuccess />}
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </>
  );
};

const Wrapper = styled(ModalContentWrapper)`
  margin-top: 1rem;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormHeaderWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  padding: 1.5em;
  padding-bottom: 0;
`;

const TextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 1rem;

  ${mobile(css`
    margin-top: 0.75rem;
    margin-left: 0;
  `)};
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${green100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeadingText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

const Subtext = styled.div`
  padding-bottom: 1em;
  margin-top: 0.5rem;
  color: ${gray500};
`;

export default requireLightning(OpenChannel);
