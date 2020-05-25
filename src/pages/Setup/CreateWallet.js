import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AES } from 'crypto-js';
import { bip32, networks } from 'bitcoinjs-lib';
import { QRCode } from "react-qr-svg";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom";

import { Button } from '../../components';
import { lightBlue, blue, white, black, darkOffWhite, lightGray, darkGray, gray } from '../../utils/colors';
import { saveFileToGoogleDrive } from '../../utils/google-drive';
import { getUnchainedNetworkFromBjslibNetwork } from '../../utils/transactions';


const CreateWallet = ({ config, setConfigFile, currentBitcoinNetwork }) => {
  const [password, setPassword] = useState('');
  const [mnemonicWords, setMnemonicWords] = useState('');
  const history = useHistory();


  useEffect(() => {
    setMnemonicWords(generateMnemonic(256));
  }, []);

  const mnemonicWordsArray = mnemonicWords.split(" ");

  const exportSetupFiles = async () => {
    const configCopy = { ...config };

    const node = bip32.fromSeed(await mnemonicToSeed(mnemonicWords), currentBitcoinNetwork);
    const xprvString = node.toBase58();
    const xpubString = node.neutered().toBase58();
    console.log('xprvString: ', xprvString);
    console.log('xpubString: ', xpubString);

    const id = uuidv4();

    configCopy.wallets.push({
      id: id,
      name: id,
      network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
      addressType: "P2WSH",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      xpub: xpubString,
      xprv: xprvString,
      parentFingerprint: node.fingerprint
    });

    const encryptedConfigObject = AES.encrypt(JSON.stringify(configCopy), password).toString();

    saveFileToGoogleDrive(encryptedConfigObject);
    setConfigFile(configCopy);
    history.push('/settings');
  }

  return (
    <Wrapper>
      <WordContainer>
        <WordSection>
          {mnemonicWordsArray.slice(0, 6).map((word, index) => (
            <Word>{index + 1}) {word}</Word>
          ))}
        </WordSection>
        <WordSection>
          {mnemonicWordsArray.slice(6, 12).map((word, index) => (
            <Word>{index + 7}) {word}</Word>
          ))}
        </WordSection>
        <WordSection>
          {mnemonicWordsArray.slice(12, 18).map((word, index) => (
            <Word>{index + 13}) {word}</Word>
          ))}
        </WordSection>
        <WordSection>
          {mnemonicWordsArray.slice(18, 24).map((word, index) => (
            <Word>{index + 19}) {word}</Word>
          ))}
        </WordSection>
      </WordContainer>
      <PasswordWrapper>
        <PasswordText>Almost done, just set a password to encrypt your setup file:</PasswordText>
        <PasswordInput placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      </PasswordWrapper>
      <WordContainer>
        <SaveWalletButton
          onClick={() => exportSetupFiles()}
        >
          Save Wallet
        </SaveWalletButton>
      </WordContainer>
    </Wrapper>
  );
}

const SaveWalletButton = styled.div`
  ${Button};
  flex: 1;
`;

const PasswordWrapper = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
`;

const PasswordText = styled.h3``;

const PasswordInput = styled.input`
  position: relative;
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: .75em;
  text-align: center;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px;
  border-radius: 4px;
  font-size: 1.5em;
  z-index: 1;
  flex: 1;
  font-family: 'Montserrat', sans-serif;

  ::placeholder {
    color: ${gray};
  }

  :active, :focused {
    outline: 0;
    border: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
`;

const WordSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Word = styled.div`
  padding: 1.25em;
  margin: 1.25em;
  background: ${lightBlue};
  border: 1px solid ${blue};
`;

export default CreateWallet;