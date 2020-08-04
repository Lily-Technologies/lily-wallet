import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import { AddCircleOutline } from '@styled-icons/material';
import { Upload } from '@styled-icons/boxicons-regular';

import GDriveImport from './GDriveImport';

import { StyledIcon, FileUploader } from '../components';

import { GridArea } from '../components/layout';

import { black, darkGray, white, blue, gray, offWhite } from '../utils/colors';

const Login = ({ setConfigFile }) => {
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
        <LilyImage src={require('../assets/flower.svg')} />
        Lily Wallet
        </MainText>
      <Subtext>Lily is the easiest way to securely store and manage your Bitcoin</Subtext>

      <FileUploader
        accept="*"
        id="localConfigFile"
        onFileLoad={(file) => {
          setEncryptedConfigFile(file)
        }}
      />

      <SignupOptionMenu>
        <LabelOverlay htmlFor="localConfigFile">
          <SignupOptionItem style={{ borderTop: `8px solid ${blue}` }}>
            <StyledIcon as={Upload} size={48} style={{ marginBottom: '0.5em' }} />
            <SignupOptionMainText>Load Wallet</SignupOptionMainText>
            <SignupOptionSubtext>Load an existing wallet configuration from a file on your local machine</SignupOptionSubtext>
          </SignupOptionItem>
        </LabelOverlay>

        <SignupOptionItem onClick={() => history.push('setup')}>
          <StyledIcon as={AddCircleOutline} size={48} style={{ marginBottom: '0.5em' }} />
          <SignupOptionMainText>New Account</SignupOptionMainText>
          <SignupOptionSubtext>Create a new vault or wallet to send and receive Bitcoin</SignupOptionSubtext>
        </SignupOptionItem>
      </SignupOptionMenu>
    </Wrapper>
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
`;

const MainText = styled.div`
  display: flex;
  font-size: 3em;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const Subtext = styled.div`
  font-size: .75em;
  color: ${darkGray};
  margin-bottom: 12px;
`;

const LilyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 12px;
`;


const LabelOverlay = styled.label`
  width: 100%;
`;

const SignupOptionMenu = styled(GridArea)`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  max-width: 46.875em;
  width: 100%;
  padding-top: 3.75em;
  align-items: flex-end;
`;

const SignupOptionMainText = styled.div`
  font-size: 1em;
`;

const SignupOptionSubtext = styled.div`
  font-size: .5em;
  margin-top: 0.5em;
  color: ${darkGray};
  padding: 0 5em;
`;

const SignupOptionItem = styled.div`
  background: ${white};
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

  &:hover {
    background: ${offWhite};
    cursor: pointer;
  }
`;

export default Login;