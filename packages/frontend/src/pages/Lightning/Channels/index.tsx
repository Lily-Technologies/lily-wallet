import React, { useState } from 'react';

import ChannelView from './ChannelView';
import OpenChannel from './OpenChannel';

const Channels = () => {
  const [viewOpenChannelForm, setViewOpenChannelForm] = useState(false);
  let view = <ChannelView setViewOpenChannelForm={setViewOpenChannelForm} />;

  if (viewOpenChannelForm) {
    view = <OpenChannel setViewOpenChannelForm={setViewOpenChannelForm} />;
  }
  return view;
};

export default Channels;
