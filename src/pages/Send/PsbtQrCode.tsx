import React, { Fragment } from 'react';
import styled from 'styled-components';
import { QRCode } from "react-qr-svg";

import { white, black, lightGray, darkOffWhite } from '../../utils/colors';

interface Props {
  psbt: string
}

const PsbtQrCode = ({ psbt }: Props) => (
  <Fragment>
    <ModalHeaderContainer>
      Scan this with your device
    </ModalHeaderContainer>
    <ModalContent>
      <OutputItem style={{ wordBreak: 'break-word' }}>
        <QRCode
          bgColor={white}
          fgColor={black}
          level="Q"
          style={{ width: 256 }}
          value={psbt}
        />
      </OutputItem>
    </ModalContent>
  </Fragment>
)

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
  margin: 12px 0;
  background: ${lightGray};
  border: 1px solid ${darkOffWhite};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const ModalContent = styled.div`
  padding: 1.5em;
`;

export default PsbtQrCode;
