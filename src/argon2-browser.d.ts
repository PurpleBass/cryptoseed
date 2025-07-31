declare module 'argon2-browser' {
  export interface Argon2Options {
    pass: string | Uint8Array;
    salt: string | Uint8Array;
    type: number;
    mem: number;
    time: number;
    parallelism: number;
    hashLen: number;
  }

  export interface Argon2Result {
    hash: Uint8Array;
    hashHex: string;
    encoded: string;
  }

  export enum ArgonType {
    Argon2d = 0,
    Argon2i = 1,
    Argon2id = 2,
  }

  export function hash(options: Argon2Options): Promise<Argon2Result>;
  export function verify(options: { pass: string | Uint8Array; encoded: string }): Promise<boolean>;

  const argon2: {
    hash: typeof hash;
    verify: typeof verify;
    ArgonType: typeof ArgonType;
  };

  export default argon2;
}
