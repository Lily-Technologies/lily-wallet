import React, { useState } from "react";
import styled from "styled-components";
import { satoshisToBitcoins, bitcoinsToSatoshis } from "unchained-bitcoin";
import BigNumber from "bignumber.js";
import coinSelect from "coinselect";
import { Psbt } from "bitcoinjs-lib";

import { Button, Input } from "../../components";
import { getFeeForMultisig, getFee } from "../../utils/send";

import {
  gray50,
  gray100,
  gray300,
  gray400,
  gray500,
  gray600,
  green200,
  green500,
  green600,
  white,
} from "../../utils/colors";

import { LilyAccount, UTXO, FeeRates } from "../../types";

interface Props {
  currentAccount: LilyAccount;
  finalPsbt: Psbt;
  feeRates: FeeRates;
  availableUtxos: UTXO[];
  recipientAddress: string;
  sendAmount: string;
  closeModal(): void;
  createTransactionAndSetState(
    _recipientAddress: string,
    _sendAmount: string,
    _fee: BigNumber
  ): void;
  currentBitcoinPrice: any; // KBC-TODO: change to be more specific
}

export const FeeSelector = ({
  currentAccount,
  finalPsbt,
  feeRates,
  availableUtxos,
  recipientAddress,
  sendAmount,
  closeModal,
  createTransactionAndSetState,
  currentBitcoinPrice,
}: Props) => {
  const fee = getFee(finalPsbt, currentAccount.transactions); // in sats
  const [customFee, setCustomFee] = useState(fee);
  const [customFeeError, setCustomFeeError] = useState("");
  const [customFeeBtc, setCustomFeeBtc] = useState(satoshisToBitcoins(fee));
  const [showEditCustomFee, setShowEditCustomFee] = useState(false);

  let fastestFee: number;
  let normalFee: number;
  let slowFee: number;
  if (currentAccount.config.quorum.totalSigners > 1) {
    fastestFee = getFeeForMultisig(
      feeRates.fastestFee,
      currentAccount.config.addressType,
      finalPsbt.txInputs.length,
      finalPsbt.txOutputs.length,
      currentAccount.config.quorum.requiredSigners,
      currentAccount.config.quorum.totalSigners
    )
      .integerValue(BigNumber.ROUND_CEIL)
      .toNumber();
    normalFee = getFeeForMultisig(
      feeRates.halfHourFee,
      currentAccount.config.addressType,
      finalPsbt.txInputs.length,
      finalPsbt.txOutputs.length,
      currentAccount.config.quorum.requiredSigners,
      currentAccount.config.quorum.totalSigners
    )
      .integerValue(BigNumber.ROUND_CEIL)
      .toNumber();
    slowFee = getFeeForMultisig(
      feeRates.hourFee,
      currentAccount.config.addressType,
      finalPsbt.txInputs.length,
      finalPsbt.txOutputs.length,
      currentAccount.config.quorum.requiredSigners,
      currentAccount.config.quorum.totalSigners
    )
      .integerValue(BigNumber.ROUND_CEIL)
      .toNumber();
  } else {
    fastestFee = coinSelect(
      availableUtxos,
      [
        {
          address: recipientAddress,
          value: bitcoinsToSatoshis(sendAmount).toNumber(),
        },
      ],
      feeRates.fastestFee
    ).fee;
    normalFee = coinSelect(
      availableUtxos,
      [
        {
          address: recipientAddress,
          value: bitcoinsToSatoshis(sendAmount).toNumber(),
        },
      ],
      feeRates.halfHourFee
    ).fee;
    slowFee = coinSelect(
      availableUtxos,
      [
        {
          address: recipientAddress,
          value: bitcoinsToSatoshis(sendAmount).toNumber(),
        },
      ],
      feeRates.hourFee
    ).fee;
  }

  const validateCustomFee = () => {
    if (!satoshisToBitcoins(customFee).isGreaterThan(0)) {
      setCustomFeeError("Cannot set a negative fee!");
      return false;
    }
    if (satoshisToBitcoins(customFee).isGreaterThan(0) && customFeeError) {
      setCustomFeeError("");
    }
    return true;
  };

  const selectFee = (fee: number) => {
    createTransactionAndSetState(
      recipientAddress,
      sendAmount,
      new BigNumber(fee)
    );
    closeModal();
  };

  return (
    <>
      <ModalHeaderContainer>Adjust Transaction Fee</ModalHeaderContainer>
      {!showEditCustomFee ? (
        <div style={{ padding: "1.5em" }}>
          <FeeItem
            data-cy="fastFeeItem"
            onClick={() => selectFee(fastestFee)}
            selected={fastestFee === fee}
          >
            <FeeMainText>Fast: ~10 minutes</FeeMainText>
            <FeeSubtext>
              $
              <span data-cy="fastFeePrice">
                {satoshisToBitcoins(fastestFee)
                  .multipliedBy(currentBitcoinPrice)
                  .toFixed(2)}
              </span>
              ,{" "}
              <span data-cy="fastFeeBTC">
                {satoshisToBitcoins(fastestFee).toNumber()}
              </span>{" "}
              BTC
            </FeeSubtext>
          </FeeItem>
          {normalFee !== fastestFee && (
            <FeeItem
              onClick={() => selectFee(normalFee)}
              selected={normalFee === fee}
            >
              <FeeMainText>Normal: ~30 minutes</FeeMainText>
              <FeeSubtext>
                $
                <span data-cy="normalFeePrice">
                  {satoshisToBitcoins(normalFee)
                    .multipliedBy(currentBitcoinPrice)
                    .toFixed(2)}
                </span>
                ,{" "}
                <span data-cy="normalFeeBTC">
                  {satoshisToBitcoins(normalFee).toNumber()}
                </span>{" "}
                BTC
              </FeeSubtext>
            </FeeItem>
          )}
          {slowFee !== normalFee && ( //  remove slow option if same as normal (mempool isnt very full)
            <FeeItem
              data-cy="slowFeeItem"
              onClick={() => selectFee(slowFee)}
              selected={slowFee === fee}
            >
              <FeeMainText>Slow: ~1 hour</FeeMainText>
              <FeeSubtext>
                $
                <span data-cy="slowFeePrice">
                  {satoshisToBitcoins(slowFee)
                    .multipliedBy(currentBitcoinPrice)
                    .toFixed(2)}
                </span>
                ,{" "}
                <span data-cy="slowFeeBTC">
                  {satoshisToBitcoins(slowFee).toNumber()}
                </span>{" "}
                BTC
              </FeeSubtext>
            </FeeItem>
          )}
          <FeeItem
            data-cy="customFeeItem"
            onClick={() => {
              setShowEditCustomFee(true);
            }}
            selected={
              slowFee !== fee && normalFee !== fee && fastestFee !== fee
            }
          >
            <FeeMainText>Set custom fee</FeeMainText>
            <FeeSubtext>
              {slowFee !== fee &&
                normalFee !== fee &&
                fastestFee !== fee &&
                `$${satoshisToBitcoins(customFee)
                  .multipliedBy(currentBitcoinPrice)
                  .toFixed(2)}, ${satoshisToBitcoins(
                  customFee
                ).toNumber()} BTC`}
            </FeeSubtext>
          </FeeItem>
        </div>
      ) : (
        <CustomFeeContainer>
          <Input
            label="Custom Fee"
            type="text"
            onChange={(value) => {
              setCustomFeeBtc(value);
              setCustomFee(bitcoinsToSatoshis(value));
              validateCustomFee();
            }}
            value={customFeeBtc}
            placeholder={"0.00001"}
            error={customFeeError}
            inputStaticText="BTC"
            largeText={true}
            id="custom-fee"
          />
          <InputStaticText disabled text="BTC">
            BTC
          </InputStaticText>

          <ButtonGroup>
            <CancelButton
              onClick={() => {
                setShowEditCustomFee(false);
              }}
            >
              Cancel
            </CancelButton>
            <SaveFeeButton
              background={green600}
              color={white}
              onClick={() => {
                if (validateCustomFee()) {
                  createTransactionAndSetState(
                    recipientAddress,
                    sendAmount,
                    new BigNumber(customFee)
                  );
                  closeModal();
                }
              }}
            >
              Adjust fee
            </SaveFeeButton>
          </ButtonGroup>
        </CustomFeeContainer>
      )}
    </>
  );
};

const CustomFeeContainer = styled.div`
  padding: 1.5em;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const CancelButton = styled.div`
  padding: 1em 1.25rem;
  border: 1px solid ${gray400};
  border-radius: 0.375rem;
  flex: 1;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  margin-right: 1em;

  &:hover {
    border: 1px solid ${gray500};
    cursor: pointer;
  }
`;

const SaveFeeButton = styled.button`
  ${Button};
  padding: 1em 1.25rem;
  border-radius: 0.375rem;
  flex: 1;
  text-align: center;
  font-family: "Montserrat", sans-serif;
`;

const FeeMainText = styled.div`
  font-size: 1em;
`;

const FeeSubtext = styled.div`
  color: ${gray600};
  font-size: 0.75em;
`;

const FeeItem = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 1.5em;
  background: ${(p) => (p.selected ? green200 : gray100)};
  border: 1px solid ${(p) => (p.selected ? green500 : gray300)};
  margin: 12px 0;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  transition-duration: 0.15s;
  &:hover {
    border: 1px solid ${(p) => (p.selected ? green500 : gray50)};

    background: ${(p) => (p.selected ? green200 : gray50)};
  }

  &:active {
    background: ${(p) => (p.selected ? green200 : gray400)};
  }
`;

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
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
  color: ${gray400};

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
