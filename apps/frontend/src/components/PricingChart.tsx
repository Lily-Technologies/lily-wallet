import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';

import { LicenseTiers, LilyOnchainAccount } from '@lily/types';

const tiers = [
  {
    name: 'Multisig',
    href: '/download',
    priceAnnual: 100,
    description: 'A premium solution for businesses, inheritance, or high net-worth individuals',
    features: [
      'Eliminate single points of failure',
      'Collaborative custody with other stakeholders',
      'Zero KYC or invasive surveillance',
      'Premium support staff on call to assist'
    ],
    cta: 'Purchase'
  }
];

interface Props {
  clickRenewLicense: (tier: LicenseTiers, currentAccount: LilyOnchainAccount) => Promise<void>;
  currentAccount: LilyOnchainAccount;
}

export const PricingChart = ({ clickRenewLicense, currentAccount }: Props) => {
  const [isLoading, setLoading] = useState('');

  const onLicenseClick = async (tier: LicenseTiers, account: LilyOnchainAccount) => {
    if (!isLoading) {
      setLoading(tier);
      try {
        await clickRenewLicense(tier, account);
        setLoading('');
      } catch (e) {
        setLoading('');
      }
    }
  };

  return (
    <>
      <div className='relative'>
        <div className=''>
          <div className='pt-12 sm:pt-16 bg-emerald-600 bg-gradient-to-b from-emerald-500 to-emerald-700'>
            <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
              <div className='mx-auto max-w-3xl space-y-2 pb-8 sm:pb-12 lg:pb-16'>
                <Transition
                  appear={true}
                  show={true}
                  enter='transition-all duration-500'
                  enterFrom='opacity-0 translate-y-6'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition-opacity duration-150'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <p className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl'>
                    Pricing
                  </p>
                </Transition>
                <Transition
                  appear={true}
                  show={true}
                  enter='transition-all duration-500 delay-100'
                  enterFrom='opacity-0 translate-y-6'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition-opacity duration-150'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <p className='text-xl text-green-200'>
                    Upgrade to multisig for more robust security and complex custody solutions.
                  </p>
                </Transition>
              </div>
            </div>
          </div>
          <div className=''>
            <div className='relative'>
              <div className='absolute inset-0 h-3/4 bg-emerald-700' />
              <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto max-w-md space-y-4 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-5 lg:space-y-0'>
                  <div
                    key={tiers[0].name}
                    className='flex flex-col overflow-hidden rounded-3xl shadow-lg'
                  >
                    <div className='bg-white px-6 py-8 sm:p-10 sm:pb-6'>
                      <div>
                        <h3
                          className='inline-flex text-lg font-medium font-sans text-transparent text-yellow-400 bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-500'
                          id='tier-standard'
                        >
                          {tiers[0].name}
                        </h3>
                      </div>
                      {tiers[0].priceAnnual ? (
                        <div className='mt-1 flex items-baseline text-6xl font-bold tracking-tight'>
                          ${tiers[0].priceAnnual}
                          <span className='ml-1 text-2xl font-medium tracking-normal text-gray-500'>
                            /year
                          </span>
                        </div>
                      ) : (
                        <div className='mt-1 flex items-baseline text-6xl font-bold tracking-tight'>
                          Free
                        </div>
                      )}
                      <p className='mt-5 text-lg text-gray-500'>{tiers[0].description}</p>
                    </div>
                    <div className='flex flex-1 flex-col justify-between space-y-16 bg-gray-50 px-6 pt-6 pb-8 sm:p-10 sm:pt-12'>
                      <ul role='list' className='space-y-8'>
                        {tiers[0].features.map((feature) => (
                          <li key={feature} className='flex items-start'>
                            <div className='flex-shrink-0'>
                              <CheckIcon className='h-6 w-6 text-green-500' aria-hidden='true' />
                            </div>
                            <p className='ml-3 text-base text-gray-700'>{feature}</p>
                          </li>
                        ))}
                      </ul>
                      <div className='rounded-md shadow'>
                        <button
                          onClick={() => onLicenseClick(LicenseTiers.basic, currentAccount)}
                          className='w-full flex items-center justify-center rounded-md border border-transparent bg-yellow-500 bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 px-5 py-3 text-base font-medium text-white hover:bg-yellow-400'
                          aria-describedby='tier-standard'
                        >
                          {!isLoading ? tiers[0].cta : 'Creating transaction...'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    key={tiers[0].name}
                    className='flex flex-col overflow-hidden rounded-3xl shadow-lg'
                  >
                    <div className='bg-white px-6 py-8 sm:p-10 sm:pb-6'>
                      <h2 className='text-2xl font-extrabold text-gray-900 mb-8'>
                        Frequently asked questions
                      </h2>
                      <div className='space-y-16'>
                        <div className='space-y-2'>
                          <dt className='text-lg leading-6 font-medium text-gray-900'>
                            Why do your charge money for multisig security?
                          </dt>
                          <dd className='text-base text-gray-500'>
                            We assume that users requiring multisig security are holding large
                            amounts of bitcoin or have a complex custodial arrangement.
                          </dd>
                          <dd className='text-base text-gray-500'>
                            We ask users who use multisig to purchase a license to help support
                            development of Lily Wallet.
                          </dd>
                        </div>

                        <div className='space-y-2'>
                          <dt className='text-lg leading-6 font-medium text-gray-900'>
                            Do you require KYC/AML information for a license?
                          </dt>
                          <dd className='text-base text-gray-500'>
                            Purchasing a license doesn't require any KYC/AML information from our
                            customers.
                          </dd>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-1 flex-col justify-between space-y-16 bg-gray-50 px-6 pt-6 pb-8 sm:p-10 sm:pt-12'>
                      <div className='rounded-md shadow bg-white'>
                        <a
                          href='https://lily-wallet.com/pricing'
                          target='_blank'
                          className='flex items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium'
                          aria-describedby='tier-standard'
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
