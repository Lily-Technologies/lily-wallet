import React, { useState } from 'react';
import styled from 'styled-components';

import { Transition } from '.';
import OutsideClick from './OutsideClick';

import { classNames } from 'src/utils/other';

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
  [rest: string]: any;
}

export const Dropdown = React.forwardRef<HTMLButtonElement, Props>(
  ({ buttonLabel, className, dropdownItems, minimal, style, ...rest }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <DropdownWrapper className={className}>
        <ButtonContainer>
          {minimal ? (
            <button
              style={style}
              onClick={() => setIsOpen(!isOpen)}
              aria-label='Options'
              id='options-menu'
              className='flex items-center p-2 text-inherit cursor-pointer border-0 rounded-full focus:ring-green-500 focus:border-green-500 focus:outline-none dark:hover:bg-white/10'
              ref={ref}
              {...rest}
            >
              <DotDotDotImage fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z'></path>
              </DotDotDotImage>
            </button>
          ) : (
            <DropdownButtonContainer>
              <DropdownButton
                ref={ref}
                className='bg-white dark:bg-slate-800 focus:ring-green-500 focus:border-green-500 focus:outline-none'
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
            <div className='w-60 origin-top-right shadow-lg right-0 absolute mt-2 rounded-md z-[2] bg-white dark:bg-slate-600 dark:highlight-white/10'>
              <DropdownItems role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
                {dropdownItems.map((item, index) => {
                  if ('label' in item) {
                    return (
                      <a
                        className={classNames(
                          item.onlyMobile ? 'flex sm:hidden' : 'flex',
                          'block px-4 py-2 cursor-pointer text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-500'
                        )}
                        key={index}
                        // onlyMobile={!!item.onlyMobile}
                        onClick={() => {
                          if (item.onClick) {
                            item.onClick();
                            setIsOpen(false);
                          }
                        }}
                        role='menuitem'
                      >
                        {item.label}
                      </a>
                    );
                  } else {
                    return (
                      <div
                        className={classNames(
                          item.onlyMobile ? 'flex sm:hidden' : 'flex',
                          'bg-slate-200 dark:bg-slate-50/20 h-px flex'
                        )}
                        key={index}
                      />
                    );
                  }
                })}
              </DropdownItems>
            </div>
          </OutsideClick>
        </Transition>
      </DropdownWrapper>
    );
  }
);

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

const DropdownItems = styled.div`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`;
