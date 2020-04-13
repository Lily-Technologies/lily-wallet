import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

import { Button } from '../components';
import { black, gray, blue, darkBlue, offWhite } from '../utils/colors';

const Device = ({ device }) => {
  document.title = `Device Config: ${device.model} (${device.fingerprint})`;

  return (
    <Wrapper>
      <FormContainer>
        <SelectDeviceContainer>
          <SelectDeviceHeaderWrapper>
            <SelectAnotherDeviceHeader to="..">{'<'} Select a different device</SelectAnotherDeviceHeader>
            <SelectDeviceHeader>{device.model} <SelectDeviceFingerprintHeader>({device.fingerprint})</SelectDeviceFingerprintHeader></SelectDeviceHeader>
          </SelectDeviceHeaderWrapper>

          <DevicesWrapper>
            <Section>
              <ScanDevicesButton to="xpub">Get XPub</ScanDevicesButton>
            </Section>
            <Section>
              Ready to spend from the device? Use this to sign a PSBT and authorize spends from this wallet.
              <ScanDevicesButton to="sign">Sign PSBT</ScanDevicesButton>
            </Section>
          </DevicesWrapper>
        </SelectDeviceContainer>
      </FormContainer>
      <ViewSourceCodeText href="#">View Source Code</ViewSourceCodeText>
      <DontTrustVerify>Don't Trust. Verify.</DontTrustVerify>
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

const SelectDeviceHeaderWrapper = styled.div`
  color: ${blue};
  background: ${offWhite};
  height: 48px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-top: 12px solid ${blue};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid ${gray};
`;

const SelectDeviceHeader = styled.h1`
  font-size: 16px;
  font-weight: 500;
`;

const SelectDeviceFingerprintHeader = styled.span`
  font-size: 12px;
`;

const SelectAnotherDeviceHeader = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  &:visited {
    color: ${blue};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 250px;
  padding: 24px;
  justify-content: flex-end;
`;

const ScanDevicesButton = styled(Link)`
  ${Button};
  padding: 16px;
  font-size: 16px;
  margin-top: 12px;
  font-weight: 700;
`;

const ViewSourceCodeText = styled.a`
  color: ${black};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: -0.03em;
`;

const DontTrustVerify = styled.span`
  color: ${gray};
`;

const DevicesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  min-height: 400px;
`;

export default Device;