import * as ByteBuffer from 'bytebuffer';

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
  const _KEYS = {
    ValidatorListSubstore: new ByteBuffer().WriteString(
      'ValidatorList/ValidatorListKey'
    )
  };
  export function getValidatorListKey() {
    return _KEYS.ValidatorListSubstore;
  }
}

export default Keys;
