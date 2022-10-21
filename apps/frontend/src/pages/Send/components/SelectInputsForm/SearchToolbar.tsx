import {
  TagIcon,
  SearchIcon,
  SortAscendingIcon,
  SortDescendingIcon
} from '@heroicons/react/outline';

import { classNames } from 'src/utils/other';

import { SortOptions } from '.';

interface Props {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  toggleSort?: () => void;
  sort?: SortOptions;
  setShowTags?: React.Dispatch<React.SetStateAction<boolean>>;
  showTags?: boolean;
}

export const SearchToolbar = ({
  searchQuery,
  setSearchQuery,
  toggleSort,
  sort,
  setShowTags,
  showTags
}: Props) => {
  return (
    <div className='flex h-16 justify-between bg-transparent px-4 border-t border-b border-gray-700/20 dark:border-slate-500/20'>
      <div className='flex flex-1 py-2'>
        <form className='flex w-full lg:ml-0'>
          <label htmlFor='search-field' className='sr-only'>
            Search
          </label>
          <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center'>
              <SearchIcon className='h-5 w-5' aria-hidden='true' />
            </div>
            <input
              id='search-field'
              className='block h-full w-full border-transparent bg-transparent dark:text-slate-200 py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm'
              placeholder='Search'
              type='text'
              name='search'
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </form>
      </div>
      <div className='flex items-center'>
        <div className='ml-1 flex items-center lg:ml-2'>
          {toggleSort ? (
            <button
              type='button'
              className={classNames(
                !!sort
                  ? 'bg-green-200 hover:bg-green-300 dark:bg-green-600 active:bg-green-400 dark:active:bg-green-800'
                  : 'bg-transparent hover:bg-gray-100 hover:border hover:border-gray-400 dark:hover:bg-green-700 active:bg-gray-200 dark:active:bg-green-800',
                'inline-flex items-center rounded-md border border-transparent px-2 py-1 text-xs font-medium dark:text-white shadow-sm focus:outline-none focus:ring-2 ring-green-500'
              )}
              onClick={() => {
                toggleSort();
              }}
            >
              {sort === 'asc' ? (
                <SortAscendingIcon className='w-4 h-4' />
              ) : (
                <SortDescendingIcon className='w-4 h-4' />
              )}
            </button>
          ) : null}
        </div>
      </div>
      <div className='ml-1 flex items-center lg:ml-2'>
        {setShowTags ? (
          <button
            type='button'
            className={classNames(
              showTags
                ? 'bg-green-200 hover:bg-green-300 dark:bg-green-600 active:bg-green-400 dark:active:bg-green-800'
                : 'bg-transparent hover:bg-gray-100 hover:border hover:border-gray-400 dark:hover:bg-green-700 active:bg-gray-200 dark:active:bg-green-800',
              'inline-flex items-center rounded-md border border-transparent px-2 py-1 text-xs font-medium dark:text-white shadow-sm focus:outline-none focus:ring-2 ring-green-500'
            )}
            onClick={() => {
              setShowTags(!showTags);
            }}
          >
            <TagIcon className='w-4 h-4' />
          </button>
        ) : null}
      </div>
    </div>
  );
};
