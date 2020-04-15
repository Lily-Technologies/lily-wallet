import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';

import { BACKEND_URL } from '../config';
import { Button } from '../components';
import { black, gray, blue, darkOffWhite, white } from '../utils/colors';

const Signup = ({ device, setDevice }) => {
  document.title = 'Select Device';
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const history = useHistory();

  useEffect(() => {
    enumerate();
  }, devices);

  const enumerate = async () => {
    setLoading(true);
    const { data } = await axios.get(`${BACKEND_URL}/enumerate`);
    setLoading(false);
    setDevices(data);
  }

  const onClickDevice = (device) => {
    setDevice(device);
    history.push('/device');
  }

  return (
    <Wrapper key={'ab123c'}>
      <FormContainer>
        <SelectDeviceContainer>
          <SelectDeviceHeader>Select a Device to Configure</SelectDeviceHeader>

          <DevicesWrapper>
            {devices.map((device, index) => (
              <DeviceWrapper key={index} onClick={() => onClickDevice(device)}>
                <DeviceImage src={"https://coldcardwallet.com/static/images/coldcard-front.png"} />
                <DeviceName>{device.model}</DeviceName>
                <DeviceFingerprint>{device.fingerprint}</DeviceFingerprint>
              </DeviceWrapper>
            ))}
          </DevicesWrapper>

          <ScanDevicesButton background={blue} color={white} onClick={enumerate}>{loading ? 'Loading...' : 'Scan for new devices'}</ScanDevicesButton>
        </SelectDeviceContainer>
      </FormContainer>
      <ViewSourceCodeText href="https://github.com/KayBeSee/cc-kitchen-frontend" target="_blank">View Source Code</ViewSourceCodeText>
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
  padding: 24px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin: 18px;
`;

const SelectDeviceHeader = styled.h1`
  text-align: center;
  color: ${blue};
`;

const ScanDevicesButton = styled.button`
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


const DeviceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  margin: 24px;
  flex: 0 0 250px;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background: ${darkOffWhite};
  }
`;

const DeviceImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-height: 250px;
  max-width: 148px;
`;

const DeviceName = styled.h4`
  text-transform: capitalize;
  margin-bottom: 2px;
`;

const DeviceFingerprint = styled.h5`
  color: ${gray};
  margin: 0;
`;

export default Signup;