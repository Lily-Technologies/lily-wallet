import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { AES } from 'crypto-js';
import { bip32, networks } from 'bitcoinjs-lib';
import { QRCode } from "react-qr-svg";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import b58 from 'bs58check';

import { Button } from '../../components';
import { lightBlue, blue, white, black, darkOffWhite, lightGray, darkGray, gray } from '../../utils/colors';
import { saveFileToGoogleDrive } from '../../utils/google-drive';
import { getUnchainedNetworkFromBjslibNetwork } from '../../utils/transactions';
import { downloadFile } from '../../utils/files';


const CreateWallet = ({ config, accountName, setConfigFile, currentBitcoinNetwork }) => {
  const [createWalletStep, setCreateWalletStep] = useState(0);
  const [password, setPassword] = useState('');
  const [mnemonicWords, setMnemonicWords] = useState('');
  const history = useHistory();


  useEffect(() => {
    setMnemonicWords(generateMnemonic(256));
  }, []);

  const mnemonicWordsArray = mnemonicWords.split(" ");

  const exportSetupFiles = async () => {
    const contentType = "text/plain;charset=utf-8;";
    const configCopy = { ...config };
    configCopy.isEmpty = false;

    // taken from BlueWallet so you can import and use on mobile
    console.log('mnemonicWords: ', mnemonicWords);
    const seed = await mnemonicToSeed(mnemonicWords);
    const root = bip32.fromSeed(seed, currentBitcoinNetwork);
    const path = "m/84'/0'/0'";
    const child = root.derivePath(path).neutered();
    const xpubString = child.toBase58();
    const xprvString = root.derivePath(path).toBase58();

    const masterXprvString = root.toBase58();

    configCopy.wallets.push({
      id: uuidv4(),
      name: accountName,
      network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
      addressType: "P2WSH",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      xpub: xpubString,
      xprv: xprvString,
      masterXprv: masterXprvString,
      mnemonic: mnemonicWords,
      parentFingerprint: root.fingerprint
    });

    const encryptedConfigObject = AES.encrypt(JSON.stringify(configCopy), password).toString();

    const encryptedConfigFile = new Blob([decodeURIComponent(encodeURI(encryptedConfigObject))], { type: contentType });
    downloadFile(encryptedConfigFile, `lily_wallet_config-${moment().format()}.txt`);
    setConfigFile(configCopy);
    history.push('/');
  }

  return (
    <Wrapper>
      {createWalletStep === 0 ? (
        <Fragment>
          {/* <BoxedWrapper> */}
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <SetupHeader>Write down these recovery words</SetupHeader>
              <SetupExplainerText>
                These 24 words are the keys to your wallet.
                Write them down and keep them in a safe place.
                Do not share them with anyone else.
                These can be used to recover your wallet and send funds.
              </SetupExplainerText>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <WordContainer>
            <WordSection>
              {mnemonicWordsArray.slice(0, 6).map((word, index) => (
                <Word>
                  <WordIndex>({index + 1})</WordIndex>
                  {word}
                </Word>
              ))}
            </WordSection>
            <WordSection>
              {mnemonicWordsArray.slice(6, 12).map((word, index) => (
                <Word>
                  <WordIndex>({index + 7}) </WordIndex>
                  {word}
                </Word>
              ))}
            </WordSection>
            <WordSection>
              {mnemonicWordsArray.slice(12, 18).map((word, index) => (
                <Word>
                  <WordIndex>({index + 13})</WordIndex>
                  {word}
                </Word>
              ))}
            </WordSection>
            <WordSection>
              {mnemonicWordsArray.slice(18, 24).map((word, index) => (
                <Word>
                  <WordIndex>({index + 19})</WordIndex>
                  {word}
                </Word>
              ))}
            </WordSection>
          </WordContainer>
          <SaveWalletButton onClick={() => setCreateWalletStep(1)}>
            I have written these words down
        </SaveWalletButton>
        </Fragment>
      ) : (
          <Fragment>
            <PasswordWrapper>
              <PasswordText>Almost done, just set a password to encrypt your setup file:</PasswordText>
              <PasswordInput placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </PasswordWrapper>
            <SaveWalletContainer>
              <SaveWalletButton onClick={() => exportSetupFiles()}>
                Save Wallet
              </SaveWalletButton>
            </SaveWalletContainer>
          </Fragment>
        )}
    </Wrapper>
  );
}

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
  font-size: .8em;
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

const SaveWalletButtonContainer = styled.div`
  padding: 1.5em;
`;

const SaveWalletButton = styled.div`
  ${Button};
  flex: 1;
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
  background: ${white};
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

const SaveWalletContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
  background: ${lightBlue};
  justify-content: center;
  border-top: 1px solid ${darkOffWhite} !important;
  border: 1px solid ${gray};
`;

const WordSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Word = styled.div`
  padding: 1.25em;
  margin: .25em;
  background: ${white};
  border: 1px solid ${blue};
  border-radius: 4px;
  position: relative;
  text-align: center;
`;

const WordIndex = styled.span`
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: .5em;
  color: #869198;
`;

export default CreateWallet;