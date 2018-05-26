import { ec as EC } from 'elliptic';

export function genPrivKeyHex(): string {
  const ec = new EC('secp256k1');
  return ec.genKeyPair().getPrivate('hex');
}
