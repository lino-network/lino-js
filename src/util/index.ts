import { ec as EC } from 'elliptic';
import {
  decodePrivKey,
  decodePubKey,
  encodePubKey,
  encodePrivKey
} from '../transport/utils';

export function genPrivKeyHex(): string {
  const ec = new EC('secp256k1');
  const rawKey = ec.genKeyPair().getPrivate('hex');
  return encodePrivKey(rawKey);
}

export function pubKeyFromPrivate(privKeyHex: string): string {
  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
  const rawKey = key.getPublic(true, 'hex');
  return encodePubKey(rawKey);
}

export function isValidUsername(username: string): boolean {
  const reg = /^[a-z0-9]([a-z0-9_-]){2,20}$/;
  const match = reg.exec(username);
  return match != null;
}

export function isKeyMatch(privKeyHex: string, pubKeyHex: string): boolean {
  const ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
  return key.getPublic(true, 'hex').toUpperCase() == decodePubKey(pubKeyHex);
}
