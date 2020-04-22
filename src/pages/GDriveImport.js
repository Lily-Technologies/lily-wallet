import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { AES, enc } from 'crypto-js';
import { RestaurantMenu } from '@styled-icons/material';
import { StyledIcon, StyledIconSpinning } from '../components';

import { Button } from '../components';
import { black, gray, darkOffWhite, lightGray, darkGray, blue } from '../utils/colors';

import { getConfigFileFromGoogleDrive, saveFileToGoogleDrive } from '../utils/google-drive';


const GDriveImport = ({ setCaravanFile }) => {
  document.title = `GDriveImport - Coldcard Kitchen`;
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [encryptedCaravanFile, setEncryptedCaravanFile] = useState(null);

  const history = useHistory();


  useEffect(() => {
    const onload = async () => {
      // await saveFileToGoogleDrive({ "name": "Coldcard Kitchen", "addressType": "P2WSH", "network": "testnet", "client": { "type": "public" }, "quorum": { "requiredSigners": 2, "totalSigners": 3 }, "extendedPublicKeys": [{ "name": "34ecf56b", "bip32Path": "m/0", "xpub": "tpubDECB21DPAjBvUtqSCGWHJrbh6nSg9JojqmoMBuS5jGKTFvYJb784Pu5hwq8vSpH6vkk3dZmjA3yR7mGbrs3antkL6BHVHAyjPeeJyAiVARA", "method": "xpub" }, { "name": "9130c3d6", "bip32Path": "m/0", "xpub": "tpubDDv6Az73JkvvPQPFdytkRrizpdxWtHTE6gHywCRqPu3nz2YdHDG5AnbzkJWJhtYwEJDR3eENpQQZyUxtFFRRC2K1PEGdwGZJYuji8QcaX4Z", "method": "xpub" }, { "name": "4f60d1c9", "bip32Path": "m/0", "xpub": "tpubDFR1fvmcdWbMMDn6ttHPgHi2Jt92UkcBmzZ8MX6QuoupcDhY7qoKsjSG2MFvN66r2zQbZrdjfS6XtTv8BjED11hUMq3kW2rc3CLTjBZWWFb", "method": "xpub" }] });
      const encryptedCaravanFile = await getConfigFileFromGoogleDrive();
      if (encryptedCaravanFile) {
        setLoading(false);
        setEncryptedCaravanFile(encryptedCaravanFile)
      } else {
        history.replace('/setup');
      }
    }
    onload();
  }, []);

  const unlockFile = () => {
    // KBC-TODO: probably need error handling for wrong password
    setLoading(true);
    var bytes = AES.decrypt(encryptedCaravanFile, password);
    var decryptedData = JSON.parse(bytes.toString(enc.Utf8));
    setCaravanFile(decryptedData);
    history.replace('/vault');
  }

  return (
    <Wrapper>
      <MainText>
        <CandyImage src={require('../assets/sugar.svg')} />
        Candyman
        </MainText>
      <Subtext>Candyman is a self-custody Bitcoin wallet that allows you to easily store, manage, and spend Bitcoin</Subtext>
      <FormContainer>
        <SelectDeviceContainer>
          <DevicesWrapper>
            {loading && <h1>Loading Wallet</h1>}
            {loading && <StyledIconSpinning as={RestaurantMenu} size={96} />}
            {loading && <h3>Please wait...</h3>}

            {encryptedCaravanFile && <h2>Type in password to unlock wallet</h2>}
            {encryptedCaravanFile && <PasswordInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />}
            {encryptedCaravanFile && <UnlockButton onClick={() => unlockFile()}>Unlock Wallet</UnlockButton>}
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

const MainText = styled.div`
  display: flex;
  font-size: 48px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const Subtext = styled.div`
  font-size: 12px;
  color: ${darkGray};
  margin-bottom: 12px;
`;

const CandyImage = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 12px;
`;

const PasswordInput = styled.input`
  position: relative;
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: 12px;
  text-align: center;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px;
  border-radius: 4px;
  font-size: 24px;
  z-index: 1;
  font-family: 'Montserrat', sans-serif;

  ::placeholder {
    color: ${gray};
  }

  :active, :focused {
    outline: 0;
    border: none;
  }
`;

const UnlockButton = styled.div`
  ${Button};
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
  padding: 24px;
  justify-content: center;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const ScanDevicesButton = styled(Link)`
  ${Button};
  padding: 16px;
  font-size: 16px;
  margin-top: 12px;
  font-weight: 700;
  flex: 1;
`;

const DevicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-wrap: wrap;
`;

export default GDriveImport;