declare module "lnd-grpc" {
  import { Readable } from "../streams";
  interface OptionsShape {
    lndconnectUri: string;
  }

  interface LndGrpc {
    new (n: OptionsShape);
    connect: () => {};

    services: {
      Lightning: LightningService;
    };
  }

  class LndGrpc {
    constructor(n: OptionsShape);
  }

  export default LndGrpc;

  interface Peer {
    pub_key: string;
    address: string;
    bytes_sent: number;
    bytes_recv: number;
    sat_sent: number;
    sat_recv: number;
    inbound: boolean;
    ping_time: number;
    sync_type: Peer.SyncType;
    features: Array<[number, Feature.AsObject]>;
    errors: Array<TimestampedError.AsObject>;
    flap_count: number;
    last_flap_ns: number;
  }

  interface LightningAddress {
    pubkey: string;
    host: string;
  }

  interface ConnectPeerRequest {
    addr?: LightningAddress;
    perm?: boolean;
  }

  interface NodeInfoRequest {
    pub_key: string;
    include_channels?: boolean;
  }

  interface NodeInfo {
    node?: LightningNode;
    num_channels: number;
    total_capacity: string;
    channels: ChannelEdge[];
  }

  interface OpenStatusUpdate {
    chan_pending?: PendingUpdate;
    chan_open?: ChannelOpenUpdate;
    psbt_fund?: ReadyForPsbtFunding;
    pending_chan_id?: Buffer | string;
  }

  interface OpenChannelRequest {
    node_pubkey?: Buffer | string;
    node_pubkey_string?: string;
    local_funding_amount?: string;
    push_sat?: string;
    target_conf?: number;
    sat_per_byte?: string;
    private?: boolean;
    min_htlc_msat?: string;
    remote_csv_delay?: number;
    min_confs?: number;
    spend_unconfirmed?: boolean;
    close_address?: string;
    funding_shim?: FundingShim;
    remote_max_value_in_flight_msat?: number;
    remote_max_htlcs?: number;
  }

  interface LightningService {
    listPeers: () => { peers: Peer[] };
    connectPeer(args: ConnectPeerRequest): Promise<{}>;
    getNodeInfo(args: NodeInfoRequest): Promise<NodeInfo>;
    openChannel(args: OpenChannelRequest): Readable<OpenStatusUpdate>;
  }
}
