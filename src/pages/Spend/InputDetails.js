import React from 'react';
import styled from 'styled-components';

import { Button } from '../../components';
import { black, gray, blue, green, lightBlue, offWhite, darkGray, darkOffWhite } from '../../utils/colors';

const InputDetails = ({
  scriptPubKeyAddress,
  setScriptPubKeyAddress,
  witnessScript,
  setWitnessScript,
  unsignedTransaction,
  setUnsignedTransaction,
  caravanFile,
  setCaravanFile,
  bip32path,
  setBip32path,
  step,
  setStep
}) => {
  return (
    <InputDetailsWrapper>
      <div>
        <InputDetailsHeader>Input Details</InputDetailsHeader>
        <InputDetailsSubheader>Enter the following information about the input you are spending from the spend page on your Caravan app.</InputDetailsSubheader>
      </div>
      <DetailsWrapper>
        <DetailsContainer>
          <RowSection>
            <RowSectionItem style={{ flex: 1 }}>
              <PathHeader>Script Public Key Address:</PathHeader>
              <Input
                value={scriptPubKeyAddress}
                placeholder="tb1qfptyhh3zr2h3cwv882fttgmuuyahp00zj68k8awgc5wz4yrdv3tqy94q23"
                onChange={(e) => setScriptPubKeyAddress(e.target.value)}
              />
            </RowSectionItem>
            <RowSectionItem>
              <PathHeader>BIP32 Path:</PathHeader>
              <Input
                value={bip32path}
                placeholder="m/0/0"
                onChange={(e) => setBip32path(e.target.value)}
              />
            </RowSectionItem>
          </RowSection>
          <PathHeader>Witness Script:</PathHeader>
          <Input
            value={witnessScript}
            placeholder="52210283ac6d2c54f377b8cf73aeafa24bd10f9537f029a2fbae7f2ac1decb2bfb64d921034e73d173c72796da4fbfb491e8477639dd5b3c94b34f9879a49a61bc0574c5c221034f3c7c8255c82a3ff785c381e9d414f2363f66ddd4401570e27cf6db7e013a3f53ae"
            onChange={(e) => setWitnessScript(e.target.value)}
          />
          <PathHeader>Unsigned Transaction:</PathHeader>
          <Input
            value={unsignedTransaction}
            placeholder="010000000192a975198c69cb3ec075c06e3f8c5b06bd3ba5df8cf470b63d496a456dd285b50000000000ffffffff01601300000000000017a914ffd0dbb44402d5f8f12d9ba5b484a2c1bb47da428700000000"
            onChange={(e) => setUnsignedTransaction(e.target.value)}
          />
        </DetailsContainer>
      </DetailsWrapper>
      <GetXPubButton onClick={() => setStep(step + 1)}>Next Step</GetXPubButton>
    </InputDetailsWrapper>
  )
}

const DetailsWrapper = styled.div`
  display: flex;
`;

const DetailsContainer = styled.div`
  flex: 1 0 250px;
  padding: 12px;
  background: ${lightBlue};
  border-radius: 4px;
  border: solid 1px ${darkOffWhite};
  display: flex;
  flex-direction: column;
`;

const InputDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  padding: 24px;
  justify-content: space-between;
`;

const RowSection = styled.div`
  display: flex;
`;

const RowSectionItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const PathHeader = styled.h4`
  margin: 0;
`;

const FileUploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


const CaravanFileUploadLabel = styled.label`
  ${Button}
  background: transparent;
  border: 1px solid ${blue};
  color: ${blue};
  pointer: cursor;
`;

const FileInput = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid ${darkOffWhite};
  margin: 8px;
`;

const GetXPubButton = styled.button`
  ${Button};
  padding: 12px;
  margin: 0 8px;
`;

const InputDetailsHeader = styled.h5`
  font-size: 24px;
  margin: 4px 0;
`;

const InputDetailsSubheader = styled.span`
  font-size: 12px;
`;

export default InputDetails;