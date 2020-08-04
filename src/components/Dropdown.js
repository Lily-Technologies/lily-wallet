import React from 'react';
import styled from 'styled-components';

import { Transition } from '.'

import { white } from '../utils/colors';

{/* 
  Example Usage
  
  <Dropdown
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    buttonLabel={'Options'}
    dropdownItems={[
      { label: 'Item #1', onClick: () => { console.log('foobar') } },
      { label: 'Item #2', onClick: () => { console.log('foobar2') } },
      { label: 'Item #3', onClick: () => { console.log('foobar3') } }
    ]}
  /> 

*/}

export const Dropdown = ({ isOpen, setIsOpen, buttonLabel, dropdownItems }) => {
  console.log('isOpen: ', isOpen)
  return (
    <DropdownWrapper>
      <div>
        <DropdownButtonContainer>
          <DropdownButton
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true">
            {buttonLabel}
            <DownArrowIcon viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </DownArrowIcon>
          </DropdownButton>
        </DropdownButtonContainer>
      </div>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <DropdownItemsWrapper>
          <DropdownItemsContainer>
            <DropdownItems role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {dropdownItems.map((item) => (
                <DropdownItem
                  onClick={() => item.onClick()}
                  role="menuitem">{item.label}</DropdownItem>
              ))}
            </DropdownItems>
          </DropdownItemsContainer>
        </DropdownItemsWrapper>
      </Transition>
    </DropdownWrapper>
  )
}

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  text-align: left;
`;

const DropdownButtonContainer = styled.span`
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  border-radius: .375rem;
`;

const DropdownButton = styled.button`
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-property: background-color,border-color,color,fill,stroke,opacity,box-shadow,transform;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: .5rem;
  padding-bottom: .5rem;
  line-height: 1.25rem;
  font-size: .875rem;
  font-weight: 500;
  justify-content: center;
  display: inline-flex;
  border-width: 1px;
  border-radius: .375rem;
  border-color: rgb(210,214,220);
  background: ${white};

  &:active {
    color: rgb(37,47,63);
  }


  &:hover {
    color: rgb(107,114,128);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(164,202,254,.45);
    outline: 0;
    border-color: rgb(164,202,254)
  }
`;

const DownArrowIcon = styled.svg`
  width: 1.25rem;
  margin-right: -.25rem;
  margin-left: .5rem;
  height: 1.25rem;
  display: block;
  vertical-align: middle;
  color: rgb(37,47,63);
`;

const DropdownItemsWrapper = styled.div`
  transform-origin: top right;
  width: 14rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
  right: 0;
  position: absolute;
  margin-top: .5rem;
  border-radius: .375rem;
`;

const DropdownItemsContainer = styled.div`
  border-radius: .375rem;
  box-shadow: 0 0 0 1px rgba(0,0,0,.05);
  background: ${white};
`;

const DropdownItems = styled.div`
  padding-top: .25rem;
  padding-bottom: .25rem;
`;

const DropdownItem = styled.a`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: .5rem;
  padding-bottom: .5rem;
  line-height: 1.25rem;
  font-size: .875rem;
  display: block;
  background-color: transparent;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: rgb(244,245,247);
    color: rgb(22,30,46);
  }

  &:focus {
    outline: 0;
    background-color: rgb(244,245,247);
    color: rgb(22,30,46);
  }
`;