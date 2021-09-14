import { VaultConfig, AccountConfig, LilyLightningAccount } from "../../types";

import HWWAccount from "./HWW/HWW-Account.json";
import HWWAddresses from "./HWW/HWW-Addresses.json";
import HWWChangeAddresses from "./HWW/HWW-ChangeAddresses.json";
import HWWTransactions from "./HWW/HWW-Transactions.json";
import HWWUnusedAddresses from "./HWW/HWW-UnusedAddresses.json";
import HWWUnusedChangeAddresses from "./HWW/HWW-UnusedChangeAddresses.json";
import HWWUTXOs from "./HWW/HWW-UTXOs.json";

const HWW = {
  account: HWWAccount as AccountConfig,
  addresses: HWWAddresses,
  changeAddresses: HWWChangeAddresses,
  transactions: HWWTransactions,
  unusedAddresses: HWWUnusedAddresses,
  unusedChangeAddresses: HWWUnusedChangeAddresses,
  availableUtxos: HWWUTXOs,
};

import DASAccount from "./DAS/DAS-Account.json";
import DASAddresses from "./DAS/DAS-Addresses.json";
import DASChangeAddresses from "./DAS/DAS-ChangeAddresses.json";
import DASTransactions from "./DAS/DAS-Transactions.json";
import DASUnusedAddresses from "./DAS/DAS-UnusedAddresses.json";
import DASUnusedChangeAddresses from "./DAS/DAS-UnusedChangeAddresses.json";
import DASUTXOs from "./DAS/DAS-UTXOs.json";
import DASOtherData from "./DAS/DAS-other-data.json";

const DAS = {
  account: DASAccount as AccountConfig,
  addresses: DASAddresses,
  changeAddresses: DASChangeAddresses,
  transactions: DASTransactions,
  unusedAddresses: DASUnusedAddresses,
  unusedChangeAddresses: DASUnusedChangeAddresses,
  availableUtxos: DASUTXOs,
  other: DASOtherData,
};

import JBAccount from "./JB/JB-Config.json";
import JBAddresses from "./JB/JB-Addresses.json";
import JBChangeAddresses from "./JB/JB-ChangeAddresses.json";
import JBTransactions from "./JB/JB-Transactions.json";
import JBUnusedAddresses from "./JB/JB-UnusedAddresses.json";
import JBUnusedChangeAddresses from "./JB/JB-UnusedChangeAddresses.json";
import JBUTXOs from "./JB/JB-UTXOs.json";
import JBOtherData from "./JB/JB-other-data.json";

const JB = {
  config: JBAccount as AccountConfig,
  addresses: JBAddresses,
  changeAddresses: JBChangeAddresses,
  transactions: JBTransactions,
  unusedAddresses: JBUnusedAddresses,
  unusedChangeAddresses: JBUnusedChangeAddresses,
  availableUtxos: JBUTXOs,
  other: JBOtherData,
};

import SunnyAccount from "./Sunny/Sunny-Config.json";
// import SunnyAddresses from "./Sunny/Sunny-Addresses.json";
// import SunnyChangeAddresses from "./Sunny/Sunny-ChangeAddresses.json";
// import SunnyTransactions from "./Sunny/Sunny-Transactions.json";
// import SunnyUnusedAddresses from "./Sunny/Sunny-UnusedAddresses.json";
// import SunnyUnusedChangeAddresses from "./Sunny/Sunny-UnusedChangeAddresses.json";
// import SunnyUTXOs from "./Sunny/Sunny-UTXOs.json";
import SunnyOtherData from "./Sunny/Sunny-other-data.json";

const Sunny = {
  config: SunnyAccount as AccountConfig,
  // addresses: SunnyAddresses,
  // changeAddresses: SunnyChangeAddresses,
  // transactions: SunnyTransactions,
  // unusedAddresses: SunnyUnusedAddresses,
  // unusedChangeAddresses: SunnyUnusedChangeAddresses,
  // availableUtxos: SunnyUTXOs,
  other: SunnyOtherData,
};

import MnemonicConfig from "./Mnemonic/Mnemonic-Config.json";
import MnemonicAddresses from "./Mnemonic/Mnemonic-Addresses.json";
import MnemonicChangeAddresses from "./Mnemonic/Mnemonic-ChangeAddresses.json";
import MnemonicTransactions from "./Mnemonic/Mnemonic-Transactions.json";
import MnemonicUnusedAddresses from "./Mnemonic/Mnemonic-UnusedAddresses.json";
import MnemonicUnusedChangeAddresses from "./Mnemonic/Mnemonic-UnusedChangeAddresses.json";
import MnemonicUTXOs from "./Mnemonic/Mnemonic-UTXOs.json";

const Mnemonic = {
  config: MnemonicConfig,
  addresses: MnemonicAddresses,
  changeAddresses: MnemonicChangeAddresses,
  transactions: MnemonicTransactions,
  unusedAddresses: MnemonicUnusedAddresses,
  unusedChangeAddresses: MnemonicUnusedChangeAddresses,
  availableUtxos: MnemonicUTXOs,
};

import MultisigConfig from "./Multisig/Multisig-Config.json";
import MultisigAddresses from "./Multisig/Multisig-Addresses.json";
import MultisigChangeAddresses from "./Multisig/Multisig-ChangeAddresses.json";
import MultisigTransactions from "./Multisig/Multisig-Transactions.json";
import MultisigUnusedAddresses from "./Multisig/Multisig-UnusedAddresses.json";
import MultisigUnusedChangeAddresses from "./Multisig/Multisig-UnusedChangeAddresses.json";
import MultisigUTXOs from "./Multisig/Multisig-UTXOs.json";
import MultisigOtherData from "./Multisig/Multisig-other-data.json";

const Multisig = {
  config: MultisigConfig as VaultConfig,
  addresses: MultisigAddresses,
  changeAddresses: MultisigChangeAddresses,
  transactions: MultisigTransactions,
  unusedAddresses: MultisigUnusedAddresses,
  unusedChangeAddresses: MultisigUnusedChangeAddresses,
  availableUtxos: MultisigUTXOs,
  other: MultisigOtherData,
};

import LightningConfig from "./Lightning/Lightning-Config.json";
import LightningChannels from "./Lightning/Lightning-Channels.json";
import LightningCurrentBalance from "./Lightning/Lightning-CurrentBalance.json";
import LightningClosedChannels from "./Lightning/Lightning-ClosedChannels.json";
import LightningBalanceHistory from "./Lightning/Lightning-BalanceHistory.json";
import LightningEvents from "./Lightning/Lightning-Events.json";
import LightningInfo from "./Lightning/Lightning-Info.json";
import LightningInvoices from "./Lightning/Lightning-Invoices.json";
import LightningPayments from "./Lightning/Lightning-Payments.json";

const Lightning = {
  name: LightningConfig.name,
  currentBalance: LightningCurrentBalance,
  config: LightningConfig,
  channels: LightningChannels,
  pendingChannels: [],
  closedChannels: LightningClosedChannels,
  balanceHistory: LightningBalanceHistory,
  events: LightningEvents,
  info: LightningInfo,
  invoices: LightningInvoices,
  payments: LightningPayments,
  loading: false,
} as unknown as LilyLightningAccount;

export { HWW, DAS, JB, Sunny, Mnemonic, Multisig, Lightning };
