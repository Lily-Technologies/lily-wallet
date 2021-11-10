import { URL, URLSearchParams } from 'url';
import { decodeCert, decodeMacaroon } from 'lndconnect';

export const parseLndConnectUri = (string = '') => {
  const parsedUrl = new URL(string);
  const parsedQuery = new URLSearchParams(parsedUrl.searchParams);

  if (parsedUrl.protocol !== 'lndconnect:') {
    throw new Error('Invalid protocol');
  }

  return {
    server: parsedUrl.host,
    tls: '',
    cert: decodeCert(parsedQuery.get('cert')!) || undefined,
    macaroon: decodeMacaroon(parsedQuery.get('macaroon')!) || undefined
  };
};
