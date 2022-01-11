interface EncodeProps {
  host: string;
  cert: string;
  macaroon: string;
}

declare module 'lndconnect' {
  function decodeCert(cert: string): string;
  function decodeMacaroon(cert: string): string;
  function encode({ host, cert, macaroon }: EncodeProps): string;
}
