import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { SlideOver } from 'src/components';

import { LabelTag } from './LabelTag';
import AddressDetailsSlideover from './AddressDetailsSlideover';

import { Address, AddressLabel } from '@lily/types';
import { PlatformContext } from 'src/context';

interface Props {
  address: Address;
  searchQuery?: string;
  used: boolean;
}

const AddressRow = ({ address, searchQuery = '', used }: Props) => {
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
        className='px-4 w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 py-2 items-center flex justify-between'
        onClick={() =>
          openInSlideover(
            <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} used={used} />
          )
        }
      >
        <td className='flex flex-col justify-start text-left'>
          <UtxoHeader className='text-gray-900 dark:text-gray-200'>{address.address}</UtxoHeader>
          <p className='text-sm text-gray-500'>{address.bip32derivation[0].path}</p>
        </td>
        <td className='flex justify-end items-center space-x-1'>
          <ul className='space-x-1 flex overflow-x-auto max-w-xs'>
            {labels.map((label) => (
              <li className='inline' key={label.id}>
                <LabelTag label={label} />
              </li>
            ))}
          </ul>
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

export default AddressRow;
