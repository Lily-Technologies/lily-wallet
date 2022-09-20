import React from 'react';
import { QuestionMarkCircle } from '@styled-icons/heroicons-outline';

import Coldcard from 'src/assets/coldcard.png';
import LedgerNanoS from 'src/assets/ledger_nano_s.png';
import LedgerNanoX from 'src/assets/ledger_nano_x.png';
import TrezorOne from 'src/assets/trezor_1.png';
import TrezorT from 'src/assets/trezor_t.png';
import Cobo from 'src/assets/cobo.png';
import Bitbox from 'src/assets/bitbox02.png';
import Iphone from 'src/assets/iphone.png';
import Unchained from 'src/assets/unchained.png';

import { Device } from '@lily/types';

interface Props {
  device: Device;
  className?: string;
}

export const DeviceImage = ({ device, className }: Props) => {
  if (device.type === 'unknown') {
    return (
      <div className='flex items-center justify-center py-14 px-7 text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded'>
        <QuestionMarkCircle className='h-10 w-10' />
      </div>
    );
  }
  return (
    <img
      className={className}
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
          : device.type === 'trezor'
          ? TrezorOne
          : device.type === 'cobo'
          ? Cobo
          : device.type === 'bitbox02'
          ? Bitbox
          : device.type === 'unchained'
          ? Unchained
          : Iphone
      }
    />
  );
};
