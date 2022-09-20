import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MailIcon, UserIcon, ArrowRightIcon, WifiIcon } from '@heroicons/react/outline';
import FlowerLoading from 'src/assets/flower-loading.svg';
import { DeviceImage, SlideOver, Loading } from 'src/components';
import DeviceDetails from 'src/pages/Vault/Settings/Devices/DeviceDetails';

import { FormContainer } from '../styles';

import RequiredDevicesModal from './RequiredDevicesModal';
import AddDeviceDropdown from './AddDeviceDropdown';
import { InnerTransition } from './InnerTransition';
import NoDevicesEmptyState from './NoDevicesEmptyState';
import PageHeader from '../PageHeader';

import {
  getMultisigDeriationPathForNetwork,
  multisigDeviceToExtendedPublicKey
} from 'src/utils/files';

import { PlatformContext, ConfigContext } from 'src/context';

import { HwiEnumerateResponse, OnChainConfigWithoutId, ExtendedPublicKey } from '@lily/types';

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  newAccount: OnChainConfigWithoutId;
  setNewAccount: React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>;
}

const NewVaultScreen = ({ setStep, newAccount, setNewAccount }: Props) => {
  const [availableDevices, setAvailableDevices] = useState<HwiEnumerateResponse[]>([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]);
  const [hwiLoading, setHwiLoading] = useState(false);
  const otherMethodsDropdownRef = useRef<HTMLButtonElement>(null);
  console.log('otherMethodsDropdownRef: ', otherMethodsDropdownRef);

  const [innerStep, setInnerStep] = useState(0);
  const location = useLocation();

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
    const paramObject = new URLSearchParams(location.search);
    const status = paramObject.get('status');
    if (status) {
      setInnerStep(1);
    }
  }, [location.search]);

  const { platform } = useContext(PlatformContext);
  const { currentBitcoinNetwork } = useContext(ConfigContext);

  useEffect(() => {
    enumerate();
  }, []); // eslint-disable-line

  const enumerate = async () => {
    setHwiLoading(true);
    try {
      const response = await platform.enumerate();
      console.log('response: ', response);
      setHwiLoading(false);

      // filter out devices that are available but already imported
      const filteredDevices = response.filter((device) => {
        // eslint-disable-line
        let deviceAlreadyConfigured = false;
        for (let i = 0; i < newAccount.extendedPublicKeys.length; i++) {
          if (newAccount.extendedPublicKeys[i].parentFingerprint === device.fingerprint) {
            deviceAlreadyConfigured = true;
          } else if (
            device.type === 'phone' &&
            newAccount.extendedPublicKeys[i].device.type === 'phone'
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
      setAvailableDevices(filteredDevices);
    } catch (e) {
      console.log('e: ', e);
      setHwiLoading(false);
    }
  };

  const nextStep = () => {
    setStep(3);
  };

  const addExtendedPublicKeysToNewAccount = (extendedPublicKeys: ExtendedPublicKey[]) => {
    const updatedExtendedPublicKeysArray = [
      ...newAccount.extendedPublicKeys,
      ...extendedPublicKeys
    ];

    // if totalSigners is set above current extendedPublicKeys array length
    // then use that value (expecting more devices), else increment
    const updatedTotalSigners =
      newAccount.quorum.totalSigners >= updatedExtendedPublicKeysArray.length
        ? newAccount.quorum.totalSigners
        : updatedExtendedPublicKeysArray.length;

    setNewAccount({
      ...newAccount,
      quorum: {
        ...newAccount.quorum,
        totalSigners: updatedTotalSigners
      },
      extendedPublicKeys: updatedExtendedPublicKeysArray
    });
  };

  const updateExtendedPublicKeysOnNewAccount = (
    updatedExtendedPublicKey: ExtendedPublicKey,
    extendedPublicKeys: ExtendedPublicKey[]
  ) => {
    const updatedExtendedPublicKeys = extendedPublicKeys.map((item) =>
      item.id !== updatedExtendedPublicKey.id ? item : updatedExtendedPublicKey
    );
    setNewAccount({
      ...newAccount,
      extendedPublicKeys: updatedExtendedPublicKeys
    });
  };

  const setRequiredSigners = (requiredSigners: number) => {
    setNewAccount({
      ...newAccount,
      quorum: {
        ...newAccount.quorum,
        requiredSigners: requiredSigners
      }
    });
    setInnerStep(1);
  };

  const importMultisigDevice = async (device: HwiEnumerateResponse, index: number) => {
    try {
      const response = await platform.getXpub({
        deviceType: device.type,
        devicePath: device.path,
        path: getMultisigDeriationPathForNetwork(currentBitcoinNetwork) // we are assuming BIP48 P2WSH wallet
      });

      const deviceWithXpub = {
        ...device,
        xpub: response.xpub
      };

      const newExtendedPublicKey = multisigDeviceToExtendedPublicKey(
        deviceWithXpub,
        currentBitcoinNetwork
      );

      addExtendedPublicKeysToNewAccount([newExtendedPublicKey]);
      availableDevices.splice(index, 1);
      if (errorDevices.includes(device.fingerprint)) {
        const errorDevicesCopy = [...errorDevices];
        errorDevicesCopy.splice(errorDevices.indexOf(device.fingerprint), 1);
        setErrorDevices(errorDevicesCopy);
      }
      setAvailableDevices([...availableDevices]);
    } catch (e) {
      const errorDevicesCopy = [...errorDevices];
      errorDevicesCopy.push(device.fingerprint);
      setErrorDevices([...errorDevicesCopy]);
    }
  };

  return (
    <div className='w-full max-w-7xl mx-auto '>
      <div className='relative overflow-hidden pb-8'>
        <div className='-mx-5 flex flex-col md:flex-row'></div>
        <PageHeader headerText='Create new vault' setStep={setStep} showCancel={true} />
        <FormContainer>
          <InnerTransition show={innerStep === 0}>
            <div className='bg-slate-50 dark:bg-slate-800 mb-24 md:rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 dark:highlight-white/10'>
              <RequiredDevicesModal
                newAccount={newAccount}
                onClick={(requiredSigners: number) => setRequiredSigners(requiredSigners)}
              />
            </div>
          </InnerTransition>
          <InnerTransition appear={false} show={innerStep === 1}>
            <>
              <div className='bg-white dark:bg-slate-700 border-t-8 border-green-600 shadow-sm rounded-2xl w-ful mt-6'>
                <div className='flex items-center p-4 border-b border-gray-200 dark:border-gray-600 sm:py-4 sm:px-6 sm:grid sm:grid-cols-4 sm:gap-x-6'>
                  <dl className='flex-1 grid grid-cols-2 gap-x-6 text-sm sm:col-span-2 sm:grid-cols-2 lg:col-span-2'>
                    <div>
                      <dt className='font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap'>
                        Name
                      </dt>
                      <dd className='mt-1 text-gray-500 dark:text-gray-300'>{newAccount.name}</dd>
                    </div>
                    {/* <div>
                      <dt className='font-medium text-gray-900  dark:text-gray-100 whitespace-nowrap'>
                        Required signers
                      </dt>
                      <dd className='mt-1 text-gray-500  dark:text-gray-300'>
                        {newAccount.quorum.requiredSigners} of {newAccount.quorum.totalSigners}
                      </dd>
                    </div> */}
                  </dl>

                  <div className='hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4'>
                    <AddDeviceDropdown
                      addExtendedPublicKeysToNewAccount={addExtendedPublicKeysToNewAccount}
                      newAccount={newAccount}
                      setNewAccount={setNewAccount}
                      ref={otherMethodsDropdownRef}
                    />
                  </div>
                </div>

                <div className='py-4 px-4'>
                  <div className='bg-gray-50 dark:bg-slate-800 py-4 rounded-lg shadow-inner'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-4'>
                      {!!newAccount.extendedPublicKeys.length || !!availableDevices.length ? (
                        <ul
                          role='list'
                          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-3 px-2'
                        >
                          {newAccount.extendedPublicKeys.map((item) => {
                            return (
                              <li
                                key={item.device.fingerprint}
                                className='col-span-1 flex flex-col flex-none text-center bg-white dark:bg-slate-600  rounded-lg shadow divide-y divide-gray-200 dark:divide-slate-500 border border-gray-200 dark:border-slate-700'
                              >
                                <div className='flex-1 flex flex-col py-2 px-4'>
                                  <DeviceImage
                                    className='w-20 h-32 shrink-0 mx-auto object-contain'
                                    device={item.device}
                                  />
                                  <h3 className='mt-2 text-gray-900 dark:text-white text-sm font-medium capitalize'>
                                    {item.device.type === 'unknown'
                                      ? 'Add in Lily Wallet'
                                      : item.device.type}
                                  </h3>
                                  <dl className='mt-0 flex-grow flex flex-col justify-between'>
                                    <dt className='sr-only'>Type</dt>
                                    <dd className='text-gray-500 dark:text-gray-300 text-xxs uppercase'>
                                      {item.device.fingerprint}
                                    </dd>
                                    <dt className='sr-only'>Fingerprint</dt>
                                  </dl>
                                </div>
                                <div className='px-4 py-3'>
                                  <p className='flex items-center text-xs text-gray-700 dark:text-gray-200 truncate'>
                                    <UserIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400' />
                                    {item.device.owner?.name || 'Not set'}
                                  </p>
                                  <p className='mt-2 flex items-center text-xs text-gray-700 dark:text-gray-200 truncate'>
                                    <MailIcon className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400' />
                                    {item.device.owner?.email || 'Not set'}
                                  </p>
                                </div>
                                <div className='-mt-px flex divide-x divide-gray-200'>
                                  <div className='w-0 flex-1 flex'>
                                    <button
                                      className='relative w-0 flex-1 inline-flex items-center justify-center py-2 text-xs text-gray-700 dark:text-gray-200 font-medium border border-transparent outline-none rounded-bl-lg hover:text-gray-500 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500'
                                      onClick={() =>
                                        openInModal(
                                          <DeviceDetails
                                            extendedPublicKey={item}
                                            closeModal={() => closeModal()}
                                            hideActionButtons={true}
                                            onSave={(extendedPublicKey) =>
                                              updateExtendedPublicKeysOnNewAccount(
                                                extendedPublicKey,
                                                newAccount.extendedPublicKeys
                                              )
                                            }
                                          />
                                        )
                                      }
                                    >
                                      <span>View details</span>
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                          {availableDevices.map((item, index) => (
                            <li
                              key={item.fingerprint}
                              className='col-span-1 flex flex-col flex-none text-center bg-white dark:bg-slate-600  rounded-lg shadow divide-y divide-gray-200 dark:divide-slate-500 border border-gray-200 dark:border-slate-700'
                            >
                              <div className='flex-1 flex flex-col py-2 px-4'>
                                <DeviceImage
                                  className='w-20 h-32 shrink-0 mx-auto object-contain'
                                  device={{
                                    type: item.type,
                                    model: item.model,
                                    fingerprint: item.fingerprint
                                  }}
                                />
                                <h3 className='mt-2 text-gray-900 dark:text-white text-sm font-medium capitalize'>
                                  {item.type}
                                </h3>
                                <dl className='mt-0 flex-grow flex flex-col justify-between'>
                                  <dt className='sr-only'>Type</dt>
                                  <dd className='text-gray-500 dark:text-gray-300 text-xxs uppercase'>
                                    {item.fingerprint}
                                  </dd>
                                  <dt className='sr-only'>Fingerprint</dt>
                                </dl>
                              </div>
                              <div className='-mt-px flex divide-x divide-gray-200'>
                                <div className='w-0 flex-1 flex'>
                                  <button
                                    className='relative w-0 flex-1 inline-flex items-center justify-center py-2 text-xs text-gray-700 dark:text-gray-200 font-medium border border-transparent outline-none rounded-bl-lg hover:text-gray-500 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500'
                                    onClick={() => importMultisigDevice(item, index)}
                                  >
                                    <span>Add to vault</span>
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                          {Array.from(
                            Array(
                              newAccount.quorum.totalSigners - newAccount.extendedPublicKeys.length
                            )
                          ).map((index) => (
                            <li
                              key={index}
                              className='opacity-50 hover:opacity-100 col-span-1 flex flex-col flex-none text-center bg-white dark:bg-slate-600  rounded-lg shadow divide-y divide-gray-200 dark:divide-slate-500 border border-gray-200 dark:border-slate-700'
                            >
                              <div className='flex-1 flex flex-col py-2 px-4'>
                                <DeviceImage
                                  className='w-20 h-32 shrink-0 mx-auto object-contain'
                                  device={{
                                    type: 'unknown',
                                    model: 'unknown',
                                    fingerprint: ''
                                  }}
                                />
                                <h3 className='mt-2 text-gray-900 dark:text-white text-sm font-medium capitalize'>
                                  Unknown
                                </h3>
                                <dl className='mt-0 flex-grow flex flex-col justify-between'>
                                  <dt className='sr-only'>Type</dt>
                                  <dd className='text-gray-500 dark:text-gray-300 text-xxs uppercase'>
                                    xxx
                                  </dd>
                                  <dt className='sr-only'>Fingerprint</dt>
                                </dl>
                              </div>
                              <div className='-mt-px flex divide-x divide-gray-200'>
                                <div className='w-0 flex-1 flex'>
                                  <button
                                    className='relative w-0 flex-1 inline-flex items-center justify-center py-2 text-xs text-gray-700 dark:text-gray-200 font-medium border border-transparent outline-none rounded-bl-lg hover:text-gray-500 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500'
                                    onClick={() => otherMethodsDropdownRef.current?.click()}
                                  >
                                    <span>Add a device</span>
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : hwiLoading ? (
                        <Loading itemText='devices' />
                      ) : (
                        <NoDevicesEmptyState ref={otherMethodsDropdownRef} />
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex gap-4 justify-end px-4 py-6'>
                  <button
                    className='inline-flex justify-center items-center rounded-lg text-sm font-medium py-3 px-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 focus:ring-1 focus:ring-gray-300 dark:focus:ring-slate-100/20  outline-none'
                    onClick={() => enumerate()}
                  >
                    {newAccount.extendedPublicKeys.length && hwiLoading ? (
                      <img className='w-5 h-5 mr-2' src={FlowerLoading} />
                    ) : (
                      <WifiIcon className='w-4 h-4 mr-2' />
                    )}
                    Scan for Devices
                  </button>
                  <button
                    className='group inline-flex justify-center items-center rounded-lg text-sm font-medium py-3 px-4 disabled:opacity-50 bg-green-500 border border-green-600 text-slate-50 hover:bg-green-600 focus:ring-1 focus:ring-green-800 dark:focus:ring-green-600 outline-none'
                    onClick={() => nextStep()}
                    disabled={
                      newAccount.extendedPublicKeys.length < 2 ||
                      newAccount.extendedPublicKeys.length < newAccount.quorum.totalSigners
                    }
                  >
                    Review details
                    <ArrowRightIcon className='ml-2 w-4 h-4 animate-xBounce group-disabled:animate-none' />
                  </button>
                </div>
              </div>
            </>
          </InnerTransition>
        </FormContainer>
      </div>
      <SlideOver open={modalIsOpen} setOpen={setModalIsOpen} content={modalContent} />
    </div>
  );
};

export default NewVaultScreen;
