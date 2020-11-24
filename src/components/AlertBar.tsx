import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import { Alert } from '@styled-icons/ionicons-outline'

import { Button } from '.';

import { white, yellow500, yellow600 } from '../utils/colors';

import { LilyConfig, NodeConfig, SetStateBoolean } from '../types';

interface Props {
  config: LilyConfig
  nodeConfig: NodeConfig
}

export const AlertBar = ({ config, nodeConfig }: Props) => {
  const history = useHistory();
  let blockDiff;
  if (nodeConfig) {
    blockDiff = config.license.expires - nodeConfig.blocks;
  } else {
    blockDiff = config.license.expires;
  }
  const blockDiffTimeEst = blockDiff * 10;
  const expireAsDate = moment().add(blockDiffTimeEst, "minutes");

  return (
    <Fragment>
      <HeightHolder />
      <Wrapper>
        <Container>
          <TextContainer>
            <IconWrapper>
              <Icon />
            </IconWrapper>
            <Text>
              Your license will expire in {blockDiff} blocks (approx. {expireAsDate.fromNow()})
          </Text>
          </TextContainer>
          <BuyButton
            background={white}
            color={yellow500}
            onClick={() => history.push('purchase')}>
            Buy a License
        </BuyButton>
        </Container>
      </Wrapper >
    </Fragment>
  )
}

const Wrapper = styled.div`
  background: ${yellow500};
  z-index: 2;
  position: fixed;
  top: 2.5em;
  width: 100%;
`;

const HeightHolder = styled.div`
  height: 2.5rem;
  z-index: 0;
  background: transparent;
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
  font-weight: 600;
`;