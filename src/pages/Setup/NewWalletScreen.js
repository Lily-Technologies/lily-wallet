import React, { useEffect } from "react";
import styled from "styled-components";
import { generateMnemonic } from "bip39";

import { Button, MnemonicWordsDisplayer } from "../../components";
import {
  lightBlue,
  blue,
  white,
  darkOffWhite,
  darkGray,
  gray,
} from "../../utils/colors";
import { InnerWrapper } from './styles';

const CreateWallet = ({
  walletMnemonic,
  setWalletMnemonic,
  setStep
}) => {
  useEffect(() => {
    setWalletMnemonic(generateMnemonic(256));
  }, []);

  return (
    <InnerWrapper>
      <XPubHeaderWrapper>
        <SetupHeaderWrapper>
          <SetupHeader>Write down these recovery words</SetupHeader>
          <SetupExplainerText>
            These 24 words are the keys to your wallet. Write them down and keep
            them in a safe place. Do not share them with anyone else. These can
            be used to recover your wallet if you lose your configuration file.
          </SetupExplainerText>
        </SetupHeaderWrapper>
      </XPubHeaderWrapper>
      <WordContainer>
        <MnemonicWordsDisplayer mnemonicWords={walletMnemonic} />
      </WordContainer>
      <SaveWalletButton
        onClick={() => {
          setStep(3);
        }}>
        I have written these words down
      </SaveWalletButton>
    </InnerWrapper>
  )
};

const XPubHeaderWrapper = styled.div`
  color: ${blue};
  background: ${white};
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 24px 24px 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid ${gray};
  border-left: 1px solid ${gray};
  border-right: 1px solid ${gray};
  border-top: 1px solid ${gray};
`;

const SetupHeader = styled.span`
  font-size: 1.5em;
  margin: 4px 0;
`;

const SetupExplainerText = styled.div`
  color: ${darkGray};
  font-size: 0.8em;
  margin: 8px 0;
`;

const SetupHeaderWrapper = styled.div`
  display: flex;
  // align-items: center;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  padding: 0 48px 0 0;
`;

const SaveWalletButton = styled.div`
  ${Button};
  flex: 1;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
  background: ${lightBlue};
  justify-content: center;
  border-bottom: 1px solid ${darkOffWhite};
  border-left: 1px solid ${gray};
  border-right: 1px solid ${gray};
`;

export default CreateWallet;
