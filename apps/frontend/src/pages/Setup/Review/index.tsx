import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import OnchainReview from './OnchainReview';
import LightningReview from './LightningReview';

import { AccountId, OnChainConfig, LightningConfig, OnChainConfigWithoutId } from '@lily/types';
import { PlatformContext } from 'src/context';

interface Props {
  newAccount: OnChainConfigWithoutId | LightningConfig;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setupOption: number;
  currentBlockHeight: number;
  setNewAccount: React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>;
}

const ReviewScreen = ({
  setStep,
  newAccount,
  setupOption,
  currentBlockHeight,
  setNewAccount
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
    return <LightningReview newAccount={newAccount} setStep={setStep} />;
  }
};

export default ReviewScreen;
