declare module '@cvbb/sdk' {
  class CoboVaultSDK {
    new()

    encodeDataForQR(data: string): string[]
    decodeQRData(dataFrames: string[]): string
  }
}