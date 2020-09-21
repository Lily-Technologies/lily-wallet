import React from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import { CheckCircle } from '@styled-icons/material';

import { StyledIcon, Button } from '../../components';
import { white, darkGray, green, gray500, gray600, gray700 } from '../../utils/colors';
import { FormContainer, InnerWrapper, BoxedWrapper } from './styles';

import { downloadFile } from '../../utils/files';

const SuccessScreen = ({ exportSetupFiles, config }) => {
  const history = useHistory();

  return (
    <InnerWrapper>
      <FormContainer>
        <BoxedWrapperModified>
          <IconWrapper style={{ color: green }}>
            <StyledIcon as={CheckCircle} size={100} />
          </IconWrapper>
          <SuccessText>Setup Success!</SuccessText>
          <SuccessSubtext>
            Your account configuration has been saved in your Lily app data directory. <br /><br />
            You may backup this file to another location for safe keeping now <br /> or later via Settings > Download Backup Configuration.
          </SuccessSubtext>
          <Buttons>
            <SaveBackupButton
              background={white}
              color={gray600}
              onClick={() => {
                downloadFile(JSON.stringify(config), 'lily-config-encrypted.json')
              }}
            >
              Backup Config File
          </SaveBackupButton>
            <DownloadButton
              color={white}
              onClick={async () => {
                await exportSetupFiles();
                history.push('/');
              }}>View Account</DownloadButton>
          </Buttons>
        </BoxedWrapperModified>
      </FormContainer>
    </InnerWrapper>
  )
}

const Buttons = styled.div`
  display: flex;
  margin-top: 2em;
  width: 100%;
  justify-content: center;
`;

const SaveBackupButton = styled.button`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  border: 1px solid #d2d6dc;
  margin-right: 1em;

  &:hover {
    color: ${gray500};
  }
`;

const BoxedWrapperModified = styled(BoxedWrapper)`
  align-items: center;
  padding: 2em;
`;

const IconWrapper = styled.div``;

const SuccessText = styled.div`
  margin-top: 0.5em;
  font-size: 1.5em;
  color: ${gray700}
`;

const SuccessSubtext = styled.div`
  color: ${darkGray};
  margin-top: 2rem;
  text-align: center;
`;

const DownloadButton = styled.button`
  ${Button};
`;

export default SuccessScreen;