import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

import { white, red600, gray400, gray900, green500 } from 'src/utils/colors';

interface Option {
  label: string;
  onClick: () => void;
}
interface Props {
  label: string;
  options: Option[];
  initialSelection?: Option;
  error?: boolean;
  id?: string;
}

export const Select = React.memo(
  ({ label, options, initialSelection, error, id }: Props) => {
    const [selected, setSelected] = useState(initialSelection || options[0]);

    return (
      <Listbox
        value={selected}
        onChange={(option) => {
          setSelected(option);
          option.onClick();
        }}
      >
        {({ open }) => (
          <>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200'>
              {label}
            </label>
            <ListboxContainer className='dark:text-gray-200'>
              <ListboxButton
                error={error}
                id={id}
                className='border border-gray-300 dark:border-gray-500 dark:bg-slate-800 dark:hover:bg-slate-700 focus:ring-green-500 focus:border-green-500 focus:outline-none'
              >
                <SelectionContainer>{selected ? selected.label : 'Loading...'}</SelectionContainer>
                <SelectorIconContainer>
                  <SelectorIconDecorated aria-hidden='true' />
                </SelectorIconContainer>
              </ListboxButton>

              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <ListboxOptions>
                  {options.map((option, index) => (
                    <Listbox.Option key={index} value={option} className="dark:bg-slate-800'">
                      {({ selected, active }: { selected: boolean; active: boolean }) => (
                        <OptionContainer
                          active={active}
                          className='cursor-pointer dark:bg-slate-800'
                        >
                          <DropdownItemLabel selected={selected}>{option.label}</DropdownItemLabel>

                          {selected ? (
                            <CheckIconContainer active={active}>
                              <CheckIconDecorated aria-hidden='true' />
                            </CheckIconContainer>
                          ) : null}
                        </OptionContainer>
                      )}
                    </Listbox.Option>
                  ))}
                </ListboxOptions>
              </Transition>
            </ListboxContainer>
          </>
        )}
      </Listbox>
    );
  },
  (prevState, nextState) => {
    // TODO: this should probably do a more thorough check, but it works for now
    return prevState.options[0]?.label === nextState.options[0].label;
  }
);

const ListboxContainer = styled.div`
  position: relative;
  margin-top: 0.25rem;
`;

const ListboxOptions = styled(Listbox.Options)`
  position: absolute;
  z-index: 10;
  margin-top: 0.25rem;
  max-height: 15rem;
  width: 100%;
  overflow: auto;
  border-radius: 0.375rem;
  background: ${white};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  line-height: 1.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OptionContainer = styled.div<{ active: boolean }>`
  background: ${(p) => (p.active ? green500 : white)};
  color: ${(p) => (p.active ? white : gray900)};
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 2.25rem;
  padding-left: 0.75rem;
  cursor: pointer;
  position: relative;
`;

const CheckIconDecorated = styled(CheckIcon)`
  width: 1.25rem;
  height: 1.25rem;
  display: block;
  vertical-align: middle;
`;

const ListboxButton = styled(Listbox.Button)<{
  error?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}>`
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: left;
  padding-right: 2.5rem;
  padding-left: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: default;
  width: 100%;
  border-radius: 0.375rem;
  position: relative;
  cursor: pointer;

  border-color: ${(p) => (p.error ? red600 : 'inherit')}

  *,
  &:after,
  &:before {
    box-sizing: border-box;
    border: 0 solid #d2d6dc;
  }
`;

const SelectionContainer = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
`;

const SelectorIconContainer = styled.span`
  padding-right: 0.5rem;
  align-items: center;
  display: flex;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
`;

const SelectorIconDecorated = styled(SelectorIcon)`
  color: ${gray400};
  width: 1.25rem;
  height: 1.25rem;
  display: block;
  vertical-align: middle;
`;

const DropdownItemLabel = styled.span<{ selected: boolean }>`
  font-weight: ${(p) => (p.selected ? 600 : 400)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
`;

const CheckIconContainer = styled.span<{ active: boolean }>`
  color: ${(p) => (p.active ? white : green500)};
  display: flex;
  align-items: center;
  padding-right: 0.5rem;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
`;
