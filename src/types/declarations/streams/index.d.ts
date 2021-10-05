import { Stream } from "stream";

export declare class Readable<RES = any>
  extends Stream
  implements NodeJS.ReadableStream
{
  public readable: boolean;
  public readonly readableHighWaterMark: number;
  public readonly readableLength: number;
  constructor(opts?: ReadableOptions<RES>);
  public _read(size: number): void;
  public read(size?: number): string | Buffer;
  public setEncoding(encoding: string): this;
  public pause(): this;
  public resume(): this;
  public isPaused(): boolean;
  public unpipe<T extends NodeJS.WritableStream>(destination?: T): this;
  public unshift(chunk: string | Buffer): void;
  public wrap(oldStream: NodeJS.ReadableStream): this;
  public push(chunk: RES, encoding?: string): boolean;
  public _destroy(
    error: Error | null,
    callback: (error: Error | null) => void
  ): void;
  public destroy(error?: Error): void;

  /**
   * Event emitter
   * The defined events on documents including:
   * 1. close
   * 2. data
   * 3. end
   * 4. readable
   * 5. error
   */
  public addListener(
    event: "close" | "end" | "readable",
    listener: () => void
  ): this;
  public addListener(event: "data", listener: (chunk: RES) => void): this;
  public addListener(event: "error", listener: (err: Error) => void): this;
  public addListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;

  public emit(event: "close" | "end" | "readable"): boolean;
  public emit(event: "data", chunk: RES): boolean;
  public emit(event: "error", err: Error): boolean;
  public emit(event: string | symbol, ...args: any[]): boolean;

  public on(event: "close" | "end" | "readable", listener: () => void): this;
  public on(event: "data", listener: (chunk: RES) => void): this;
  public on(event: "error", listener: (err: Error) => void): this;
  public on(event: string | symbol, listener: (...args: any[]) => void): this;

  public once(event: "close" | "end" | "readable", listener: () => void): this;
  public once(event: "data", listener: (chunk: RES) => void): this;
  public once(event: "error", listener: (err: Error) => void): this;
  public once(event: string | symbol, listener: (...args: any[]) => void): this;

  public prependListener(
    event: "close" | "end" | "readable",
    listener: () => void
  ): this;
  public prependListener(event: "data", listener: (chunk: RES) => void): this;
  public prependListener(event: "error", listener: (err: Error) => void): this;
  public prependListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;

  public prependOnceListener(
    event: "close" | "end" | "readable",
    listener: () => void
  ): this;
  public prependOnceListener(
    event: "data",
    listener: (chunk: RES) => void
  ): this;
  public prependOnceListener(
    event: "error",
    listener: (err: Error) => void
  ): this;
  public prependOnceListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;

  public removeListener(
    event: "close" | "end" | "readable",
    listener: () => void
  ): this;
  public removeListener(event: "data", listener: (chunk: RES) => void): this;
  public removeListener(event: "error", listener: (err: Error) => void): this;
  public removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void
  ): this;

  public [Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer>;
}

export interface ReadableOptions<RES> {
  highWaterMark?: number;
  encoding?: string;
  objectMode?: boolean;
  read?(this: Readable<RES>, size: number): void;
  destroy?(
    this: Readable<RES>,
    error: Error | null,
    callback: (error: Error | null) => void
  ): void;
}
