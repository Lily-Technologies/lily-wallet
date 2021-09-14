import React, { useState } from "react";
import styled, { css } from "styled-components";

import { Spinner } from ".";

import {
  gray50,
  gray200,
  gray300,
  gray400,
  gray500,
  gray700,
  gray900,
  green500,
  green600,
  white,
} from "../utils/colors";
import { sm, md, lg } from "../utils/media";

import { LicenseTiers, LilyOnchainAccount } from "../types";

interface Props {
  clickRenewLicense: (
    level: LicenseTiers,
    currentAccount: LilyOnchainAccount
  ) => void;
  currentAccount: LilyOnchainAccount;
}

export const PricingTable = ({ clickRenewLicense, currentAccount }: Props) => {
  const [isLoading, setLoading] = useState("");

  const onLicenseClick = async (
    tier: LicenseTiers,
    account: LilyOnchainAccount
  ) => {
    if (!isLoading) {
      setLoading(tier);
      try {
        await clickRenewLicense(tier, account);
        setLoading("");
      } catch (e) {
        setLoading("");
      }
    }
  };

  const twoOfThree = currentAccount.config.quorum.totalSigners === 3;
  const threeOfFive = currentAccount.config.quorum.totalSigners === 5;
  const premiumOnly = !twoOfThree && !threeOfFive;
  const basicPrice = twoOfThree ? 100 : threeOfFive ? 500 : 1000;

  return (
    <Wrapper>
      <MobileTableContainer>
        {!premiumOnly ? (
          <MobileTableItem>
            <HeaderColumn>
              <MobileHeading>Basic</MobileHeading>
              <p className="mt-4">
                <Price>${basicPrice}</Price>
                <span className="text-base font-medium text-gray-500">
                  /year
                </span>
              </p>

              <DownloadButton
                onClick={() =>
                  onLicenseClick(LicenseTiers.basic, currentAccount)
                }
                disabled={!!isLoading}
              >
                {isLoading === LicenseTiers.basic ? <Spinner /> : "Buy Basic"}
              </DownloadButton>
            </HeaderColumn>

            <MobileTable>
              <MobileTableSection>Security</MobileTableSection>
              <thead>
                <TableRow>
                  <ScreenReaderCol scope="col">Feature</ScreenReaderCol>
                  <ScreenReaderCol scope="col">Included</ScreenReaderCol>
                </TableRow>
              </thead>
              <TableBody>
                <TableRow>
                  <TableHeader scope="row">
                    Single Signature Hardware Wallets
                  </TableHeader>
                  <TableColumn>
                    <CheckIcon
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </CheckIcon>
                    <ScreenReader>Yes</ScreenReader>
                  </TableColumn>
                </TableRow>

                <TableRow>
                  <TableHeader scope="row">
                    {twoOfThree ? "2-of-3" : threeOfFive ? "3-of-5" : "Custom"}{" "}
                    Multisig Vault
                  </TableHeader>
                  <TableColumn>
                    <CheckIcon
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </CheckIcon>
                    <ScreenReader>Yes</ScreenReader>
                  </TableColumn>
                </TableRow>
              </TableBody>
            </MobileTable>

            <MobileTable>
              <MobileTableSection>Network</MobileTableSection>
              <thead>
                <TableRow>
                  <ScreenReaderCol scope="col">Feature</ScreenReaderCol>
                  <ScreenReaderCol scope="col">Included</ScreenReaderCol>
                </TableRow>
              </thead>
              <TableBody>
                <TableRow>
                  <TableHeader scope="row">Connect to Bitcoin Core</TableHeader>
                  <TableColumn>
                    <CheckIcon
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </CheckIcon>
                    <ScreenReader>Yes</ScreenReader>
                  </TableColumn>
                </TableRow>

                <TableRow>
                  <TableHeader scope="row">Tor Support</TableHeader>
                  <TableColumn>
                    <CheckIcon
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </CheckIcon>
                    <ScreenReader>Yes</ScreenReader>
                  </TableColumn>
                </TableRow>
              </TableBody>
            </MobileTable>

            <MobileTable>
              <MobileTableSection>Support</MobileTableSection>
              <thead>
                <TableRow>
                  <ScreenReaderCol scope="col">Feature</ScreenReaderCol>
                  <ScreenReaderCol scope="col">Included</ScreenReaderCol>
                </TableRow>
              </thead>
              <TableBody>
                <TableRow>
                  <TableHeader scope="row">Email Support</TableHeader>
                  <TableColumn>
                    <CheckIcon
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </CheckIcon>
                    <ScreenReader>Yes</ScreenReader>
                  </TableColumn>
                </TableRow>

                <TableRow>
                  <TableHeader scope="row">Phone / Zoom Support</TableHeader>
                  <TableColumn>
                    <DashIcon
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </DashIcon>
                    <ScreenReader>No</ScreenReader>
                  </TableColumn>
                </TableRow>
              </TableBody>
            </MobileTable>

            <FooterButton>
              <DownloadButton
                onClick={() =>
                  onLicenseClick(LicenseTiers.basic, currentAccount)
                }
                disabled={!!isLoading}
              >
                {isLoading === LicenseTiers.basic ? <Spinner /> : "Buy Basic"}
              </DownloadButton>
            </FooterButton>
          </MobileTableItem>
        ) : null}

        <MobileTableItem>
          <HeaderColumn>
            <MobileHeading>Premium</MobileHeading>
            <p className="mt-4">
              <Price>$1000</Price>
              <span className="text-base font-medium text-gray-500">/year</span>
            </p>

            <DownloadButton
              onClick={() =>
                onLicenseClick(LicenseTiers.premium, currentAccount)
              }
              disabled={!!isLoading}
            >
              {isLoading === LicenseTiers.premium ? <Spinner /> : "Buy Premium"}
            </DownloadButton>
          </HeaderColumn>

          <MobileTable>
            <MobileTableSection>Security</MobileTableSection>
            <thead>
              <TableRow>
                <ScreenReaderCol scope="col">Feature</ScreenReaderCol>
                <ScreenReaderCol scope="col">Included</ScreenReaderCol>
              </TableRow>
            </thead>
            <TableBody>
              <TableRow>
                <TableHeader scope="row">
                  Single Signature Hardware Wallets
                </TableHeader>
                <TableColumn>
                  <CheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </CheckIcon>
                  <ScreenReader>Yes</ScreenReader>
                </TableColumn>
              </TableRow>

              <TableRow>
                <TableHeader scope="row">
                  {twoOfThree ? "2-of-3" : threeOfFive ? "3-of-5" : "Custom"}{" "}
                  Multisig Vault
                </TableHeader>
                <TableColumn>
                  <CheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </CheckIcon>
                  <ScreenReader>Yes</ScreenReader>
                </TableColumn>
              </TableRow>
            </TableBody>
          </MobileTable>

          <MobileTable>
            <MobileTableSection>Network</MobileTableSection>
            <thead>
              <TableRow>
                <ScreenReaderCol scope="col">Feature</ScreenReaderCol>
                <ScreenReaderCol scope="col">Included</ScreenReaderCol>
              </TableRow>
            </thead>
            <TableBody>
              <TableRow>
                <TableHeader scope="row">Connect to Bitcoin Core</TableHeader>
                <TableColumn>
                  <CheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </CheckIcon>
                  <ScreenReader>Yes</ScreenReader>
                </TableColumn>
              </TableRow>

              <TableRow>
                <TableHeader scope="row">Tor Support</TableHeader>
                <TableColumn>
                  <CheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </CheckIcon>
                  <ScreenReader>Yes</ScreenReader>
                </TableColumn>
              </TableRow>
            </TableBody>
          </MobileTable>

          <MobileTable>
            <MobileTableSection>Support</MobileTableSection>
            <thead>
              <TableRow>
                <ScreenReaderCol scope="col">Feature</ScreenReaderCol>
                <ScreenReaderCol scope="col">Included</ScreenReaderCol>
              </TableRow>
            </thead>
            <TableBody>
              <TableRow>
                <TableHeader scope="row">Email Support</TableHeader>
                <TableColumn>
                  <CheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </CheckIcon>
                  <ScreenReader>Yes</ScreenReader>
                </TableColumn>
              </TableRow>

              <TableRow>
                <TableHeader scope="row">Phone / Zoom Support</TableHeader>
                <TableColumn>
                  <CheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </CheckIcon>
                  <ScreenReader>Yes</ScreenReader>
                </TableColumn>
              </TableRow>
            </TableBody>
          </MobileTable>

          <FooterButton>
            <DownloadButton
              onClick={() =>
                onLicenseClick(LicenseTiers.premium, currentAccount)
              }
              disabled={!!isLoading}
            >
              {isLoading === LicenseTiers.premium ? <Spinner /> : "Buy Premium"}
            </DownloadButton>
          </FooterButton>
        </MobileTableItem>
      </MobileTableContainer>

      <DesktopTableContainer>
        <DesktopTable>
          <ScreenReaderCaption>Pricing plan comparison</ScreenReaderCaption>
          <thead>
            <TableRow>
              <DesktopPlansHeader scope="col">
                <ScreenReader>Feature by</ScreenReader>
                <span>Plans</span>
              </DesktopPlansHeader>

              {!premiumOnly ? (
                <DesktopTableHeader scope="col">Basic</DesktopTableHeader>
              ) : null}

              <DesktopTableHeader scope="col">Premium</DesktopTableHeader>
            </TableRow>
          </thead>
          <TableBody>
            <TableRow>
              <DesktopTablePricingHeader scope="row">
                Pricing
              </DesktopTablePricingHeader>

              {!premiumOnly ? (
                <DesktopTablePricingHeaderColumn>
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <p>
                        <Price>${basicPrice}</Price>
                        <PerYear>/ year</PerYear>
                      </p>
                    </div>
                    <DownloadButton
                      onClick={() =>
                        onLicenseClick(LicenseTiers.basic, currentAccount)
                      }
                      disabled={!!isLoading}
                    >
                      {isLoading === LicenseTiers.basic ? (
                        <Spinner />
                      ) : (
                        "Buy Basic"
                      )}
                    </DownloadButton>
                  </div>
                </DesktopTablePricingHeaderColumn>
              ) : null}

              <DesktopTablePricingHeaderColumn>
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <p>
                      <Price>$1000</Price>
                      <PerYear>/ year</PerYear>
                    </p>
                  </div>
                  <DownloadButton
                    onClick={() =>
                      onLicenseClick(LicenseTiers.premium, currentAccount)
                    }
                    disabled={!!isLoading}
                  >
                    {isLoading === LicenseTiers.premium ? (
                      <Spinner />
                    ) : (
                      "Buy Premium"
                    )}
                  </DownloadButton>
                </div>
              </DesktopTablePricingHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderDesktop colSpan={5} scope="colgroup">
                Security
              </TableHeaderDesktop>
            </TableRow>

            <TableRow>
              <DesktopKeyHeader scope="row">
                Single Signature Hardware Wallets
              </DesktopKeyHeader>
              {!premiumOnly ? (
                <TableColumn>
                  <DesktopCheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </DesktopCheckIcon>
                  <ScreenReader>Included in Basic</ScreenReader>
                </TableColumn>
              ) : null}
              <TableColumn>
                <DesktopCheckIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </DesktopCheckIcon>
                <ScreenReader>Included in Premium</ScreenReader>
              </TableColumn>
            </TableRow>

            <TableRow>
              <DesktopKeyHeader scope="row">
                {twoOfThree ? "2-of-3" : threeOfFive ? "3-of-5" : "Custom"}{" "}
                Multisig Vault
              </DesktopKeyHeader>
              {!premiumOnly ? (
                <TableColumn>
                  <DesktopCheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </DesktopCheckIcon>
                  <ScreenReader>Included in Basic</ScreenReader>
                </TableColumn>
              ) : null}
              <TableColumn>
                <DesktopCheckIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </DesktopCheckIcon>
                <ScreenReader>Included in Premium</ScreenReader>
              </TableColumn>
            </TableRow>
            <TableRow>
              <TableHeaderDesktop colSpan={5} scope="colgroup">
                Network
              </TableHeaderDesktop>
            </TableRow>

            <TableRow>
              <DesktopKeyHeader scope="row">
                Connect to Bitcoin Core
              </DesktopKeyHeader>
              {!premiumOnly ? (
                <TableColumn>
                  <DesktopCheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </DesktopCheckIcon>
                  <ScreenReader>Included in Basic</ScreenReader>
                </TableColumn>
              ) : null}
              <TableColumn>
                <DesktopCheckIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </DesktopCheckIcon>
                <ScreenReader>Included in Premium</ScreenReader>
              </TableColumn>
            </TableRow>

            <TableRow>
              <DesktopKeyHeader scope="row">Tor Support</DesktopKeyHeader>
              {!premiumOnly ? (
                <TableColumn>
                  <DesktopCheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </DesktopCheckIcon>
                  <ScreenReader>Included in Basic</ScreenReader>
                </TableColumn>
              ) : null}
              <TableColumn>
                <DesktopCheckIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </DesktopCheckIcon>
                <ScreenReader>Included in Premium</ScreenReader>
              </TableColumn>
            </TableRow>

            <TableRow>
              <TableHeaderDesktop colSpan={5} scope="colgroup">
                Support
              </TableHeaderDesktop>
            </TableRow>

            <TableRow>
              <DesktopKeyHeader scope="row">Email Support</DesktopKeyHeader>
              {!premiumOnly ? (
                <TableColumn>
                  <DesktopCheckIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </DesktopCheckIcon>
                  <ScreenReader>Included in Basic</ScreenReader>
                </TableColumn>
              ) : null}
              <TableColumn>
                <DesktopCheckIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </DesktopCheckIcon>
                <ScreenReader>Included in Premium</ScreenReader>
              </TableColumn>
            </TableRow>

            <TableRow>
              <DesktopKeyHeader scope="row">
                Phone / Zoom Support
              </DesktopKeyHeader>
              {!premiumOnly ? (
                <TableColumn>
                  <DesktopDashIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </DesktopDashIcon>
                  <ScreenReader>Not included in Basic</ScreenReader>
                </TableColumn>
              ) : null}
              <TableColumn>
                <DesktopCheckIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </DesktopCheckIcon>
                <ScreenReader>Included in Premium</ScreenReader>
              </TableColumn>
            </TableRow>
          </TableBody>
          <tfoot>
            <TableRow>
              <ScreenReaderCol scope="row">Choose your plan</ScreenReaderCol>
              {!premiumOnly ? (
                <TableFooterItem>
                  <DownloadButton
                    onClick={() =>
                      onLicenseClick(LicenseTiers.basic, currentAccount)
                    }
                    disabled={!!isLoading}
                  >
                    {isLoading === LicenseTiers.basic ? (
                      <Spinner />
                    ) : (
                      "Buy Basic"
                    )}
                  </DownloadButton>
                </TableFooterItem>
              ) : null}
              <TableFooterItem>
                <DownloadButton
                  onClick={() =>
                    onLicenseClick(LicenseTiers.premium, currentAccount)
                  }
                  disabled={!!isLoading}
                >
                  {isLoading === LicenseTiers.premium ? (
                    <Spinner />
                  ) : (
                    "Buy Premium"
                  )}
                </DownloadButton>
              </TableFooterItem>
            </TableRow>
          </tfoot>
        </DesktopTable>
      </DesktopTableContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${white};
  margin-top: 2rem;
  border-radius: 0.5rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  max-width: 80rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  ${sm(css`
    padding-top: 2rem;
    padding-bottom: 2rem;
  `)}

  ${lg(css`
    max-width: 80rem;
  `)}
`;

const MobileTableContainer = styled.div`
  --tw-space-y-reverse: 0;
  margin-top: calc(6rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(6rem * var(--tw-space-y-reverse));

  ${lg(css`
    display: none;
  `)}
`;

const HeaderColumn = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
`;

const MobileTable = styled.table`
  margin-top: 2rem;
  border-collapse: collapse;
  border-color: transparent;
`;

const MobileTableSection = styled.caption`
  background: ${gray50};
  border: top 1px ${gray200};
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  font-weight: 500;
  text-align: left;
`;

const DesktopTableContainer = styled.div`
  display: none;

  ${lg(css`
    display: block;
  `)}
`;

const CheckIcon = styled.svg`
  color: ${green500};
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: auto;
  margin-left: auto;
`;

const DashIcon = styled.svg`
  margin-left: auto;
  height: 1.25rem;
  width: 1.25rem;
  color: ${gray400};
`;

const TableRow = styled.tr`
  border-top: 1px ${gray200} solid;
  border: none;
`;

const TableBody = styled.tbody`
  border-top: 1px solid ${gray200};
  border-bottom: 1px solid ${gray200};
`;

const TableHeader = styled.th`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
  color: ${gray700};
  text-align: left;
  border-color: ${gray300};
`;

const ScreenReaderCol = styled.th`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const ScreenReaderCaption = styled.caption`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const ScreenReader = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const DesktopCheckIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  color: ${green500};
`;

const DesktopDashIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  color: ${gray400};
`;

const TableColumn = styled.td`
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${gray200};
`;

const MobileHeading = styled.h2`
  font-size: 1.125rem;
  line-height: 1.75rem;
  line-height: 1.5rem;
  color: ${gray900};
  font-weight: 500;
  border-color: ${gray300};
`;

const Price = styled.span`
  font-size: 2.25rem;
  line-height: 2.5rem;
  color: ${gray900};
  font-weight: 800;
`;

const DesktopTableHeader = styled.th`
  font-size: 1.125rem;
  line-height: 1.75rem;
  padding-bottom: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: ${gray900};
  text-align: left;
  border: none;
  width: 40%;
`;

const TableHeaderDesktop = styled.th`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.5rem;
  background: ${gray50};
  color: ${gray900};
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: left;
  font-weight: 400;
  border-color: ${gray300};
`;

const DesktopKeyHeader = styled.th`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  font-weight: 400;
  color: ${gray700};
  text-align: left;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-color: ${gray200};
`;

const TableFooterItem = styled.td`
  padding-top: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border: none;
`;

const DownloadButton = styled.button`
  color: ${white};
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  background: ${green500};
  width: 100%;
  border-color: transparent;
  border-width: 1px;
  font-weight: 600;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-decoration: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &:hover {
    background: ${green600};
    cursor: pointer;
  }
`;

const DesktopTable = styled.table`
  table-layout: fixed;
  width: 100%;
  height: 1px;
  border-collapse: collapse;
  border: none;
`;

const DesktopPlansHeader = styled.th`
  padding-left: 1.5rem;
  text-align: left;
  padding-right: 1.5rem;
  padding-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  width: 20%;
`;

const DesktopTablePricingHeader = styled.th`
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  vertical-align: top;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  text-align: left;
  font-weight: 500;
  border-color: ${gray300};
`;

const DesktopTablePricingHeaderColumn = styled.td`
  height: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  vertical-align: top;
  border-color: ${gray300};
`;

const FooterButton = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  border-color: ${gray200};
`;

const PerYear = styled.span`
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: ${gray500};

  ${md(css`
    font-size: 1rem;
    line-height: 1.5rem;
  `)}
`;

const MobileTableItem = styled.div`
  margin-top: 6rem;
  margin-bottom: 6rem;
`;
