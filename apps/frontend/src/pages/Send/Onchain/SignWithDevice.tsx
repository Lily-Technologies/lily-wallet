import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Psbt } from 'bitcoinjs-lib';

import { DeviceSelect, Dropdown } from 'src/components';

import { Device, HwiEnumerateResponse } from '@lily/types';

import { PlatformContext } from 'src/context';

interface Props {
  finalPsbt: Psbt;
  setFinalPsbt: React.Dispatch<React.SetStateAction<Psbt>>;
  signedDevices: Device[];
  signThreshold: number;
  fileUploadLabelRef: React.RefObject<HTMLLabelElement>;
  phoneAction?: () => void;
}

const SignWithDevice = ({
  finalPsbt,
  setFinalPsbt,
  signedDevices,
  signThreshold,
  fileUploadLabelRef,
  phoneAction
}: Props) => {
  const [unsignedDevices, setUnsignedDevices] = useState<HwiEnumerateResponse[]>([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]); // stores fingerprint of error devices
  const { platform } = useContext(PlatformContext);

  // KBC-TODO: add a test
  const signWithDevice = async (device: HwiEnumerateResponse, index: number) => {
    try {
      const response = await platform.signTransaction({
        deviceType: device.type,
        devicePath: device.path,
        psbt: finalPsbt.toBase64()
      });

      setFinalPsbt(Psbt.fromBase64(response.psbt));
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
      setErrorDevices([...errorDevicesCopy]);
    }
  };

  const dropdownItems = [
    {
      label: 'Add signature from file',
      onClick: () => {
        const txFileUploadButton = fileUploadLabelRef.current;
        if (txFileUploadButton !== null) {
          txFileUploadButton.click();
        }
      }
    }
  ];

  return (
    <TransactionDetailsWrapper className='col-span-12 lg:col-span-6 bg-white dark:bg-slate-800'>
      <SetupHeaderContainer className='border-b border-b-slate-200 dark:border-slate-700'>
        <SetupHeaderWrapper>
          <SetupHeaderLeft>
            <span className='text-xl text-slate-900 dark:text-slate-100 font-medium'>
              Confirm on devices
            </span>
            <span className='text-sm text-slate-800 dark:text-slate-300 font-normal'>
              {signedDevices.length} of {signThreshold} devices confirmed
            </span>
          </SetupHeaderLeft>
          <SetupHeaderRight>
            <div className='flex justify-end text-slate-900 dark:text-slate-200'>
              <Dropdown minimal={true} dropdownItems={dropdownItems} />
            </div>
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
  );
};

const TransactionDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  justify-content: space-between;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 0.375rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const SetupHeaderContainer = styled.div`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
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

export default SignWithDevice;
