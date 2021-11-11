import React, { useState } from 'react';

import { ModalContentWrapper } from 'src/components';

import { DecoratedLightningChannel, DecoratedPendingLightningChannel } from '@lily/types';

import ChannelDetailsModal from './ChannelDetailsModal';
import CloseChannelModal from './CloseChannel/CloseChannelModal';
import CloseChannelSuccess from './CloseChannel/CloseChannelSuccess';

interface Props {
  channel: DecoratedLightningChannel | DecoratedPendingLightningChannel;
}

const ChannelModal = ({ channel }: Props) => {
  const [step, setStep] = useState(0);

  return (
    <ModalContentWrapper>
      {step === 0 && <ChannelDetailsModal channel={channel} setStep={setStep} />}
      {step === 1 && (
        <CloseChannelModal setStep={setStep} channel={channel as DecoratedLightningChannel} />
      )}
      {step === 2 && <CloseChannelSuccess channel={channel as DecoratedLightningChannel} />}
    </ModalContentWrapper>
  );
};

export default ChannelModal;
