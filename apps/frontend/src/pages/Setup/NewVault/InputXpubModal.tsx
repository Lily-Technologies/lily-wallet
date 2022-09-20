import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';

import { Input, Select } from 'src/components';
import {
  capitalize,
  capitalizeAllAndReplaceUnderscore,
  isOnlyLettersAndNumbers
} from 'src/utils/other';

import { ConfigContext } from 'src/context';

import { Device, ExtendedPublicKey } from '@lily/types';
import { multisigDeviceToExtendedPublicKey } from 'src/utils/files';

const types = {
  coldcard: ['coldcard'],
  trezor: ['trezor_1', 'trezor_t'],
  ledger: ['ledger_nano_s', 'ledger_nano_x'],
  cobo: ['cobo'],
  bitbox02: ['bitbox02'],
  phone: ['phone'],
  lily: ['lily'],
  unchained: ['unknown'],
  unknown: ['unknown']
};

const bip32 = BIP32Factory(ecc);
interface Props {
  addExtendedPublicKeysToNewAccount: (extendedPublicKeys: ExtendedPublicKey[]) => void;
  closeModal: () => void;
}

const InputXpubModal = ({ addExtendedPublicKeysToNewAccount, closeModal }: Props) => {
  const [type, setType] = useState<Device['type']>('coldcard');
  const [model, setModel] = useState<Device['model']>('coldcard');
  const [path, setPath] = useState("m/48'/0'/0'/2'");
  const [fingerprint, setFingerprint] = useState('');
  const [xpub, setXpub] = useState('');
  const [options, setOptions] = useState(Object.values(types[type]));

  const { currentBitcoinNetwork } = useContext(ConfigContext);

  // Errors
  const [xpubError, setXpubError] = useState('');
  const [fingerprintError, setFingerprintError] = useState('');

  useEffect(() => {
    setOptions(Object.values(types[type]));
    setModel(String(Object.values(types[type])[0]));
  }, [type]);

  const addDevice = () => {
    let valid = true;
    try {
      // check if valid xpub
      bip32.fromBase58(xpub);
    } catch (e) {
      setXpubError('Invalid XPub');
      valid = false;
    }

    if (!isOnlyLettersAndNumbers(fingerprint) || fingerprint.length !== 8) {
      valid = false;
      setFingerprintError('Invalid device fingerprint');
    }

    if (valid) {
      const newKey = multisigDeviceToExtendedPublicKey(
        { type, model, path, fingerprint, xpub },
        currentBitcoinNetwork
      );
      addExtendedPublicKeysToNewAccount([newKey]);
      closeModal();
    }
  };

  return (
    <div className='w-full transform overflow-hidden  bg-white dark:bg-slate-800 p-6 text-left rounded-2xl dark:highlight-white/10 border dark:border-white/[0.05]'>
      <h3 className='text-gray-900 dark:text-gray-200 text-lg font-bold'>Add device manually</h3>
      <div className='mt-2'>
        <p className='text-sm text-gray-500 dark:text-gray-400 max-w-prose'>
          Input your device information below to add it to your vault. This is an advanced feature
          that is prone to mistakes, so verify all information before completing this form.
        </p>
      </div>
      <SelectionContainer>
        <div className='flex flex-col py-10'>
          <Input
            value={xpub}
            onChange={(value) => {
              setXpubError('');
              setXpub(value);
            }}
            label='Extended Public Key (XPub)'
            placeholder='xpub6F1TMXpKfN5hRMdDUwSb9qD6LQmx2LTEbNtTj4nkFJte9GN14aFbqpup5AW7m9YhnYiTvEc1PqkrXkDY4gzJ95tNWKUATL6hD2AT641pSLE'
            type='text'
            error={xpubError}
            id='xpub'
          />
          <InputRow>
            <div className='flex flex-col'>
              <StyledInput
                value={fingerprint}
                onChange={(value) => {
                  setFingerprintError('');
                  setFingerprint(value.toUpperCase());
                }}
                label='Device fingerprint'
                type='text'
                placeholder='9130C3D6'
                error={fingerprintError}
                id='fingerprint'
              />
            </div>
            <div className='flex flex-col'>
              <StyledInput
                value={path}
                disabled
                onChange={setPath}
                label='Derivation path'
                type='text'
                placeholder="m/48'/0'/0'/2'"
              />
            </div>
          </InputRow>

          <InputRow>
            <div className='flex flex-col'>
              <Select
                label='Hardware Wallet'
                options={(Object.keys(types) as Device['type'][])
                  .filter((item) => item !== 'phone' && item !== 'lily')
                  .map((item) => ({
                    label: capitalize(item),
                    onClick: () => setType(item)
                  }))}
                id='hardware_wallet_type'
              />
            </div>
            {options.length > 1 ? (
              <div className='flex flex-col'>
                <Select
                  label='Hardware Wallet Model'
                  options={options.map((item) => ({
                    label: capitalizeAllAndReplaceUnderscore(item),
                    onClick: () => {
                      setModel(String(item));
                    }
                  }))}
                  id='hardware_wallet_model'
                />
              </div>
            ) : null}
          </InputRow>
        </div>
        <div className='flex items-end justify-end'>
          <button
            type='button'
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-green-100 dark:bg-green-700 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 dark:hover:bg-green-600 dark:text-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
            onClick={() => addDevice()}
          >
            Add device
          </button>
        </div>
      </SelectionContainer>
    </div>
  );
};

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled(Input)`
  display: flex;
  flex-direction: column;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1em;
  margin-top: 1em;
`;

export default InputXpubModal;
