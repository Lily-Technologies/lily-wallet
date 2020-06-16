import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { BACKEND_URL } from '../../config';

import { Button, StyledIcon, DeviceSelectSign } from '../../components';
import { black, gray, blue, green, lightBlue, offWhite, darkGray, white, darkOffWhite } from '../../utils/colors';

const SignWithDevice = ({
  psbt,
  signedPsbts,
  setSignedPsbts
}) => {
  const [signedDevices, setSignedDevices] = useState([]);
  const [unsignedDevices, setUnsignedDevices] = useState([]);
  const [finalPsbt, setFinalPsbt] = useState(psbt);
  const [broadcastedTxId, setBroadcastedTxId] = useState(null);

  const signWithDevice = async (device, index) => {
    const response = await window.ipcRenderer.invoke('/sign', {
      deviceType: device.type,
      devicePath: device.path,
      psbt: finalPsbt.toBase64()
    });

    setSignedPsbts([...signedPsbts, response.psbt]);
    setSignedDevices([...signedDevices, device]);
    unsignedDevices.splice(index, 1);
    setUnsignedDevices([...unsignedDevices]);
  }

  return (
    <TransactionDetailsWrapper>
      <SetupHeaderContainer>
        <SetupHeaderWrapper>
          <SetupHeader>Confirm on Devices</SetupHeader>
          <SetupSubheader>{signedDevices.length} of 2 devices confirmed</SetupSubheader>
        </SetupHeaderWrapper>
        <SetupExplainerText>
          Click on a device to confirm the transaction. If you don't see your device, click "Scan for New Devices".
              </SetupExplainerText>
      </SetupHeaderContainer>
      <DeviceSelectSign
        configuredDevices={signedDevices}
        unconfiguredDevices={unsignedDevices}
        deviceAction={signWithDevice}
        setUnconfiguredDevices={setUnsignedDevices}
        configuredThreshold={2}
      />

      {/* {signedPsbts.length === 2 && <BroadcastTransactionButton background={green} color={white} onClick={broadcastTransaction}>Broadcast Transaction</BroadcastTransactionButton>} */}
      {/* {broadcastedTxId && <ViewTransactionButton href={`https://blockstream.info/testnet/tx/${broadcastedTxId}`}>View Transaction</ViewTransactionButton>} */}
    </TransactionDetailsWrapper>
  )
}

const TransactionDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  justify-content: space-between;
`;

const SetupHeaderContainer = styled.div`
`;

const SetupHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SetupHeader = styled.h3`
  font-size: 1.5em;
  display: inline-block;
  margin: 4px 0;
`;

const SetupSubheader = styled.span`
  font-size: 18px;
  color: ${darkGray};
`;

const SetupExplainerText = styled.div`
  color: ${darkGray};
  font-size: .75em;
  margin: 12px 0;
`;

const BroadcastTransactionButton = styled.button`
  ${Button}
`;

const ViewTransactionButton = styled.a`
  ${Button}
`;

export default SignWithDevice;