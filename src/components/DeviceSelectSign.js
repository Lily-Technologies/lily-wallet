import React, { useState, useEffect, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { ErrorOutline, CheckCircle } from '@styled-icons/material';

import { Button, StyledIcon } from '../components';
import { lightGreen, gray, darkOffWhite, green, blue, white } from '../utils/colors';

export const DeviceSelectSign = ({ configuredDevices, unconfiguredDevices, setUnconfiguredDevices, configuredThreshold, deviceAction }) => {
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [deviceActionLoading, setDeviceActionLoading] = useState(null);

  useEffect(() => {
    enumerate();
  }, []); // eslint-disable-line

  const enumerate = async () => {
    setDevicesLoading(true);
    const response = await window.ipcRenderer.invoke('/enumerate');
    setDevicesLoading(false);

    // filter out devices that are available but already imported
    const filteredDevices = response.filter((device) => { // eslint-disable-line
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
          <DeviceWrapper key={index} imported={true} displayLoadingCursor={deviceActionLoading !== null}>
            <ImportedWrapper style={{ color: green, alignSelf: 'flex-end' }}>
              <StyledIcon as={CheckCircle} size={24} />
            </ImportedWrapper>
            <DeviceImage src={device.type === 'coldcard' ? require('../assets/coldcard.png') : require('../assets/trezor.png')} />
            <DeviceName>{device.type}</DeviceName>
            <DeviceFingerprint>{device.fingerprint}</DeviceFingerprint>
            <DeviceMoreDetails>More Details</DeviceMoreDetails>
          </DeviceWrapper>
        ))}

        {unconfiguredDevices.map((device, index) => (
          <DeviceWrapper
            key={index}
            onClick={() => performDeviceAction(device, index)}
            loading={deviceActionLoading === index}
            displayLoadingCursor={deviceActionLoading !== null}
          >
            <DeviceImage loading={deviceActionLoading === index} src={device.type === 'coldcard' ? require('../assets/coldcard.png') : require('../assets/trezor.png')} />
            <DeviceName>{device.model}</DeviceName>
            <DeviceFingerprint>{device.fingerprint}</DeviceFingerprint>
            <ImportedWrapper>
              {deviceActionLoading === index ? (
                <div style={{ textAlign: 'center', color: gray }}>
                  Waiting for device
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                  <ConfiguringAnimation>.</ConfiguringAnimation>
                </div>
              ) : (
                  <div style={{ textAlign: 'center' }}>
                    Click to Approve Transaction
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

      {configuredDevices.length < configuredThreshold && <ScanDevicesButton background={white} color={blue} onClick={enumerate}>{devicesLoading ? 'Loading...' : 'Scan for devices'}</ScanDevicesButton>}
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
  padding: 1.5em;
`;


const NoDevicesHeader = styled.h3`

`;


const NoDevicesSubheader = styled.h4`
  text-align: center;
`;

const DeviceMoreDetails = styled.div`
  display: none;
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
  padding: .75em;
  margin: 24px;
  flex: 0 1 250px;
  border-radius: 4px;

  background: ${p => p.imported ? lightGreen : 'none'};
  border: ${p => p.imported ? `1px solid ${green}` : 'none'};

  &:hover {
    cursor: ${p => p.displayLoadingCursor ? 'wait' : 'pointer'};
    // background: ${p => p.imported ? '#C9FFB6' : p.loading ? 'none' : darkOffWhite};
  }

  // &:hover ${DeviceMoreDetails} {
  //   display: block;
  // }
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
  font-weight: 500;
`;

const DeviceFingerprint = styled.h5`
  color: ${gray};
  margin: 0;
  font-weight: 100;
`;

const ImportedWrapper = styled.div`
  margin: 4px 0 0;
`;

const ScanDevicesButton = styled.button`
  ${Button};
  padding: 1em;
  font-size: 1em;
  margin-top: 12px;
  width: fit-content;
  border-radius: 24px;
  align-self: center;
  border: 1px solid ${blue};
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