import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import { AddCircleOutline } from '@styled-icons/material';
import { Upload } from '@styled-icons/boxicons-regular';
import { networks } from 'bitcoinjs-lib';

import GDriveImport from '../GDriveImport';

import { StyledIcon, FileUploader, Button, Modal, Input, Spinner } from '../../components';

import { GridArea } from '../../components/layout';

import { black, darkGray, white, blue, gray, offWhite, gray900 } from '../../utils/colors';
import { bitcoinNetworkEqual } from '../../utils/transactions';

const Login = ({ setConfigFile, currentBitcoinNetwork }) => {
  const [encryptedConfigFile, setEncryptedConfigFile] = useState(null);

  const history = useHistory();

  document.title = `Login - Lily Wallet`;

  if (encryptedConfigFile) {
    return (
      <GDriveImport encryptedConfig={encryptedConfigFile} setConfigFile={setConfigFile} />
    )
  }

  return (
    <Wrapper>
      <MainText>
        {bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) ?
          <LilyImageGray src={require('../../assets/flower.svg')} /> :
          <LilyImage src={require('../../assets/flower.svg')} />
        }
        <TextContainer>
          <div>Lily Wallet</div>
          <Subtext>Load or create new account
          {bitcoinNetworkEqual(currentBitcoinNetwork, networks.testnet) &&
              ' (testnet)'
            }
          </Subtext>
        </TextContainer>
      </MainText>

      <FileUploader
        accept="*"
        id="localConfigFile"
        onFileLoad={(file) => {
          setEncryptedConfigFile(file)
        }}
      />

      <SignupOptionMenu>
        <LabelOverlay htmlFor="localConfigFile">
          <SignupOptionItem
            background={white}
            color={gray900}
            style={{ borderTop: `8px solid ${blue}` }}>
            <StyledIcon as={Upload} size={48} style={{ marginBottom: '0.5em' }} />
            <SignupOptionMainText>Load Wallet</SignupOptionMainText>
            <SignupOptionSubtext>Load an existing configuration from a file on your local machine</SignupOptionSubtext>
          </SignupOptionItem>
        </LabelOverlay>

        <SignupOptionItem
          background={white}
          color={gray900}
          onClick={() => history.push('setup')}>
          <StyledIcon as={AddCircleOutline} size={48} style={{ marginBottom: '0.5em' }} />
          <SignupOptionMainText>New Account</SignupOptionMainText>
          <SignupOptionSubtext>Create a new vault or wallet to send and receive Bitcoin</SignupOptionSubtext>
        </SignupOptionItem>
      </SignupOptionMenu>
    </Wrapper >
  )
}

const Wrapper = styled.div`
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 48px;
  padding: 1em;
  justify-content: center;
  position: relative;
`;

const MainText = styled.div`
  display: flex;
  font-size: 3em;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: center;
  margin-top: .5em;
  margin-left: 0.25em;
`;

const Subtext = styled.div`
  font-size: .5em;
  color: ${darkGray};
  margin-bottom: 12px;
`;

const LilyImage = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 12px;
`;

const LilyImageGray = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 12px;
  filter: grayscale(100%);
`;

const LabelOverlay = styled.label`
  width: 100%;
`;

const SignupOptionMenu = styled(GridArea)`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  max-width: 46.875em;
  width: 100%;
  padding-top: 3.75em;
`;

const SignupOptionMainText = styled.div`
  font-size: 1em;
`;

const SignupOptionSubtext = styled.div`
  font-size: .5em;
  margin-top: 0.5em;
  color: ${darkGray};
  padding: 0 5em;
  line-height: 1.5em;
  white-space: normal;
`;

const SignupOptionItem = styled.div`
  ${Button}
  border: 1px solid ${gray};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  border-radius: 4px;
  min-height: 200px;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  min-height: 12em;
`;

export default Login;