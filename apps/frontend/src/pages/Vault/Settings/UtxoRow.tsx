import React from 'react';
import styled from 'styled-components';

import { Unit } from 'src/components';

import { gray500 } from 'src/utils/colors';

import { UTXO, Address } from '@lily/types';
interface Props {
  utxo: UTXO;
}

const UtxoRow = ({ utxo }: Props) => (
  <tr>
    <td className='py-2'>
      <UtxoHeader>
        {utxo.txid}:{utxo.vout}
      </UtxoHeader>
      <UtxoSubheader className='truncate'>
        Address: {(utxo.address as Address).address}
      </UtxoSubheader>
    </td>
    {/* @ts-ignore */}
    <td className='text-right text-green-800 dark:text-green-400'>
      <Unit value={utxo.value} />
    </td>
  </tr>
);

const UtxoHeader = styled.div.attrs({
  className: 'text-gray-900 dark:text-gray-300 truncate'
})`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
`;

const UtxoSubheader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 500;
`;

export default UtxoRow;
