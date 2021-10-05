import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DotSingle } from "@styled-icons/entypo";
import { StarOfLife } from "@styled-icons/fa-solid";
import { Backspace } from "@styled-icons/ionicons-solid";

import { Button, Loading, StyledIcon } from ".";

import {
  white,
  green400,
  green500,
  green600,
  gray100,
  gray200,
  gray300,
  gray900,
  red500,
} from "../utils/colors";

import { HwiResponseEnumerate } from "../types";

interface Props {
  device: HwiResponseEnumerate;
  enumerate: () => void;
  closeModal: () => void;
}

export const PromptPinModal = ({ device, enumerate, closeModal }: Props) => {
  const [currentPin, setCurrentPin] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [promptPinError, setPromptPinError] = useState("");

  useEffect(() => {
    async function promptPin() {
      setLoadingMessage("Loading Keypad");
      try {
        await window.ipcRenderer.invoke("/promptpin", {
          deviceType: device.type,
          devicePath: device.path,
        });
      } catch (e) {
        setPromptPinError(
          "Something went wrong. Please unplug and re-plug in your device until no keypad appears on the screen."
        );
        setTimeout(() => {
          closeModal();
        }, 10000);
      }

      setLoadingMessage("");
    }

    if (device) {
      promptPin();
    }
  }, [device, closeModal]);

  const addToPin = (number: number) => {
    if (promptPinError) {
      setPromptPinError("");
    }
    setCurrentPin(currentPin.concat(number.toString()));
  };

  const backspacePin = () => {
    if (promptPinError) {
      setPromptPinError("");
    }
    setCurrentPin(currentPin.substring(0, currentPin.length - 1));
  };

  const sendPin = async () => {
    setLoadingMessage("Unlocking Device");
    // TODO: this needs a try/catch.
    // TODO: figure out flow for if Trezor prompt comes up
    const response = await window.ipcRenderer.invoke("/sendpin", {
      deviceType: device.type,
      devicePath: device.path,
      pin: currentPin,
    });
    setCurrentPin("");
    if (response.success) {
      await enumerate();
      closeModal();
    } else {
      setPromptPinError("Incorrect Pin");
      await window.ipcRenderer.invoke("/promptpin", {
        deviceType: device.type,
        devicePath: device.path,
      });
      setLoadingMessage("");
    }
  };

  const pinItems: any[] = []; // KBC-TODO: give this a correct type
  pinItems.push(
    <PinItem onClick={() => addToPin(7)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );
  pinItems.push(
    <PinItem onClick={() => addToPin(8)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );
  pinItems.push(
    <PinItem onClick={() => addToPin(9)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );
  pinItems.push(
    <PinItem onClick={() => addToPin(4)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );
  pinItems.push(
    <PinItem onClick={() => addToPin(5)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );
  pinItems.push(
    <PinItem onClick={() => addToPin(6)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );
  pinItems.push(
    <PinItem onClick={() => addToPin(1)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );
  pinItems.push(
    <PinItem onClick={() => addToPin(2)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );
  pinItems.push(
    <PinItem onClick={() => addToPin(3)}>
      <StyledIcon as={DotSingle} size={25} />
    </PinItem>
  );

  const PinInput = () => (
    <>
      <PinInputWrapper>
        <CurrentInput>
          {currentPin.split("").map((item) => (
            <StyledIcon as={StarOfLife} size={25} />
          ))}
        </CurrentInput>
        {currentPin.length > 0 && (
          <BackspaceWrapper onClick={() => backspacePin()}>
            <StyledIcon
              style={{ cursor: "pointer" }}
              as={Backspace}
              size={25}
            />
          </BackspaceWrapper>
        )}
      </PinInputWrapper>
      <PinItemsWrapper>{pinItems}</PinItemsWrapper>
      {promptPinError && <ErrorText>{promptPinError}</ErrorText>}
      <UnlockButton
        background={green600}
        color={white}
        onClick={() => sendPin()}
      >
        Unlock Device
      </UnlockButton>
    </>
  );

  return (
    <>
      <ModalHeaderContainer>Enter PIN</ModalHeaderContainer>
      {!!loadingMessage && <Loading message={loadingMessage} />}
      {!!!loadingMessage && <PinInput />}
    </>
  );
};

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

const PinInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0em 3em;
  background: ${gray100};
  color: ${gray900};
  margin: 1.5em 3em 0.5em;
  border-radius: 0.385em;
  height: 4.3333em;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;

const CurrentInput = styled.div`
  flex: 1;
  justify-content: center;
  display: flex;
  margin-left: 1em;
`;

const BackspaceWrapper = styled.div`
  border-radius: 9999999px;
  padding: 0.5em;

  &:hover {
    background: ${gray200};
  }

  &:active {
    background: ${gray300};
  }
`;

const PinItemsWrapper = styled.div`
  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  padding: 1em 3em;
`;

const PinItem = styled.div`
  padding: 1.25em;
  margin: 0.25em;
  background: ${white};
  border: 1px solid ${green500};
  border-radius: 4px;
  position: relative;
  text-align: center;
  cursor: pointer;

  &:hover {
    border: 1px solid ${green400};
  }

  &:active {
    border: 1px solid ${green600};
    background: ${gray100};
  }
`;

const ErrorText = styled.div`
  color: ${red500};
  text-align: center;
  padding-bottom: 1em;
`;

const UnlockButton = styled.button`
  ${Button};
  width: 100%;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;
