import React, { useState } from 'react';
import styled from 'styled-components';
import { satoshisToBitcoins } from 'unchained-bitcoin';
import { Psbt } from 'bitcoinjs-lib';

import { Button, Input } from 'src/components';
import { getFee } from 'src/utils/send';

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
  white
} from 'src/utils/colors';

import { LilyOnchainAccount, FeeRates } from '@lily/types';

interface Props {
  currentAccount: LilyOnchainAccount;
  finalPsbt: Psbt;
  feeRates: FeeRates;
  recipientAddress: string;
  sendAmount: string;
  closeModal(): void;
  createTransactionAndSetState(
    _recipientAddress: string,
    _sendAmount: string,
    _fee: number
  ): Promise<Psbt>;
  currentBitcoinPrice: any; // KBC-TODO: change to be more specific
}

export const FeeSelector = ({
  currentAccount,
  finalPsbt,
  feeRates,
  recipientAddress,
  sendAmount,
  closeModal,
  createTransactionAndSetState,
  currentBitcoinPrice
}: Props) => {
  const fee = getFee(finalPsbt, currentAccount.transactions); // in sats
  const [customFeeRate, setCustomFeeRate] = useState(fee);
  const [customFeeRateError, setCustomFeeRateError] = useState('');
  const [customFeeBtc, setCustomFeeBtc] = useState(fee);
  const [showEditCustomFeeRate, setShowEditCustomFeeRate] = useState(false);

  const validateCustomFee = () => {
    if (customFeeRate! < 0) {
      setCustomFeeRateError('Cannot set a negative fee!');
      return false;
    }
    if (customFeeRate! > 0 && customFeeRateError) {
      setCustomFeeRateError('');
    }
    return true;
  };

  const selectFee = async (feeRate: number) => {
    try {
      await createTransactionAndSetState(recipientAddress, sendAmount, feeRate);
      closeModal();
    } catch (e) {
      console.log('e: ', e);
      if (e instanceof Error) {
        setCustomFeeRateError(e.message);
      }
    }
  };

  const { fastestFee, halfHourFee, hourFee } = feeRates;

  return (
    <>
      <ModalHeaderContainer>Adjust Transaction Fee</ModalHeaderContainer>
      {!showEditCustomFeeRate ? (
        <div style={{ padding: '1.5em' }}>
          <FeeItem
            data-cy='fastFeeItem'
            onClick={() => selectFee(fastestFee)}
            selected={fastestFee === fee}
          >
            <FeeMainText>Fast: ~10 minutes</FeeMainText>
            <FeeSubtext>
              $
              <span data-cy='fastFeePrice'>
                {satoshisToBitcoins(fastestFee).multipliedBy(currentBitcoinPrice).toFixed(2)}
              </span>
              , <span data-cy='fastFeeBTC'>{satoshisToBitcoins(fastestFee).toNumber()}</span> BTC
            </FeeSubtext>
          </FeeItem>
          {halfHourFee !== fastestFee && (
            <FeeItem onClick={() => selectFee(halfHourFee)} selected={halfHourFee === fee}>
              <FeeMainText>Normal: ~30 minutes</FeeMainText>
              <FeeSubtext>
                $
                <span data-cy='normalFeePrice'>
                  {satoshisToBitcoins(halfHourFee).multipliedBy(currentBitcoinPrice).toFixed(2)}
                </span>
                , <span data-cy='normalFeeBTC'>{satoshisToBitcoins(halfHourFee).toNumber()}</span>{' '}
                BTC
              </FeeSubtext>
            </FeeItem>
          )}
          {hourFee !== halfHourFee && ( //  remove slow option if same as normal (mempool isnt very full)
            <FeeItem
              data-cy='slowFeeItem'
              onClick={() => selectFee(hourFee)}
              selected={hourFee === fee}
            >
              <FeeMainText>Slow: ~1 hour</FeeMainText>
              <FeeSubtext>
                $
                <span data-cy='slowFeePrice'>
                  {satoshisToBitcoins(hourFee).multipliedBy(currentBitcoinPrice).toFixed(2)}
                </span>
                , <span data-cy='slowFeeBTC'>{satoshisToBitcoins(hourFee).toNumber()}</span> BTC
              </FeeSubtext>
            </FeeItem>
          )}
          <FeeItem
            data-cy='customFeeItem'
            onClick={() => {
              setShowEditCustomFeeRate(true);
            }}
            selected={hourFee !== fee && halfHourFee !== fee && fastestFee !== fee}
          >
            <FeeMainText>Set custom fee</FeeMainText>
            <FeeSubtext>
              {hourFee !== fee &&
                halfHourFee !== fee &&
                fastestFee !== fee &&
                `$${satoshisToBitcoins(customFeeRate)
                  .multipliedBy(currentBitcoinPrice)
                  .toFixed(2)}, ${satoshisToBitcoins(customFeeRate).toNumber()} BTC`}
            </FeeSubtext>
          </FeeItem>
        </div>
      ) : (
        <CustomFeeContainer>
          <Input
            label='Custom Fee'
            type='text'
            onChange={(value) => {
              setCustomFeeBtc(Number(value));
              setCustomFeeRate(Number(value));
              validateCustomFee();
            }}
            value={customFeeBtc!.toString()}
            placeholder={'5'}
            error={customFeeRateError}
            inputStaticText='sat/vB'
            largeText={true}
            id='custom-fee'
            style={{ paddingRight: '4em' }}
          />
          <ButtonGroup>
            <CancelButton
              onClick={() => {
                setShowEditCustomFeeRate(false);
              }}
            >
              Cancel
            </CancelButton>
            <SaveFeeButton
              background={green600}
              color={white}
              onClick={() => {
                if (validateCustomFee()) {
                  selectFee(customFeeRate!);
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
  margin-top: 1em;
`;

const CancelButton = styled.div`
  padding: 1em 1.25rem;
  border: 1px solid ${gray400};
  border-radius: 0.375rem;
  flex: 1;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
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
  font-family: 'Montserrat', sans-serif;
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
