import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import {
  XPubHeaderWrapper,
  SetupHeaderWrapper,
  SetupExplainerText,
  FormContainer,
  BoxedWrapper,
  SetupHeader
} from './styles';

import PageHeader from './PageHeader';

import { Button, Input, Spinner } from 'src/components';

import { white, green600 } from 'src/utils/colors';

import { PlatformContext } from 'src/context';
import { LightningConfig } from '@lily/types';
import { ChannelBalanceResponse, GetInfoResponse } from '@lily-technologies/lnrpc';

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  newAccount: LightningConfig;
  setNewAccount: React.Dispatch<React.SetStateAction<LightningConfig>>;
  setTempLightningState: React.Dispatch<
    React.SetStateAction<(GetInfoResponse & ChannelBalanceResponse) | undefined>
  >;
}

const NewLightningScreen = ({
  setStep,
  newAccount,
  setNewAccount,
  setTempLightningState
}: Props) => {
  const { platform } = useContext(PlatformContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const attemptConnection = async () => {
    setIsLoading(true);
    try {
      const data = await platform.lightningConnect(newAccount.connectionDetails.lndConnectUri);
      setTempLightningState(data);
      setStep(3);
    } catch (e) {
      if (e instanceof Error) {
        console.log('/lightning-connect error: ', e.message);
        setError(e.message);
        setIsLoading(false);
      }
    }
  };

  if (!newAccount.connectionDetails) {
    return null;
  }

  return (
    <div className='w-full justify-center text-gray-900 dark:text-gray-200 overflow-x-hidden'>
      <PageHeader
        headerText={`Connect your lightning wallet`}
        setStep={setStep}
        showCancel={true}
      />
      <FormContainer>
        <BoxedWrapper>
          <XPubHeaderWrapper>
            <SetupHeaderWrapper>
              <div>
                <SetupHeader>Input your LNDConnect string</SetupHeader>
                <SetupExplainerText>
                  Input your LNDConnect string found on your node.
                </SetupExplainerText>
              </div>
            </SetupHeaderWrapper>
          </XPubHeaderWrapper>
          <AnotherContainer>
            <Input
              value={newAccount.connectionDetails.lndConnectUri}
              onChange={(value) => {
                setNewAccount({
                  ...newAccount,
                  connectionDetails: {
                    lndConnectUri: value
                  }
                });
              }}
              label='LND Connect URI'
              placeholder='lndconnect://dfasdfdfadfafdf27kuuepeqmxpla4gkmcvbjuiuafikstbyfsnaahxvqd.onion:10009?cert=MIICJDCCAcqgAwIBAgIQHwI3rZ6WKo62pQ-mHThUjjAKBggqhkjOPQQDAjA4MR8wHQYDVQQKExZsbmQgYXV0b2dlbmVyYXRlZCBjZXJ0MRUwEwYDVQQDEwx1bWJyZWwubG9jYWwwHhcNMjEwMjAyMjMzNjUyWhcNMjIwMzMwMjMzNjUyWjA4MR8wHQYDVQQKExZsbmQgYXV0b2dlbmVyYXRlZCBjZXJ0MRUwEwYDVQQDEwx1bWJyZX_5FufyjI_8Gt-gsp0FWT5SbqQTXsi-miiCbMVPMGWauWZnHt8vBSyTbrlZclo4G1MIGyMA4GA1UdDwEB_wQEAwICpDATBgNVHSUEDDAKBggrBgEFBQcDATAPBgNVHRMBAf8EBTADAQH_MB0GA1UdDgQWBBRqJKzY0mA_HHiKD8oJQw6CgxSq5zBbBgNVHREEVDBSgglsb2NhbGhvc3SCDHVtYnJlbC5sb2NhbIIEdW5peIIKdW5peHBhY2tldIIHYnVmY29ubocEfwAAAYcQAAAAAAAAAAAAAAAAAAAAAYcEChUVCTAKBggqhkjOPQQDAgNIADBFAiEAtoTlp0CIArPm_2wUn7QDUGqJCDaqSplsSvk4ol9pBoYs_OQClU2&macaroon=AgEDbG5kAusBAwoQRS5dNbHOmyqBr45cYt7CfxIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaFAoIbWFjYXJvb24SCGdlbmVyYXRlGhYKB21lc3NhZ2USBHJlYWQSBXdyaXRlGhcKCG9mZmNoYWluEgRyZWFkEgV3cml0ZRoWCgdvbmNoYWluEgRyZWFkEgV3cml0ZRoUCgVwZWVycxIEcmVhESfC21-Iois71G34f4c9ndvk7n5aFnkJYLYoayJTQ'
              type='text'
              error={error}
            />
          </AnotherContainer>
        </BoxedWrapper>
        <ContinueButton
          background={green600}
          color={white}
          onClick={() => {
            attemptConnection();
          }}
        >
          {isLoading ? (
            <>
              <Spinner />
              Connecting...
            </>
          ) : (
            'Continue'
          )}
        </ContinueButton>
      </FormContainer>
    </div>
  );
};

const ContinueButton = styled.button`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  width: 100%;
`;

const AnotherContainer = styled.div`
  padding-right: 1em;
  padding-left: 1em;
  padding-top: 1.75em;
  padding-bottom: 1.75em;
`;

export default NewLightningScreen;
