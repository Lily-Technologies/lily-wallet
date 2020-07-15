import React, { useState } from 'react';
import styled from 'styled-components';

import { DeviceSelect } from '../../components';
import { darkGray } from '../../utils/colors';

const SignWithDevice = ({
  psbt,
  signedPsbts,
  setSignedPsbts
}) => {
  const [signedDevices, setSignedDevices] = useState([]);
  const [unsignedDevices, setUnsignedDevices] = useState([]);
  const [errorDevices, setErrorDevices] = useState([]);

  const signWithDevice = async (device, index) => {
    try {
      const response = await window.ipcRenderer.invoke('/sign', {
        deviceType: device.type,
        devicePath: device.path,
        psbt: psbt.toBase64()
      });

      setSignedPsbts([...signedPsbts, response.psbt]);
      setSignedDevices([...signedDevices, device]);
      if (errorDevices.includes(device.fingerprint)) {
        const errorDevicesCopy = [...errorDevices];
        errorDevicesCopy.splice(errorDevices.indexOf(device.fingerprint), 1);
        setErrorDevices(errorDevicesCopy);
      }
      unsignedDevices.splice(index, 1);
      setUnsignedDevices([...unsignedDevices]);
    } catch (e) {
      const errorDevicesCopy = [...errorDevices];
      errorDevicesCopy.push(device.fingerprint);
      setErrorDevices([...errorDevicesCopy])
    }
  }

  return (
    <TransactionDetailsWrapper>
      <SetupHeaderContainer>
        <SetupHeaderWrapper>
          <SetupHeader>Confirm on Devices</SetupHeader>
          <SetupSubheader>{signedDevices.length} of 2 devices confirmed</SetupSubheader>
        </SetupHeaderWrapper>
        <SetupExplainerText>
          Click on a device to confirm the transaction. If you don't see your device, click "Scan for New Devices".
              </SetupExplainerText>
      </SetupHeaderContainer>
      <DeviceSelect
        configuredDevices={signedDevices}
        unconfiguredDevices={unsignedDevices}
        deviceAction={signWithDevice}
        deviceActionText={'Click to Approve'}
        deviceActionLoadingText={'Approve on device'}
        setUnconfiguredDevices={setUnsignedDevices}
        errorDevices={errorDevices}
        configuredThreshold={2}
      />
    </TransactionDetailsWrapper>
  )
}

const TransactionDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  justify-content: space-between;
`;

const SetupHeaderContainer = styled.div`
`;

const SetupHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SetupHeader = styled.h3`
  font-size: 1.5em;
  display: inline-block;
  margin: 4px 0;
`;

const SetupSubheader = styled.span`
  font-size: 18px;
  color: ${darkGray};
`;

const SetupExplainerText = styled.div`
  color: ${darkGray};
  font-size: .75em;
  margin: 12px 0;
`;

export default SignWithDevice;