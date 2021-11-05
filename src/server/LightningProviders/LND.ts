import axios from 'axios';
import crypto from 'crypto';
import createLnRpc, {
  InvoiceState,
  LnRpc,
  Invoice,
  createRouterRpc,
  Payment,
  OpenStatusUpdate,
  CloseChannelRequest,
  CloseStatusUpdate,
  FundingPsbtVerify,
  FundingPsbtFinalize,
  OpenChannelRequest
} from '@radar/lnrpc';
import { blockExplorerAPIURL } from 'unchained-bitcoin';
import BigNumber from 'bignumber.js';

import { LightningBaseProvider } from '.';

import { parseLndConnectUri } from '../../utils/lightning';

import {
  LightningConfig,
  LilyLightningAccount,
  LightningEvent,
  DecoratedPendingLightningChannel,
  DecoratedLightningChannel,
  BalanceHistory,
  OpenChannelRequestArgs
} from '../..//types';

import { getTxIdFromChannelPoint, getErrorMessageFromChunk } from '../utils';

export class LND extends LightningBaseProvider {
  constructor(lndConnectUri: string) {
    super('LND', lndConnectUri);
  }

  async getClient(): Promise<LnRpc> {
    const client = await createLnRpc(parseLndConnectUri(this.lndConnectUri));
    return client;
  }

  async initialize() {
    try {
      const client = await this.getClient();
      const info = await client.getInfo();
      this.setConnected(true);
      return info;
    } catch (e) {
      console.log('initialize e: ', e);
      this.setConnected(false);
      throw new Error('Failed to connect');
    }
  }

  async getAccountData(
    config: LightningConfig,
    callback: (accountData: LilyLightningAccount) => void
  ) {
    const lnRpcClient = await createLnRpc(
      parseLndConnectUri(config.connectionDetails.lndConnectUri)
    );

    let { channels } = await lnRpcClient.listChannels();
    if (!channels) {
      channels = [];
    }
    let { channels: closedChannels } = await lnRpcClient.closedChannels();
    if (!closedChannels) {
      closedChannels = [];
    }

    let { pendingOpenChannels, waitingCloseChannels } = await lnRpcClient.pendingChannels();

    if (!pendingOpenChannels) {
      pendingOpenChannels = [];
    }

    if (!waitingCloseChannels) {
      waitingCloseChannels = [];
    }
    const info = await lnRpcClient.getInfo();
    let balance = await lnRpcClient.channelBalance();
    if (!balance) {
      balance = {
        balance: '0',
        pendingOpenBalance: '0'
      };
    }
    // const { transactions } = await lnRpcClient.getTransactions();

    const paymentsAccum: Payment[] = [];
    let allPaymentsRetrieved = false;
    let index = 0;
    while (!allPaymentsRetrieved) {
      let { payments } = await lnRpcClient.listPayments({
        indexOffset: index * 100
      });

      if (!payments) {
        payments = [];
      }

      paymentsAccum.push(...payments);
      index++;
      if (payments.length < 100) {
        allPaymentsRetrieved = true;
        index = 0;
      }
    }

    const invoicesAccum: Invoice[] = [];
    let allInvoicesRetrieved = false;
    while (!allInvoicesRetrieved) {
      let { invoices } = await lnRpcClient.listInvoices({
        indexOffset: (index * 100).toString()
      });

      if (!invoices) {
        invoices = [];
      }

      invoicesAccum.push(...invoices);
      index++;
      if (invoices.length < 100) {
        allInvoicesRetrieved = true;
        index = 0;
      }
    }

    const incomingTxs = invoicesAccum.reduce((filtered, invoice) => {
      if (invoice.state !== InvoiceState.CANCELED && invoice.state !== InvoiceState.OPEN) {
        const decoratedInvoice = {
          ...invoice,
          valueSat: invoice.amtPaidSat,
          title: invoice.memo,
          type: 'PAYMENT_RECEIVE'
        } as LightningEvent;
        filtered.push(decoratedInvoice);
      }
      return filtered;
    }, [] as LightningEvent[]);

    const outgoingTxs = await Promise.all(
      paymentsAccum.map(async (payment) => {
        const decoratedPayment = {
          ...payment,
          type: 'PAYMENT_SEND',
          title: ''
        } as LightningEvent;
        if (payment.paymentRequest) {
          const decodedPaymentRequest = await lnRpcClient.decodePayReq({
            payReq: payment.paymentRequest
          });
          decoratedPayment.title = decodedPaymentRequest.description;
        }

        return decoratedPayment;
      })
    );

    let closedChannelActivity: LightningEvent[] = [];
    for (let i = 0; i < closedChannels.length; i++) {
      const txId = getTxIdFromChannelPoint(closedChannels[i].channelPoint);

      // TODO: use general method to get tx
      const channelOpenTx = await (
        await axios.get(blockExplorerAPIURL(`/tx/${txId}`, 'mainnet'))
      ).data;

      let alias = closedChannels[i].remotePubkey;
      try {
        const openingNodeInfo = await lnRpcClient.getNodeInfo({
          pubKey: closedChannels[i].remotePubkey
        });
        alias = openingNodeInfo!.node!.alias;
      } catch (e) {
        console.log('error getting alias: ', e);
      }

      const channelOpen = {
        type: 'CHANNEL_OPEN',
        creationDate: channelOpenTx.status.block_time,
        title: `Open channel to ${alias}`,
        valueSat: closedChannels[i].capacity,
        tx: channelOpenTx
      } as LightningEvent;
      closedChannelActivity.push(channelOpen);

      const channelCloseTx = await (
        await axios.get(blockExplorerAPIURL(`/tx/${closedChannels[i].closingTxHash}`, 'mainnet'))
      ).data;

      const channelClose = {
        type: 'CHANNEL_CLOSE',
        creationDate: channelCloseTx.status.block_time,
        title: `Close channel to ${alias}`,
        valueSat: closedChannels[i].settledBalance || closedChannels[i].capacity,
        tx: channelCloseTx
      } as LightningEvent;
      closedChannelActivity.push(channelClose);
    }

    const pendingOpenChannelsDecorated: DecoratedPendingLightningChannel[] = [];
    const pendingChannelOpenActivity: LightningEvent[] = [];
    for (let i = 0; i < pendingOpenChannels.length; i++) {
      const { channel } = pendingOpenChannels[i];
      if (channel) {
        const txId = getTxIdFromChannelPoint(channel.channelPoint);
        const channelOpenTx = await (
          await axios.get(blockExplorerAPIURL(`/tx/${txId}`, 'mainnet'))
        ).data;

        const openingNodeInfo = await lnRpcClient.getNodeInfo({
          pubKey: channel.remoteNodePub
        });

        pendingChannelOpenActivity.push({
          type: 'CHANNEL_OPEN',
          creationDate: undefined,
          title: `Open channel to ${openingNodeInfo?.node?.alias}`,
          valueSat: channel.capacity,
          tx: channelOpenTx
        });

        pendingOpenChannelsDecorated.push({
          ...channel,
          alias: openingNodeInfo?.node?.alias || channel.remoteNodePub
        });
      }
    }

    const pendingCloseChannelsDecorated: DecoratedPendingLightningChannel[] = [];
    const pendingChannelCloseActivity: LightningEvent[] = [];
    for (let i = 0; i < waitingCloseChannels.length; i++) {
      const { channel } = waitingCloseChannels[i];
      if (channel) {
        const openingNodeInfo = await lnRpcClient.getNodeInfo({
          pubKey: channel.remoteNodePub
        });

        pendingChannelCloseActivity.push({
          type: 'CHANNEL_CLOSE',
          creationDate: undefined,
          title: `Close channel to ${openingNodeInfo?.node?.alias}`,
          valueSat: channel.capacity
        });

        pendingCloseChannelsDecorated.push({
          ...channel,
          alias: openingNodeInfo?.node?.alias || channel.remoteNodePub
        });
      }
    }

    const decoratedOpenChannels: DecoratedLightningChannel[] = [];
    const openChannelActivity: LightningEvent[] = [];
    for (let i = 0; i < channels.length; i++) {
      const txId = getTxIdFromChannelPoint(channels[i].channelPoint);
      const channelOpenTx = await (
        await axios.get(blockExplorerAPIURL(`/tx/${txId}`, 'mainnet'))
      ).data;

      let alias = channels[i].remotePubkey;
      try {
        const openingNodeInfo = await lnRpcClient.getNodeInfo({
          pubKey: channels[i].remotePubkey
        });
        if (openingNodeInfo?.node?.alias) {
          alias = openingNodeInfo.node.alias;
        }
      } catch (e) {
        console.log('error getting alias: ', e);
      }

      try {
        const detailedChannelInfo = await lnRpcClient.getChanInfo({
          chanId: channels[i].chanId
        });
        decoratedOpenChannels.push({
          ...channels[i],
          lastUpdate: detailedChannelInfo.lastUpdate,
          alias: alias
        });
      } catch (e) {
        console.log('error (/lightning-account-data) getChanInfo', e);
      }

      openChannelActivity.push({
        type: 'CHANNEL_OPEN',
        creationDate: channelOpenTx.status.block_time,
        title: `Open channel to ${alias}`,
        valueSat: channels[i].capacity,
        tx: channelOpenTx
      });
    }

    const sortedEvents = [
      ...outgoingTxs,
      ...incomingTxs,
      ...closedChannelActivity,
      ...openChannelActivity,
      ...pendingChannelOpenActivity,
      ...pendingChannelCloseActivity
    ].sort((a, b) => {
      if (!b.creationDate && !a.creationDate) {
        return 0;
      } else if (!b.creationDate) {
        return -1;
      } else if (!a.creationDate) {
        return -1;
      }
      return Number(b.creationDate) - Number(a.creationDate);
    });

    let balanceHistory: BalanceHistory[] = [];
    if (sortedEvents.length) {
      balanceHistory = [
        {
          blockTime: Number(sortedEvents[sortedEvents.length - 1].creationDate) - 1,
          totalValue: 0
        }
      ];

      for (let i = sortedEvents.length - 1; i >= 0; i--) {
        const currentEvent = sortedEvents[i];
        let currentValue = balanceHistory[balanceHistory.length - 1].totalValue;
        if (currentEvent.type === 'CHANNEL_OPEN' || currentEvent.type === 'PAYMENT_RECEIVE') {
          currentValue += Number(currentEvent.valueSat);
        } else {
          currentValue -= Number(currentEvent.valueSat);
        }

        balanceHistory.push({
          blockTime: currentEvent.creationDate ? Number(currentEvent.creationDate) : undefined,
          totalValue: new BigNumber(currentValue).toNumber()
        });
      }

      balanceHistory.push({
        blockTime: Math.floor(Date.now() / 1000),
        totalValue: new BigNumber(balanceHistory[balanceHistory.length - 1].totalValue).toNumber()
      });
    }

    const accountData = {
      name: config.name,
      config: config,
      channels: decoratedOpenChannels,
      pendingChannels: [...pendingOpenChannelsDecorated, ...pendingCloseChannelsDecorated],
      closedChannels: closedChannels,
      info: info,
      loading: false,
      events: sortedEvents,
      payments: paymentsAccum,
      invoices: invoicesAccum,
      currentBalance: balance,
      balanceHistory: balanceHistory
    };

    callback(accountData);
  }

  async getInvoice({ memo, value }: Invoice) {
    const client = await this.getClient();
    const invoice = await client.addInvoice({ memo, value });
    return invoice;
  }

  async sendPayment(paymentRequest: string, callback: (data: Payment) => void) {
    const lnRpcClient = await createRouterRpc(parseLndConnectUri(this.lndConnectUri));

    const sendPaymentStream = lnRpcClient.sendPaymentV2({
      paymentRequest: paymentRequest,
      timeoutSeconds: 15 // TODO: change?
    });

    sendPaymentStream.on('data', (chunk: Payment) => {
      callback(chunk);
    });

    sendPaymentStream.on('error', (chunk: Payment) => {
      console.log('data error: ', chunk);
    });
  }

  async openChannelInitialize(
    { lightningAddress, channelAmount }: OpenChannelRequestArgs,
    callback: (data: OpenStatusUpdate) => void
  ) {
    const client = await this.getClient();
    // connect to peer
    const { peers } = await client.listPeers();
    const [pubkey, host] = lightningAddress.split('@');

    // if we aren't connected to peer, then connect
    if (!peers.some((peer) => peer.pubKey === pubkey)) {
      console.log(`connecting to peer ${lightningAddress}...`);
      await client.connectPeer({
        addr: {
          pubkey,
          host
        }
      });
      console.log(`connected to peer ${lightningAddress}`);
    }

    const pendingChannelId = crypto.randomBytes(32);
    const openChannelOptions = {
      nodePubkey: Buffer.from(pubkey, 'hex'),
      localFundingAmount: channelAmount,
      pushSat: '0',
      // private?
      fundingShim: {
        psbtShim: {
          pendingChanId: pendingChannelId
        }
      }
    } as OpenChannelRequest;

    console.log(`attempting channel open to ${lightningAddress}...`);
    const openingNodeInfo = await client.getNodeInfo({
      pubKey: pubkey
    });

    const channelResponse = await client.openChannel(openChannelOptions);

    channelResponse.on('data', (chunk) => {
      if (chunk.psbtFund) {
        const openChannelData = {
          ...chunk,
          alias: openingNodeInfo.node!.alias,
          color: openingNodeInfo.node!.color
        };
        callback(openChannelData);
      } else if (chunk.chanPending) {
        callback(chunk);
      }
    });
    channelResponse.on('error', (chunk) => {
      console.log('channelResponse error.message: ', getErrorMessageFromChunk(chunk.message));
      throw new Error(getErrorMessageFromChunk(chunk.message));
    });
    channelResponse.on('end', () => console.log('/open-channel end'));
  }

  async openChannelVerify({ fundedPsbt, pendingChanId }: FundingPsbtVerify) {
    try {
      const client = await this.getClient();
      await client.fundingStateStep({
        psbtVerify: {
          fundedPsbt,
          pendingChanId
        }
      });
    } catch (e) {
      console.log('openChannelVerify error: ', e);
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }

  async openChannelFinalize(psbtFinalize: FundingPsbtFinalize) {
    try {
      const client = await this.getClient();
      await client.fundingStateStep({
        psbtFinalize
      });
    } catch (e) {
      console.log('openChannelFinalize: ', e);
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }

  async closeChannel(
    { channelPoint, deliveryAddress }: CloseChannelRequest,
    callback: (data: CloseStatusUpdate) => void
  ) {
    const client = await this.getClient();
    const closeChannelResponse = await client.closeChannel({
      channelPoint,
      deliveryAddress
    });

    closeChannelResponse.on('data', (chunk) => {
      console.log('/close-channel data: ', chunk);
      callback(chunk);
    });

    closeChannelResponse.on('error', (chunk) => {
      console.log('/close-channel error: ', chunk);
    });

    closeChannelResponse.on('end', () => {
      console.log('/close-channel end');
    });
  }
}
