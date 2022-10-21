import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Badge, SlideOver } from 'src/components';

import { LabelTag } from './LabelTag';
import AddressDetailsSlideover from './AddressDetailsSlideover';

import { gray500 } from 'src/utils/colors';
import { classNames } from 'src/utils/other';

import { Address, AddressLabel } from '@lily/types';
import { PlatformContext } from 'src/context';

interface Props {
  address: Address;
  status: 'used' | 'unused';
  searchQuery?: string;
}

const AddressRow = ({ address, status, searchQuery = '' }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [labels, setLabels] = useState<AddressLabel[]>([]);
  const [hidden, setHidden] = useState(false);

  const [slideoverIsOpen, setSlideoverOpen] = useState(false);
  const [slideoverContent, setSlideoverContent] = useState<JSX.Element | null>(null);

  const openInSlideover = (component: JSX.Element) => {
    setSlideoverOpen(true);
    setSlideoverContent(component);
  };

  useEffect(() => {
    const retrieveLabels = async () => {
      const currentLabels = await platform.getAddressLabels(address.address);
      setLabels(currentLabels);
    };
    retrieveLabels();
  }, [slideoverIsOpen]);

  useEffect(() => {
    const labelMatch = labels.some((label) => label.label.toLowerCase().includes(searchQuery));
    const addressMatch = address.address.includes(searchQuery);

    const visible = labelMatch || addressMatch;

    setHidden(!visible);
  }, [searchQuery, labels]);

  if (hidden) {
    return null;
  }

  return (
    <>
      <button
        className='w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 py-2 items-center flex justify-between'
        onClick={() =>
          openInSlideover(<AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />)
        }
      >
        <td className=''>
          <UtxoHeader className='text-gray-900 dark:text-gray-200'>{address.address}</UtxoHeader>
          {/* <UtxoSubheader>{address.bip32derivation[0].path}</UtxoSubheader> */}
        </td>
        <td className='flex justify-end items-center space-x-1'>
          <ul className='space-x-1 flex overflow-x-auto max-w-xs'>
            {labels.map((label) => (
              <li className='inline' key={label.id}>
                <LabelTag label={label} />
              </li>
            ))}
          </ul>
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
      </button>
      <SlideOver open={slideoverIsOpen} setOpen={setSlideoverOpen} content={slideoverContent} />
    </>
  );
};

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
