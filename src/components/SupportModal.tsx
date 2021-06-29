import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import { Support } from "@styled-icons/boxicons-regular";

import {
  StyledIcon,
  Button,
  ModalContentWrapper,
  Spinner,
} from "../components";

import { mobile } from "../utils/media";
import {
  white,
  green100,
  red500,
  green600,
  gray100,
  gray300,
  gray400,
  gray600,
  gray700,
} from "../utils/colors";

import { ConfigContext } from "../ConfigContext";

interface Props {
  closeModal: () => void;
}

export const SupportModal = ({ closeModal }: Props) => {
  const { config } = useContext(ConfigContext);
  const [supportCode, setSupportCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  console.log("supportCode: ", supportCode);

  useEffect(() => {
    async function getSupportCode() {
      if (!config.isEmpty) {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_LILY_ENDPOINT}/support`,
            {
              license: config.vaults[0].license, // license
            }
          );
          console.log("data.code: ", data.code);
          setSupportCode(data.code);
          setIsLoading(false);
        } catch (e) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
    getSupportCode();
  }, []);

  return (
    <ModalContentWrapper>
      <DangerIconContainer>
        <StyledIconCircle>
          <StyledIcon style={{ color: green600 }} as={Support} size={36} />
        </StyledIconCircle>
      </DangerIconContainer>
      <TextContainer>
        <HeadingText>Lily Support Portal</HeadingText>
        <Subtext>
          {supportCode
            ? "When asked, give this code to our support staff to verify your license."
            : `Upgrade to a paying customer to recieve premium support.`}
        </Subtext>

        <SupportCodeContainer data-cy="support-code">
          {isLoading ? <Spinner /> : null}
          {supportCode.split("").map((char) => (
            <CodeDigit>{char}</CodeDigit>
          ))}
        </SupportCodeContainer>

        <Buttons>
          <CancelButton
            background={white}
            color={gray700}
            onClick={() => {
              window.open("https://lily-wallet.com/support", "_blank");
            }}
          >
            Contact Support
          </CancelButton>
          <SaveChangesButton
            background={green600}
            color={white}
            onClick={() => {
              window.open("https://docs.lily-wallet.com/", "_blank");
            }}
          >
            Read Documentation
          </SaveChangesButton>
        </Buttons>
      </TextContainer>
    </ModalContentWrapper>
  );
};

const SupportCodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const CodeDigit = styled.div`
  padding: 0.75em;
  background: ${gray100};
  border: 1px solid ${gray400};
  font-size: 2em;
  width: 3em;

  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 0.25em;
  margin: 1em 0;

  &:not(:last-child) {
    margin-right: 1em;
  }
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;

  ${mobile(css`
    flex-direction: column;
  `)};
`;

const SaveChangesButton = styled.button`
  ${Button}
  margin-top: 1rem;

  ${mobile(css`
    margin-top: 1.25rem;
  `)};
`;

const CancelButton = styled.button`
  ${Button}
  margin-top: 1rem;
  border: 1px solid ${gray300};
  margin-right: 1rem;

  ${mobile(css`
    margin-top: 1.25rem;
  `)};
`;

const TextContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 1rem;

  ${mobile(css`
    margin-top: 0.75rem;
    margin-left: 0;
  `)};
`;

const DangerIconContainer = styled.div``;

const StyledIconCircle = styled.div`
  border-radius: 9999px;
  background: ${green100};
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeadingText = styled.div`
  font-size: 1.125rem;
  text-align: center;
  font-weight: 500;
`;

const Subtext = styled.div`
  padding-bottom: 2em;
  margin-top: 0.5rem;
  color: ${gray600};
`;
