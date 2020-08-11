import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { AES } from "crypto-js";
import { bip32, networks } from "bitcoinjs-lib";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import moment from "moment";

import { Button, MnemonicWordsDisplayer } from "../../components";
import {
  lightBlue,
  blue,
  white,
  darkOffWhite,
  lightGray,
  darkGray,
  gray,
} from "../../utils/colors";
import { downloadFile } from "../../utils/files";
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

const PasswordWrapper = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  border: 1px solid ${gray};
  border-bottom: none;
`;

const PasswordText = styled.h3`
  font-weight: 100;
`;

const FileSavedWrapper = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  border: 1px solid ${gray};
  border-bottom: none;
`;

const FileSavedText = styled.h3`
  font-weight: 100;
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

const PasswordInput = styled.input`
  position: relative;
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 0.75em;
  text-align: center;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border-radius: 4px;
  font-size: 1.5em;
  z-index: 1;
  flex: 1;
  font-family: "Montserrat", sans-serif;

  ::placeholder {
    color: ${gray};
  }

  :active,
  :focused {
    outline: 0;
    border: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${white};
`;

const SaveWalletContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
  background: ${lightBlue};
  justify-content: center;
  border-top: 1px solid ${darkOffWhite} !important;
  border: 1px solid ${gray};
`;

export default CreateWallet;
