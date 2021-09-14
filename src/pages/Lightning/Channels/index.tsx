import React, { useState } from "react";

import ChannelView from "./ChannelView";
import OpenChannel from "./OpenChannel";

import { NodeConfig } from "src/types";

interface Props {
  nodeConfig: NodeConfig;
}

const Channels = ({ nodeConfig }: Props) => {
  const [viewOpenChannelForm, setViewOpenChannelForm] = useState(false);
  let view = <ChannelView setViewOpenChannelForm={setViewOpenChannelForm} />;

  if (viewOpenChannelForm) {
    view = <OpenChannel setViewOpenChannelForm={setViewOpenChannelForm} />;
  }
  return view;
};

export default Channels;
