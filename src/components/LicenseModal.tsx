import React, { Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { Button, Modal } from '.';

import { white, green600, gray300, gray400, gray500, gray900 } from '../utils/colors';

interface Props {
  isOpen: boolean
  onRequestClose: () => void
}

export const LicenseModal = ({
  isOpen,
  onRequestClose
}: Props) => {

  const clickRenewLicense = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_LILY_ENDPOINT}/payment-address`);
    console.log('data: ', data);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <Fragment>
        <ModalHeader>
          <HeaderText>License Information</HeaderText>
        </ModalHeader>
        <InputsWrapper>
          <ItemContainer>
            <ItemLabel>Payment Transaction</ItemLabel>
            <ItemValue>7c30da6f78978ec475cd7d050fb7a791e6bf740756d8278e8323772b26c14033</ItemValue>
          </ItemContainer>

          <ItemContainer>
            <ItemLabel>License Expires</ItemLabel>
            <ItemValue>Block 613,022</ItemValue>
          </ItemContainer>

          <ItemContainer>
            <ItemLabel>Approximate Expire Date</ItemLabel>
            <ItemValue>Dec 18, 2021</ItemValue>
          </ItemContainer>

          <Buttons>
            <RenewButton
              style={{ border: `1px solid ${gray400}`, marginRight: '1em' }}
              color={gray900}
              background={white}>
              Contact Support
          </RenewButton>
            <RenewButton
              onClick={() => clickRenewLicense()}
              color={white}
              background={green600}>
              Renew License
          </RenewButton>
          </Buttons>
        </InputsWrapper>
      </Fragment>
    </Modal >
  )
}

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const RenewButton = styled.button`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const ItemContainer = styled.div`
  margin: 1em 0;
`;

const ItemLabel = styled.div`
  color: ${gray500};
  font-weight: 900;
`;

const ItemValue = styled.div`
  color: ${gray900};
`;

const ModalHeader = styled.div`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-top: -.5rem;
  justify-content: space-between;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${gray300};
`;

const HeaderText = styled.div`
  margin-top: .5rem;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 500;
`;

const InputsWrapper = styled.div`
  padding: 1em 2em 2em;
`;