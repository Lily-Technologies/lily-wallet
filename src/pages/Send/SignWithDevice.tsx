import React, { useState } from "react";
import styled from "styled-components";
import { Psbt } from "bitcoinjs-lib";

import { DeviceSelect, Dropdown } from "../../components";
import { gray800, white } from "../../utils/colors";

import { Device, HwiResponseEnumerate } from "../../types";

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
  phoneAction,
}: Props) => {
  const [unsignedDevices, setUnsignedDevices] = useState<
    HwiResponseEnumerate[]
  >([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]); // stores fingerprint of error devices

  // KBC-TODO: add a test
  const signWithDevice = async (
    device: HwiResponseEnumerate,
    index: number
  ) => {
    try {
      const response = await window.ipcRenderer.invoke("/sign", {
        deviceType: device.type,
        devicePath: device.path,
        psbt: finalPsbt.toBase64(),
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
      label: "Add signature from file",
      onClick: () => {
        const txFileUploadButton = fileUploadLabelRef.current;
        if (txFileUploadButton !== null) {
          txFileUploadButton.click();
        }
      },
    },
  ];

  return (
    <TransactionDetailsWrapper>
      <SetupHeaderContainer>
        <SetupHeaderWrapper>
          <SetupHeaderLeft>
            <SetupHeader>Confirm on Devices</SetupHeader>
            <SetupSubheader>
              {signedDevices.length} of {signThreshold} devices confirmed
            </SetupSubheader>
          </SetupHeaderLeft>
          <SetupHeaderRight>
            <Dropdown minimal={true} dropdownItems={dropdownItems} />
          </SetupHeaderRight>
        </SetupHeaderWrapper>
      </SetupHeaderContainer>
      <DeviceSelect
        configuredDevices={signedDevices}
        unconfiguredDevices={unsignedDevices}
        deviceAction={signWithDevice}
        deviceActionText={"Click to Approve"}
        deviceActionLoadingText={"Approve on device"}
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
  background: ${white};
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const SetupHeaderContainer = styled.div`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-bottom: 1px solid rgb(229, 231, 235);
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
`;

const SetupSubheader = styled.span`
  font-size: 14px;
  color: ${gray800};
`;

export default SignWithDevice;
