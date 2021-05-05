import React, { useState, useContext } from "react";
import moment from "moment";
import { Network } from "bitcoinjs-lib";

import { Modal, SettingsTable } from "../../../components";

import DeleteAccountModal from "./DeleteAccountModal";
import EditAccountNameModal from "./EditAccountNameModal";
import DeviceDetailsModal from "./DeviceDetailsModal";

import { AccountMapContext } from "../../../AccountMapContext";

import { capitalize } from "../../../utils/other";
import { white, red500, green500 } from "../../../utils/colors";
interface Props {
  password: string;
  currentBitcoinNetwork: Network;
}

const GeneralView = ({ password, currentBitcoinNetwork }: Props) => {
  const { currentAccount } = useContext(AccountMapContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openInModal = (component: JSX.Element) => {
    setModalIsOpen(true);
    setModalContent(component);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  return (
    <SettingsTable.Wrapper>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>
          Account Information
        </SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          This information is private and only seen by you.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>

      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Name</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn style={{ paddingTop: 0, paddingBottom: 0 }}>
          <SettingsTable.ValueText>
            {currentAccount.config.name}
          </SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              background={white}
              color={green500}
              onClick={() =>
                openInModal(
                  <EditAccountNameModal
                    password={password}
                    closeModal={() => setModalIsOpen(false)}
                  />
                )
              }
            >
              Edit
            </SettingsTable.ActionButton>
          </SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Created</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText>
            {moment(currentAccount.config.created_at).format("MMMM Do YYYY")}
          </SettingsTable.ValueText>
          <SettingsTable.ValueAction></SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>ID</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText>
            {currentAccount.config.id}
          </SettingsTable.ValueText>
          <SettingsTable.ValueAction></SettingsTable.ValueAction>
        </SettingsTable.ValueColumn>
      </SettingsTable.Row>

      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>
          Device Information
        </SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          Information about the devices that approve transactions for this
          account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      {currentAccount.config.extendedPublicKeys?.map((item) => (
        <SettingsTable.Row>
          <SettingsTable.KeyColumn>
            {item.device.fingerprint}
          </SettingsTable.KeyColumn>
          <SettingsTable.ValueColumn>
            <SettingsTable.ValueText>
              {capitalize(item.device.type)}
            </SettingsTable.ValueText>
            <SettingsTable.ValueAction>
              <SettingsTable.ActionButton
                background={white}
                color={green500}
                onClick={() =>
                  openInModal(
                    <DeviceDetailsModal
                      item={item}
                    />
                  )
                }
              >
                View Details
              </SettingsTable.ActionButton>
            </SettingsTable.ValueAction>
          </SettingsTable.ValueColumn>
        </SettingsTable.Row>
      ))}

      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Danger Zone</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          Remove this account from Lily Wallet.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      <SettingsTable.Row>
        <SettingsTable.KeyColumn>Delete Account</SettingsTable.KeyColumn>
        <SettingsTable.ValueColumn>
          <SettingsTable.ValueText></SettingsTable.ValueText>
          <SettingsTable.ValueAction>
            <SettingsTable.ActionButton
              background={white}
              color={red500}
              onClick={() =>
                openInModal(
                  <DeleteAccountModal
                    password={password}
                    closeModal={closeModal}
                  />
                )
              }
            >
              Delete
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

export default GeneralView;
