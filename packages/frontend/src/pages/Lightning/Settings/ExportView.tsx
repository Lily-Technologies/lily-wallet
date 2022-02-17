import React, { useState } from 'react';
import styled from 'styled-components';
import { QRCode } from 'react-qr-svg';

import { Modal, SettingsTable } from 'src/components';
import { white, black, gray100, green500 } from 'src/utils/colors';

import { LilyLightningAccount } from '@lily/types';
import { requireLightning } from 'src/hocs';

interface Props {
  currentAccount: LilyLightningAccount;
}

const ExportView = ({ currentAccount }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const LndUriQRCode = () => (
    <Container>
      <ModalHeaderContainer>
        Scan this with your device to connect to your node remotely
      </ModalHeaderContainer>
      <ModalContent>
        <QRCode
          bgColor={white}
          fgColor={black}
          level='Q'
          style={{ width: 256 }}
          value={currentAccount.config.connectionDetails.lndConnectUri}
        />
      </ModalContent>
    </Container>
  );

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Export Account</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          Use the options below to use other software to verify the information in Lily.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>

      <SettingsTable.Row>
        <SettingsTable.KeyColumn>LNDConnect URI</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              onClick={() => {
                openInModal(<LndUriQRCode />);
              }}
            >
              View QR Code
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>

      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)}>
        {modalContent}
      </Modal>
    </SettingsTable.Wrapper>
  );
};

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
`;

const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5em;
  background: ${gray100};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default requireLightning(ExportView);
