import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';

// import CaravanFileUpload from './CaravanFileUpload';
import InputDetails from './InputDetails';
import SignWithDevice from './SignWithDevice';


import { black, gray, blue, green, lightBlue, offWhite, darkGray, darkOffWhite } from '../../utils/colors';

const Spend = () => {
  const [signedPsbt, setSignedPsbt] = useState('');
  const [psbt, setPsbt] = useState('');
  const [signPsbtLoading, setSignPsbtLoading] = useState(false);
  const [scriptPubKeyAddress, setScriptPubKeyAddress] = useState('');
  const [witnessScript, setWitnessScript] = useState('');
  const [unsignedTransaction, setUnsignedTransaction] = useState('');
  const [bip32path, setBip32path] = useState('');
  const [caravanFile, setCaravanFile] = useState(null);
  const [step, setStep] = useState(0);

  document.title = `Spend Funds - Coldcard Kitchen`;

  return (
    <Wrapper>
      <FormContainer>
        <SelectDeviceContainer>
          <SpendHeaderWrapper>
            <MainMenuHeader to="..">{'<'} Main Menu</MainMenuHeader>
            <SelectDeviceHeader>Send Transaction</SelectDeviceHeader>
          </SpendHeaderWrapper>

          {/* {step === 0 && (
            <CaravanFileUpload
              caravanFile={caravanFile}
              setCaravanFile={setCaravanFile}
              step={step}
              setStep={setStep}
            />
          )} */}

          {step === 1 && (
            <InputDetails
              scriptPubKeyAddress={scriptPubKeyAddress}
              setScriptPubKeyAddress={setScriptPubKeyAddress}
              witnessScript={witnessScript}
              setWitnessScript={setWitnessScript}
              unsignedTransaction={unsignedTransaction}
              setUnsignedTransaction={setUnsignedTransaction}
              caravanFile={caravanFile}
              setCaravanFile={setCaravanFile}
              bip32path={bip32path}
              setBip32path={setBip32path}
              step={step}
              setStep={setStep}
            />
          )}

          {step === 2 && (
            <SignWithDevice
              scriptPubKeyAddress={scriptPubKeyAddress}
              witnessScript={witnessScript}
              unsignedTransaction={unsignedTransaction}
              caravanFile={caravanFile}
              bip32path={bip32path}
              step={step}
              setStep={setStep}
            />
          )}
        </SelectDeviceContainer>
      </FormContainer>
    </Wrapper >
  )
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  // margin-top: -1px;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding-top: 50px;
`;

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SelectDeviceContainer = styled.div`
  max-width: 750px;
  background: #fff;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin: 18px;
`;

const SpendHeaderWrapper = styled.div`
  color: ${blue};
  background: ${offWhite};
  height: 48px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: .75em;
  border-top: 12px solid ${blue};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid ${gray};
`;

const SelectDeviceHeader = styled.h1`
  font-size: 1em;
  font-weight: 500;
`;

const MainMenuHeader = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  &:visited {
    color: ${blue};
  }
`;

const ViewSourceCodeText = styled.a`
  color: ${black};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: -0.03em;
`;

const DontTrustVerify = styled.span`
  color: ${gray};
`;

export default Spend;