import React, { useEffect } from 'react';
import styled from 'styled-components';
import { generateMnemonic } from 'bip39';

import { Button, MnemonicWordsDisplayer } from 'src/components';

import PageHeader from './PageHeader';

import { white, green600, gray100 } from 'src/utils/colors';
import {
  XPubHeaderWrapper,
  SetupHeaderWrapper,
  SetupExplainerText,
  FormContainer,
  BoxedWrapper,
  SetupHeader
} from './styles';
import { OnChainConfigWithoutId } from '@lily/types';

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  newAccount: OnChainConfigWithoutId;
  setNewAccount: React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>;
}

const CreateWallet = ({ setStep, newAccount, setNewAccount }: Props) => {
  useEffect(() => {
    setNewAccount({
      ...newAccount,
      mnemonic: generateMnemonic(256)
    });
  }, []);

  return (
    <div className='w-full justify-center text-gray-900 dark:text-gray-200 overflow-x-hidden'>
      <PageHeader headerText={`Create new wallet`} setStep={setStep} showCancel={true} />
      <FormContainer>
        <BoxedWrapper>
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Write down these recovery words</SetupHeader>
                <SetupExplainerText>
                  These 24 words are the keys to your wallet. Write them down and keep them in a
                  safe place. Do not share them with anyone else. These can be used to recover your
                  wallet if you lose your configuration file.
                </SetupExplainerText>
              </div>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <WordContainer>
            <MnemonicWordsDisplayer mnemonicWords={newAccount.mnemonic!} />
          </WordContainer>
          <SaveWalletButton
            background={green600}
            color={white}
            onClick={() => {
              setStep(3);
            }}
          >
            I have written these words down <br /> and stored them in a safe place
          </SaveWalletButton>
        </BoxedWrapper>
      </FormContainer>
    </div>
  );
};

const SaveWalletButton = styled.button`
  ${Button};
  flex: 1;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
  background: ${gray100};
  justify-content: center;
  border-bottom: 1px solid ${gray100};
`;

export default CreateWallet;
