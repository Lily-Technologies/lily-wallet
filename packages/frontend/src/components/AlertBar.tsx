import React, { Fragment, useContext, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { blockExplorerTransactionURL } from 'unchained-bitcoin';
import { Network } from 'bitcoinjs-lib';
import { useHistory } from 'react-router-dom';
import { Alert } from '@styled-icons/ionicons-outline';

import { Button } from '.';

import { AccountMapContext, ConfigContext, PlatformContext } from 'src/context';

import { getLicenseBannerMessage, licenseTxId } from 'src/utils/license';
import { mobile } from 'src/utils/media';
import { getUnchainedNetworkFromBjslibNetwork } from 'src/utils/files';
import { white, yellow500, yellow600 } from 'src/utils/colors';

import { NodeConfigWithBlockchainInfo, VaultConfig } from '@lily/types';

interface Props {
  nodeConfig: NodeConfigWithBlockchainInfo | undefined;
  currentBitcoinNetwork: Network;
}

export const AlertBar = ({ nodeConfig, currentBitcoinNetwork }: Props) => {
  const { config } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const { setCurrentAccountId } = useContext(AccountMapContext);
  const history = useHistory();

  let licenseBannerMessage = useRef({ message: '', promptBuy: false });
  let licenseBannerAccount = useRef({} as VaultConfig);

  useEffect(() => {
    async function checkLicenseTxConfirmed() {
      let licenseTxConfirmed = false;
      if (nodeConfig) {
        config.vaults.forEach(async (vault) => {
          try {
            const txId = licenseTxId(vault.license);
            if (txId) {
              licenseTxConfirmed = await platform.isConfirmedTransaction(txId);
            }
          } catch (e) {
            licenseTxConfirmed = false;
            console.log('AlertBar: Error retriving license transaction');
          }
          licenseBannerMessage.current = getLicenseBannerMessage(
            vault,
            licenseTxConfirmed,
            nodeConfig
          );
          licenseBannerAccount.current = vault;
        });
      }
    }
    checkLicenseTxConfirmed();
  }, [config, nodeConfig, platform]);

  if (licenseBannerMessage.current.message) {
    return (
      <Fragment>
        <HeightHolder />
        <Wrapper>
          <Container>
            <TextContainer>
              <IconWrapper>
                <Icon />
              </IconWrapper>
              <Text>{licenseBannerMessage.current.message}</Text>
            </TextContainer>
            {licenseBannerMessage.current.promptBuy ? (
              <BuyButton
                background={white}
                color={yellow500}
                onClick={() => {
                  setCurrentAccountId(licenseBannerAccount.current.id);
                  history.push(`/vault/${licenseBannerAccount.current.id}/purchase`);
                }}
              >
                Buy a License
              </BuyButton>
            ) : (
              <ViewTransactionButton
                background={white}
                color={yellow500}
                href={blockExplorerTransactionURL(
                  licenseTxId(licenseBannerAccount.current.license) as string,
                  getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
                )}
                target='_blank'
              >
                View transaction
              </ViewTransactionButton>
            )}
          </Container>
        </Wrapper>
      </Fragment>
    );
  }
  return null;
};

const Wrapper = styled.div`
  background: ${yellow500};
  z-index: 2;
  position: fixed;
  top: 2.5em;
  width: 100%;
`;

const HeightHolder = styled.div`
  height: 3.5rem;
  z-index: 0;
  background: transparent;

  ${mobile(css`
    height: 5.5rem;
  `)}
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 80rem;
  width: 100%;
  padding-right: 2rem;
  padding-left: 2rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  margin: 0 auto;

  ${mobile(css`
    flex-direction: column;
    padding-right: 0.75;
    padding-left: 0.75;
  `)};
`;

const TextContainer = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.span`
  background: ${yellow600};
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
`;

const Icon = styled(Alert)`
  color: ${white};
  width: 1.5rem;
`;

const Text = styled.span`
  color: ${white};
  margin-left: 0.75em;
  font-weight: 500;
`;

const BuyButton = styled.button`
  ${Button}
  font-size: 0.75em;
  padding: 0.5em 1em;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;

  ${mobile(css`
    width: 100%;
    margin-top: 1em;
  `)};
`;

const ViewTransactionButton = styled.a`
  ${Button}
  font-size: 0.75em;
  padding: 0.5em 1em;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;

  ${mobile(css`
    width: 100%;
    margin-top: 1em;
  `)};
`;
