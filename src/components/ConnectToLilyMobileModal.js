import React, { useState, Fragment } from 'react';
import styled from 'styled-components';

import { AnimatedQrCode } from './AnimatedQrCode' // can't import from index https://github.com/styled-components/styled-components/issues/1449
import { Modal, Button } from '.';

import { white, green800 } from '../utils/colors'

const getChunks = (value, parts) => {
  const chunkLength = Math.ceil(value.length / parts);
  const result = []
  for (let i = 1; i <= parts; i++) {
    result.push(`${i}/${parts}(:)${value.slice((chunkLength * (i - 1)), (chunkLength * i))}`)
  }
  return result;
}

export const ConnectToLilyMobileModal = ({ isOpen, onRequestClose, config }) => {
  const [lilyMobileStep, setLilyMobileStep] = useState(0);

  const numChunks = Math.ceil(config.length / 1000);
  const splitValueArray = getChunks(config, numChunks);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setLilyMobileStep(0);
        onRequestClose()
      }}>
      <LilyMobileContainer>
        {lilyMobileStep === 0 && (
          <Fragment>
            <LilyMobileHeader>Connect to Lily Mobile</LilyMobileHeader>
            <LilyMobileContent>You can use your phone as a transaction approver and monitor your account balances on your phone using Lily Mobile.</LilyMobileContent>
            <LilyMobileContent style={{ marginTop: '1em' }}>Download it from the app store by clicking here. Once you have it loaded on your phone, click continue below to view your config QR code.</LilyMobileContent>
            <LilyMobileContinueButton onClick={() => setLilyMobileStep(1)}>Continue</LilyMobileContinueButton>
          </Fragment>
        )}
        {lilyMobileStep === 1 && (
          <Fragment>
            <LilyMobileHeader style={{ textAlign: 'center' }}>Scan the QR Code</LilyMobileHeader>
            <LilyMobileQrContainer>
              <LilyMobileQrCode
                valueArray={splitValueArray}
              />
            </LilyMobileQrContainer>
          </Fragment>
        )}
      </LilyMobileContainer>
    </Modal>
  )
}

const LilyMobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${green800};
  color: ${white};
  padding: 1.5em;
`;

const LilyMobileHeader = styled.span`
  font-size: 1.5em;
  margin-bottom: 1em;
`;

const LilyMobileContent = styled.div`
  font-size: 0.75em;
`;

const LilyMobileContinueButton = styled.button`
  ${Button}
  margin-top: 2em;
`;

const LilyMobileQrCode = styled(AnimatedQrCode)`
  width: 100%;
`;

const LilyMobileQrContainer = styled.div`
  max-width: 500px;
  align-self: center;
`;