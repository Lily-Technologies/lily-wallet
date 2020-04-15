import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { Settings, Send } from '@styled-icons/material';
import { StyledIcon } from '../components';

import { Button } from '../components';
import { black, gray } from '../utils/colors';

const MainMenu = () => {
  document.title = `Coldcard Kitchen - Main Menu`;

  return (
    <Wrapper>
      <img src="https://coldcardwallet.com/static/images/coldcard-logo-nav@2x.png" />
      <KitchenText>Kitchen</KitchenText>
      <FormContainer>
        <SelectDeviceContainer>
          <DevicesWrapper>
            <Section>
              <StyledIcon as={Settings} size={96} style={{ alignSelf: 'center', margin: 24 }} />
                Connect your devices to create setup files for Caravan and Coldcard.
              <ButtonContainer>
                <ScanDevicesButton to="/setup">Create Wallet Files</ScanDevicesButton>
              </ButtonContainer>
            </Section>
            <Section>
              <StyledIcon as={Send} size={96} style={{ alignSelf: 'center', margin: 24 }} />
              Use data from Caravan to send a transaction from your device.
              <ButtonContainer>
                <ScanDevicesButton to="/send">Send Transaction</ScanDevicesButton>
              </ButtonContainer>
            </Section>
          </DevicesWrapper>
        </SelectDeviceContainer>
      </FormContainer>
    </Wrapper>
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

const KitchenText = styled.div`
  font-size: 36px;
  font-weight: 700;
  margin-top: -10px;
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
  padding: 0;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin: 18px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 250px;
  padding: 24px;
  justify-content: center;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const ScanDevicesButton = styled(Link)`
  ${Button};
  padding: 16px;
  font-size: 16px;
  margin-top: 12px;
  font-weight: 700;
  flex: 1;
`;

const DevicesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  min-height: 400px;
  flex-wrap: wrap;
`;

export default MainMenu;