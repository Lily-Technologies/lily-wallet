import React from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import { CheckCircle } from '@styled-icons/material';

import { StyledIcon, Button } from '../../components';
import { white, darkGray, green } from '../../utils/colors';
import { FormContainer, InnerWrapper, BoxedWrapper } from './styles';

const SuccessScreen = ({ exportSetupFiles }) => {
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
            The configuration file will be saved in your default download folder. <br /><br />
            This file is required to restore your wallet next time you start Lilly Wallet.
          </SuccessSubtext>
          <DownloadButton
            color={white}
            onClick={() => {
              history.push('/');
              exportSetupFiles();
            }}>Download Configuration File</DownloadButton>
        </BoxedWrapperModified>
      </FormContainer>
    </InnerWrapper>
  )
}

const BoxedWrapperModified = styled(BoxedWrapper)`
  align-items: center;
  padding: 2em;
`;

const IconWrapper = styled.div``;

const SuccessText = styled.div`
  margin-top: 0.5em;
  font-size: 1.5em;
`;

const SuccessSubtext = styled.div`
  color: ${darkGray};
  margin-top: 2rem;
  text-align: center;
`;

const DownloadButton = styled.div`
  ${Button};
  margin-top: 2em;
`;

export default SuccessScreen;