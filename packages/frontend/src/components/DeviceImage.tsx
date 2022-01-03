import React from 'react';
import styled from 'styled-components';

import Coldcard from 'src/assets/coldcard.png';
import LedgerNanoS from 'src/assets/ledger_nano_s.png';
import LedgerNanoX from 'src/assets/ledger_nano_x.png';
import TrezorOne from 'src/assets/trezor_1.png';
import TrezorT from 'src/assets/trezor_t.png';
import Cobo from 'src/assets/cobo.png';
import Bitbox from 'src/assets/bitbox02.png';
import Iphone from 'src/assets/iphone.png';

import { Device } from '@lily/types';

interface Props {
  device: Device;
}

export const DeviceImage = ({ device }: Props) => {
  return (
    <DeviceImageWrapper
      src={
        device.type === 'coldcard'
          ? Coldcard
          : device.type === 'ledger' && device.model === 'ledger_nano_s'
          ? LedgerNanoS
          : device.type === 'ledger' && device.model === 'ledger_nano_x'
          ? LedgerNanoX
          : device.type === 'trezor' && device.model === 'trezor_1'
          ? TrezorOne
          : device.type === 'trezor' && device.model === 'trezor_t'
          ? TrezorT
          : device.type === 'cobo'
          ? Cobo
          : device.type === 'bitbox02'
          ? Bitbox
          : Iphone
      }
    />
  );
};

const DeviceImageWrapper = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-height: 250px;
  max-width: 6.25em;
`;
