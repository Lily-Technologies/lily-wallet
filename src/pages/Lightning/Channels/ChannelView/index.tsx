import React, { useState } from "react";
import styled from "styled-components";

import ChannelRow from "./ChannelRow";
import ChannelModal from "./ChannelModal";

import { Table, TableBody } from "src/components/Table";
import { SettingsTable, Button, Modal } from "src/components";

import { white, green600 } from "src/utils/colors";

import { requireLightning } from "src/hocs";
import { LilyLightningAccount, SetStateBoolean } from "src/types";

interface Props {
  currentAccount: LilyLightningAccount;
  setViewOpenChannelForm: SetStateBoolean;
}

const ChannelView = ({ currentAccount, setViewOpenChannelForm }: Props) => {
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
    <Padding>
      <HeadingSection>
        <SettingsTable.HeaderSection>
          <SettingsTable.HeaderTitle>
            Channel Information
          </SettingsTable.HeaderTitle>
          <SettingsTable.HeaderSubtitle>
            These are the channel associated with your account.
          </SettingsTable.HeaderSubtitle>
        </SettingsTable.HeaderSection>
        <ButtonContainer>
          <OpenChannelButton
            color={white}
            background={green600}
            onClick={() => setViewOpenChannelForm(true)}
          >
            Open new channel
          </OpenChannelButton>
        </ButtonContainer>
      </HeadingSection>

      <Table>
        <TableBody>
          {currentAccount.pendingChannels.map((channel) => (
            <ChannelRow
              key={123}
              alias={channel.alias}
              capacity={channel.capacity}
              status={'pending'}
              onClick={() => openInModal(<ChannelModal channel={channel} />)}
            />
          ))}
          {currentAccount.channels.map((channel) => (
            <ChannelRow
              key={123}
              alias={channel.alias}
              capacity={channel.capacity}
              status={channel.active ? 'active' : 'inactive'}
              onClick={() => openInModal(<ChannelModal channel={channel} />)}
            />
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={modalIsOpen} closeModal={() => setModalIsOpen(false)} style={{ content: { overflow: 'visible' } }}>
        {modalContent}
      </Modal>
    </Padding>
  );
};

const Padding = styled.div`
  padding: 0 1.5em;
`;

const HeadingSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const OpenChannelButton = styled.button`
  ${Button}
  border-radius: 0.375rem;
`;

export default requireLightning(ChannelView);
