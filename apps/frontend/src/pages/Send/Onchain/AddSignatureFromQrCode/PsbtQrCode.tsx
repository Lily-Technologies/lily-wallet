import React from 'react';
import styled from 'styled-components';
import { Psbt } from 'bitcoinjs-lib';
import { V2 } from '@cvbb/qr-protocol/dist';

import { AnimatedQrCode } from 'src/components';

import { gray100 } from 'src/utils/colors';

interface Props {
  psbt: Psbt;
}

const PsbtQrCode = ({ psbt }: Props) => {
  const psbtEncoded = V2.constructQRCode(psbt.toHex());
  return (
    <>
      <ModalHeaderContainer className='border-b border-gray-200 dark:border-gray-700'>
        <span className='text-xl font-medium text-gray-900 dark:text-gray-100'>
          Scan this with your device
        </span>
      </ModalHeaderContainer>
      <div className='px-4 py-5 flex items-center justify-center'>
        <AnimatedQrCode valueArray={psbtEncoded} />
      </div>
    </>
  );
};

const ModalHeaderContainer = styled.div`
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
  height: 90px;
`;

export default PsbtQrCode;
