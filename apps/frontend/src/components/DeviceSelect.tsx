import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { CheckCircle } from '@styled-icons/material';
import { ExclamationDiamond } from '@styled-icons/bootstrap';

import { StyledIcon, PromptPinModal, Modal, DeviceImage, Loading } from 'src/components';
import { red500, gray600 } from 'src/utils/colors';
import { classNames } from 'src/utils/other';

import { Device, HwiEnumerateResponse } from '@lily/types';
import { PlatformContext } from 'src/context';

interface Props {
  configuredDevices: Device[];
  unconfiguredDevices: HwiEnumerateResponse[];
  errorDevices: string[]; // fingerprints of error devices
  setUnconfiguredDevices: React.Dispatch<React.SetStateAction<HwiEnumerateResponse[]>>;
  configuredThreshold: number;
  deviceAction: (device: HwiEnumerateResponse, index: number) => void;
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
  phoneAction
}: Props) => {
  const { platform } = useContext(PlatformContext);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [deviceActionLoading, setDeviceActionLoading] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  useEffect(() => {
    enumerate();
  }, []); // eslint-disable-line

  const enumerate = async () => {
    setDevicesLoading(true);
    // what?
    try {
      const response = await platform.enumerate();
      setDevicesLoading(false);

      if (phoneAction) {
        response.push({
          type: 'cobo',
          fingerprint: 'unknown',
          xpub: 'unknown',
          model: 'unknown',
          path: 'unknown'
        });
      }

      // filter out devices that are available but already imported
      const filteredDevices = response.filter((device) => {
        // eslint-disable-line
        let deviceAlreadyConfigured = false;
        for (let i = 0; i < configuredDevices.length; i++) {
          if (configuredDevices[i].fingerprint === device.fingerprint) {
            deviceAlreadyConfigured = true;
          } else if (device.type === 'phone' && configuredDevices[i].type === 'phone') {
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
      console.log('e: ', e);
      setDevicesLoading(false);
    }
  };

  const performDeviceAction = async (device: HwiEnumerateResponse, index: number) => {
    setDeviceActionLoading(index);
    await deviceAction(device, index);
    setDeviceActionLoading(null);
  };

  return (
    <div
      className={classNames(
        !!deviceActionLoading ? 'cursor-progress' : '',
        'flex flex-col h-full w-full justify-center items-center bg-whtie dark:bg-gray-800 py-8 px-4'
      )}
    >
      <div className='overflow-x-auto flex'>
        {configuredDevices.map((device, index) => (
          <div key={index} className='w-48 flex flex-col items-center py-4 px-3'>
            <DeviceImage device={device} />
            <div className='py-2 flex flex-col items-center'>
              <h4 className='text-gray-900 dark:text-gray-200 capitalize font-medium'>
                {device.type}
              </h4>
              <p className='text-sm text-gray-900 dark:text-gray-400 capitalize font-medium'>
                {device.fingerprint}
              </p>
              <div>
                <p className={'text-green-600 dark:text-green-500 font-semibold flex items-center'}>
                  <span className='mr-1'>Complete</span> <StyledIcon as={CheckCircle} size={24} />
                </p>
              </div>
            </div>
          </div>
        ))}

        {unconfiguredDevices.map((device, index) => {
          const deviceError = errorDevices.includes(device.fingerprint);
          const deviceWarning = !device.fingerprint && device.type !== 'phone'; // if ledger isn't in the BTC app or trezor is locked, it wont give fingerprint, so show warning
          let actionText = deviceActionText;
          if (deviceError) {
            actionText = 'Click to retry';
          } else if (deviceWarning && device.type === 'ledger') {
            actionText = 'Open bitcoin app on device';
          } else if (deviceWarning) {
            actionText = 'Click to enter pin';
          } else if (deviceActionLoading === index) {
            actionText = `${deviceActionLoadingText}...`;
          }

          return (
            <button
              className={classNames(
                'w-48 flex flex-col items-center py-4 px-3 transform transition-transform transition hover:-translate-y-1 hover:translate-x-1 hover:rotate-1 hover:scale-105 duration-300',
                deviceActionLoading === index
                  ? 'animate-pulse hover:scale-0 hover:translate-y-0'
                  : '',
                !!deviceActionLoading ? 'cursor-progress' : 'cursor-pointer',
                deviceError ? 'bg-red-100' : ''
              )}
              style={{
                transform: deviceActionLoading === index ? 'translate(0px, 0px)' : ''
              }}
              key={index}
              onClick={async () => {
                if (deviceActionLoading === null) {
                  if (deviceWarning) {
                    if (device.type === 'trezor') {
                      openInModal(
                        <PromptPinModal
                          device={device!}
                          enumerate={enumerate}
                          closeModal={() => closeModal()}
                        />
                      );
                    } else {
                      await enumerate();
                    }
                  } else {
                    if (
                      (device.type === 'cobo' || device.type === 'phone') &&
                      phoneAction !== undefined
                    ) {
                      phoneAction();
                    } else {
                      performDeviceAction(device, index);
                    }
                  }
                }
              }}
            >
              {deviceError && (
                <IconWrapper style={{ color: red500 }}>
                  <StyledIcon as={ExclamationDiamond} size={24} />
                </IconWrapper>
              )}
              <DeviceImage device={device} />
              <div className='py-2 flex flex-col items-center'>
                <h4 className='text-gray-900 dark:text-gray-200 capitalize font-medium'>
                  {device.type}
                </h4>
                <p className='text-sm text-gray-900 dark:text-gray-400 capitalize font-medium'>
                  {device.fingerprint}
                </p>
                <div>
                  <p className={'text-gray-900 dark:text-gray-200 font-medium'}>{actionText}</p>
                </div>
              </div>
            </button>
          );
        })}
        {unconfiguredDevices.length === 0 && configuredDevices.length === 0 && !devicesLoading && (
          <NoDevicesContainer>
            <div className='flex flex-col items-center justify-center text-center'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-gray-300'>
                No devices detected
              </h3>
              <StyledIcon
                className='text-gray-600 dark:text-gray-400 my-4'
                as={ExclamationDiamond}
                size={96}
              />
              <p className='text-base font-medium text-gray-900 dark:text-gray-300'>
                Please make sure your device is connected and unlocked.
              </p>
            </div>
          </NoDevicesContainer>
        )}

        {unconfiguredDevices.length === 0 && configuredDevices.length === 0 && devicesLoading && (
          <LoadingDevicesWrapper>
            <Loading itemText='devices' />
          </LoadingDevicesWrapper>
        )}
      </div>

      {configuredDevices.length <= configuredThreshold ? (
        <button
          onClick={enumerate}
          type='button'
          className='mt-4 inline-flex w-min flex-nowrap whitespace-nowrap items-center px-4 py-2 border border-gray-300 dark:text-gray-300 dark:bg-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:hover:bg-gray-800'
        >
          {devicesLoading ? 'Scanning for devices...' : 'Scan for devices'}
        </button>
      ) : null}
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

const NoDevicesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingDevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5em;
  justify-content: center;
  color: ${gray600};
  text-align: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  align-self: flex-end;
  top: 0.65em;
`;
