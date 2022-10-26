import React, { useEffect, useState } from 'react';

import AddressRow from './AddressRow';
import NoAddressesEmptyState from './NoAddressesEmptyState';

import { requireOnchain } from 'src/hocs';

import { SettingsTable } from 'src/components';
import { LilyOnchainAccount } from '@lily/types';

import { SearchToolbar } from 'src/pages/Send/components/SelectInputsForm/SearchToolbar';

import { classNames, normalizedIncludes } from 'src/utils/other';

interface Props {
  currentAccount: LilyOnchainAccount;
}

const tabs = ['Receive', 'Change'];

const AddressesView = ({ currentAccount }: Props) => {
  const { addresses, unusedAddresses, changeAddresses, unusedChangeAddresses } = currentAccount;
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const [filteredAddresses, setFilteredAddresses] = useState(addresses);
  const [filteredUnusedAddresses, setFilteredUnusedAddresses] = useState(unusedAddresses);

  useEffect(() => {
    const usedAddrs = activeTab === 'Receive' ? addresses : changeAddresses;
    const unusedAddrs = activeTab === 'Receive' ? unusedAddresses : unusedChangeAddresses;

    const currentFilteredAddresses = usedAddrs.filter((address) => {
      const labelMatch = address.tags.some((tag) => normalizedIncludes(tag.label, searchQuery));
      const addressMatch = normalizedIncludes(address.address, searchQuery);

      return addressMatch || labelMatch;
    });

    const currentFilteredUnusedAddresses = unusedAddrs.filter((address) => {
      const labelMatch = address.tags.some((tag) => normalizedIncludes(tag.label, searchQuery));
      const addressMatch = normalizedIncludes(address.address, searchQuery);

      return addressMatch || labelMatch;
    });

    setFilteredAddresses(currentFilteredAddresses);
    setFilteredUnusedAddresses(currentFilteredUnusedAddresses);
  }, [searchQuery, activeTab, addresses, unusedAddresses, changeAddresses, unusedChangeAddresses]);

  const hasResults = filteredAddresses.length || filteredUnusedAddresses.length;

  return (
    <>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>Addresses Information</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          These are the addresses associated with this account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>

      <div className='border-b border-gray-200 dark:border-slate-700'>
        <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
          {tabs.map((tab) => (
            <a
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={classNames(
                activeTab === tab
                  ? 'border-yellow-500 text-gray-900 dark:text-slate-100'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300',
                'cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              )}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </a>
          ))}
        </nav>
      </div>

      <div className=''>
        <SearchToolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <div className='my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='overflow-hidden sm:rounded-lg'>
            {hasResults ? (
              <table className='border-collapse w-full'>
                <tbody className='divide-y dark:divide-slate-400/10'>
                  {filteredUnusedAddresses.length ? (
                    <>
                      <tr className='border-t border-gray-200 dark:border-slate-700'>
                        <th
                          colSpan={5}
                          scope='colgroup'
                          className='bg-gray-50 dark:bg-slate-700 dark:text-slate-300 px-4 py-2 text-left text-sm font-semibold text-gray-800'
                        >
                          Unused
                        </th>
                      </tr>
                      {filteredUnusedAddresses.map((address) => (
                        <AddressRow key={address.address} address={address} used={false} />
                      ))}
                    </>
                  ) : null}
                  {filteredAddresses.length ? (
                    <>
                      <tr className='border-t border-gray-200 dark:border-slate-700'>
                        <th
                          colSpan={5}
                          scope='colgroup'
                          className='bg-gray-50 dark:bg-slate-700 dark:text-slate-300 px-4 py-2 text-left text-sm font-semibold text-gray-800'
                        >
                          Used
                        </th>
                      </tr>
                      {filteredAddresses.map((address) => (
                        <AddressRow key={address.address} address={address} used={true} />
                      ))}
                    </>
                  ) : null}
                </tbody>
              </table>
            ) : (
              <NoAddressesEmptyState />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default requireOnchain(AddressesView);
