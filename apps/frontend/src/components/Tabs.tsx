import React from 'react';

import { SetStateString } from 'src/types';

import { classNames } from 'src/utils/other';

interface TabItem {
  name: string;
  tabId: string;
}

interface Props {
  currentTab: string;
  setCurrentTab: SetStateString;
  items: TabItem[];
}

export const Tabs = ({ currentTab, setCurrentTab, items }: Props) => {
  return (
    <div className='border-b border-gray-200 dark:border-gray-600 overflow-x-auto'>
      <nav className='-mb-px flex space-x-8' data-cy='settings-tabs'>
        {items.map(({ tabId, name }) => (
          <button
            className={classNames(
              currentTab === tabId
                ? 'border-green-500 text-green-600 dark:text-green-500 dark:border-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            )}
            onClick={() => setCurrentTab(tabId)}
          >
            {name}
          </button>
        ))}
      </nav>
    </div>
  );
};
