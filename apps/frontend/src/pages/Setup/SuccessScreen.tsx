import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { CheckCircle } from '@styled-icons/material';

import { StyledIcon, Button } from 'src/components';
import { white, green500, green600, gray500, gray600, gray700 } from 'src/utils/colors';
import { FormContainer, InnerWrapper, BoxedWrapper } from './styles';

import { downloadFile } from 'src/utils/files';

import { LilyConfig } from '@lily/types';
import { PlatformContext } from 'src/context';

interface Props {
  config: LilyConfig;
}

const SuccessScreen = ({ config }: Props) => {
  const history = useHistory();
  const { platform } = useContext(PlatformContext);

  return (
    <InnerWrapper>
      <FormContainer>
        <BoxedWrapperModified>
          <IconWrapper style={{ color: green500 }}>
            <StyledIcon as={CheckCircle} size={100} />
          </IconWrapper>
          <h1 className='text-2xl text-color-gray-700 dark:text-color-gray-200'>Setup Success!</h1>
          <SuccessSubtext>
            Your account configuration has been saved to this computer. <br />
            <br />
            You may backup this file to another location for safe keeping now <br /> or later via
            Settings &gt; Download Backup Configuration.
          </SuccessSubtext>
          <Buttons>
            <SaveBackupButton
              background={white}
              color={gray600}
              onClick={() => {
                downloadFile(JSON.stringify(config), 'lily-config-encrypted.json', platform);
              }}
            >
              Save Backup File
            </SaveBackupButton>
            <DownloadButton
              background={green600}
              color={white}
              onClick={() => {
                history.push(`/`);
              }}
            >
              View Accounts
            </DownloadButton>
          </Buttons>
        </BoxedWrapperModified>
      </FormContainer>
    </InnerWrapper>
  );
};

const Buttons = styled.div`
  display: flex;
  margin-top: 2em;
  width: 100%;
  justify-content: center;
`;

const SaveBackupButton = styled.button`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #d2d6dc;
  margin-right: 1em;
  flex: 1;

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
  color: ${gray700};
`;

const SuccessSubtext = styled.div`
  color: ${gray600};
  margin-top: 2rem;
  text-align: center;
`;

const DownloadButton = styled.button`
  ${Button};
  flex: 1;
`;

export default SuccessScreen;
