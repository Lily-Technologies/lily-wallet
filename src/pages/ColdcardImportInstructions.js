import React from 'react';
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';

import { Button } from '../components';
import { black, darkGray } from '../utils/colors';

const ColdcardImportInstructions = () => {
  document.title = `ColdcardImportInstructions - Lily Wallet`;
  const history = useHistory();

  return (
    <Wrapper>
      <FormContainer>
        <SelectDeviceContainer>
          <DevicesWrapper>
            <h1>Import File to Coldcard</h1>

            <Instructions style={{ marginTop: '1em' }}>1) Drag and drop coldcard_import_file.txt into an SD Card</Instructions>
            <Instructions>2) Put SD Card into Coldcard Wallet</Instructions>
            <Instructions>3) Import Wallet: Settings > Multisig Wallets > Import from SD</Instructions>

            <ScanDevicesButton
              onClick={() => history.push('/vault')}>
              I have completed these instructions
              </ScanDevicesButton>
          </DevicesWrapper>
        </SelectDeviceContainer>
      </FormContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding-top: 150px;
`;

const Instructions = styled.div`
  color: ${darkGray};
  align-self: flex-start;
  padding: 0.35em;
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
  justify-content: center;
  align-items: center;
  padding: 0;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  margin: 18px;
`;

const ScanDevicesButton = styled(Link)`
  ${Button};
  padding: 1em;
  font-size: 1em;
  margin-top: 2.5em;
  font-weight: 700;
`;

const DevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-wrap: wrap;
`;

export default ColdcardImportInstructions;