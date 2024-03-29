import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { ExclamationDiamond } from '@styled-icons/bootstrap';

import { StyledIcon, PromptPinModal, Modal, DeviceImage, Loading } from 'src/components';
import { gray600 } from 'src/utils/colors';
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
    <div className='py-6 px-4 flex-1 flex w-full flex-col'>
      <div className='bg-slate-50 dark:bg-slate-900/50 py-2 rounded-lg shadow-inner items-center w-full flex overflow-x-auto flex-1'>
        <div className='max-w-7xl mx-auto px-2 sm:px-4 flex flex-col'>
          <ul role='list' className='flex items-center justify-center py-3 px-2 gap-4'>
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
                    'w-60 flex flex-col items-center pt-4 pb-3 px-3 text-center bg-white hover:bg-gray-50 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg shadow border border-slate-200 dark:border-slate-700',
                    deviceActionLoading === index
                      ? 'animate-pulse hover:scale-0 hover:translate-y-0'
                      : '',
                    deviceActionLoading === index ? 'cursor-wait' : 'cursor-pointer'
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
                    <h3 className='mt-2 text-slate-900 dark:text-white text-md font-medium capitalize'>
                      {device.type}
                    </h3>
                    <dl className='mt-0 flex-grow flex flex-col justify-between h-4'>
                      <dt className='sr-only'>Type</dt>
                      <dd
                        className='text-slate-500 dark:text-slate-300 text-xs uppercase'
                        style={{ fontSize: '.65rem' }}
                      >
                        {device.fingerprint}
                      </dd>
                      <dt className='sr-only'>Fingerprint</dt>
                    </dl>
                    <div className='mt-3'>
                      <span
                        className={classNames(
                          'px-2 py-1 text-xs font-medium rounded-full border border-slate-500/10',
                          deviceError ? 'text-red-800 bg-red-100' : 'text-slate-800 bg-slate-100'
                        )}
                      >
                        {actionText}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
            {configuredDevices.map((device, index) => (
              <li
                key={index}
                className='w-60 flex flex-col items-center pt-4 pb-3 px-3 text-center bg-white dark:bg-slate-600 rounded-lg shadow border border-slate-200 dark:border-slate-700 dark:highlight-white/10'
              >
                <DeviceImage
                  device={device}
                  className='w-28 h-48 shrink-0 mx-auto object-contain'
                />
                <div className='py-2 flex flex-col items-center'>
                  <h3 className='mt-2 text-slate-900 dark:text-white text-md font-medium capitalize'>
                    {device.type}
                  </h3>
                  <dl className='mt-0 flex-grow flex flex-col justify-between h-4'>
                    <dt className='sr-only'>Type</dt>
                    <dd
                      className='text-slate-500 dark:text-slate-300 text-xs uppercase'
                      style={{ fontSize: '.65rem' }}
                    >
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
            {unconfiguredDevices.length === 0 && configuredDevices.length === 0 && !devicesLoading && (
              <div className='flex items-center justify-center mb-2'>
                <div className='flex flex-col items-center justify-center text-center'>
                  <h3 className='text-lg font-medium text-slate-900 dark:text-slate-300'>
                    No devices detected
                  </h3>
                  <StyledIcon
                    className='text-slate-600 dark:text-slate-400 my-4'
                    as={ExclamationDiamond}
                    size={96}
                  />
                  <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                    Please make sure your device is <br /> connected and unlocked.
                  </p>
                </div>
              </div>
            )}

            {unconfiguredDevices.length === 0 && configuredDevices.length === 0 && devicesLoading && (
              <div className='flex flex-col items-center justify-center text-gray-600 text-center'>
                <Loading itemText='devices' />
              </div>
            )}
          </ul>
        </div>
      </div>
      {configuredDevices.length <= configuredThreshold ? (
        <button
          onClick={enumerate}
          type='button'
          className='mt-5 inline-flex w-min flex-nowrap self-center whitespace-nowrap items-center px-4 py-2 border border-slate-400/20 dark:border-slate-500/20 dark:text-slate-300 dark:bg-slate-700 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
