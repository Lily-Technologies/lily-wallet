import React, { useState, useRef, useContext } from 'react';
import styled, { css } from 'styled-components';
import { decode } from 'bs58check';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import { Network } from 'bitcoinjs-lib';
import { v4 as uuidv4 } from 'uuid';

import { CursorClick } from '@styled-icons/heroicons-solid';

import {
  Button,
  DeviceSelect,
  FileUploader,
  Dropdown,
  ErrorModal,
  Modal,
  StyledIcon
} from 'src/components';
import {
  InnerWrapper,
  XPubHeaderWrapper,
  SetupHeaderWrapper,
  FormContainer,
  BoxedWrapper
} from './styles';
import { zpubToXpub } from 'src/utils/other';
import { mobile } from 'src/utils/media';
import { getP2shDeriationPathForNetwork, getP2wpkhDeriationPathForNetwork } from 'src/utils/files';

import { getAddressFromAccount } from 'src/utils/accountMap';

import {
  white,
  gray300,
  gray500,
  gray700,
  gray900,
  green100,
  green700,
  green600
} from 'src/utils/colors';

import { PlatformContext } from 'src/context';

import {
  HwiEnumerateResponse,
  ColdcardElectrumExport,
  File,
  AddressType,
  OnChainConfig
} from '@lily/types';

interface Props {
  header: JSX.Element;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  importedDevices: HwiEnumerateResponse[];
  setImportedDevices: React.Dispatch<React.SetStateAction<HwiEnumerateResponse[]>>;
  currentBitcoinNetwork: Network;
  setPath: React.Dispatch<React.SetStateAction<string>>;
  setAddressType: React.Dispatch<React.SetStateAction<AddressType>>;
}

const NewHardwareWalletScreen = ({
  header,
  setStep,
  importedDevices,
  setImportedDevices,
  currentBitcoinNetwork,
  setPath,
  setAddressType
}: Props) => {
  const [availableDevices, setAvailableDevices] = useState<HwiEnumerateResponse[]>([]);
  const [errorDevices, setErrorDevices] = useState<string[]>([]);
  const importDeviceFromFileRef = useRef<HTMLLabelElement>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const { platform } = useContext(PlatformContext);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const importSingleSigDevice = async (device: HwiEnumerateResponse, index: number) => {
    try {
      const p2wpkhXpub = await platform.getXpub({
        deviceType: device.type,
        devicePath: device.path,
        path: getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork) // we are assuming BIP48 P2WSH wallet
      });

      const p2wpkhConfig = {
        id: uuidv4(),
        created_at: 123, // this is a dumby value bc thrown away later
        type: 'onchain',
        name: 'test',
        network: 'mainnet',
        addressType: AddressType.P2WPKH,
        quorum: {
          requiredSigners: 1,
          totalSigners: 1
        },
        extendedPublicKeys: [
          {
            id: uuidv4(),
            created_at: Date.now(),
            parentFingerprint: device.fingerprint,
            network: 'mainnet',
            bip32Path: getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork),
            xpub: p2wpkhXpub.xpub,
            device: {
              type: device.type,
              fingerprint: device.fingerprint,
              model: device.model
            }
          }
        ]
      } as OnChainConfig;

      const p2wpkhAddress = getAddressFromAccount(p2wpkhConfig, 'm/0/0', currentBitcoinNetwork);
      const p2wpkhTxs = await platform.doesAddressHaveTransaction(p2wpkhAddress.address);

      // check for P2SH(P2WPK) transactions too
      const p2shXpub = await platform.getXpub({
        deviceType: device.type,
        devicePath: device.path,
        path: getP2shDeriationPathForNetwork(currentBitcoinNetwork) // we are assuming BIP48 P2WSH wallet
      });

      const p2shConfig = {
        id: uuidv4(),
        created_at: 123, /// this gets thrown away later, so set dumby value
        type: 'onchain',
        name: 'test',
        network: 'mainnet',
        addressType: AddressType.p2sh,
        quorum: {
          requiredSigners: 1,
          totalSigners: 1
        },
        extendedPublicKeys: [
          {
            id: uuidv4(),
            created_at: Date.now(),
            parentFingerprint: device.fingerprint,
            network: 'mainnet',
            bip32Path: getP2shDeriationPathForNetwork(currentBitcoinNetwork),
            xpub: p2shXpub.xpub,
            device: {
              type: device.type,
              fingerprint: device.fingerprint,
              model: device.model
            }
          }
        ]
      } as OnChainConfig;

      const p2shAddress = getAddressFromAccount(p2shConfig, 'm/0/0', currentBitcoinNetwork);
      const p2shTxs = await platform.doesAddressHaveTransaction(p2shAddress.address);

      if (p2shTxs && p2wpkhTxs) {
        openInModal(
          <ModalWrapper>
            <StyledIconCircle>
              <StyledIcon style={{ color: green600 }} as={CursorClick} size={36} />
            </StyledIconCircle>
            <ModalHeader>Select address type</ModalHeader>
            <ModalSubtext>
              We detected transaction history for two different address types with this device.
              Please choose which address type you would like to use.
            </ModalSubtext>
            <ButtonContainer>
              <SecondaryOptionButton
                data-cy='p2sh-button'
                color={gray700}
                background={white}
                onClick={() => {
                  setPath(getP2shDeriationPathForNetwork(currentBitcoinNetwork));
                  setAddressType(AddressType.p2sh);
                  setImportedDevices([...importedDevices, { ...device, ...p2shXpub }]);
                  closeModal();
                }}
              >
                P2SH(P2WPKH)
              </SecondaryOptionButton>
              <OptionButton
                data-cy='p2wpkh-button'
                color={white}
                background={green700}
                onClick={() => {
                  setPath(getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork));
                  setAddressType(AddressType.P2WPKH);
                  setImportedDevices([...importedDevices, { ...device, ...p2wpkhXpub }]);
                  closeModal();
                }}
              >
                P2WPKH
              </OptionButton>
            </ButtonContainer>
          </ModalWrapper>
        );
      } else if (p2shTxs) {
        setPath(getP2shDeriationPathForNetwork(currentBitcoinNetwork));
        setAddressType(AddressType.p2sh);
        setImportedDevices([...importedDevices, { ...device, ...p2shXpub }]);
      } else {
        setPath(getP2wpkhDeriationPathForNetwork(currentBitcoinNetwork));
        setAddressType(AddressType.P2WPKH);
        setImportedDevices([...importedDevices, { ...device, ...p2wpkhXpub }]);
      }

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

  const importDeviceFromFile = (parsedFile: ColdcardElectrumExport) => {
    try {
      if (parsedFile.keystore.derivation !== "m/49'/0'/0'") {
        throw new Error('Invalid file');
      }

      const xpub = zpubToXpub(decode(parsedFile.keystore.xpub));

      const newDevice = {
        type: parsedFile.keystore.hw_type,
        fingerprint: parsedFile.keystore.label.substring(
          'Coldcard Import '.length,
          parsedFile.keystore.label.length
        ),
        xpub: xpub,
        model: 'unknown',
        path: 'unknown'
      } as HwiEnumerateResponse;

      const updatedImportedDevices = [...importedDevices, newDevice];
      setImportedDevices(updatedImportedDevices);
      setStep(3);
    } catch (e) {
      if (e instanceof Error) {
        openInModal(<ErrorModal message={e.message} closeModal={closeModal} />);
      }
    }
  };

  const importDeviceFromQR = ({ data }: { data: string }) => {
    try {
      const { xfp, xpub, path } = JSON.parse(data);
      const xpubFromZpub = zpubToXpub(decode(xpub));

      const newDevice = {
        type: 'cobo',
        fingerprint: xfp,
        xpub: xpubFromZpub,
        model: 'unknown',
        path: path
      } as HwiEnumerateResponse;

      const updatedImportedDevices = [...importedDevices, newDevice];
      setImportedDevices(updatedImportedDevices);
      setAvailableDevices([...availableDevices.filter((item) => item.type !== 'phone')]);
      closeModal();
    } catch (e) {
      if (e instanceof Error) {
        openInModal(<ErrorModal message={e.message} closeModal={closeModal} />);
      }
    }
  };

  return (
    <InnerWrapper>
      {header}
      <FormContainer>
        <BoxedWrapper>
          <FileUploader
            accept='application/JSON'
            id='localConfigFile'
            onFileLoad={({ file }: File) => {
              try {
                const parsedFile = JSON.parse(file);
                importDeviceFromFile(parsedFile);
              } catch (e) {
                openInModal(<ErrorModal message='Invalid file' closeModal={closeModal} />);
              }
            }}
          />

          <ImportFromFileLabel
            htmlFor='localConfigFile'
            ref={importDeviceFromFileRef}
          ></ImportFromFileLabel>

          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div className='mr-8'>
                <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-gray-200'>
                  Connect hardware wallet to computer
                </h3>
                <p className='mt-1 text-sm text-gray-500 dark:text-gray-300'>
                  Connect your device via USB or import via QR code or SD card. For detailed
                  instructions, read the{' '}
                  <a
                    className='underline text-green-600 font-medium'
                    target='_blank'
                    href='https://docs.lily-wallet.com/get-started/part-2'
                  >
                    documentation
                  </a>
                  .
                </p>
              </div>
              <Dropdown
                minimal={true}
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
                          // @ts-ignore
                          height={'100%'}
                          onUpdate={(err, result) => {
                            if (result) importDeviceFromQR({ data: result.getText() });
                            else return;
                          }}
                        />
                      )
                  }
                ]}
              />
              {/* <ImportFromFileButton htmlFor="localConfigFile" background={white} color={darkGray}>Import from File</ImportFromFileButton> */}
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <DeviceSelect
            deviceAction={importSingleSigDevice}
            deviceActionText={'Click to Configure'}
            deviceActionLoadingText={'Configuring'}
            configuredDevices={importedDevices}
            unconfiguredDevices={availableDevices}
            errorDevices={errorDevices}
            setUnconfiguredDevices={setAvailableDevices}
            configuredThreshold={1}
          />
        </BoxedWrapper>
        {importedDevices.length > 0 && (
          <ContinueButton
            background={green600}
            color={white}
            onClick={() => {
              setStep(3);
            }}
          >
            Continue
          </ContinueButton>
        )}
      </FormContainer>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </InnerWrapper>
  );
};

const ContinueButton = styled.button`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  width: 100%;
`;

const ImportFromFileLabel = styled.label`
  display: none;
`;

const ModalWrapper = styled.div`
  padding: 1.5em;
  text-align: center;
`;

const ModalHeader = styled.h3`
  line-height: 1.5rem;
  font-size: 1.125em;
  color: ${gray900};
`;

const ModalSubtext = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
`;

const SecondaryOptionButton = styled.button`
  ${Button}
  border: 1px solid ${gray300};
  border-radius: 0.375em;
  flex: 1;
`;

const OptionButton = styled.button`
  ${Button}
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: grid;
  gap: 0.75rem;
  margin-top: 1.5em;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  ${mobile(css`
    display: block;
  `)}
`;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${green100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

export default NewHardwareWalletScreen;
