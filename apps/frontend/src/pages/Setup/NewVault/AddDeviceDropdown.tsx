import React, { useContext, useState, useRef } from 'react';
import { decode } from 'bs58check';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';

import { FileUploader, Dropdown, Modal, ErrorModal } from 'src/components';

import InputXpubModal from './InputXpubModal';
import RequestDeviceViaEmail from './RequestDeviceViaEmail';

import { zpubToXpub } from 'src/utils/other';
import { multisigDeviceToExtendedPublicKey } from 'src/utils/files';

import { ConfigContext } from 'src/context';

import {
  File,
  ColdcardDeviceMultisigExportFile,
  ColdcardMultisigExportFile,
  OnChainConfigWithoutId,
  ExtendedPublicKey,
  Device
} from '@lily/types';

interface Props {
  newAccount: OnChainConfigWithoutId;
  setNewAccount: (account: OnChainConfigWithoutId) => void;
  addExtendedPublicKeysToNewAccount: (extendedPublicKeys: ExtendedPublicKey[]) => void;
}

export const AddDeviceDropdown = React.forwardRef<HTMLButtonElement, Props>(
  ({ newAccount, setNewAccount, addExtendedPublicKeysToNewAccount }, ref) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
    const importDeviceFromFileRef = useRef<HTMLLabelElement>(null);
    const { currentBitcoinNetwork } = useContext(ConfigContext);

    const openInModal = (component: JSX.Element) => {
      setModalIsOpen(true);
      setModalContent(component);
    };

    const closeModal = () => {
      setModalIsOpen(false);
      setModalContent(null);
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
      addExtendedPublicKeysToNewAccount(extendedPublicKeysFromFile);
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

        addExtendedPublicKeysToNewAccount([newDevice]);
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

      addExtendedPublicKeysToNewAccount([newDevice]);
    };

    return (
      <>
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

        <Dropdown
          ref={ref}
          minimal={true}
          data-cy='advanced-import-dropdown'
          className='dark:text-slate-200'
          dropdownItems={[
            {
              label: 'Add device from file',
              onClick: () => {
                const importDeviceFromFile = importDeviceFromFileRef.current;
                if (importDeviceFromFile) {
                  importDeviceFromFile.click();
                }
              }
            },
            {
              label: 'Add device from QR code',
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
              label: 'Add device manually',
              onClick: () =>
                openInModal(
                  <InputXpubModal
                    addExtendedPublicKeysToNewAccount={addExtendedPublicKeysToNewAccount}
                    closeModal={closeModal}
                  />
                )
            },
            {
              label: 'Request device via URL',
              onClick: () => {
                openInModal(
                  <RequestDeviceViaEmail newAccount={newAccount} setNewAccount={setNewAccount} />
                );
              }
            }
          ]}
        />
        <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
          {modalContent}
        </Modal>
      </>
    );
  }
);

export default AddDeviceDropdown;
