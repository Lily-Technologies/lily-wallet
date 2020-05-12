import React from 'react';
import styled from 'styled-components';

import { PageWrapper, PageTitle } from '../../components';

import { black, lightGray, gray, blue, darkGray, white, offWhite } from '../../utils/colors';

const Transfer = ({ caravanFile }) => {
  return (
    <PageWrapper>
      <PageTitle>Transfer</PageTitle>
      <ValueWrapper>

        To do...

        </ValueWrapper>
    </PageWrapper>
  )
};

const ValueWrapper = styled.div`
  background: ${white};
  padding: 1.5em;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-top: solid 11px ${blue};
`;

export default Transfer