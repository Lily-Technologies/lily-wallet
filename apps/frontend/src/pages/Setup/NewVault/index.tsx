import React, { useState, useRef, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { decode } from 'bs58check';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';

import { Button, DeviceSelect, FileUploader, Dropdown, Modal, ErrorModal } from 'src/components';

import {
  XPubHeaderWrapper,
  SetupHeaderWrapper,
  SetupExplainerText,
  FormContainer,
  BoxedWrapper,
  SetupHeader
} from '../styles';

import RequiredDevicesModal from './RequiredDevicesModal';
import InputXpubModal from './InputXpubModal';
import { InnerTransition } from './InnerTransition';
import PageHeader from '../PageHeader';

import { white, green600 } from 'src/utils/colors';

import {
  getMultisigDeriationPathForNetwork,
  multisigDeviceToExtendedPublicKey
} from 'src/utils/files';
import { zpubToXpub } from 'src/utils/other';

import { PlatformContext, ConfigContext } from 'src/context';

import {
  HwiEnumerateResponse,
  File,
  ColdcardDeviceMultisigExportFile,
  ColdcardMultisigExportFile,
  OnChainConfigWithoutId,
  ExtendedPublicKey,
  Device
} from '@lily/types';

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  newAccount: OnChainConfigWithoutId;
  setNewAccount: React.Dispatch<React.SetStateAction<OnChainConfigWithoutId>>;
}

const NewVaultScreen = ({ setStep, newAccount, setNewAccount }: Props) => {
  const [availableDevices, setAvailableDevices] = useState<HwiEnumerateResponse[]>([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [innerStep, setInnerStep] = useState(0);
  const [importedDevices, setImportedDevices] = useState<ExtendedPublicKey[]>(
    newAccount.extendedPublicKeys
  );
  const location = useLocation();

  useEffect(() => {
    const paramObject = new URLSearchParams(location.search);
    const fingerprint = paramObject.get('fingerprint');
    if (fingerprint) {
      const configCopy = { ...newAccount };
      configCopy.extendedPublicKeys = newAccount.extendedPublicKeys.filter(
        (item) => item.parentFingerprint !== fingerprint
      );
      setImportedDevices(configCopy.extendedPublicKeys);
      setNewAccount(configCopy);
    }
  }, [location.search]);

  const { platform } = useContext(PlatformContext);
  const { currentBitcoinNetwork } = useContext(ConfigContext);

  const importDeviceFromFileRef = useRef<HTMLLabelElement>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const displayRequiredStep = () => {
    setNewAccount({
      ...newAccount,
      extendedPublicKeys: importedDevices
    });
    setInnerStep(1);
  };

  const nextStep = (requiredSigners: number) => {
    setNewAccount({
      ...newAccount,
      quorum: {
        requiredSigners: requiredSigners,
        totalSigners: importedDevices.length
      },
      extendedPublicKeys: importedDevices
    });
    setStep(3);
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

      setImportedDevices([...importedDevices, newExtendedPublicKey]);
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

  const importDeviceFromQR = ({ data }: { data: string }) => {
    try {
      const { xfp, xpub, path, lilyMobile } = JSON.parse(data);

      let newDevice: ExtendedPublicKey;
      if (lilyMobile) {
        newDevice = multisigDeviceToExtendedPublicKey(
          {
            type: 'phone',
            fingerprint: xfp,
            xpub: xpub,
            model: 'unknown',
            path: path
          },
          currentBitcoinNetwork
        );
      } else {
        const xpubFromZpub = zpubToXpub(decode(xpub));
        newDevice = multisigDeviceToExtendedPublicKey(
          {
            type: 'cobo',
            fingerprint: xfp,
            xpub: xpubFromZpub,
            model: 'unknown',
            path: path
          },
          currentBitcoinNetwork
        );
      }

      const updatedImportedDevices = [...importedDevices, newDevice];
      setImportedDevices(updatedImportedDevices);
      setAvailableDevices([...availableDevices.filter((item) => item.type !== 'phone')]);
      closeModal();
    } catch (e) {}
  };

  const importDeviceFromFile = (parsedFile: ColdcardDeviceMultisigExportFile) => {
    const zpub = decode(parsedFile.p2wsh);
    const xpub = zpubToXpub(zpub);

    const newDevice = multisigDeviceToExtendedPublicKey(
      {
        type: 'coldcard',
        fingerprint: parsedFile.xfp,
        xpub: xpub,
        path: 'unknown',
        model: 'unknown'
      },
      currentBitcoinNetwork
    );

    const updatedImportedDevices = [...importedDevices, newDevice];
    setImportedDevices(updatedImportedDevices);
  };

  const importMultisigWalletFromFile = (parsedFile: ColdcardMultisigExportFile) => {
    const numPubKeys = Object.keys(parsedFile).filter((key) => key.startsWith('x')).length; // all exports start with x
    const extendedPublicKeysFromFile: ExtendedPublicKey[] = [];

    for (let i = 1; i < numPubKeys + 1; i++) {
      const zpub = decode(parsedFile[`x${i}/`].xpub);
      const xpub = zpubToXpub(zpub);

      const newDevice = multisigDeviceToExtendedPublicKey(
        {
          type: parsedFile[`x${i}/`].hw_type as Device['type'],
          fingerprint: parsedFile[`x${i}/`].label.substring(
            parsedFile[`x${i}/`].label.indexOf('Coldcard ') + 'Coldcard '.length
          ),
          xpub: xpub,
          model: 'unknown',
          path: 'none'
        },
        currentBitcoinNetwork
      );

      extendedPublicKeysFromFile.push(newDevice);
    }
    const updatedImportedDevices = [...importedDevices, ...extendedPublicKeysFromFile];
    setImportedDevices(updatedImportedDevices);
  };

  return (
    <div className='w-full justify-center text-gray-900 dark:text-gray-200 overflow-x-hidden'>
      <PageHeader headerText='Create new vault' setStep={setStep} showCancel={true} />
      <FormContainer>
        <BoxedWrapper>
          <FileUploader
            accept='application/JSON'
            id='importVaultDeviceFromFile'
            onFileLoad={({ file }: File) => {
              try {
                const parsedFile = JSON.parse(file);
                if (parsedFile.seed_version) {
                  // is a multisig file
                  importMultisigWalletFromFile(parsedFile);
                } else {
                  // is a wallet export file
                  importDeviceFromFile(parsedFile);
                }
              } catch (e) {
                openInModal(<ErrorModal message='Invalid file' closeModal={closeModal} />);
              }
            }}
          />
          <label
            className='hidden'
            htmlFor='importVaultDeviceFromFile'
            ref={importDeviceFromFileRef}
          ></label>

          <InnerTransition appear={false} show={innerStep === 0}>
            <>
              <XPubHeaderWrapper>
                <SetupHeaderWrapper>
                  <div>
                    <SetupHeader>Connect devices to computer</SetupHeader>
                    <SetupExplainerText>
                      Devices unlocked and connected to your computer will appear here. Click on
                      them to include them in your vault. You may disconnect a device from your
                      computer after it has been imported.
                    </SetupExplainerText>
                  </div>
                  <Dropdown
                    minimal={true}
                    data-cy='advanced-import-dropdown'
                    dropdownItems={[
                      {
                        label: 'Import from File',
                        onClick: () => {
                          const importDeviceFromFile = importDeviceFromFileRef.current;
                          if (importDeviceFromFile) {
                            importDeviceFromFile.click();
                          }
                        }
                      },
                      {
                        label: 'Import from QR Code',
                        onClick: () =>
                          openInModal(
                            <BarcodeScannerComponent
                              // @ts-ignore
                              width={'100%'}
                              onUpdate={(err, result) => {
                                if (result) importDeviceFromQR({ data: result.getText() });
                                else return;
                              }}
                            />
                          )
                      },
                      {
                        label: 'Manually add device',
                        onClick: () =>
                          openInModal(
                            <InputXpubModal
                              importedDevices={importedDevices}
                              setImportedDevices={setImportedDevices}
                              closeModal={closeModal}
                            />
                          )
                      }
                    ]}
                  />
                </SetupHeaderWrapper>
              </XPubHeaderWrapper>
              <DeviceSelect
                deviceAction={importMultisigDevice}
                deviceActionText={'Click to Configure'}
                deviceActionLoadingText={'Configuring'}
                configuredDevices={importedDevices.map((device) => device.device)}
                unconfiguredDevices={availableDevices}
                errorDevices={errorDevices}
                setUnconfiguredDevices={setAvailableDevices}
                configuredThreshold={15}
              />
            </>
          </InnerTransition>
          <InnerTransition show={innerStep === 1}>
            <>
              <RequiredDevicesModal
                newAccount={newAccount}
                onClick={(requiredSigners: number) => nextStep(requiredSigners)}
              />
            </>
          </InnerTransition>
          {importedDevices.length > 1 && innerStep === 0 && (
            <ContinueButton
              background={green600}
              color={white}
              onClick={() => displayRequiredStep()}
            >
              Finish adding devices
            </ContinueButton>
          )}
        </BoxedWrapper>
      </FormContainer>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

const ContinueButton = styled.button`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  width: 100%;
`;

export default NewVaultScreen;
