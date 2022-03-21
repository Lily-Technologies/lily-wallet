import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { Transition } from '.';
import OutsideClick from './OutsideClick';

import { white, gray900 } from 'src/utils/colors';
import { mobile } from 'src/utils/media';

// https://codesandbox.io/s/outside-alerter-hooks-lmr2y?module=/src/OutsideAlerter.js&file=/src/OutsideAlerter.js
/* 
  Example Usage
  
  <Dropdown
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    buttonLabel={'Options'}
    minimal={false}
    dropdownItems={[
      { label: 'Item #1', onClick: () => { console.log('foobar') } },
      { label: 'Item #2', onClick: () => { console.log('foobar2') } },
      { label: 'Item #3', onClick: () => { console.log('foobar3') } }
    ]}
  /> 

*/

export type DropdownItemProps = {
  label?: string | JSX.Element;
  onClick?: () => void;
  onlyMobile?: boolean;
};

type DividerProps = {
  onlyMobile?: boolean;
};
interface Props {
  buttonLabel?: string | React.ReactNode;
  className?: string;
  dropdownItems: (DropdownItemProps | DividerProps)[];
  minimal: boolean;
  style?: {};
}

export const Dropdown = ({
  buttonLabel,
  className,
  dropdownItems,
  minimal,
  style,
  ...rest
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownWrapper className={className}>
      <ButtonContainer>
        {minimal ? (
          <MinimalDropdownButtonContainer
            style={style}
            onClick={() => setIsOpen(!isOpen)}
            aria-label='Options'
            id='options-menu'
            className='focus:ring-green-500 focus:border-green-500 focus:outline-none text-black'
            {...rest}
          >
            <DotDotDotImage fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z'></path>
            </DotDotDotImage>
          </MinimalDropdownButtonContainer>
        ) : (
          <DropdownButtonContainer>
            <DropdownButton
              className='bg-white dark:bg-gray-800 focus:ring-green-500 focus:border-green-500 focus:outline-none'
              style={style}
              onClick={() => setIsOpen(!isOpen)}
              type='button'
              id='options-menu'
              aria-haspopup='true'
              {...rest}
            >
              {buttonLabel}
              {/* <DownArrowIcon style={style} fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </DownArrowIcon> */}
            </DropdownButton>
          </DropdownButtonContainer>
        )}
      </ButtonContainer>
      <Transition
        show={isOpen}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
        appear={undefined} // KBC-TODO: does this need to be here?
      >
        <OutsideClick onOutsideClick={() => setIsOpen(false)}>
          <DropdownItemsWrapper>
            <DropdownItemsContainer>
              <DropdownItems role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
                {dropdownItems.map((item, index) => {
                  if ('label' in item) {
                    return (
                      <DropdownItem
                        key={index}
                        clickable={!!item.onClick}
                        onlyMobile={!!item.onlyMobile}
                        onClick={() => {
                          if (item.onClick) {
                            item.onClick();
                            setIsOpen(false);
                          }
                        }}
                        role='menuitem'
                      >
                        {item.label}
                      </DropdownItem>
                    );
                  } else {
                    return <Divider key={index} onlyMobile={!!item.onlyMobile} />;
                  }
                })}
              </DropdownItems>
            </DropdownItemsContainer>
          </DropdownItemsWrapper>
        </OutsideClick>
      </Transition>
    </DropdownWrapper>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DropdownWrapper = styled.div`
  position: relative;
  text-align: left;
  z-index: 10;
`;

const DropdownButtonContainer = styled.span`
  // box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  // border-radius: .375rem;
  cursor: pointer;
`;

const MinimalDropdownButtonContainer = styled.button`
  display: flex;
  align-items: center;
  color: inherit;
  padding: 0.25em;
  cursor: pointer;
  border: none;
  border-radius: 9999px;
`;

const DropdownButton = styled.button`
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow,
    transform;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  line-height: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  justify-content: center;
  display: inline-flex;
  // border-width: 1px;
  border-radius: 0.375rem;
  // border-color: rgb(210,214,220);
  cursor: pointer;

  &:active {
    color: rgb(37, 47, 63);
  }

  &:hover {
    color: rgb(107, 114, 128);
  }
`;

const DotDotDotImage = styled.svg`
  height: 1.25rem;
  width: 1.25rem;
  display: block;
  vertical-align: middle;
`;

const DropdownItemsWrapper = styled.div`
  transform-origin: top right;
  width: 14rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  right: 0;
  position: absolute;
  margin-top: 0.5rem;
  border-radius: 0.375rem;
  z-index: 2;
`;

const DropdownItemsContainer = styled.div`
  border-radius: 0.375rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  background: ${white};
`;

const DropdownItems = styled.div`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`;

const Divider = styled.div<{ onlyMobile: boolean }>`
  background: #d2d6dc;
  height: 1px;
  display: none;

  ${(p) =>
    p.onlyMobile
      ? mobile(css`
          display: flex;
        `)
      : 'display: flex'}
`;

const DropdownItem = styled.a<{ clickable: boolean; onlyMobile: boolean }>`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  line-height: 1.25rem;
  font-size: 0.875rem;
  background-color: transparent;
  text-decoration: none;
  cursor: ${(p) => (p.clickable ? 'pointer' : 'default')};
  color: ${gray900};
  display: none;

  &:hover {
    background: rgb(244, 245, 247);
    color: rgb(22, 30, 46);
  }

  ${(p) =>
    p.onlyMobile
      ? mobile(css`
          display: block;
        `)
      : 'display: block;'}
`;
