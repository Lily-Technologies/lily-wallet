import React, { useState } from 'react';
import styled from 'styled-components';

import { white, offWhite, gray100 } from '../../utils/colors';
import { Address } from '../../types';

interface Props {
  address: Address,
  flat: boolean
}

const AddressRow = ({ address, flat }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AddressRowWrapper flat={flat}>
      <AddressRowContainer flat={flat} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <AddressWrapper flat={flat}>{address.address}</AddressWrapper>
        <AmountWrapper flat={flat}>{address.bip32derivation[0].path}</AmountWrapper>
      </AddressRowContainer>
      {isOpen && <TransactionMoreInfo>
        <pre>{JSON.stringify(address, null, 2)}</pre>
      </TransactionMoreInfo>}
    </AddressRowWrapper>
  )
}

const AddressRowWrapper = styled.div<{ flat: boolean }>`
  background: ${p => p.flat ? 'transparent' : white};
  box-shadow: ${p => p.flat ? 'none' : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'};;
  align-items: center;
  flex-direction: column;
`;

const AddressRowContainer = styled.div<{ isOpen: boolean, flat: boolean }>`
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

export default AddressRow;