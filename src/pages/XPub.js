import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';

import { BACKEND_URL } from '../config';

import { Button } from '../components';
import { black, gray, blue, green, lightBlue, offWhite, darkGray, darkOffWhite } from '../utils/colors';

const XPub = ({ device }) => {
  const [xPub, setXPub] = useState('');
  const [path, setPath] = useState('');
  const [xpubLoading, setXpubLoading] = useState(false);

  document.title = `Device Config: ${device.model} (${device.fingerprint})`;

  const getXPub = async () => {
    setXpubLoading(true);
    const { data } = await axios.post(`${BACKEND_URL}/xpub`, {
      deviceType: device.type,
      devicePath: device.path,
      path: path
    });
    setXpubLoading(false);
    setXPub(data.xpub);
  }

  return (
    <Wrapper>
      <FormContainer>
        <SelectDeviceContainer>
          <XPubHeaderWrapper>
            <SelectAnotherDeviceHeader to="..">{'<'} Select a different device</SelectAnotherDeviceHeader>
            <SelectDeviceHeader>{device.model} <SelectDeviceFingerprintHeader>({device.fingerprint})</SelectDeviceFingerprintHeader></SelectDeviceHeader>
          </XPubHeaderWrapper>

          <XPubWrapper>
            <div>
              <XPubHeader>Get XPub</XPubHeader>
              <PathWrapper>
                <PathContainer>
                  <PathHeader>Path:</PathHeader>
                  <PathInput
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                  />
                  <GetXPubButton onClick={getXPub}>{xpubLoading ? 'Retriving XPub...' : 'Get XPub'}</GetXPubButton>
                </PathContainer>
                <CommonPathsWrapper>
                  <div>
                    <BIPHeader>BIP 32:</BIPHeader>
                    m/32'/0/1/0/0
                  </div>
                  <div>
                    <BIPHeader>BIP 44:</BIPHeader>
                    m/44'/0'/1'/0/0
                  </div>
                </CommonPathsWrapper>
              </PathWrapper>
            </div>
            {xPub && (
              <XPubContainer>
                <XpubHeader>XPub ({path}): </XpubHeader>
                <XPubOutput>{xPub}</XPubOutput>
              </XPubContainer>
            )}
            <ResourcesWrapper>
              <ResourcesHeader>Tutorials and resources</ResourcesHeader>
              blah balh blah
              blah blah
            </ResourcesWrapper>
          </XPubWrapper>
        </SelectDeviceContainer>
      </FormContainer>
      <ViewSourceCodeText href="https://github.com/KayBeSee/cc-kitchen-frontend" target="_blank">View Source Code</ViewSourceCodeText>
      <DontTrustVerify>Don't Trust. Verify.</DontTrustVerify>
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

const XPubHeaderWrapper = styled.div`
  color: ${blue};
  background: ${offWhite};
  height: 48px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-top: 12px solid ${blue};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid ${gray};
`;

const PathWrapper = styled.div`
  display: flex;
`;

const PathContainer = styled.div`
  flex: 1 0 250px;
  padding: 12px;
  background: ${lightBlue};
  border-radius: 4px;
  border: solid 1px ${darkOffWhite};
  display: flex;
  flex-direction: column;
`;

const CommonPathsWrapper = styled.div`
  flex: 1 0 250px;
  text-align: right;
  color: ${darkGray};
`;

const BIPHeader = styled.h5`
  color: ${gray};
  margin: 0;
`;

const ResourcesWrapper = styled.div``;

const ResourcesHeader = styled.h1``;

const SelectDeviceHeader = styled.h1`
  font-size: 16px;
  font-weight: 500;
`;

const SelectDeviceFingerprintHeader = styled.span`
  font-size: 12px;
`;

const SelectAnotherDeviceHeader = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  &:visited {
    color: ${blue};
  }
`;

const XPubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  padding: 24px;
  justify-content: space-between;
`;

const XPubHeader = styled.h1`
  margin-top: 0;
`;

const PathHeader = styled.h3`
  margin: 0;
`;

const PathInput = styled.input`
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

const XPubContainer = styled.div`
  padding: 12px;
  background: ${green};
  border-radius: 4px;
`;

const XpubHeader = styled.h5`
  font-size: 14px;
  margin: 4px 0;
`;

const XPubOutput = styled.h5`
  font-size: 8.45px;
  margin: 0;
  text-align: center;
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

export default XPub;