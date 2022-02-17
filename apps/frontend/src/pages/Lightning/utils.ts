export const getFriendlyType = (
  type: 'CHANNEL_OPEN' | 'CHANNEL_CLOSE' | 'PAYMENT_SEND' | 'PAYMENT_RECEIVE'
) => {
  if (type === 'PAYMENT_SEND') {
    return 'Sent';
  } else if (type === 'PAYMENT_RECEIVE') {
    return 'Received';
  } else if (type === 'CHANNEL_OPEN') {
    return 'Open channel';
  } else {
    return 'Close channel';
  }
};
