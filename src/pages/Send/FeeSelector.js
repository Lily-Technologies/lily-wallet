import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import {
  satoshisToBitcoins,
  bitcoinsToSatoshis
} from "unchained-bitcoin";
import BigNumber from 'bignumber.js';
import coinSelect from 'coinselect';

import { Button } from '../../components';
import { getFeeForMultisig } from './utils';
import { AddressDisplayWrapper, Input, InputStaticText } from './styles';

import { gray, blue, darkGray, lightGray, lightBlue, offWhite } from '../../utils/colors';


export const FeeSelector = ({
  currentAccount,
  feeEstimate,
  finalPsbt,
  feeRates,
  availableUtxos,
  recipientAddress,
  sendAmount,
  closeModal,
  createTransactionAndSetState,
  currentBitcoinPrice
}) => {
  const [customFee, setCustomFee] = useState(feeEstimate);
  const [customFeeError, setCustomFeeError] = useState(false);
  const [customFeeBtc, setCustomFeeBtc] = useState(satoshisToBitcoins(feeEstimate));
  const [showEditCustomFee, setShowEditCustomFee] = useState(false);

  let fastestFee;
  let normalFee;
  let slowFee;
  if (currentAccount.config.quorum.totalSigners > 1) {
    fastestFee = getFeeForMultisig(feeRates.fastestFee, currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
    normalFee = getFeeForMultisig(feeRates.halfHourFee, currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
    slowFee = getFeeForMultisig(feeRates.hourFee, currentAccount.config.addressType, finalPsbt.__CACHE.__TX.ins.length, finalPsbt.__CACHE.__TX.outs.length, currentAccount.config.quorum.requiredSigners, currentAccount.config.quorum.totalSigners).integerValue(BigNumber.ROUND_CEIL);
  } else {
    fastestFee = coinSelect(availableUtxos, [{ address: recipientAddress, value: bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.fastestFee).fee;
    normalFee = coinSelect(availableUtxos, [{ address: recipientAddress, value: bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.halfHourFee).fee;
    slowFee = coinSelect(availableUtxos, [{ address: recipientAddress, value: bitcoinsToSatoshis(sendAmount).toNumber() }], feeRates.hourFee).fee;
  }

  const validateCustomFee = () => {
    if (!satoshisToBitcoins(BigNumber(customFee)).isGreaterThan(0)) {
      setCustomFeeError(true);
      return false;
    }
    if (satoshisToBitcoins(BigNumber(customFee)).isGreaterThan(0) && customFeeError) {
      setCustomFeeError(false)
    }
    return true;
  }

  return (
    <Fragment>
      <ModalHeaderContainer>
        Adjust Transaction Fee
    </ModalHeaderContainer>
      {!showEditCustomFee ? (
        <div style={{ padding: '1.5em' }}>
          <FeeItem
            onClick={() => {
              createTransactionAndSetState(fastestFee);
              closeModal();
            }}
            selected={fastestFee === feeEstimate}>
            <FeeMainText>Fast: ~10 minutes</FeeMainText>
            <FeeSubtext>${satoshisToBitcoins(fastestFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(fastestFee).toNumber()} BTC</FeeSubtext>
          </FeeItem>
          {normalFee !== fastestFee && (
            <FeeItem
              onClick={() => {
                createTransactionAndSetState(normalFee);
                closeModal();
              }}
              selected={normalFee === feeEstimate}>
              <FeeMainText>Normal: ~30 minutes</FeeMainText>
              <FeeSubtext>${satoshisToBitcoins(normalFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(normalFee).toNumber()} BTC</FeeSubtext>
            </FeeItem>
          )}
          {slowFee !== normalFee && ( //  remove slow option if same as normal (mempool isnt very full)
            <FeeItem
              onClick={() => {
                createTransactionAndSetState(slowFee);
                closeModal();
              }}
              selected={slowFee === feeEstimate}>
              <FeeMainText>Slow: ~1 hour</FeeMainText>
              <FeeSubtext>${satoshisToBitcoins(slowFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, {satoshisToBitcoins(slowFee).toNumber()} BTC</FeeSubtext>
            </FeeItem>
          )}
          <FeeItem
            onClick={() => {
              setShowEditCustomFee(true);
            }}
            selected={slowFee !== feeEstimate && normalFee !== feeEstimate && fastestFee !== feeEstimate}>
            <FeeMainText>Custom Fee</FeeMainText>
            <FeeSubtext>
              {slowFee !== feeEstimate && normalFee !== feeEstimate && fastestFee !== feeEstimate &&
                `$${satoshisToBitcoins(customFee).multipliedBy(currentBitcoinPrice).toFixed(2)}, ${satoshisToBitcoins(customFee).toNumber()} BTC`
              }
            </FeeSubtext>
          </FeeItem>
        </div>
      ) : (
          <Container>
            <AddressDisplayWrapper>
              <Input
                onChange={(e) => {
                  setCustomFeeBtc(e.target.value);
                  setCustomFee(bitcoinsToSatoshis(e.target.value));
                  validateCustomFee();
                }}
                value={customFeeBtc}
                placeholder={"0.00001"}
                style={{ paddingRight: 80, color: darkGray, flex: 1 }}
                error={customFeeError}
              />
              <InputStaticText
                disabled
                text="BTC"
              >BTC</InputStaticText>
            </AddressDisplayWrapper>

            <ButtonGroup>
              <CancelButton
                onClick={() => {
                  setShowEditCustomFee(false);
                }}>
                Cancel
              </CancelButton>
              <SaveFeeButton
                onClick={() => {
                  if (validateCustomFee()) {
                    createTransactionAndSetState(customFee);
                    closeModal();
                  }
                }}>
                Save Fee
              </SaveFeeButton>
            </ButtonGroup>
          </Container>
        )}
    </Fragment >
  )
}

const Container = styled.div`
padding: 1.5em;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const CancelButton = styled.div`
  padding: 1em 1.25rem;
  border: 1px solid ${gray};
  border-radius: .375rem;
  flex: 1;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  margin-right: 1em;

  &:hover {
    border: 1px solid ${darkGray};
    cursor: pointer;
  }
`;

const SaveFeeButton = styled.button`
  ${Button};
  padding: 1em 1.25rem;
  border-radius: .375rem;
  flex: 1;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
`

const FeeMainText = styled.div`
  font-size: 1em;
`;

const FeeSubtext = styled.div`
  color: ${darkGray};
  font-size: 0.75em;
`;

const FeeItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5em;
  margin: 12px 0;
  background: ${ p => p.selected ? lightBlue : lightGray};
  border: 1px solid ${p => p.selected ? blue : offWhite};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  transition-duration: .15s;

  &:hover {
    border: 1px solid ${p => p.selected ? blue : offWhite};
    background: ${ p => p.selected ? lightBlue : offWhite};
  }

  &:active {
    background: ${ p => p.selected ? lightBlue : gray};
  }
`;

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229,231,235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;