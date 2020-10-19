import React, { useState } from 'react';
import styled from 'styled-components';

import { DeviceSelect, Dropdown } from '../../components';
import { darkGray, white } from '../../utils/colors';

const SignWithDevice = ({
  psbt,
  signedPsbts,
  setSignedPsbts,
  signedDevices,
  setSignedDevices,
  signThreshold,
  fileUploadLabelRef,
  phoneAction
}) => {
  const [unsignedDevices, setUnsignedDevices] = useState([]);
  const [errorDevices, setErrorDevices] = useState([]);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);

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

  const dropdownItems = [
    {
      label: 'Add signature from file',
      onClick: () => {
        const txFileUploadButton = fileUploadLabelRef.current;
        txFileUploadButton.click()
      }
    }
  ]

  return (
    <TransactionDetailsWrapper>
      <SetupHeaderContainer>
        <SetupHeaderWrapper>
          <SetupHeaderLeft>
            <SetupHeader>Confirm on Devices</SetupHeader>
            <SetupSubheader>{signedDevices.length} of {signThreshold} devices confirmed</SetupSubheader>
          </SetupHeaderLeft>
          <SetupHeaderRight>
            <Dropdown
              isOpen={optionsDropdownOpen}
              setIsOpen={setOptionsDropdownOpen}
              minimal={true}
              dropdownItems={dropdownItems}
            />
          </SetupHeaderRight>
        </SetupHeaderWrapper>
      </SetupHeaderContainer>
      <DeviceSelect
        configuredDevices={signedDevices}
        unconfiguredDevices={unsignedDevices}
        deviceAction={signWithDevice}
        deviceActionText={'Click to Approve'}
        deviceActionLoadingText={'Approve on device'}
        setUnconfiguredDevices={setUnsignedDevices}
        errorDevices={errorDevices}
        configuredThreshold={signThreshold}
        phoneAction={phoneAction}
      />
    </TransactionDetailsWrapper>
  )
}

const TransactionDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  justify-content: space-between;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  border-radius: 0.375rem;
  background: ${white};
  height: 100%;
`;

const SetupHeaderContainer = styled.div`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-bottom: 1px solid rgb(229,231,235);
  height: 90px;
`;

const SetupHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SetupHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const SetupHeaderRight = styled.div``;

const SetupHeader = styled.span`
  font-size: 1.5em;
  display: inline-block;
  margin-bottom: 4px;
  font-weight: 100;
`;

const SetupSubheader = styled.span`
  font-size: 14px;
  color: ${darkGray};
`;

export default SignWithDevice;