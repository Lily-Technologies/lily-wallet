import React from 'react';

import AddressRow from './AddressRow';

import { requireOnchain } from '../../../hocs';

import { SettingsTable } from '../../../components';
import { LilyOnchainAccount } from '@lily/types';

interface Props {
  currentAccount: LilyOnchainAccount;
}

const AddressesView = ({ currentAccount }: Props) => {
  const { addresses, unusedAddresses, changeAddresses, unusedChangeAddresses } = currentAccount;

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
                  />
                ))}
                {unusedAddresses.map((address) => (
                  <AddressRow
                    key={address.address}
                    address={address}
                    type='external'
                    status='unused'
                  />
                ))}
                {changeAddresses.map((address) => (
                  <AddressRow key={address.address} address={address} type='change' status='used' />
                ))}
                {unusedChangeAddresses.map((address) => (
                  <AddressRow
                    key={address.address}
                    address={address}
                    type='change'
                    status='unused'
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default requireOnchain(AddressesView);
