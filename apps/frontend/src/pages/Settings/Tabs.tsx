import React from 'react';
import styled from 'styled-components';

import { green500, gray300, gray500, gray700 } from 'src/utils/colors';

import { LilyConfig } from '@lily/types';
import { SetStateString } from 'src/types';

interface Props {
  currentTab: string;
  setCurrentTab: SetStateString;
  config: LilyConfig;
}

const Tabs = ({ currentTab, setCurrentTab, config }: Props) => {
  return (
    <div
      className='flex border-b border-gray-200 dark:border-gray-600 overflow-x-auto'
      id='settings-navigation'
    >
      <TabItem active={currentTab === 'network'} onClick={() => setCurrentTab('network')}>
        Network
      </TabItem>
      {!config.isEmpty && (
        <TabItem active={currentTab === 'backup'} onClick={() => setCurrentTab('backup')}>
          Backup
        </TabItem>
      )}
      <TabItem active={currentTab === 'about'} onClick={() => setCurrentTab('about')}>
        About
      </TabItem>
    </div>
  );
};

const TabItem = styled.button<{ active: boolean }>`
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-bottom: 2px solid ${(p) => (p.active ? green500 : 'none')};
  margin-left: 2rem;
  cursor: pointer;
  color: ${(p) => (p.active ? green500 : gray500)};
  font-weight: 500;
  text-decoration: none;

  &:nth-child(1) {
    margin-left: 0;
  }

  &:hover {
    border-bottom: 2px solid ${(p) => (p.active ? 'none' : gray300)};
    color: ${(p) => (p.active ? 'inherit' : gray700)};
  }
`;

export default Tabs;
