import React, { useState } from 'react';

import AddressRow from './AddressRow';

import { requireOnchain } from 'src/hocs';

import { SettingsTable, SlideOver } from 'src/components';
import { LilyOnchainAccount } from '@lily/types';

import AddressDetailsSlideover from './AddressDetailsSlideover';

import { classNames } from 'src/utils/other';

interface Props {
  currentAccount: LilyOnchainAccount;
}

const tabs = ['Receive', 'Change'];

const AddressesView = ({ currentAccount }: Props) => {
  const { addresses, unusedAddresses, changeAddresses, unusedChangeAddresses } = currentAccount;
  const [activeTab, setActiveTab] = useState(tabs[0]);

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
          These are the addresses associated with this account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>

      <div className='border-b border-gray-200'>
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

      <div className='my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='overflow-hidden sm:rounded-lg'>
            <table className='border-collapse w-full'>
              <tbody className='divide-y dark:divide-slate-400/10'>
                {activeTab === 'Receive'
                  ? addresses.map((address) => (
                      <AddressRow
                        key={address.address}
                        address={address}
                        status='used'
                        onClick={() =>
                          openInSlideover(
                            <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />
                          )
                        }
                      />
                    ))
                  : null}
                {activeTab === 'Receive'
                  ? unusedAddresses.map((address) => (
                      <AddressRow
                        key={address.address}
                        address={address}
                        status='unused'
                        onClick={() =>
                          openInSlideover(
                            <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />
                          )
                        }
                      />
                    ))
                  : null}
                {activeTab === 'Change'
                  ? changeAddresses.map((address) => (
                      <AddressRow
                        key={address.address}
                        address={address}
                        status='used'
                        onClick={() =>
                          openInSlideover(
                            <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />
                          )
                        }
                      />
                    ))
                  : null}
                {activeTab === 'Change'
                  ? unusedChangeAddresses.map((address) => (
                      <AddressRow
                        key={address.address}
                        address={address}
                        status='unused'
                        onClick={() =>
                          openInSlideover(
                            <AddressDetailsSlideover address={address} setOpen={setSlideoverOpen} />
                          )
                        }
                      />
                    ))
                  : null}
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
