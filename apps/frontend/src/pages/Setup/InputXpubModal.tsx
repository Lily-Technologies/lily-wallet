import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';

import { Button, Input, Select } from 'src/components';
import { green600, white } from 'src/utils/colors';
import {
  capitalize,
  capitalizeAllAndReplaceUnderscore,
  isOnlyLettersAndNumbers
} from 'src/utils/other';

import { HwiEnumerateResponse, Device } from '@lily/types';

const types = {
  coldcard: ['coldcard'],
  trezor: ['trezor_1', 'trezor_t'],
  ledger: ['ledger_nano_s', 'ledger_nano_x'],
  cobo: ['cobo'],
  bitbox02: ['bitbox02'],
  phone: ['phone'],
  lily: ['lily']
};

const bip32 = BIP32Factory(ecc);
interface Props {
  importedDevices: HwiEnumerateResponse[];
  setImportedDevices: React.Dispatch<React.SetStateAction<HwiEnumerateResponse[]>>;
  closeModal: () => void;
}

const InputXpubModal = ({ importedDevices, setImportedDevices, closeModal }: Props) => {
  const [type, setType] = useState<Device['type']>('coldcard');
  const [model, setModel] = useState<Device['model']>('coldcard');
  const [path, setPath] = useState("m/48'/0'/0'/2'");
  const [fingerprint, setFingerprint] = useState('');
  const [xpub, setXpub] = useState('');
  const [options, setOptions] = useState(Object.values(types[type]));

  // Errors
  const [xpubError, setXpubError] = useState('');
  const [fingerprintError, setFingerprintError] = useState('');

  useEffect(() => {
    setOptions(Object.values(types[type]));
    setModel(Object.values(types[type])[0]);
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
      const updatedDevices = [{ type, model, path, fingerprint, xpub }, ...importedDevices];
      setImportedDevices(updatedDevices);
      closeModal();
    }
  };

  return (
    <>
      <ModalHeaderContainer className='text-gray-900 dark:text-gray-200'>
        Manually input device data
      </ModalHeaderContainer>
      <SelectionContainer>
        <InputSection>
          <Input
            value={xpub}
            onChange={(value) => {
              setXpubError('');
              setXpub(value);
            }}
            label='Extended Public Key (XPub)'
            type='text'
            error={xpubError}
            id='xpub'
          />
          <InputRow>
            <InputContainer>
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
            </InputContainer>
            <InputContainer>
              <StyledInput
                value={path}
                disabled
                onChange={setPath}
                label='Derivation path'
                type='text'
                placeholder="m/48'/0'/0'/2'"
              />
            </InputContainer>
          </InputRow>

          <InputRow>
            <InputContainer>
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
            </InputContainer>
            {options.length > 1 ? (
              <InputContainer>
                <Select
                  label='Hardware Wallet Model'
                  options={options.map((item) => ({
                    label: capitalizeAllAndReplaceUnderscore(item),
                    onClick: () => {
                      setModel(item);
                    }
                  }))}
                  id='hardware_wallet_model'
                />
              </InputContainer>
            ) : null}
          </InputRow>
        </InputSection>

        <ContinueButton background={green600} color={white} onClick={() => addDevice()}>
          Add device
        </ContinueButton>
      </SelectionContainer>
    </>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

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

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5em;
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

const ContinueButton = styled.button`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
`;

export default InputXpubModal;
