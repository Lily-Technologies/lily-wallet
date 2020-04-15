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
  scriptPubKeyAddress,
  witnessScript,
  unsignedTransaction,
  caravanFile,
  bip32path,
  step,
  setStep
}) => {
  const [signedDevices, setSignedDevices] = useState([]);
  const [unsignedDevices, setUnsignedDevices] = useState([]);
  const [finalPsbt, setFinalPsbt] = useState(null);
  const [signedPsbts, setSignedPsbts] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [broadcastedTxId, setBroadcastedTxId] = useState(null);

  useEffect(() => {
    enumerate();
  }, []);

  useEffect(async () => {
    const psbt = await constructPsbt(
      caravanFile,
      scriptPubKeyAddress,
      witnessScript,
      unsignedTransaction,
      bip32path
    );
    setFinalPsbt(psbt);
  }, []);


  const enumerate = async () => {
    setDevicesLoading(true);
    const { data } = await axios.get(`${BACKEND_URL}/enumerate`);
    setDevicesLoading(false);

    // filter out devices that are available but already imported
    const filteredDevices = data.filter((device) => {
      let deviceAlreadyImported = false;
      for (let i = 0; i < signedDevices.length; i++) {
        if (signedDevices[i].fingerprint === device.fingerprint) {
          deviceAlreadyImported = true;
        }
      }
      if (!deviceAlreadyImported) {
        return device
      }
    });
    setUnsignedDevices(filteredDevices);
  }

  const signWithDevice = async (device) => {
    const { data } = await axios.post(`${BACKEND_URL}/sign`, {
      deviceType: device.type,
      devicePath: device.path,
      psbt: finalPsbt.toBase64()
    });
    console.log('signWithDevice data: ', data);
    setSignedPsbts([...signedPsbts, data.psbt]);
    setSignedDevices([...signedDevices, device]);
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
      <div>
        <AuthorizeHeader>Authorize from Device</AuthorizeHeader>
        <AuthorizeSubheader>Click on a device to authorize the transaction. If you don't see your device, click "Scan for New Devices".</AuthorizeSubheader>
      </div>


      <DeviceSelect
        configuredDevices={signedDevices}
        unconfiguredDevices={unsignedDevices}
        deviceAction={signWithDevice}
        setUnconfiguredDevices={setUnsignedDevices}
      />


      <DevicesWrapper>
        {signedDevices.map((device, index) => (
          <DeviceWrapper key={index} imported={true}>
            <DeviceImage src={"https://coldcardwallet.com/static/images/coldcard-front.png"} />
            <DeviceName>{device.model}</DeviceName>
            <DeviceFingerprint>{device.fingerprint}</DeviceFingerprint>
            <ImportedWrapper>
              <StyledIcon as={CheckCircle} size={24} />
            </ImportedWrapper>
          </DeviceWrapper>
        ))}

        {unsignedDevices.map((device, index) => (
          <DeviceWrapper key={index} onClick={() => signWithDevice(device, index)}>
            <DeviceImage src={"https://coldcardwallet.com/static/images/coldcard-front.png"} />
            <DeviceName>{device.model}</DeviceName>
            <DeviceFingerprint>{device.fingerprint}</DeviceFingerprint>
          </DeviceWrapper>
        ))}
      </DevicesWrapper>

      {signedPsbts.length < 2 && <GetXPubButton onClick={enumerate}>{devicesLoading ? 'Loading...' : 'Scan for New Devices'}</GetXPubButton>}
      {signedPsbts.length === 2 && <BroadcastTransactionButton background={green} color={white} onClick={broadcastTransaction}>Broadcast Transaction</BroadcastTransactionButton>}
      {broadcastedTxId && <ViewTransactionButton href={`https://blockstream.info/testnet/tx/${broadcastedTxId}`}>View Transaction</ViewTransactionButton>}
    </TransactionDetailsWrapper>
  )
}

const TransactionDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  padding: 24px;
  justify-content: space-between;
`;

const GetXPubButton = styled.button`
  ${Button};
  padding: 12px;
  margin: 0 8px;
`;

const AuthorizeHeader = styled.h5`
  font-size: 24px;
  margin: 4px 0;
`;

const AuthorizeSubheader = styled.p`
  font-size: 12px;
`;

const DevicesWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  min-height: 400px;
`;


const DeviceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  margin: 24px;
  flex: 0 1 250px;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background: ${darkOffWhite};
  }
`;

const DeviceImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-height: 250px;
  max-width: 148px;
`;

const DeviceName = styled.h4`
  text-transform: capitalize;
  margin-bottom: 2px;
`;

const DeviceFingerprint = styled.h5`
  color: ${gray};
  margin: 0;
`;

const ImportedWrapper = styled.div`
  margin: 4px 0 0;
  color: ${green};
`;

const BroadcastTransactionButton = styled.button`
  ${Button}
`;

const ViewTransactionButton = styled.a`
  ${Button}
`;

export default SignWithDevice;