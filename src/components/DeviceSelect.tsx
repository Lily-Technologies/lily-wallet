import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { CheckCircle } from "@styled-icons/material";
import { ExclamationDiamond } from "@styled-icons/bootstrap";

import { Button, StyledIcon, PromptPinModal } from "../components";
import {
  lightGreen,
  gray,
  green,
  green800,
  white,
  darkGray,
  red,
  lightRed,
  yellow,
  lightYellow,
  gray600,
  gray900,
} from "../utils/colors";

import { Device, HwiResponseEnumerate } from "../types";

interface Props {
  configuredDevices: Device[];
  unconfiguredDevices: HwiResponseEnumerate[];
  errorDevices: string[]; // fingerprints of error devices
  setUnconfiguredDevices: React.Dispatch<
    React.SetStateAction<HwiResponseEnumerate[]>
  >;
  configuredThreshold: number;
  deviceAction: (device: HwiResponseEnumerate, index: number) => void;
  deviceActionText: string;
  deviceActionLoadingText: string;
  phoneAction?: () => void;
}

export const DeviceSelect = ({
  configuredDevices,
  unconfiguredDevices,
  errorDevices,
  setUnconfiguredDevices,
  configuredThreshold,
  deviceAction,
  deviceActionText,
  deviceActionLoadingText,
  phoneAction,
}: Props) => {
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [deviceActionLoading, setDeviceActionLoading] = useState<number | null>(
    null
  );
  const [
    promptPinModalDevice,
    setPromptPinModalDevice,
  ] = useState<HwiResponseEnumerate | null>(null);

  useEffect(() => {
    enumerate();
  }, []); // eslint-disable-line

  const enumerate = async () => {
    setDevicesLoading(true);
    // what?
    try {
      const response: HwiResponseEnumerate[] = await window.ipcRenderer.invoke(
        "/enumerate"
      );
      setDevicesLoading(false);

      if (phoneAction) {
        response.push({
          type: "cobo",
          fingerprint: "unknown",
          xpub: "unknown",
          model: "unknown",
          path: "unknown",
        });
      }

      // filter out devices that are available but already imported
      const filteredDevices = response.filter((device) => {
        // eslint-disable-line
        let deviceAlreadyConfigured = false;
        for (let i = 0; i < configuredDevices.length; i++) {
          if (configuredDevices[i].fingerprint === device.fingerprint) {
            deviceAlreadyConfigured = true;
          } else if (
            device.type === "phone" &&
            configuredDevices[i].type === "phone"
          ) {
            // there can only be one phone in a config
            deviceAlreadyConfigured = true;
          }
        }
        if (!deviceAlreadyConfigured) {
          return device;
        }
        return null;
      });
      setUnconfiguredDevices(filteredDevices);
    } catch (e) {
      console.log("e: ", e);
      setDevicesLoading(false);
    }
  };

  const performDeviceAction = async (
    device: HwiResponseEnumerate,
    index: number
  ) => {
    setDeviceActionLoading(index);
    await deviceAction(device, index);
    setDeviceActionLoading(null);
  };

  return (
    <Wrapper>
      <PromptPinModal
        promptPinModalIsOpen={!!promptPinModalDevice}
        setPromptPinModalDevice={setPromptPinModalDevice}
        device={promptPinModalDevice!}
        enumerate={enumerate}
      />
      <DevicesWrapper>
        <DeviceContainer>
          {configuredDevices.map((device, index) => (
            <DeviceWrapper
              key={index}
              imported={true}
              displayLoadingCursor={deviceActionLoading !== null}
            >
              <IconWrapper style={{ color: green }}>
                <StyledIcon as={CheckCircle} size={24} />
              </IconWrapper>
              <DeviceImage
                src={
                  device.type === "coldcard"
                    ? require("../assets/coldcard.png")
                    : device.type === "ledger"
                    ? require("../assets/ledger.png")
                    : device.type === "trezor"
                    ? require("../assets/trezor.png")
                    : device.type === "cobo"
                    ? require("../assets/cobo.png")
                    : require("../assets/iphone.png")
                }
              />
              <DeviceInfoWrapper>
                <DeviceName>{device.type}</DeviceName>
                <DeviceFingerprint imported={true}>
                  {device.fingerprint}
                </DeviceFingerprint>
              </DeviceInfoWrapper>
            </DeviceWrapper>
          ))}

          {unconfiguredDevices.map((device, index) => {
            const deviceError = errorDevices.includes(device.fingerprint);
            const deviceWarning =
              !device.fingerprint && device.type !== "phone"; // if ledger isn't in the BTC app or trezor is locked, it wont give fingerprint, so show warning
            return (
              <DeviceWrapper
                key={index}
                loading={
                  deviceActionLoading !== null && deviceActionLoading === index
                }
                onClick={async () => {
                  if (deviceActionLoading === null) {
                    if (deviceWarning) {
                      if (device.type === "trezor") {
                        setPromptPinModalDevice(device);
                      } else {
                        await enumerate();
                      }
                    } else {
                      if (
                        (device.type === "cobo" || device.type === "phone") &&
                        phoneAction !== undefined
                      ) {
                        phoneAction();
                      } else {
                        performDeviceAction(device, index);
                      }
                    }
                  }
                }}
                warning={deviceWarning}
                error={deviceError}
                displayLoadingCursor={deviceActionLoading !== null}
              >
                {(deviceError || deviceWarning) && (
                  <IconWrapper style={{ color: red }}>
                    <StyledIcon as={ExclamationDiamond} size={24} />
                  </IconWrapper>
                )}
                <DeviceImage
                  src={
                    device.type === "coldcard"
                      ? require("../assets/coldcard.png")
                      : device.type === "ledger"
                      ? require("../assets/ledger.png")
                      : device.type === "trezor"
                      ? require("../assets/trezor.png")
                      : device.type === "cobo"
                      ? require("../assets/cobo.png")
                      : require("../assets/iphone.png")
                  }
                />
                <DeviceInfoWrapper>
                  <DeviceName>{device.type}</DeviceName>
                  <DeviceFingerprint imported={false}>
                    {device.fingerprint}
                  </DeviceFingerprint>
                  <ImportedWrapper>
                    {deviceActionLoading === index ? (
                      <ConfiguringText
                        error={deviceError}
                        style={{ textAlign: "center" }}
                      >
                        {deviceActionLoadingText}
                        <ConfiguringAnimation>.</ConfiguringAnimation>
                        <ConfiguringAnimation>.</ConfiguringAnimation>
                        <ConfiguringAnimation>.</ConfiguringAnimation>
                      </ConfiguringText>
                    ) : deviceError || deviceWarning ? (
                      <ConfiguringText error={true} warning={deviceWarning}>
                        {deviceError
                          ? "Click to Retry"
                          : device.type === "ledger"
                          ? "Open Bitcoin App on Device"
                          : "Click to enter PIN"}
                      </ConfiguringText>
                    ) : (
                      <ConfiguringText>{deviceActionText}</ConfiguringText>
                    )}
                  </ImportedWrapper>
                </DeviceInfoWrapper>
              </DeviceWrapper>
            );
          })}
        </DeviceContainer>
        {unconfiguredDevices.length === 0 &&
          configuredDevices.length === 0 &&
          !devicesLoading && (
            <NoDevicesContainer>
              <NoDevicesWrapper>
                <NoDevicesHeader>No devices detected</NoDevicesHeader>
                <StyledIcon as={ExclamationDiamond} size={96} />
                <NoDevicesSubheader>
                  Please make sure your device is connected and unlocked.
                </NoDevicesSubheader>
              </NoDevicesWrapper>
            </NoDevicesContainer>
          )}

        {unconfiguredDevices.length === 0 &&
          configuredDevices.length === 0 &&
          devicesLoading && (
            <LoadingDevicesWrapper>
              <LoadingImage
                src={require("../assets/flower-loading.svg")}
                style={{ maxWidth: "6.25em" }}
                alt="loading"
              />
              <LoadingText>Loading Devices</LoadingText>
              <LoadingSubText>Please wait...</LoadingSubText>
            </LoadingDevicesWrapper>
          )}
      </DevicesWrapper>

      {configuredDevices.length < configuredThreshold && (
        <ScanDevicesButton
          background={white}
          color={green800}
          onClick={enumerate}
        >
          {devicesLoading ? "Updating Device List..." : "Scan for devices"}
        </ScanDevicesButton>
      )}
    </Wrapper>
  );
};

const LoadingImage = styled.img`
  color: ${gray900};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${white};
  justify-content: center;
  height: 100%;
`;

const NoDevicesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoDevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${gray900};
  text-align: center;
`;

const LoadingDevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5em;
  justify-content: center;
  color: ${darkGray};
  text-align: center;
`;

const NoDevicesHeader = styled.h3`
  font-weight: 100;
`;

const NoDevicesSubheader = styled.h4`
  font-weight: 100;
`;

const ConfiguringText = styled.div<{ error?: boolean; warning?: boolean }>`
  color: ${(p) => (p.error ? gray600 : darkGray)};
  font-size: ${(p) => (p.warning ? "0.75em" : "1em")};
  text-align: center;
`;

const DevicesWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.25em;
  margin-top: 1.25em;
  overflow: scroll;
`;

const DeviceContainer = styled.div`
  width: 100%;
  display: flex;
`;

const DeviceInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const IconWrapper = styled.div`
  position: absolute;
  align-self: flex-end;
  top: 0.65em;
`;

const DeviceWrapper = styled.div<{
  loading?: boolean;
  imported?: boolean;
  error?: boolean;
  warning?: boolean;
  displayLoadingCursor?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: .75em;
  margin: 1.5em;
  margin-bottom: 0px;
  flex: 0 1 15.625em;
  border-radius: 4px;
  position: relative;
  animation-name: ${(p) => (p.loading ? blinking : "none")};
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;

  background: ${(p) =>
    p.imported
      ? lightGreen
      : p.error
      ? lightRed
      : p.warning
      ? lightYellow
      : "none"};
  border: ${(p) =>
    p.imported
      ? `1px solid ${green}`
      : p.error
      ? `1px solid ${red}`
      : p.warning
      ? `1px solid ${yellow}`
      : "1px solid transparent"};

  &:hover {
    cursor: ${(p) => (p.displayLoadingCursor ? "wait" : "pointer")};
`;

const DeviceImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-height: 250px;
  max-width: 6.25em;
`;

const DeviceName = styled.h4`
  text-transform: capitalize;
  margin-bottom: 2px;
  font-weight: 500;
`;

const DeviceFingerprint = styled.h5<{ imported: boolean }>`
  color: ${(p) => (p.imported ? darkGray : gray)};
  margin: 0;
  font-weight: 100;
`;

const LoadingText = styled.div`
  font-size: 1.5em;
  margin: 4px 0;
`;

const LoadingSubText = styled.div`
  font-size: 0.75em;
`;

const ImportedWrapper = styled.div``;

const ScanDevicesButton = styled.button`
  ${Button};
  padding: 1em;
  font-size: 1em;
  width: fit-content;
  align-self: center;
  border: 1px solid ${green800};
  margin-bottom: 1em;
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
