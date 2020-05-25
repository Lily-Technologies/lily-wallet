import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import { ErrorOutline, CheckCircle } from '@styled-icons/material';
import { animated } from 'react-spring'

import { BACKEND_URL } from '../config';

import { Button, StyledIcon } from '../components';
import { lightGreen, gray, darkOffWhite, green, blue, white, darkGray, offWhite } from '../utils/colors';

export const DeviceSelectSetup = ({ style, configuredDevices, unconfiguredDevices, setUnconfiguredDevices, configuredThreshold, deviceAction }) => {
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
    <animated.div style={{ ...style, display: 'flex', flexDirection: 'column' }}>
      <DevicesWrapper>
        {configuredDevices.map((device, index) => (
          <DeviceWrapper key={index} imported={true}>
            <ImportedWrapper style={{ color: green, alignSelf: 'flex-end' }}>
              <StyledIcon as={CheckCircle} size={24} />
            </ImportedWrapper>
            <DeviceImage src={"https://coldcardwallet.com/static/images/coldcard-front.png"} />
            <DeviceName>{device.model}</DeviceName>
            <DeviceFingerprint imported={true}>{device.fingerprint}</DeviceFingerprint>
          </DeviceWrapper>
        ))}

        {unconfiguredDevices.map((device, index) => (
          <DeviceWrapper key={index} onClick={() => performDeviceAction(device, index)} loading={deviceActionLoading === index}>
            <DeviceImage loading={deviceActionLoading === index} src={"https://coldcardwallet.com/static/images/coldcard-front.png"} />
            <DeviceName>{device.model}</DeviceName>
            <DeviceFingerprint>{device.fingerprint}</DeviceFingerprint>
            <ImportedWrapper>
              {deviceActionLoading === index ? (
                <ConfiguringText style={{ textAlign: 'center' }}>
                  Extracting XPub
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                </ConfiguringText>
              ) : (
                  <ConfiguringText>
                    Click to Configure
                  </ConfiguringText>
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

      {configuredDevices.length < configuredThreshold && <ScanDevicesButton background={white} color={blue} onClick={enumerate}>{devicesLoading ? 'Loading...' : 'Scan for devices'}</ScanDevicesButton>}
    </animated.div>
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
  padding: 1.5em;
`;


const NoDevicesHeader = styled.h3`

`;


const NoDevicesSubheader = styled.h4`

`;

const ConfiguringText = styled.div`
  color: ${darkGray};
`;

const DevicesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  // min-height: 400px;
`;


const DeviceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: .75em;
  margin: 1.5em;
  margin-bottom: 0px;
  flex: 0 1 15.625em;
  border-radius: 4px;

  background: ${p => p.imported ? lightGreen : 'none'};
  border: ${p => p.imported ? `1px solid ${green}` : p.loading ? darkGray : 'none'};

  &:hover {
    cursor: pointer;
    background: ${p => p.imported ? lightGreen : p.loading ? 'none' : offWhite};
    border: 1px solid ${p => p.imported ? 'none' : p.loading ? 'none' : darkGray};
    padding: ${p => p.imported ? 'none' : p.loading ? 'none' : '11px'};
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
  color: ${p => p.imported ? darkGray : gray};
  margin: 0;
`;

const ImportedWrapper = styled.div`
  margin: 4px 0 0;
  // color: ${green};
`;

const ScanDevicesButton = styled.button`
  ${Button};
  padding: 1em;
  font-size: 1em;
  margin-top: 12px;
  width: fit-content;
  align-self: center;
  border: 1px solid ${blue};
  margin-bottom: 1.5em;
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