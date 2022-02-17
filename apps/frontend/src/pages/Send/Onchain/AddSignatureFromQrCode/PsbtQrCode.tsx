import React from "react";
import styled from "styled-components";
import { Psbt } from "bitcoinjs-lib";
import { V2 } from "@cvbb/qr-protocol/dist";

import { AnimatedQrCode } from "src/components";

import { gray100 } from "src/utils/colors";

interface Props {
  psbt: Psbt;
}

const PsbtQrCode = ({ psbt }: Props) => {
  const psbtEncoded = V2.constructQRCode(psbt.toHex());
  return (
    <>
      <ModalHeaderContainer>Scan this with your device</ModalHeaderContainer>
      <ModalContent>
        <OutputItem style={{ wordBreak: "break-word" }}>
          <AnimatedQrCode valueArray={psbtEncoded} />
        </OutputItem>
      </ModalContent>
    </>
  );
};

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

const OutputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5em;
  background: ${gray100};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const ModalContent = styled.div``;

export default PsbtQrCode;
