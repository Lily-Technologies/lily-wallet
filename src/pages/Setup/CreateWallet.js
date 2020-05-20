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


const CreateWallet = ({ config, setConfigFile }) => {
  const [password, setPassword] = useState('');
  const [mnemonicWords, setMnemonicWords] = useState('');
  const history = useHistory();


  useEffect(() => {
    setMnemonicWords(generateMnemonic(256));
  }, []);

  const mnemonicWordsArray = mnemonicWords.split(" ");

  const exportSetupFiles = async () => {
    const configCopy = { ...config };

    const node = bip32.fromSeed(await mnemonicToSeed(mnemonicWords), networks.testnet);
    const xprvString = node.toBase58();
    const xpubString = node.neutered().toBase58();

    console.log('node: ', node);
    console.log('node.fingerprint: ', node.fingerprint);
    console.log('node.parentFingerprint: ', node.parentFingerprint);

    const id = uuidv4();

    configCopy.wallets = [{
      id: id,
      name: id,
      addressType: "P2WSH",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      xpub: xpubString,
      xprv: xprvString,
      parentFingerprint: node.fingerprint
    }];

    const encryptedConfigObject = AES.encrypt(JSON.stringify(configCopy), password).toString();

    saveFileToGoogleDrive(encryptedConfigObject);
    setConfigFile(configCopy);
    history.push('/settings');
  }

  return (
    <Wrapper>
      <WordContainer>
        {mnemonicWordsArray.map((word) => (
          <Word>{word}</Word>
        ))}
      </WordContainer>
      <WordContainer>
        <QRCode
          bgColor={white}
          fgColor={black}
          level="Q"
          style={{ width: 256 }}
          value={mnemonicWords}
        />
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

const Word = styled.div`
  padding: 1.25em;
  margin: 1.25em;
  background: ${lightBlue};
  border: 1px solid ${blue};
`;

export default CreateWallet;