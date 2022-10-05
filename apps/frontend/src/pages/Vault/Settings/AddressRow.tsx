import React from 'react';
import styled from 'styled-components';

import { Badge } from 'src/components';

import { gray500 } from 'src/utils/colors';
import { classNames } from 'src/utils/other';

import { Address } from '@lily/types';

interface Props {
  address: Address;
  status: 'used' | 'unused';
  type: 'external' | 'change';
}

const AddressRow = ({ address, status, type }: Props) => (
  <tr>
    <td className='py-2'>
      <UtxoHeader className='text-gray-900 dark:text-gray-200'>{address.address}</UtxoHeader>
      <UtxoSubheader>Derivation path: {address.bip32derivation[0].path}</UtxoSubheader>
    </td>
    <td className='text-right'>
      <Badge
        className={classNames(
          status === 'used'
            ? 'bg-yellow-100 dark:bg-yellow-600 text-yellow-800 dark:text-yellow-100'
            : 'bg-green-100 dark:bg-green-600 text-green-800 dark:text-green-100'
        )}
        style={{ marginRight: '1em' }}
      >
        {status}
      </Badge>
      <Badge className='text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200'>
        {type}
      </Badge>
    </td>
  </tr>
);

const UtxoHeader = styled.div`
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

export default AddressRow;
