import React from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";

import { Button } from '.'

import { white, gray800, green700 } from '../utils/colors';

export const NoAccountsEmptyState = () => {
  const history = useHistory();

  return (
    <Container>
      <Text>You haven't added any accounts yet!</Text>

      <CreateAccountButton
        background={green700}
        color={white}
        onClick={() => history.push('/setup')}>
        Add your first account
      </CreateAccountButton>
    </Container>
  )
}

const Container = styled.div`
  background: ${white};
  padding: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.385rem;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
`;

const Text = styled.span`
  color: ${gray800};
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 3rem;
`;

const CreateAccountButton = styled.button`
  ${Button};
`;