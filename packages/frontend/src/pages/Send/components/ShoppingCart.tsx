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
    <ShoppingCartList>
      {items.map((item, index) => (
        <ShoppingCartItem key={index} className='py-6 flex space-x-6'>
          {item.image}
          <ItemInformationWrapper>
            <ItemInformationInner className='space-y-1 sm:flex sm:items-start sm:justify-between sm:space-x-6'>
              <ItemInformation className='flex-auto text-sm font-medium space-y-1'>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemPrice>{item.price.toLocaleString()} sats</ItemPrice>
                {item.extraInfo?.length &&
                  item.extraInfo?.map((extra) => (
                    <ItemDetails className='hidden text-gray-500 sm:block'>
                      {extra.label}: {extra.value}
                    </ItemDetails>
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
        </ShoppingCartItem>
      ))}
    </ShoppingCartList>
  );
};

const ShoppingCartList = styled.ul`
  margin: 0;
  padding: 0;
`;

const ShoppingCartItem = styled.li`
  display: flex;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${gray200};
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
