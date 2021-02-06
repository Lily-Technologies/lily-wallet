import React, { Fragment, useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Alert } from "@styled-icons/ionicons-outline";

import { Button } from ".";

import { white, yellow500, yellow600 } from "../utils/colors";

import { NodeConfig } from "../types";

import { getLicenseBannerMessage, licenseTxId } from "../utils/license";

import { ConfigContext } from "../ConfigContext";

interface Props {
  nodeConfig: NodeConfig | undefined;
}

export const AlertBar = ({ nodeConfig }: Props) => {
  const { config } = useContext(ConfigContext);
  const history = useHistory();

  let licenseBannerMessage = useRef("");

  useEffect(() => {
    async function checkLicenseTxConfirmed() {
      let licenseTxConfirmed = false;
      if (nodeConfig && !config.isEmpty) {
        try {
          const txId = licenseTxId(config.license);
          if (txId) {
            licenseTxConfirmed = await window.ipcRenderer.invoke(
              "/isConfirmedTransaction",
              { txId }
            );
          }
        } catch (e) {
          licenseTxConfirmed = false;
          console.log("Error retriving license transaction");
        }
        console.log("licenseTxConfirmed: ", licenseTxConfirmed);
        licenseBannerMessage.current = getLicenseBannerMessage(
          config.license,
          licenseTxConfirmed,
          nodeConfig
        );
      }
      console.log(
        "licenseBannerMessage.current: ",
        licenseBannerMessage.current
      );
    }
    checkLicenseTxConfirmed();
  }, [config, nodeConfig]);

  if (licenseBannerMessage.current) {
    return (
      <Fragment>
        <HeightHolder />
        <Wrapper>
          <Container>
            <TextContainer>
              <IconWrapper>
                <Icon />
              </IconWrapper>
              <Text>{licenseBannerMessage.current}</Text>
            </TextContainer>
            <BuyButton
              background={white}
              color={yellow500}
              onClick={() => history.push("/purchase")}
            >
              Buy a License
            </BuyButton>
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
