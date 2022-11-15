import moment from 'moment';
import { verify } from 'bitcoinjs-message';

import { LilyLicense, NodeConfigWithBlockchainInfo, VaultConfig } from '@lily/types';

// License: tier:expires:txId

export const licenseTier = (license: LilyLicense) => {
  const tier = license.license.split(':')[0];
  return tier;
};

export const licenseExpires = (license: LilyLicense) => {
  return parseInt(license.license.split(':')[1]);
};

export const licenseTxId = (license: LilyLicense) => {
  const txId = license.license.split(':')[2];
  if (txId) {
    return txId;
  } else {
    return null;
  }
};

export const isFreeTrial = (license: LilyLicense) => {
  return licenseTier(license) === 'trial';
};

export const isAlmostExpiredLicense = (
  license: LilyLicense,
  nodeConfig: NodeConfigWithBlockchainInfo
) => {
  return licenseExpires(license) - nodeConfig.blocks < 2160; // two week notice (6 * 24 * 15days)
};

export const isExpiredLicense = (
  license: LilyLicense,
  nodeConfig: NodeConfigWithBlockchainInfo
) => {
  return licenseExpires(license) - nodeConfig.blocks < 0;
};

export const licenseExpireAsDate = (
  license: LilyLicense,
  nodeConfig: NodeConfigWithBlockchainInfo
) => {
  const blockDiff = licenseExpires(license) - nodeConfig.blocks;
  const blockDiffTimeEst = blockDiff * 10;
  const expireAsDate = moment().add(blockDiffTimeEst, 'minutes');
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
  if (licenseTier(license) === 'trial') {
    return true;
  }
  return false;
};

export const getLicenseUploadErrorMessage = (
  license: LilyLicense,
  nodeConfig: NodeConfigWithBlockchainInfo
) => {
  if (!isValidLicenseSignature(license)) {
    return `Invalid License`;
  } else if (isExpiredLicense(license, nodeConfig)) {
    return `This license is expired`;
  }
  return null;
};

export const getLicenseBannerMessage = (
  vault: VaultConfig,
  txConfirmed: boolean,
  nodeConfig: NodeConfigWithBlockchainInfo
): { message: string; promptBuy: boolean } => {
  if (isFreeTrialLicense(vault.license)) {
    if (isExpiredLicense(vault.license, nodeConfig)) {
      return {
        message: `Your 30 day free trial for ${vault.name} has expired. Please purchase a license to help support Lily Wallet.`,
        promptBuy: true
      };
    } else {
      return {
        message: `${vault.name} is using a free trial version of Lily. The trial will expire in ${
          licenseExpires(vault.license) - nodeConfig.blocks
        } blocks (approx. ${licenseExpireAsDate(vault.license, nodeConfig).fromNow()})`,
        promptBuy: false
      };
    }
  } else if (!isValidLicenseSignature(vault.license)) {
    return {
      message: `${vault.name} is using an invalid license.`,
      promptBuy: true
    };
  } else if (isExpiredLicense(vault.license, nodeConfig)) {
    return {
      message: `${vault.name}'s license has expired! Please renew your license.`,
      promptBuy: true
    };
  } else if (isAlmostExpiredLicense(vault.license, nodeConfig)) {
    return {
      message: `${vault.name}'s license will expire in ${
        licenseExpires(vault.license) - nodeConfig.blocks
      } blocks (approx. ${licenseExpireAsDate(vault.license, nodeConfig).fromNow()})`,
      promptBuy: false
    };
  } else if (!txConfirmed && licenseTier(vault.license) !== 'free') {
    return {
      message: `${vault.name}'s license payment transaction hasn't confirmed yet.`,
      promptBuy: false
    };
  } else {
    return { message: '', promptBuy: false };
  }
};

export const isAtLeastTier = (license: LilyLicense, minimumTier: string) => {
  const TIERS = ['free', 'basic', 'essential', 'premium', 'trial'];
  const licenseIndex = TIERS.indexOf(licenseTier(license));
  const minimumIndex = TIERS.indexOf(minimumTier);
  if (licenseIndex >= minimumIndex) {
    return true;
  } else {
    return false;
  }
};
