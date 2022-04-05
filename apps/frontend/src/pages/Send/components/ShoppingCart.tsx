import React from 'react';
import styled, { css } from 'styled-components';

import { mobile } from 'src/utils/media';
import { gray200, gray600, gray900 } from 'src/utils/colors';

import { ShoppingItem } from '@lily/types';

interface Props {
  items: ShoppingItem[];
}

const ShoppingCartView = ({ items }: Props) => {
  return (
    <ul
      role='list'
      className='divide-y divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700'
    >
      {items.map((item, index) => (
        <li key={index} className='flex py-6 px-4 sm:px-6'>
          {item.image}
          <ItemInformationWrapper>
            <ItemInformationInner className='space-y-1 sm:flex sm:items-start sm:justify-between sm:space-x-6'>
              <ItemInformation className='flex-auto text-sm font-medium space-y-1'>
                <h3 className='text-gray-900 dark:text-gray-200 font-medium'>{item.header}</h3>
                <p className='text-gray-900 dark:text-gray-300 mt-1'>{item.subtext}</p>
                {item.extraInfo?.length &&
                  item.extraInfo?.map((extra) => (
                    <p className='hidden text-gray-500 sm:block'>
                      {extra.label}: {extra.value}
                    </p>
                  ))}
              </ItemInformation>
              {/* <div className="flex-none flex space-x-4">
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Edit
                </button>
                <div className="flex border-l border-gray-300 pl-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Remove
                  </button>
                </div>
              </div> */}
            </ItemInformationInner>
          </ItemInformationWrapper>
        </li>
      ))}
    </ul>
  );
};

const ShoppingCartItem = styled.li`
  display: flex;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const ItemInformationWrapper = styled.div`
  flex: 1 1 auto;
`;

const ItemInformationInner = styled.div`
  justify-content: space-between;
  align-items: flex-start;
  display: flex;
  margin-right: 1rem;
  margin-left: 1rem;
`;

const ItemInformation = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  flex: 1 1 auto;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
`;

const ItemTitle = styled.h3`
  color: ${gray900};
  margin: 0;
  font-weight: 500;
`;

const ItemPrice = styled.p`
  color: ${gray900};
  margin: 0;
  margin-top: 0.25rem;
`;

const ItemDetails = styled.p`
  color: ${gray600};
  display: block;
  font-weight: 400;
  margin: 0;
  margin-top: 0.25rem;
  ${mobile(css`
    display: none;
  `)}
`;

export default ShoppingCartView;
