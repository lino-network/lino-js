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
    ProposalKVStoreKey: 'proposal',
    ReputationKVStoreKey: 'reputation',

    AccountInfoSubStore: 'info',
    AccountBankSubStore: 'bank',
    AccountBankByAddressSubStore: 'bankByAddress',
    AccountMetaSubStore: 'meta',
    AccountRewardSubStore: 'reward',
    AccountPendingCoinDaySubStore: 'pendingCoinDay',
    AccountGrantPubKeySubStore: 'grantPubKey',
    AccountAllGrantPubKeys: 'allGrantPubKey',
    AccountTxAndSequence: 'txAndSeq',

    DeveloperSubStore: 'dev',
    DeveloperListSubStore: 'devList',
    IDASubStore: 'devIDA',
    IDABalanceSubStore: 'devIDABalance',
    AffiliatedSubStore: 'devAffiliated',
    ReservePoolSubStore: 'devReservePool',
    IDAStatsSubStore: 'devIDAStats',

    TimeEventListSubStore: 'timeEventList',
    GlobalMetaSubStore: 'globalMeta',
    InflationPoolSubStore: 'inflationPool',
    ConsumptionMetaSubStore: 'consumptionMeta',
    TpsSubStore: 'tps',
    LinoStakeStatSubStore: 'stake-stats',
    GlobalTimeSubStore: 'globalTime',
    InflationSubStore: 'inflation',

    InfraProviderSubStore: 'infra',
    InfraListSubStore: 'infraList',

    PostInfoSubStore: 'info',
    PostMetaSubStore: 'meta',
    PostReportOrUpvoteSubStore: 'reportOrUpvote',
    PostCommentSubStore: 'comment',
    PostViewSubStore: 'view',

    NextProposalIDSubStore: 'next',
    OngoingProposalSubStore: 'ongoing',
    ExpiredProposalSubStore: 'expired',

    ValidatorSubStore: 'validator',
    ValidatorListSubStore: 'valList',
    ElectionVoteListSubStore: 'electionVoteList',

    DelegationSubStore: 'delegation',
    VoterSubStore: 'voter',
    VoteSubStore: 'vote',
    ReferenceListSubStore: 'refList',
    DelegateeSubStore: 'delegatee',

    AllocationParamSubStore: 'allocation',
    InfraInternalAllocationParamSubStore: 'infraInternal',
    DeveloperParamSubStore: 'developer',
    VoteParamSubStore: 'vote',
    ProposalParamSubStore: 'proposal',
    ValidatorParamSubStore: 'validator',
    CoinDayParamSubStore: 'coinday',
    BandwidthParamSubStore: 'bandwidth',
    AccountParamSubStore: 'account',
    PostParamSubStore: 'post',
    ReputationParamSubStore: 'reputation',

    ReputationSubStore: 'rep'
  };
  const _KEYS = {
    validatorSubstore: '00',
    validatorListSubstore: '01',
    electionVoteListSubstore: '02',

    delegationSubstore: '00',
    voterSubstore: '01',
    voteSubstore: '02',
    referenceListSubStore: '03',
    delegateeSubStore: '04',

    nextProposalIDSubstore: '00',
    ongoingProposalSubStore: '01',
    expiredProposalSubStore: '02',

    developerSubstore: '00',
    developerListSubstore: '01',

    infraProviderSubstore: '00',
    infraProviderListSubstore: '01',

    accountInfoSubstore: '00',
    accountBankSubstore: '01',
    accountMetaSubstore: '02',
    accountRewardSubstore: '03',
    accountPendingCoinDayQueueSubstore: '04',
    accountGrantPubKeySubstore: '05',

    postInfoSubStore: '00',
    postMetaSubStore: '01',
    postReportOrUpvoteSubStore: '02',
    postCommentSubStore: '03',
    postViewsSubStore: '04',
    postDonationsSubStore: '05',

    allocationParamSubStore: '00',
    infraInternalAllocationParamSubStore: '01',
    evaluateOfContentValueParamSubStore: '02',
    developerParamSubStore: '03',
    voteParamSubStore: '04',
    proposalParamSubStore: '05',
    validatorParamSubStore: '06',
    coinDayParamSubStore: '07',
    bandwidthParamSubStore: '08',
    accountParamSubstore: '09',
    postParamSubStore: '0a',
    reputationParamSubStore: '0b',

    timeEventListSubStore: '00',
    globalMetaSubStore: '01',
    inflationPoolSubStore: '02',
    consumptionMetaSubStore: '03',
    tpsSubStore: '04',
    timeSubStore: '05',
    linoStakeStatSubStore: '06',

    repUserMetaSubStore: '00',
    repPostMetaSubStore: '01',
    repUserPostMetaSubStore: '02',
    repRoundMetaSubstore: '03',
    repRoundPostMetaSubstore: '04',
    repRoundUserPostMetaPrefix: '05',
    repGameMetaPrefix: '06',

    sep: ByteBuffer.fromUTF8('/').toHex(),
    separator: '/'
  };

  export function getHexSubstringAfterKeySeparator(key: string): string {
    return key.substr(key.indexOf(_KEYS.separator) + 1, key.length);
  }

  export function getSubstringAfterKeySeparator(key: string): string {
    return key.substr(key.lastIndexOf(_KEYS.separator) + 1, key.length);
  }

  export function getSubstringAfterSubstore(key: string): string {
    return key.substr(2, key.length);
  }

  // validator related
  export function getValidatorKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.validatorSubstore.concat(accKeyHex);
  }

  export function getValidatorListKey(): string {
    return _KEYS.validatorListSubstore;
  }

  export function getElectionVoteListKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.electionVoteListSubstore.concat(accKeyHex);
  }

  // vote related
  export function getVotePrefix(id: string): string {
    const idHex = ByteBuffer.fromUTF8(id).toHex();
    return _KEYS.voteSubstore.concat(idHex).concat(_KEYS.sep);
  }

  export function getVoteKey(proposalID: string, voter: string): string {
    const voterHex = ByteBuffer.fromUTF8(voter).toHex();
    return getVotePrefix(proposalID).concat(voterHex);
  }

  export function getDelegationPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.delegationSubstore.concat(meHex).concat(_KEYS.sep);
  }

  export function getDelegationKey(me: string, myDelegator: string): string {
    const myDelegatorHex = ByteBuffer.fromUTF8(myDelegator).toHex();
    return getDelegationPrefix(me).concat(myDelegatorHex);
  }

  export function getVoterKey(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.voterSubstore.concat(meHex);
  }

  export function getDelegateePrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.delegateeSubStore.concat(meHex).concat(_KEYS.sep);
  }

  export function getDelegateeKey(me: string, myDelegatee: string): string {
    const myDelegateeHex = ByteBuffer.fromUTF8(myDelegatee).toHex();
    return getDelegateePrefix(me).concat(myDelegateeHex);
  }

  // developer related
  export function getDeveloperKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.developerSubstore.concat(accKeyHex);
  }

  export function getDeveloperPrefix(): string {
    return _KEYS.developerSubstore;
  }

  export function getDeveloperListKey(): string {
    return _KEYS.developerListSubstore;
  }

  // infra related
  export function getInfraProviderKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.infraProviderSubstore.concat(accKeyHex);
  }

  export function getInfraProviderListKey(): string {
    return _KEYS.infraProviderListSubstore;
  }

  // account related
  export function getAccountInfoKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.accountInfoSubstore.concat(accKeyHex);
  }

  export function getAccountBankKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.accountBankSubstore.concat(accKeyHex);
  }

  export function getAccountMetaKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.accountMetaSubstore.concat(accKeyHex);
  }

  export function getAccountPendingCoinDayQueueKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.accountPendingCoinDayQueueSubstore.concat(accKeyHex);
  }

  export function getRewardKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.accountRewardSubstore.concat(accKeyHex);
  }

  export function getPendingCoinDayQueueKey(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.accountPendingCoinDayQueueSubstore.concat(meHex).concat(_KEYS.sep);
  }

  export function getGrantPubKeyPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.accountGrantPubKeySubstore.concat(meHex).concat(_KEYS.sep);
  }

  // TODO: should the pubKey be string or crypto.PubKey?
  export function getGrantPubKeyKey(me: string, pubKey: string): string {
    const pubKeyHex = ByteBuffer.fromUTF8(pubKey).toHex();
    return getGrantPubKeyPrefix(me).concat(pubKeyHex);
  }

  // post related
  export function getPermlink(author: string, postID: string): string {
    return author.concat('#').concat(postID);
  }

  export function getPostInfoPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.postInfoSubStore.concat(meHex);
  }

  export function getPostInfoKey(permlink: string): string {
    const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
    return _KEYS.postInfoSubStore.concat(permlinkHex);
  }

  export function getPostMetaPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.postMetaSubStore.concat(meHex);
  }

  export function getPostMetaKey(permlink: string): string {
    const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
    return _KEYS.postMetaSubStore.concat(permlinkHex);
  }

  export function getPostReportOrUpvotePrefix(permlink: string): string {
    const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
    return _KEYS.postReportOrUpvoteSubStore.concat(permlinkHex).concat(_KEYS.sep);
  }

  export function getPostReportOrUpvoteKey(permlink: string, user: string): string {
    const userHex = ByteBuffer.fromUTF8(user).toHex();
    return getPostReportOrUpvotePrefix(permlink).concat(userHex);
  }

  export function getPostViewPrefix(permlink: string): string {
    const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
    return _KEYS.postViewsSubStore.concat(permlinkHex).concat(_KEYS.sep);
  }

  export function getPostViewKey(permlink: string, viewUser: string): string {
    const viewUserHex = ByteBuffer.fromUTF8(viewUser).toHex();
    return getPostViewPrefix(permlink).concat(viewUserHex);
  }

  export function getPostCommentPrefix(permlink: string): string {
    const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
    return _KEYS.postCommentSubStore.concat(permlinkHex).concat(_KEYS.sep);
  }

  export function getPostCommentKey(permlink: string, commentPermlink: string): string {
    const commentPermlinkHex = ByteBuffer.fromUTF8(commentPermlink).toHex();
    return getPostCommentPrefix(permlink).concat(commentPermlinkHex);
  }

  export function getPostDonationsPrefix(permlink: string): string {
    const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
    return _KEYS.postDonationsSubStore.concat(permlinkHex).concat(_KEYS.sep);
  }

  export function getPostDonationsKey(permlink: string, donateUser: string): string {
    const donateUserHex = ByteBuffer.fromUTF8(donateUser).toHex();
    return getPostDonationsPrefix(permlink).concat(donateUserHex);
  }

  // proposal related
  export function getOngoingProposalKey(proposalID: string): string {
    const proposalIDHex = ByteBuffer.fromUTF8(proposalID).toHex();
    return _KEYS.ongoingProposalSubStore.concat(proposalIDHex);
  }

  export function getExpiredProposalKey(proposalID: string): string {
    const proposalIDHex = ByteBuffer.fromUTF8(proposalID).toHex();
    return _KEYS.expiredProposalSubStore.concat(proposalIDHex);
  }

  export function getNextProposalIDKey(): string {
    return _KEYS.nextProposalIDSubstore;
  }

  export function getOngoingProposalPrefix(): string {
    return _KEYS.ongoingProposalSubStore;
  }

  export function getExpiredProposalPrefix(): string {
    return _KEYS.expiredProposalSubStore;
  }

  // param related
  export function getEvaluateOfContentValueParamKey(): string {
    return _KEYS.evaluateOfContentValueParamSubStore;
  }

  export function getGlobalAllocationParamKey(): string {
    return _KEYS.allocationParamSubStore;
  }

  export function getInfraInternalAllocationParamKey(): string {
    return _KEYS.infraInternalAllocationParamSubStore;
  }

  export function getDeveloperParamKey(): string {
    return _KEYS.developerParamSubStore;
  }

  export function getVoteParamKey(): string {
    return _KEYS.voteParamSubStore;
  }

  export function getValidatorParamKey(): string {
    return _KEYS.validatorParamSubStore;
  }

  export function getProposalParamKey(): string {
    return _KEYS.proposalParamSubStore;
  }

  export function getCoinDayParamKey(): string {
    return _KEYS.coinDayParamSubStore;
  }

  export function getBandwidthParamKey(): string {
    return _KEYS.bandwidthParamSubStore;
  }

  export function getAccountParamKey(): string {
    return _KEYS.accountParamSubstore;
  }

  export function getPostParamKey(): string {
    return _KEYS.postParamSubStore;
  }

  export function getReputationParamKey(): string {
    return _KEYS.reputationParamSubStore;
  }

  export function getGlobalMetaKey(): string {
    return _KEYS.globalMetaSubStore;
  }

  export function getInflationPoolKey(): string {
    return _KEYS.inflationPoolSubStore;
  }

  export function getConsumptionMetaKey(): string {
    return _KEYS.consumptionMetaSubStore;
  }

  export function getTimeEventKey(time: string): string {
    return _KEYS.timeEventListSubStore.concat(time);
  }

  export function getTimeEventPrefix(): string {
    return _KEYS.timeEventListSubStore;
  }

  export function getTPSKey(): string {
    return _KEYS.tpsSubStore;
  }

  export function getTimeKey(): string {
    return _KEYS.timeSubStore;
  }

  export function getLinoStakeStatKey(day: string): string {
    const dayHex = ByteBuffer.fromUTF8(day).toHex();
    return _KEYS.linoStakeStatSubStore.concat(dayHex);
  }

  export function getUserReputationMetaKey(username: string): string {
    const usernameHex = ByteBuffer.fromUTF8(username).toHex();
    return _KEYS.repUserMetaSubStore.concat(usernameHex);
  }

  export function getPostReputationMetaKey(permlink: string): string {
    const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
    return _KEYS.repPostMetaSubStore.concat(permlinkHex);
  }
}

export default Keys;
