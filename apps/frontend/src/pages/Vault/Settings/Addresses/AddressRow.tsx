import React from 'react';
import styled from 'styled-components';

import { Badge } from 'src/components';

import { gray500 } from 'src/utils/colors';
import { classNames } from 'src/utils/other';

import { Address } from '@lily/types';

interface Props {
  address: Address;
  status: 'used' | 'unused';
  onClick: () => void;
}

const AddressRow = ({ address, status, onClick }: Props) => (
  <tr className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' onClick={() => onClick()}>
    <td className='py-2'>
      <UtxoHeader className='text-gray-900 dark:text-gray-200'>{address.address}</UtxoHeader>
      <UtxoSubheader>{address.bip32derivation[0].path}</UtxoSubheader>
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
