import React, { useEffect, Fragment, useState } from "react";
import styled from "styled-components";
import { generateMnemonic } from "bip39";

import { Button, MnemonicWordsDisplayer, DeviceSelect } from "../../components";
import {
  lightBlue,
  blue,
  white,
  darkOffWhite,
  darkGray,
  gray,
} from "../../utils/colors";
import { InnerWrapper, XPubHeaderWrapper, SetupHeaderWrapper, SetupExplainerText, FormContainer, BoxedWrapper, SetupHeader } from './styles';

const CreateWallet = ({
  header,
  walletMnemonic,
  setWalletMnemonic,
  setStep,
  importedDevices,
  availableDevices,
  setAvailableDevices,
  errorDevices,
  importDevice
}) => {
  const [importHWW, setImportHWW] = useState(false);


  useEffect(() => {
    setWalletMnemonic(generateMnemonic(256));
  }, []);

  let screen = null;

  switch (importHWW) {
    case false:
      screen = <Fragment>
        <XPubHeaderWrapper>
          <SetupHeaderWrapper>
            <div>
              <SetupHeader>Write down these recovery words</SetupHeader>
              <SetupExplainerText>
                These 24 words are the keys to your wallet. Write them down and keep
                them in a safe place. Do not share them with anyone else. These can
                be used to recover your wallet if you lose your configuration file.
                </SetupExplainerText>
            </div>
          </SetupHeaderWrapper>
          <ConnectHWWButton
            onClick={() => setImportHWW(true)}
            background={white}
            color={darkGray}>
            Connect hardware wallet
            </ConnectHWWButton>
        </XPubHeaderWrapper>
        <WordContainer>
          <MnemonicWordsDisplayer mnemonicWords={walletMnemonic} />
        </WordContainer>
        <SaveWalletButton
          onClick={() => {
            setStep(3);
          }}>
          I have written these words down <br /> and stored them in a safe place
          </SaveWalletButton>
      </Fragment>
      break;
    case true:
      screen = <Fragment>
        <XPubHeaderWrapper>
          <SetupHeaderWrapper>
            <div>
              <SetupHeader>Connect Devices to Computer</SetupHeader>
              <SetupExplainerText>
                Devices unlocked and connected to your computer will appear here. Click on them to import and manage their funds with Lily.
              </SetupExplainerText>
            </div>
            {/* <ConnectHWWButton htmlFor="localConfigFile" background={white} color={darkGray}>Import from File</ConnectHWWButton> */}
          </SetupHeaderWrapper>
        </XPubHeaderWrapper>
        <DeviceSelect
          deviceAction={importDevice}
          deviceActionText={'Click to Configure'}
          deviceActionLoadingText={'Extracting XPub'}
          configuredDevices={importedDevices}
          unconfiguredDevices={availableDevices}
          errorDevices={errorDevices}
          setUnconfiguredDevices={setAvailableDevices}
          configuredThreshold={1}
        />
        {importedDevices.length === 1 && <ContinueButton
          onClick={() => {
            setStep(3);
          }}>Continue</ContinueButton>}
      </Fragment>

      break;
    default:
      screen = <div>Unexpected error</div>
  }

  return (
    <InnerWrapper style={{ marginBottom: '2em' }}>
      {header}
      <FormContainer>
        <BoxedWrapper>
          {screen}
        </BoxedWrapper>
      </FormContainer>
    </InnerWrapper>
  )
};

const ContinueButton = styled.div`
  ${Button};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
`;

const ConnectHWWButton = styled.label`
  ${Button}
  font-size: 0.75em;
  border: 1px solid ${darkGray};
`;

const SaveWalletButton = styled.div`
  ${Button};
  flex: 1;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
  background: ${lightBlue};
  justify-content: center;
  border-bottom: 1px solid ${darkOffWhite};
`;

export default CreateWallet;
