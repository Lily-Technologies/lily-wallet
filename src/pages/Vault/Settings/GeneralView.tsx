import React, { useContext } from "react";
import styled, { css } from "styled-components";
import moment from "moment";
import { Network } from "bitcoinjs-lib";

import { Button } from "../../../components";

import DeleteAccountModal from "./DeleteAccountModal";
import EditAccountNameModal from "./EditAccountNameModal";
import DeviceDetailsModal from "./DeviceDetailsModal";

import { AccountMapContext } from "../../../AccountMapContext";
import { ModalContext } from "../../../ModalContext";

import { mobile } from "../../../utils/media";
import { capitalize } from "../../../utils/other";
import {
  white,
  red500,
  green500,
  gray200,
  gray500,
  gray900,
} from "../../../utils/colors";
interface Props {
  password: string;
  currentBitcoinNetwork: Network;
}

const GeneralView = ({ password, currentBitcoinNetwork }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const { openInModal, closeModal } = useContext(ModalContext);

  return (
    <GeneralSection>
      <HeaderSection>
        <HeaderTitle>Account Information</HeaderTitle>
        <HeaderSubtitle>
          This information is private and only seen by you.
        </HeaderSubtitle>
      </HeaderSection>

      <ProfileRow>
        <ProfileKeyColumn>Name</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>{currentAccount.config.name}</ProfileValueText>
          <ProfileValueAction>
            <ActionButton
              background={white}
              color={green500}
              onClick={() =>
                openInModal(
                  <EditAccountNameModal
                    password={password}
                    closeModal={closeModal}
                  />
                )
              }
            >
              Edit
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>Created</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>
            {moment(currentAccount.config.created_at).format("MMMM Do YYYY")}
          </ProfileValueText>
          <ProfileValueAction></ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
      <ProfileRow>
        <ProfileKeyColumn>ID</ProfileKeyColumn>
        <ProfileValueColumn>
          <ProfileValueText>{currentAccount.config.id}</ProfileValueText>
          <ProfileValueAction></ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>

      <HeaderSection>
        <HeaderTitle>Device Information</HeaderTitle>
        <HeaderSubtitle>
          Information about the devices that approve transactions for this
          account.
        </HeaderSubtitle>
      </HeaderSection>
      {currentAccount.config.extendedPublicKeys?.map((item) => (
        <ProfileRow>
          <ProfileKeyColumn>{item.device.fingerprint}</ProfileKeyColumn>
          <ProfileValueColumn>
            <ProfileValueText>{capitalize(item.device.type)}</ProfileValueText>
            <ProfileValueAction>
              <ActionButton
                background={white}
                color={green500}
                onClick={() =>
                  openInModal(
                    <DeviceDetailsModal
                      item={item}
                      currentBitcoinNetwork={currentBitcoinNetwork}
                    />
                  )
                }
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
              onClick={() =>
                openInModal(<DeleteAccountModal password={password} />)
              }
            >
              Delete
            </ActionButton>
          </ProfileValueAction>
        </ProfileValueColumn>
      </ProfileRow>
    </GeneralSection>
  );
};

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

export default GeneralView;
