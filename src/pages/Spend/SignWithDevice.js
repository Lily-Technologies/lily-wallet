import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { CheckCircle } from '@styled-icons/material';
import { Psbt, Transaction, bip32, networks } from 'bitcoinjs-lib';
import {
  deriveChildPublicKey,
  blockExplorerAPIURL,
  deriveChildExtendedPublicKey,
  getFingerprintFromPublicKey,
  deriveExtendedPublicKey,
  TESTNET
} from "unchained-bitcoin";

import { BACKEND_URL } from '../../config';

import { constructPsbt } from './constructPsbt';

import { Button, StyledIcon, DeviceSelect } from '../../components';
import { black, gray, blue, green, lightBlue, offWhite, darkGray, white, darkOffWhite } from '../../utils/colors';

const SignWithDevice = ({
  psbt
}) => {
  const [signedDevices, setSignedDevices] = useState([]);
  const [unsignedDevices, setUnsignedDevices] = useState([]);
  const [finalPsbt, setFinalPsbt] = useState(psbt);
  const [signedPsbts, setSignedPsbts] = useState([]);
  const [broadcastedTxId, setBroadcastedTxId] = useState(null);

  const signWithDevice = async (device, index) => {
    const { data } = await axios.post(`${BACKEND_URL}/sign`, {
      deviceType: device.type,
      devicePath: device.path,
      psbt: finalPsbt.toBase64()
    });
    console.log('signWithDevice data: ', data);
    setSignedPsbts([...signedPsbts, data.psbt]);
    setSignedDevices([...signedDevices, device]);
    unsignedDevices.splice(index, 1);
    setUnsignedDevices([...unsignedDevices]);
  }

  const broadcastTransaction = async () => {
    if (signedPsbts.length === 2) {
      const psbt = finalPsbt;
      const psbt1 = Psbt.fromBase64(signedPsbts[0]);
      const psbt2 = Psbt.fromBase64(signedPsbts[1]);

      console.log('psbt1, psbt2: ', psbt1, psbt2);

      psbt.combine(psbt1, psbt2);

      psbt.finalizeAllInputs();

      console.log('psbt.extractTransaction(): ', psbt.extractTransaction());
      console.log('psbt.extractTransaction().toHex(): ', psbt.extractTransaction().toHex());
      const { data } = await axios.get(blockExplorerAPIURL(`/broadcast?tx=${psbt.extractTransaction().toHex()}`, TESTNET));
      setBroadcastedTxId(data);
    }
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
      <DeviceSelect
        configuredDevices={signedDevices}
        unconfiguredDevices={unsignedDevices}
        deviceAction={signWithDevice}
        setUnconfiguredDevices={setUnsignedDevices}
        configuredThreshold={2}
      />

      {signedPsbts.length === 2 && <BroadcastTransactionButton background={green} color={white} onClick={broadcastTransaction}>Broadcast Transaction</BroadcastTransactionButton>}
      {broadcastedTxId && <ViewTransactionButton href={`https://blockstream.info/testnet/tx/${broadcastedTxId}`}>View Transaction</ViewTransactionButton>}
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
`;

const SetupHeader = styled.h3`
  font-size: 24px;
  display: inline-block;
  margin: 4px 0;
`;

const SetupSubheader = styled.span`
  font-size: 18px;
  color: ${darkGray};
`;

const SetupExplainerText = styled.div`
  color: ${darkGray};
  font-size: 12px;
  margin: 12px 0;
`;

const BroadcastTransactionButton = styled.button`
  ${Button}
`;

const ViewTransactionButton = styled.a`
  ${Button}
`;

export default SignWithDevice;