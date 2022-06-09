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
    <div className='py-6 px-4'>
      <div className='bg-gray-50 dark:bg-gray-700 pt-8 pb-4 rounded-lg shadow-inner'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col'>
          <ul role='list' className='flex items-center justify-center py-3 px-2 gap-4'>
            {configuredDevices.map((device, index) => (
              <li
                key={index}
                className='w-48 flex flex-col items-center py-4 px-3 text-center bg-white dark:bg-gray-600 rounded-lg shadow border border-gray-200 dark:border-gray-700'
              >
                <DeviceImage
                  device={device}
                  className='w-28 h-48 shrink-0 mx-auto object-contain'
                />
                <div className='py-2 flex flex-col items-center'>
                  <h3 className='mt-4 text-gray-900 dark:text-white text-md font-medium capitalize'>
                    {device.type}
                  </h3>
                  <dl className='mt-0 flex-grow flex flex-col justify-between h-4'>
                    <dt className='sr-only'>Type</dt>
                    <dd className='text-gray-500 dark:text-gray-300 text-xs uppercase'>
                      {device.fingerprint}
                    </dd>
                    <dt className='sr-only'>Fingerprint</dt>
                  </dl>
                  <div className='mt-3'>
                    <span className='px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full'>
                      Complete
                    </span>
                  </div>
                </div>
              </li>
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
                <li
                  className={classNames(
                    'w-48 flex flex-col items-center py-4 px-3 text-center bg-white dark:bg-gray-600 rounded-lg shadow border border-gray-200 dark:border-gray-700',
                    deviceActionLoading === index
                      ? 'animate-pulse hover:scale-0 hover:translate-y-0'
                      : '',
                    !!deviceActionLoading ? 'cursor-progress' : 'cursor-pointer'
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
                              deviceAction={(device) => performDeviceAction(device, index)}
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
                  <DeviceImage
                    device={device}
                    className='w-28 h-48 shrink-0 mx-auto object-contain'
                  />
                  <div className='py-2 flex flex-col items-center'>
                    <h3 className='mt-4 text-gray-900 dark:text-white text-md font-medium capitalize'>
                      {device.type}
                    </h3>
                    <dl className='mt-0 flex-grow flex flex-col justify-between h-4'>
                      <dt className='sr-only'>Type</dt>
                      <dd className='text-gray-500 dark:text-gray-300 text-xs uppercase'>
                        {device.fingerprint}
                      </dd>
                      <dt className='sr-only'>Fingerprint</dt>
                    </dl>
                    <div className='mt-3'>
                      <span
                        className={classNames(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          deviceError ? 'text-red-800 bg-red-100' : 'text-gray-800 bg-gray-100'
                        )}
                      >
                        {actionText}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
            {unconfiguredDevices.length === 0 && configuredDevices.length === 0 && !devicesLoading && (
              <div className='flex items-center justify-center mb-8'>
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
              </div>
            )}

            {unconfiguredDevices.length === 0 && configuredDevices.length === 0 && devicesLoading && (
              <LoadingDevicesWrapper>
                <Loading itemText='devices' />
              </LoadingDevicesWrapper>
            )}
          </ul>
          {configuredDevices.length <= configuredThreshold ? (
            <button
              onClick={enumerate}
              type='button'
              className='mt-2 inline-flex w-min flex-nowrap self-center whitespace-nowrap items-center px-4 py-2 border border-gray-300 dark:text-gray-300 dark:bg-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:hover:bg-gray-800'
            >
              {devicesLoading ? 'Scanning for devices...' : 'Scan for devices'}
            </button>
          ) : null}
        </div>
      </div>
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
