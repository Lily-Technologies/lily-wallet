import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import { ErrorOutline, CheckCircle } from '@styled-icons/material';

import { BACKEND_URL } from '../config';

import { Button, StyledIcon } from '../components';
import { lightGreen, gray, darkOffWhite, green, blue, white } from '../utils/colors';

export const DeviceSelect = ({ configuredDevices, unconfiguredDevices, setUnconfiguredDevices, configuredThreshold, deviceAction }) => {
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [deviceActionLoading, setDeviceActionLoading] = useState(false);

  useEffect(() => {
    enumerate();
  }, []);

  const enumerate = async () => {
    setDevicesLoading(true);
    const { data } = await axios.get(`${BACKEND_URL}/enumerate`);
    setDevicesLoading(false);

    // filter out devices that are available but already imported
    const filteredDevices = data.filter((device) => {
      let deviceAlreadyConfigured = false;
      for (let i = 0; i < configuredDevices.length; i++) {
        if (configuredDevices[i].fingerprint === device.fingerprint) {
          deviceAlreadyConfigured = true;
        }
      }
      if (!deviceAlreadyConfigured) {
        return device
      }
    });
    setUnconfiguredDevices(filteredDevices);
  }

  const performDeviceAction = async (device, index) => {
    setDeviceActionLoading(index)
    await deviceAction(device, index);
    setDeviceActionLoading(null);
  }

  return (
    <Fragment >
      <DevicesWrapper>
        {configuredDevices.map((device, index) => (
          <DeviceWrapper key={index} imported={true}>
            <DeviceImage src={"https://coldcardwallet.com/static/images/coldcard-front.png"} />
            <DeviceName>{device.model}</DeviceName>
            <DeviceFingerprint>{device.fingerprint}</DeviceFingerprint>
            <ImportedWrapper>
              <StyledIcon as={CheckCircle} size={24} />
            </ImportedWrapper>
          </DeviceWrapper>
        ))}

        {unconfiguredDevices.map((device, index) => (
          <DeviceWrapper key={index} onClick={() => performDeviceAction(device, index)}>
            <DeviceImage loading={deviceActionLoading === index} src={"https://coldcardwallet.com/static/images/coldcard-front.png"} />
            <DeviceName>{device.model}</DeviceName>
            <DeviceFingerprint>{device.fingerprint}</DeviceFingerprint>
            <ImportedWrapper>
              {deviceActionLoading === index ? (
                <div>
                  Confirm payment on device
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                </div>
              ) : (
                  <div>
                    Click to Configure
                  </div>
                )}
            </ImportedWrapper>
          </DeviceWrapper>
        ))}

        {unconfiguredDevices.length === 0 && configuredDevices.length === 0 && (
          <NoDevicesContainer>
            <NoDevicesWrapper>
              <NoDevicesHeader>No devices detected</NoDevicesHeader>
              <StyledIcon as={ErrorOutline} size={96} />
              <NoDevicesSubheader>Please make sure your device is connected and unlocked.</NoDevicesSubheader>
            </NoDevicesWrapper>
          </NoDevicesContainer>
        )}
      </DevicesWrapper>

      {configuredDevices.length < configuredThreshold && <ScanDevicesButton background={blue} color={white} onClick={enumerate}>{devicesLoading ? 'Loading...' : 'Scan for another device'}</ScanDevicesButton>}
    </Fragment >
  )
}

const NoDevicesContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NoDevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
`;


const NoDevicesHeader = styled.h3`

`;


const NoDevicesSubheader = styled.h4`

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
  flex: 0 1 250px;
  border-radius: 4px;

  background: ${p => p.imported ? lightGreen : 'none'};
  border: ${p => p.imported ? `1px solid ${green}` : 'none'};

  &:hover {
  cursor: pointer;
  background: ${p => p.imported ? '#C9FFB6' : darkOffWhite};
}
`;

const DeviceImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-height: 250px;
  max-width: 148px;

  animation-name: ${p => p.loading ? blinking : 'none'};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
`;

const DeviceName = styled.h4`
  text-transform: capitalize;
  margin-bottom: 2px;
`;

const DeviceFingerprint = styled.h5`
  color: ${gray};
  margin: 0;
`;

const ImportedWrapper = styled.div`
  margin: 4px 0 0;
  color: ${green};
`;

const ScanDevicesButton = styled.button`
  ${Button};
  padding: 16px;
  font-size: 16px;
  margin-top: 12px;
  font-weight: 700;
  width: fit-content;
  border-radius: 24px;
  align-self: center;
`;

const blinking = keyframes`
  0% { opacity: .2; }
  50% { opacity: 1; }
  100% { opacity: .2; }
`;

const ConfiguringAnimation = styled.span`
  animation-name: ${blinking};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;

  // &:nth-child(2) {
  //   animation-delay: .2s;
  // }

  // &:nth-child(3) {
  //   animation-delay: .4s;
  // }
`;