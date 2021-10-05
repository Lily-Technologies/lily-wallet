import React from "react";
import styled from "styled-components";
import { Psbt } from "bitcoinjs-lib";
import { satoshisToBitcoins } from "unchained-bitcoin";

import { createUtxoMapFromUtxoArray, getFee } from "src/utils/send";
import { cloneBuffer } from "src/utils/other";
import { gray100, gray300, gray600, green800 } from "src/utils/colors";
import { requireOnchain } from "src/hocs";

import { LilyOnchainAccount, UtxoMap } from "src/types";

interface Props {
  currentAccount: LilyOnchainAccount;
  psbt: Psbt;
  currentBitcoinPrice: number;
}

const TransactionUtxoDetails = ({
  currentAccount,
  psbt,
  currentBitcoinPrice,
}: Props) => {
  const { availableUtxos, transactions } = currentAccount;
  const _fee = getFee(psbt, transactions);
  let utxosMap: UtxoMap;
  if (availableUtxos) {
    utxosMap = createUtxoMapFromUtxoArray(availableUtxos);
  }

  return (
    <>
      <ModalHeaderContainer>
        <span>Transaction Details</span>
      </ModalHeaderContainer>
      <MoreDetailsContainer>
        <MoreDetailsSection>
          <MoreDetailsHeader>Inputs</MoreDetailsHeader>
          {psbt.txInputs.map((input) => {
            const inputBuffer = cloneBuffer(input.hash);
            const utxo =
              utxosMap[
              `${inputBuffer.reverse().toString("hex")}:${input.index}`
              ];
            return (
              <OutputItem>
                <OutputAddress>{utxo.address.address}</OutputAddress>
                <OutputAmount>
                  {satoshisToBitcoins(utxo.value).toNumber()} BTC
                </OutputAmount>
              </OutputItem>
            );
          })}
        </MoreDetailsSection>
        <MoreDetailsSection data-cy="transaction-outputs">
          <MoreDetailsHeader style={{ marginTop: "1em" }}>
            Outputs
          </MoreDetailsHeader>
          {psbt.txOutputs.map((output) => (
            <OutputItem>
              <OutputAddress>{output.address}</OutputAddress>{" "}
              <OutputAmount>
                {satoshisToBitcoins(output.value).toNumber()} BTC
              </OutputAmount>
            </OutputItem>
          ))}

          <MoreDetailsHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2em",
            }}
          >
            Fees:{" "}
            {
              <span>
                {satoshisToBitcoins(_fee).toNumber()} BTC ($
                {satoshisToBitcoins(_fee)
                  .multipliedBy(currentBitcoinPrice)
                  .toFixed(2)}
                )
              </span>
            }
          </MoreDetailsHeader>
        </MoreDetailsSection>
      </MoreDetailsContainer>
    </>
  );
};

const OutputItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5em;
  margin: 12px 0;
  background: ${gray100};
  border: 1px solid ${gray300};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const OutputAddress = styled.span`
  color: ${green800};
  flex: 2;
  word-break: break-word;
`;

const OutputAmount = styled.span`
  flex: 1;
  text-align: right;
`;

const MoreDetailsSection = styled.div``;

const MoreDetailsContainer = styled.div`
  padding: 1.5rem;
`;

const MoreDetailsHeader = styled.div`
  color: ${gray600};
  font-size: 1.5em;
`;

const ModalHeaderContainer = styled.div`
  border-bottom: 1px solid rgb(229, 231, 235);
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5em;
  height: 90px;
`;

export default requireOnchain(TransactionUtxoDetails);
