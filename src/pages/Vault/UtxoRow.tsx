import React, { useState } from 'react';
import styled from 'styled-components';
import { satoshisToBitcoins } from "unchained-bitcoin";

import { white, offWhite, gray100 } from '../../utils/colors';

import { UTXO, Address } from '../../types'
interface Props {
  utxo: UTXO,
  flat: boolean
}

const UtxoRow = ({ utxo, flat }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <UtxoRowWrapper flat={flat}>
      <UtxoRowContainer flat={flat} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <AddressWrapper flat={flat}>{(utxo.address as Address).address}</AddressWrapper>
        <AmountWrapper flat={flat}>{`${satoshisToBitcoins(utxo.value).toNumber()} BTC`}</AmountWrapper>
      </UtxoRowContainer>
      {isOpen && <TransactionMoreInfo>
        <pre>{JSON.stringify(utxo, null, 2)}</pre>
      </TransactionMoreInfo>}
    </UtxoRowWrapper>
  )
}

const UtxoRowWrapper = styled.div<{ flat: boolean }>`
  background: ${p => p.flat ? 'transparent' : white};
  box-shadow: ${p => p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);'};;
  align-items: center;
  flex-direction: column;
`;

const UtxoRowContainer = styled.div<{ isOpen: boolean, flat: boolean }>`
  display: flex;
  align-items: center;
  padding: ${p => p.flat ? '.75em' : '1.5em'};

  &:hover {
    background: ${p => !p.isOpen && offWhite};
    cursor: pointer;
  }
`;


const TransactionMoreInfo = styled.div`
  display: flex;
  padding: .75em;
  overflow: scroll;
  background: ${gray100};
`;

const AmountWrapper = styled.div<{ flat: boolean }>`
  display: flex;
  text-align: right;
  justify-content: flex-end;
  font-size: ${p => p.flat ? '.75em' : '1em'};
`;
const AddressWrapper = styled.div<{ flat: boolean }>`
  display: flex;
  flex: 1;
  font-weight: 100;
  font-size: ${p => p.flat ? '.75em' : '1em'};
  word-break: break-all;
`;

export default UtxoRow;