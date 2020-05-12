import React, { useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { RestaurantMenu } from '@styled-icons/material';
import { StyledIcon, StyledIconSpinning } from '../components';

import { Button } from '../components';
import { black, darkGray } from '../utils/colors';

const ColdcardImportInstructions = ({ setCaravanFile }) => {
  document.title = `ColdcardImportInstructions - Coldcard Kitchen`;
  const history = useHistory();

  return (
    <Wrapper>
      <FormContainer>
        <SelectDeviceContainer>
          <DevicesWrapper>
            <h1>Import File to Coldcard</h1>
            <StyledIconSpinning as={RestaurantMenu} size={96} />

            <Instructions>1) Drag and drop coldcard_import_file.txt into an SD Card</Instructions>
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
  // margin-top: -1px;
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
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  margin: 18px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 250px;
  padding: 1.5em;
  justify-content: center;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const ScanDevicesButton = styled(Link)`
  ${Button};
  padding: 1em;
  font-size: 1em;
  margin-top: 12px;
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