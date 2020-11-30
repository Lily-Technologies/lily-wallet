import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Psbt } from 'bitcoinjs-lib';
// import { CoboVaultSDK } from "@cvbb/sdk";
import { V2 } from '@cvbb/qr-protocol/dist';

import { AnimatedQrCode } from '../../../components'

import { lightGray } from '../../../utils/colors';

interface Props {
  psbt: Psbt
}

const PsbtQrCode = ({ psbt }: Props) => {
  // const sdk = new CoboVaultSDK();
  // const v2verz = V2.constructQRCode(finalPsbt.toHex())
  // // console.log('v2verz: ', v2verz);
  // // const data = sdk.encodeDataForQR(finalPsbt.toHex().toUpperCase())
  // // console.log('finalPsbt.toBase64(): ', finalPsbt.toHex());
  // // console.log('xxx', data)
  // // const foo = sdk.decodeQRData(data);
  // // console.log('foo: ', foo);

  const psbtEncoded = V2.constructQRCode(psbt.toHex())
  return (
    <Fragment>
      <ModalHeaderContainer>
        Scan this with your device
    </ModalHeaderContainer>
      <ModalContent>
        <OutputItem style={{ wordBreak: 'break-word' }}>
          <AnimatedQrCode
            valueArray={psbtEncoded}
          />
        </OutputItem>
      </ModalContent>
    </Fragment>
  )
}

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229,231,235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

const OutputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5em;
  background: ${lightGray};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const ModalContent = styled.div``;

export default PsbtQrCode;
