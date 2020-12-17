import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { Network } from 'bitcoinjs-lib';

import { Modal, Button } from '../../../components';

import DeleteAccountModal from './DeleteAccountModal';
import EditAccountNameModal from './EditAccountNameModal';
import DeviceDetailsModal from './DeviceDetailsModal';

import { AccountMapContext } from '../../../AccountMapContext';
import { LilyConfig } from '../../../types';

import { mobile } from '../../../utils/media';
import { white, red500, green500, gray200, gray500, gray900 } from '../../../utils/colors';

interface Props {
  config: LilyConfig,
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>,
  password: string
  currentBitcoinNetwork: Network
}

const GeneralView = ({ config, setConfigFile, password, currentBitcoinNetwork }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  }

  return (
    <GeneralSection>
      <HeaderSection>
        <HeaderTitle>Account Information</HeaderTitle>
        <HeaderSubtitle>This information is private and only seen by you.</HeaderSubtitle>
      </HeaderSection>

      <ProfileRow>
        <ProfileKeyColumn>Name</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>{currentAccount.config.name}</ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() => openInModal(<EditAccountNameModal config={config} setConfigFile={setConfigFile} password={password} closeModal={closeModal} />)}
            >Edit</ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Created</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>{moment(currentAccount.config.created_at).format('MMMM Do YYYY')}</ProfileValueText>
          <ProfileValueAction>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>

      <HeaderSection>
        <HeaderTitle>Device Information</HeaderTitle>
        <HeaderSubtitle>Information about the devices that approve transactions for this account.</HeaderSubtitle>
      </HeaderSection>
      {currentAccount.config.extendedPublicKeys?.map((item) => (
        <ProfileRow>
          <ProfileKeyColumn>{item.device.fingerprint}</ProfileKeyColumn>
          <ProfileValueColumn>
            <ProfileValueText>{item.device.type.charAt(0).toUpperCase() + item.device.type.slice(1)}</ProfileValueText>
            <ProfileValueAction>
              <ActionButton
                background={white}
                color={green500}
                onClick={() => openInModal(<DeviceDetailsModal item={item} currentBitcoinNetwork={currentBitcoinNetwork} />)}
              >
                View Details
              </ActionButton>
            </ProfileValueAction>
          </ProfileValueColumn>
        </ProfileRow>
      ))}

      <HeaderSection>
        <HeaderTitle>Danger Zone</HeaderTitle>
        <HeaderSubtitle>Remove this account from Lily Wallet.</HeaderSubtitle>
      </HeaderSection>
      <ProfileRow>
        <ProfileKeyColumn>Delete Account</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText></ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={red500}
              onClick={() => openInModal(<DeleteAccountModal config={config} setConfigFile={setConfigFile} password={password} />)}>
              Delete
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal()}>
        <ModalContentWrapper>
          {modalContent}
        </ModalContentWrapper>
      </Modal>
    </GeneralSection>
  )
}

const HeaderSection = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 1em;
`;

const HeaderTitle = styled.h3`
  color: ${gray900};
  line-height: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.5em;
`;

const HeaderSubtitle = styled.span`
  color: ${gray500};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  max-width: 42rem;
`;

const GeneralSection = styled.div`
  padding: 0.5em 1.5em;
`;

const ProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-top: 1px solid ${gray200};

  ${mobile(css`
    display: block;
  `)}
`;

const ProfileKeyColumn = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 600;
  align-items: center;
  display: flex;
`;

const ProfileValueColumn = styled.div`
  grid-column: span 2 / span 2;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  display: flex;
  align-items: center;
`;

const ProfileValueText = styled.span`
  flex: 1;
`;

const ProfileValueAction = styled.span`
  margin-left: 1rem;
`;

const ActionButton = styled.button`
  ${Button};
  font-weight: 600;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1.5em;
  align-items: flex-start;

  ${mobile(css`
    flex-direction: column;
    align-items: center;
    padding-top: 1.25em;
    padding-bottom: 1em;
    padding-left: 1em;
    padding-right: 1em;
    margin-left: 0;
  `)};  
`;

export default GeneralView;