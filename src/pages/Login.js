import React from 'react';
import { Link, useLocation } from "react-router-dom";
import styled from 'styled-components';
import { GoogleDrive } from '@styled-icons/entypo-social';
import { Upload } from '@styled-icons/boxicons-regular';

import { StyledIcon } from '../components';

import { Button } from '../components';
import { black, darkGray } from '../utils/colors';

import { getGoogleAuthenticateUrl } from '../utils/google-drive';


const Login = () => {
  document.title = `Login - Coldcard Kitchen`;

  const getGoogleAuthenticateUrlAction = async () => {
    const url = await getGoogleAuthenticateUrl();
    window.location = url;
  }
  return (
    <Wrapper>
      <MainText>
        <CandyImage src={require('../assets/sugar.svg')} />
        Candyman
        </MainText>
      <Subtext>Candyman is a self-custody Bitcoin wallet that allows you to easily store, manage, and spend Bitcoin</Subtext>
      <FormContainer>
        <SelectDeviceContainer>
          <DevicesWrapper>
            <h1>Open config file</h1>
            <SignInButton
              onClick={() => { getGoogleAuthenticateUrlAction() }}>
              <StyledIcon as={GoogleDrive} size={24} style={{ marginRight: 12 }} /> Google Drive
              </SignInButton>
            <SignInButton
              background="transparent"
              color={darkGray}
              onClick={() => { getGoogleAuthenticateUrlAction() }}>
              <StyledIcon as={Upload} size={24} style={{ marginRight: 12 }} /> Local Config File
              </SignInButton>
          </DevicesWrapper>
        </SelectDeviceContainer>
      </FormContainer>
    </Wrapper >
  )
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  // margin-top: -1px;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding-top: 150px;
`;

const MainText = styled.div`
  display: flex;
  font-size: 48px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const Subtext = styled.div`
  font-size: 12px;
  color: ${darkGray};
  margin-bottom: 12px;
`;

const CandyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 12px;
`;

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SelectDeviceContainer = styled.div`
  max-width: 750px;
  background: #fff;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin: 18px;
`;

const SignInButton = styled(Link)`
  ${Button};
  padding: 16px;
  font-size: 16px;
  margin-top: 12px;
  font-weight: 700;
`;

const DevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 400px;
  flex-wrap: wrap;
`;

export default Login;