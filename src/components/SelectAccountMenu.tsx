import React, { useContext } from 'react';
import styled from 'styled-components';
import { Safe } from '@styled-icons/crypto';
import { Wallet } from '@styled-icons/entypo';

import { StyledIcon } from '.';
import { white, gray100, gray300, gray400, gray700, gray800, orange600 } from '../utils/colors';

import { LilyConfig } from '../types';

import { AccountMapContext } from '../AccountMapContext';

interface Props {
  config: LilyConfig
}

export const SelectAccountMenu = ({ config }: Props) => {
  const { setCurrentAccountId, currentAccount } = useContext(AccountMapContext);

  return (
    <AccountMenu>
      {config.vaults.map((vault, index) => (
        <AccountMenuItemWrapper
          key={index}
          active={vault.id === currentAccount.config.id}
          onClick={() => setCurrentAccountId(vault.id)}>
          <IconWrapper active={vault.id === currentAccount.config.id}>
            <StyledIcon as={Safe} size={48} />
          </IconWrapper>
          <AccountMenuItemName>{vault.name}</AccountMenuItemName>
        </AccountMenuItemWrapper>
      ))}
      {config.wallets.map((wallet, index) => (
        <AccountMenuItemWrapper
          key={index}
          active={wallet.id === currentAccount.config.id}
          onClick={() => setCurrentAccountId(wallet.id)}>
          <IconWrapper active={wallet.id === currentAccount.config.id}>
            <StyledIcon as={Wallet} size={48} />
          </IconWrapper>
          <AccountMenuItemName>{wallet.name}</AccountMenuItemName>
        </AccountMenuItemWrapper>
      ))}
    </AccountMenu>
  )
}

const IconWrapper = styled.button<{ active: boolean }>`
  background: ${white};
  padding: 1.5em;
  border-radius: 0.385em;
  margin-bottom: 0.5em;
  border: ${p => p.active ? `1px solid ${orange600}` : `1px solid ${gray300}`};
  cursor: pointer;V
`;

const AccountMenuItemWrapper = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${p => p.active ? gray800 : gray700};
  padding: .5em;
  flex: 1;
  border-radius: 0.385em;
  margin: 0 0.25em;
  opacity: ${p => p.active ? 1 : 0.5};
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const AccountMenuItemName = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.75em;
`;

const AccountMenu = styled.div`
  display: flex;
  justify-content: space-around;
  background: ${gray100};
  margin-bottom: 1em;
  overflow: scroll;
  padding: 0.75em;
  border-radius: 0.385em;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${gray400};
`;