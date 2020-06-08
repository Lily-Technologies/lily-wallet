import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { AES, enc } from 'crypto-js';
import { RestaurantMenu } from '@styled-icons/material';
import { StyledIcon, StyledIconSpinning } from '../components';

import { Button, VaultIcon } from '../components';
import { black, gray, darkOffWhite, lightGray, darkGray, blue, lightBlue, white } from '../utils/colors';

import { getConfigFileFromGoogleDrive, saveFileToGoogleDrive } from '../utils/google-drive';


const GDriveImport = ({ encryptedConfig, setConfigFile, bitcoinQuote }) => {
  document.title = `GDriveImport - Lily Wallet`;
  const [loading, setLoading] = useState(false);
  const [loadingGDrive, setLoadingGDrive] = useState(false);
  const [password, setPassword] = useState('');
  const [encryptedConfigFile, setEncryptedConfigFile] = useState(null);
  const [showCurtain, setShowCurtain] = useState(false);
  const [startCurtain, setStartCurtain] = useState(false);
  const [enterSidebar, setEnterSidebar] = useState(false);

  const history = useHistory();

  console.log('bitcoinQuote: ', bitcoinQuote);

  console.log('enterSidebar...: ', enterSidebar);

  console.log('loading...: ', loading);

  useEffect(() => {
    const onload = async () => {
      if (!encryptedConfig) {
        setLoadingGDrive(true);
        // await saveFileToGoogleDrive({ "name": "Coldcard Kitchen", "addressType": "P2WSH", "network": "testnet", "client": { "type": "public" }, "quorum": { "requiredSigners": 2, "totalSigners": 3 }, "extendedPublicKeys": [{ "name": "34ecf56b", "bip32Path": "m/0", "xpub": "tpubDECB21DPAjBvUtqSCGWHJrbh6nSg9JojqmoMBuS5jGKTFvYJb784Pu5hwq8vSpH6vkk3dZmjA3yR7mGbrs3antkL6BHVHAyjPeeJyAiVARA", "method": "xpub" }, { "name": "9130c3d6", "bip32Path": "m/0", "xpub": "tpubDDv6Az73JkvvPQPFdytkRrizpdxWtHTE6gHywCRqPu3nz2YdHDG5AnbzkJWJhtYwEJDR3eENpQQZyUxtFFRRC2K1PEGdwGZJYuji8QcaX4Z", "method": "xpub" }, { "name": "4f60d1c9", "bip32Path": "m/0", "xpub": "tpubDFR1fvmcdWbMMDn6ttHPgHi2Jt92UkcBmzZ8MX6QuoupcDhY7qoKsjSG2MFvN66r2zQbZrdjfS6XtTv8BjED11hUMq3kW2rc3CLTjBZWWFb", "method": "xpub" }] });
        const encryptedConfigFile = await getConfigFileFromGoogleDrive();
        if (encryptedConfigFile) {
          setLoadingGDrive(false);
          setEncryptedConfigFile(encryptedConfigFile)
        } else {
          history.replace('/setup');
        }
      } else {
        setEncryptedConfigFile(encryptedConfig);
      }
    }
    onload();
  }, []);

  const unlockFile = () => {
    // KBC-TODO: probably need error handling for wrong password
    var bytes = AES.decrypt(encryptedConfigFile, password);
    var decryptedData = JSON.parse(bytes.toString(enc.Utf8));
    console.log('decryptedData: ', decryptedData);
    setConfigFile(decryptedData);
    history.replace(`/`);
  }

  const Screen = () => {
    return (
      <Wrapper>
        <MainText>
          <LilyImage src={require('../assets/flower.svg')} />
          Lily Wallet
          </MainText>
        <Subtext>Lily is a self-custody Bitcoin wallet that allows you to easily store, manage, and spend Bitcoin</Subtext>
        <FormContainer>
          <SelectDeviceContainer>
            <DevicesWrapper>
              <VaultIcon loading={loading} />
              <TypeInPasswordText>Type in password to unlock wallet</TypeInPasswordText>
              <PasswordInput disabled type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <UnlockButton>
                Unlock Wallet
                </UnlockButton>
            </DevicesWrapper>
          </SelectDeviceContainer>
        </FormContainer>
      </Wrapper>
    )
  }

  if (!showCurtain) {
    return (
      <Wrapper>
        <MainText>
          <LilyImage src={require('../assets/flower.svg')} />
          Lily Wallet
          </MainText>
        <Subtext>Lily is a self-custody Bitcoin wallet that allows you to easily store, manage, and spend Bitcoin</Subtext>
        <FormContainer>
          <SelectDeviceContainer>

            <DevicesWrapper>
              <VaultIcon loading={loading} />

              <TypeInPasswordText>Type in password to unlock wallet</TypeInPasswordText>
              <PasswordInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <UnlockButton
                loading={loadingGDrive}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setShowCurtain(true), 500);
                  setTimeout(() => setStartCurtain(true), 550);
                  // setTimeout(() => setEnterSidebar(true), 5000);
                  setTimeout(unlockFile, 2000);
                  // unlockFile();
                }}>
                Unlock Wallet
                </UnlockButton>
            </DevicesWrapper>
          </SelectDeviceContainer>
        </FormContainer>
      </Wrapper>
    )
  } else {
    return (
      <CurtainContainer>
        <CurtainLeft startCurtain={startCurtain}>
          <CurtainLeftInner>
            <Screen />
          </CurtainLeftInner>

        </CurtainLeft>
        <CurtainBehind enterSidebar={enterSidebar}>
          <ChartPlaceholder>
            <QuoteText>{bitcoinQuote.body}</QuoteText>

            <AuthorName>{bitcoinQuote.author.name}</AuthorName>
          </ChartPlaceholder>

          <div>Decrypting Wallet Config...</div>
        </CurtainBehind>
        <CurtainRight startCurtain={startCurtain}>
          <CurtainRightInner>
            <Screen />
          </CurtainRightInner>
        </CurtainRight>
      </CurtainContainer>
    )
  }
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding-top: 5em;
  background: ${lightBlue};
`;

const MainText = styled.div`
  display: flex;
  font-size: 2em;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const Subtext = styled.div`
  font-size: .5em;
  color: ${darkGray};
  margin-bottom: 12px;
`;

const LilyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 12px;
`;

const TypeInPasswordText = styled.h3`
  font-size: 1.125em;
  margin-bottom: 0;
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
  font-family: 'Montserrat', sans-serif;

  ::placeholder {
    color: ${gray};
  }

  :active, :focused {
    outline: 0;
    border: none;
  }
`;

const UnlockButton = styled.div`
  ${Button};
  margin-bottom: 16px;
  opacity: ${p => p.loading ? '0.5' : '1'};
  pointer-events: ${p => p.loading ? '0.5' : '1'};
`;

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SelectDeviceContainer = styled.div`
  max-width: 750px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-radius: 4px;
  margin: 18px;
`;

const DevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-wrap: wrap;
  background: ${white};
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-radius: 4px;
  border: 1px solid ${darkGray};
`;

const CurtainContainer = styled.div`
  display: flex;
  background: ${lightBlue};
  width: 100%;
`;

const CurtainLeft = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  flex: 1 0 50%;
  overflow: hidden;
  height: 92vh;
  
  transform: ${p => p.startCurtain ? 'translateX(-100%)' : 'translateX(0)'};
  transition: all 1s ease-out;
  z-index: 1;
`;

const CurtainLeftInner = styled.div`
  position: absolute;
  width: 100%;
  right: -25vw;
`;

const CurtainRightInner = styled.div`
  position: absolute;
  width: 100%;
  left: -25vw;
`;

const CurtainRight = styled.div`
  position: relative;
  display: flex;
  flex: 1 0 50%;
  transform: translateX(0);
  overflow: hidden;
  height: 92vh;
  transform: ${p => p.startCurtain ? 'translateX(100%)' : 'translateX(0)'};
  transition: all 1s ease-out;
  z-index: 1;
`;

const CurtainBehind = styled.div`
  display: ${p => p.enterSidebar ? 'auto' : 'none'};
  align-self: flex-start;
  flex: 1;
  position: absolute;
  width: 100%;
  display: flex;
  z-index: 0;
  justify-content: center;
  align-self: center;
  flex-direction: column;
  align-items: center;
`;

const QuoteText = styled.div`
  font-size: 1.25em;
`;


const AuthorName = styled.div`
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
`;

const SidebarWrapper = styled.div`
  transform: ${p => p.enterSidebar ? 'translateX(100%)' : 'translateX(0)'};
  transition: all 1s ease-out;
`;

const ChartPlaceholder = styled.div`
  background: ${white};
  padding: 1.5em;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin-top: .5em;
  border-top: solid 11px ${blue};
  margin: 64px;
  flex: 1;
  max-width: 46.875em;
`;

export default GDriveImport;