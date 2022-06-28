import React from 'react';

import OnchainReview from './OnchainReview';
import LightningReview from './LightningReview';

import { LightningConfig, OnChainConfigWithoutId } from '@lily/types';
import { ChannelBalanceResponse, GetInfoResponse } from '@lily-technologies/lnrpc';

interface Props {
  newAccount: OnChainConfigWithoutId | LightningConfig;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setupOption: number;
  currentBlockHeight: number;
  setNewAccount: React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>;
  tempLightningState: GetInfoResponse & ChannelBalanceResponse;
}

const ReviewScreen = ({
  setStep,
  newAccount,
  setupOption,
  currentBlockHeight,
  setNewAccount,
  tempLightningState
}: Props) => {
  if (newAccount.type === 'onchain') {
    return (
      <OnchainReview
        newAccount={newAccount}
        setStep={setStep}
        setupOption={setupOption}
        currentBlockHeight={currentBlockHeight}
        setNewAccount={setNewAccount}
      />
    );
  } else {
    return (
      <LightningReview
        newAccount={newAccount}
        setStep={setStep}
        tempLightningState={tempLightningState}
      />
    );
  }
};

export default ReviewScreen;
