import React, { Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { Modal, Button, LicenseInformation } from '.';

import { white, green600, gray300, gray400, gray900 } from '../utils/colors';
import { LilyConfig, NodeConfig } from '../types';

interface Props {
  isOpen: boolean
  onRequestClose: () => void
  config: LilyConfig
  nodeConfig: NodeConfig
}

export const LicenseModal = ({
  isOpen,
  onRequestClose,
  config,
  nodeConfig
}: Props) => {

  // KBC-TODO: Have this do something
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
        <LicenseInformation config={config} nodeConfig={nodeConfig} />
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
      </Fragment>
    </Modal >
  )
}

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

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1em 2em 2em;
`;

const RenewButton = styled.button`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;