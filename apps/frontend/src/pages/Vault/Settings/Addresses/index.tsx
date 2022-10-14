import React, { useState } from 'react';

import AddressRow from './AddressRow';

import { requireOnchain } from 'src/hocs';

import { SettingsTable, SlideOver } from 'src/components';
import { LilyOnchainAccount } from '@lily/types';

import AddressDetailsSlideover from './AddressDetailsSlideover';

interface Props {
  currentAccount: LilyOnchainAccount;
}

const AddressesView = ({ currentAccount }: Props) => {
  const { addresses, unusedAddresses, changeAddresses, unusedChangeAddresses } = currentAccount;

  const [slideoverIsOpen, setSlideoverOpen] = useState(false);
  const [slideoverContent, setSlideoverContent] = useState<JSX.Element | null>(null);

  const openInSlideover = (component: JSX.Element) => {
    setSlideoverOpen(true);
    setSlideoverContent(component);
  };

  return (
    <>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Addresses Information</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          These are the addresses associated with your account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='overflow-hidden sm:rounded-lg'>
            <table className='border-collapse w-full'>
              <tbody className='divide-y dark:divide-slate-400/10'>
                {addresses.map((address) => (
                  <AddressRow
                    key={address.address}
                    address={address}
                    type='external'
                    status='used'
                    onClick={() =>
                      openInSlideover(
                        <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />
                      )
                    }
                  />
                ))}
                {unusedAddresses.map((address) => (
                  <AddressRow
                    key={address.address}
                    address={address}
                    type='external'
                    status='unused'
                    onClick={() =>
                      openInSlideover(
                        <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />
                      )
                    }
                  />
                ))}
                {changeAddresses.map((address) => (
                  <AddressRow
                    key={address.address}
                    address={address}
                    type='change'
                    status='used'
                    onClick={() =>
                      openInSlideover(
                        <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />
                      )
                    }
                  />
                ))}
                {unusedChangeAddresses.map((address) => (
                  <AddressRow
                    key={address.address}
                    address={address}
                    type='change'
                    status='unused'
                    onClick={() =>
                      openInSlideover(
                        <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />
                      )
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <SlideOver open={slideoverIsOpen} setOpen={setSlideoverOpen} content={slideoverContent} />
    </>
  );
};

export default requireOnchain(AddressesView);
