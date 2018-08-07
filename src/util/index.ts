import { ec as EC } from 'elliptic';
import shajs from 'sha.js';
import { decodePrivKey, decodePubKey, encodePrivKey, encodePubKey } from '../transport/encoder';

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

// deterministically generates new priv-key bytes from provided key.
export function derivePrivKey(privKeyHex): string {
  const ec = new EC('secp256k1');
  const keyHash = shajs('sha256')
    .update(privKeyHex)
    .digest();
  var key = ec.genKeyPair({ entropy: keyHash });
  return encodePrivKey(key.getPrivate('hex'));
}

// Sign msg
export function signWithSha256(msg: any, username: string, app: string, privKeyHex: string): any {
  // private key from hex
  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');

  // signmsg
  const msgHash = shajs('sha256')
    .update(JSON.stringify(msg))
    .digest();
  const signByte = shajs('sha256')
    .update(JSON.stringify({ msg: msg, username: username, app: app, sha256Hash: msgHash }))
    .digest();
  // sign to get signature
  const sig = key.sign(signByte, { canonical: true });
  return sig;
}

// Sign msg
export function verifyWithSha256(
  msg: any,
  username: string,
  app: string,
  pubKeyHex: string,
  signature: any
): boolean {
  // private key from hex
  var ec = new EC('secp256k1');
  var key = ec.keyFromPublic(decodePubKey(pubKeyHex), 'hex');

  // signmsg
  const msgHash = shajs('sha256')
    .update(JSON.stringify(msg))
    .digest();
  const signByte = shajs('sha256')
    .update(JSON.stringify({ msg: msg, username: username, app: app, sha256Hash: msgHash }))
    .digest();
  // sign to get signature
  const res = key.verify(signByte, signature);
  return res;
}
