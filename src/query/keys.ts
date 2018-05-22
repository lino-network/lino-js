//@ts-ignore
import ByteBuffer from 'bytebuffer';

namespace Keys {
  export const KVSTOREKEYS = {
    MainKVStoreKey: 'main',
    AccountKVStoreKey: 'account',
    PostKVStoreKey: 'post',
    ValidatorKVStoreKey: 'validator',
    GlobalKVStoreKey: 'global',
    VoteKVStoreKey: 'vote',
    InfraKVStoreKey: 'infra',
    DeveloperKVStoreKey: 'developer',
    ParamKVStoreKey: 'param',
    ProposalKVStoreKey: 'proposal'
  };
  const _KEYS: { [name: string]: string } = {
    // ByteBuffer: returns this if offset is omitted, else the actual number of bytes written.
    // we force it to be ByteBuffer since we don't pass in `offset`
    //validatorListSubstore: new ByteBuffer().writeString("01").toString("hex")
    validatorListSubstore: "01",
    validatorSubstore: "00"
  };
  export function getValidatorListKey() {
    return _KEYS.validatorListSubstore;
  }

  export function getValidatorKey(accKey:string) {
    var accKeyHex = ByteBuffer.fromUTF8(accKey).toHex()
    return _KEYS.validatorSubstore.concat(accKeyHex)
  }
}

export default Keys;
