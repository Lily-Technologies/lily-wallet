declare module "lndconnect" {
  function decodeCert(cert: string): string;
  function decodeMacaroon(cert: string): string;
}
