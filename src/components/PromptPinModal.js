import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DotSingle } from '@styled-icons/entypo';

import { Modal, Button, Loading, StyledIcon } from '.';

import { blue, white, blue400, blue500, blue600, gray100, red500 } from '../utils/colors';

export const PromptPinModal = ({ device, promptPinModalIsOpen, setPromptPinModalDevice, enumerate }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [promptPinError, setPromptPinError] = useState(undefined)

  useEffect(() => {
    async function promptPin() {
      setLoadingMessage('Loading Keypad');
      try {
        await window.ipcRenderer.invoke('/promptpin', {
          deviceType: device.type,
          devicePath: device.path
        });

      } catch (e) {
        setPromptPinError('Something went wrong. Please unplug and re-plug in your device until no keypad appears on the screen.');
        setTimeout(() => { closeModal() }, 10000)
      }

      setLoadingMessage(null);
    }

    if (device) {
      promptPin()
    }
  }, [device]);

  const closeModal = () => {
    setPromptPinModalDevice(null);
    setPromptPinError(undefined);
  }

  const addToPin = (number) => {
    if (promptPinError) {
      setPromptPinError(undefined);
    }
    setCurrentPin(currentPin.concat(number));
  }

  const sendPin = async () => {
    setLoadingMessage('Unlocking Device')
    // TODO: this needs a try/catch.
    // TODO: figure out flow for if Trezor prompt comes up
    const response = await window.ipcRenderer.invoke('/sendpin', {
      deviceType: device.type,
      devicePath: device.path,
      pin: currentPin
    });
    setCurrentPin('');
    if (response.success) {
      enumerate();
      closeModal();
    } else {
      setPromptPinError('Incorrect Pin');
      await window.ipcRenderer.invoke('/promptpin', {
        deviceType: device.type,
        devicePath: device.path
      });
      setLoadingMessage(null);
    }
  }

  const pinItems = [];
  pinItems.push(<PinItem onClick={() => addToPin(7)}><StyledIcon as={DotSingle} size={25} /></PinItem>)
  pinItems.push(<PinItem onClick={() => addToPin(8)}><StyledIcon as={DotSingle} size={25} /></PinItem>)
  pinItems.push(<PinItem onClick={() => addToPin(9)}><StyledIcon as={DotSingle} size={25} /></PinItem>)
  pinItems.push(<PinItem onClick={() => addToPin(4)}><StyledIcon as={DotSingle} size={25} /></PinItem>)
  pinItems.push(<PinItem onClick={() => addToPin(5)}><StyledIcon as={DotSingle} size={25} /></PinItem>)
  pinItems.push(<PinItem onClick={() => addToPin(6)}><StyledIcon as={DotSingle} size={25} /></PinItem>)
  pinItems.push(<PinItem onClick={() => addToPin(1)}><StyledIcon as={DotSingle} size={25} /></PinItem>)
  pinItems.push(<PinItem onClick={() => addToPin(2)}><StyledIcon as={DotSingle} size={25} /></PinItem>)
  pinItems.push(<PinItem onClick={() => addToPin(3)}><StyledIcon as={DotSingle} size={25} /></PinItem>)

  const PinInput = () => (
    <Fragment>
      <PinItemsWrapper>
        {pinItems}
      </PinItemsWrapper>
      {promptPinError && <ErrorText>{promptPinError}</ErrorText>}
      <UnlockButton onClick={() => sendPin()}>Unlock Device</UnlockButton>
    </Fragment>
  )

  return (
    <Modal
      isOpen={promptPinModalIsOpen}
      onRequestClose={() => closeModal()}>
      <ModalHeaderContainer>
        Enter PIN
      </ModalHeaderContainer>
      {!!loadingMessage && <Loading message={loadingMessage} />}
      {!!!loadingMessage && <PinInput />}
    </Modal>
  )
}

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229,231,235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

const PinItemsWrapper = styled.div`
  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  padding: 3em;
`;

const PinItem = styled.div`
  padding: 1.25em;
  margin: .25em;
  background: ${white};
  border: 1px solid ${blue500};
  border-radius: 4px;
  position: relative;
  text-align: center;
  cursor: pointer;

  &:hover {
    border: 1px solid ${blue400};
  }

  &:active {
    border: 1px solid ${blue600};
    background: ${gray100};
  }
`;

const ErrorText = styled.div`
  color: ${red500};
  text-align: center;
  padding-bottom: 1em;
  margin-top: -2em;
`;

const UnlockButton = styled.div`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
`;