import React, { useState, Fragment, useContext } from 'react';
import styled from 'styled-components';

import { AnimatedQrCode } from './AnimatedQrCode'; // can't import from index https://github.com/styled-components/styled-components/issues/1449
import { Button } from '.';

import { white, black, green600 } from 'src/utils/colors';

import { ConfigContext } from 'src/context/ConfigContext';

const getChunks = (value: string, parts: number) => {
  const chunkLength = Math.ceil(value.length / parts);
  const result = [];
  for (let i = 1; i <= parts; i++) {
    result.push(`${i}/${parts}(:)${value.slice(chunkLength * (i - 1), chunkLength * i)}`);
  }
  return result;
};

export const ConnectToLilyMobileModal = () => {
  const { config } = useContext(ConfigContext);
  const [lilyMobileStep, setLilyMobileStep] = useState(0);
  const configStringified = JSON.stringify(config);
  const numChunks = Math.ceil(configStringified.length / 1000);
  const splitValueArray = getChunks(configStringified, numChunks);

  return (
    <LilyMobileContainer>
      {lilyMobileStep === 0 && (
        <Fragment>
          <LilyMobileHeader>Connect to Lily Mobile</LilyMobileHeader>
          <LilyMobileContent>
            You can use your phone as a transaction approver and monitor your account balances on
            your phone using Lily Mobile.
          </LilyMobileContent>
          <LilyMobileContent style={{ marginTop: '1em' }}>
            Download it from the app store by clicking here. Once you have it loaded on your phone,
            click continue below to view your config QR code.
          </LilyMobileContent>
          <LilyMobileContinueButton
            background={green600}
            color={white}
            onClick={() => setLilyMobileStep(1)}
          >
            Continue
          </LilyMobileContinueButton>
        </Fragment>
      )}
      {lilyMobileStep === 1 && (
        <Fragment>
          <LilyMobileHeader style={{ textAlign: 'center' }}>Scan the QR Code</LilyMobileHeader>
          <LilyMobileQrContainer>
            <LilyMobileQrCode valueArray={splitValueArray} />
          </LilyMobileQrContainer>
        </Fragment>
      )}
    </LilyMobileContainer>
  );
};

const LilyMobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${black};
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
