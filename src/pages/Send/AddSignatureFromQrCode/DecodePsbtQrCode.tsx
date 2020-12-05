import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { V2 } from '@cvbb/qr-protocol/dist';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";

interface Props {
  importSignatureFromFile: (file: string) => void
}

interface KeyValue {
  [key: string]: string
}

const DecodePsbtQrCode = ({ importSignatureFromFile }: Props) => {
  const [barcodeData, setBarcodeData] = useState({} as KeyValue);

  const readQrData = (data: string) => {
    const parsed = data.split('/');
    const numPieces = parsed[1].split('OF')[1];
    barcodeData[parsed[1].substring(0, parsed[1].indexOf('OF'))] = data
    setBarcodeData(barcodeData);

    if (Object.keys(barcodeData).length === parseInt(numPieces, 10)) {
      const file = V2.extractQRCode(Object.values(barcodeData));
      importSignatureFromFile(file)
    }
  }

  return (
    <Fragment>
      <ModalHeaderContainer>
        Scan the QR code on your device
    </ModalHeaderContainer>
      <ModalContent>
        <BarcodeScannerComponentStyled
          // @ts-ignore
          width={'100%'}
          onUpdate={(err, result) => {
            if (result) readQrData(result.getText())
            else return;
          }}
        />
      </ModalContent>
    </Fragment>
  )
}

const BarcodeScannerComponentStyled = styled(BarcodeScannerComponent)`
  width: 100%;
`;

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

const ModalContent = styled.div``;

export default DecodePsbtQrCode;
