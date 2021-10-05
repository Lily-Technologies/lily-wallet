import React from "react";
import styled from "styled-components";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";

interface Props {
    onSuccess: (qrData: string) => void;
}

const ScanLightningQrCode = ({ onSuccess }: Props) => {
    const readQrData = (data: string) => {
        onSuccess(data)
    };

    return (
        <>
            <ModalHeaderContainer>
                Scan the Lightning QR code on your device
            </ModalHeaderContainer>
            <ModalContent>
                <BarcodeScannerComponentStyled
                    // @ts-ignore
                    width={"100%"}
                    onUpdate={(err, result) => {
                        if (result) readQrData(result.getText());
                        else return;
                    }}
                />
            </ModalContent>
        </>
    );
};

const BarcodeScannerComponentStyled = styled(BarcodeScannerComponent)`
  width: 100%;
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

const ModalContent = styled.div``;

export default ScanLightningQrCode;
