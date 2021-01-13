import moment from "moment";
import { verify } from "bitcoinjs-message";
import { capitalize } from "./other";

import { LilyLicense, NodeConfig } from "../types";

// License: tier:expires:txId

export const licenseTier = (license: LilyLicense) => {
  const tier = license.license.split(":")[0];
  return capitalize(tier);
};

export const licenseExpires = (license: LilyLicense) => {
  return parseInt(license.license.split(":")[1]);
};

export const licenseTxId = (license: LilyLicense) => {
  const txId = license.license.split(":")[2];
  if (txId) {
    return txId;
  } else {
    return "N/A";
  }
};

export const isFreeTrial = (license: LilyLicense) => {
  return licenseTier(license) === "Trial";
};

export const isAlmostExpiredLicense = (
  license: LilyLicense,
  nodeConfig: NodeConfig
) => {
  return licenseExpires(license) - nodeConfig.blocks < 2160; // two week notice (6 * 24 * 15days)
};

export const isExpiredLicense = (
  license: LilyLicense,
  nodeConfig: NodeConfig
) => {
  return licenseExpires(license) - nodeConfig.blocks < 0;
};

const licenseExpireAsDate = (license: LilyLicense, nodeConfig: NodeConfig) => {
  const blockDiff = licenseExpires(license) - nodeConfig.blocks;
  const blockDiffTimeEst = blockDiff * 10;
  const expireAsDate = moment().add(blockDiffTimeEst, "minutes");
  return expireAsDate;
};

const isValidLicenseSignature = (license: LilyLicense) => {
  if (license.license && license.signature) {
    const verified = verify(
      license.license,
      process.env.REACT_APP_KEYSERVER_SIGNING_ADDRESS!,
      license.signature
    );
    return verified;
  }
  return false;
};

const isFreeTrialLicense = (license: LilyLicense) => {
  if (licenseTier(license) === "Trial") {
    return true;
  }
  return false;
};

export const getLicenseUploadErrorMessage = (
  license: LilyLicense,
  nodeConfig: NodeConfig
) => {
  if (!isValidLicenseSignature(license)) {
    return `Invalid License`;
  } else if (isExpiredLicense(license, nodeConfig)) {
    return `This license is expired`;
  }
  return null;
};

export const getLicenseBannerMessage = (
  license: LilyLicense,
  nodeConfig: NodeConfig
) => {
  if (isFreeTrialLicense(license)) {
    if (isExpiredLicense(license, nodeConfig)) {
      return `Your free trial of Lily has expired. Please buy a license to continue.`;
    } else {
      return `This is a trial version of Lily. Your trial will expire in ${
        licenseExpires(license) - nodeConfig.blocks
      } blocks (approx. ${licenseExpireAsDate(license, nodeConfig).fromNow()})`;
    }
  } else if (!isValidLicenseSignature(license)) {
    return `You are using an invalid license.`;
  } else if (isExpiredLicense(license, nodeConfig)) {
    return `Your license has expired!`;
  } else if (isAlmostExpiredLicense(license, nodeConfig)) {
    return `Your license will expire in ${
      licenseExpires(license) - nodeConfig.blocks
    } blocks (approx. ${licenseExpireAsDate(license, nodeConfig).fromNow()})`;
  } else {
    return null;
  }
};