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
  const _KEYS = {
    validatorSubstore: '00',
    validatorListSubstore: '01',

    delegationSubstore: '00',
    voterSubstore: '01',
    voteSubstore: '02',
    referenceListSubStore: '03',
    delegateeSubStore: '04',

    proposalSubstore: '00',
    proposalListSubStore: '01',

    developerSubstore: '00',
    developerListSubstore: '01',

    infraProviderSubstore: '00',
    infraProviderListSubstore: '01',

    accountInfoSubstore: '00',
    accountBankSubstore: '01',
    accountMetaSubstore: '02',
    accountFollowerSubstore: '03',
    accountFollowingSubstore: '04',
    accountRewardSubstore: '05',
    accountPendingStakeQueueSubstore: '06',
    accountRelationshipSubstore: '07',
    accountBalanceHistorySubstore: '08',
    accountGrantPubKeySubstore: '09',

    postInfoSubStore: '00',
    postMetaSubStore: '01',
    postLikeSubStore: '02',
    postReportOrUpvoteSubStore: '03',
    postCommentSubStore: '04',
    postViewsSubStore: '05',
    postDonationsSubStore: '06',

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
    postParamSubStore: '10',

    sep: ByteBuffer.fromUTF8('/').toHex()
  };

  // validator related
  export function getValidatorKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.validatorSubstore.concat(accKeyHex);
  }

  export function getValidatorListKey(): string {
    return _KEYS.validatorListSubstore;
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

  export function getFollowerPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.accountFollowerSubstore.concat(meHex).concat(_KEYS.sep);
  }

  export function getFollowingPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.accountFollowingSubstore.concat(meHex).concat(_KEYS.sep);
  }

  export function getFollowerKey(me: string, myFollower: string): string {
    const myFollowerHex = ByteBuffer.fromUTF8(myFollower).toHex();
    return getFollowerPrefix(me).concat(myFollowerHex);
  }

  export function getFollowingKey(me: string, myFollowing: string): string {
    const myFollowingHex = ByteBuffer.fromUTF8(myFollowing).toHex();
    return getFollowingPrefix(me).concat(myFollowingHex);
  }

  export function getRewardKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.accountRewardSubstore.concat(accKeyHex);
  }

  export function getRelationshipPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.accountRelationshipSubstore.concat(meHex).concat(_KEYS.sep);
  }

  export function getRelationshipKey(me: string, other: string): string {
    const otherHex = ByteBuffer.fromUTF8(other).toHex();
    return getRelationshipPrefix(me).concat(otherHex);
  }

  export function getBalanceHistoryPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.accountBalanceHistorySubstore.concat(meHex).concat(_KEYS.sep);
  }

  export function getBalanceHistoryKey(me: string, bucketSlot: string): string {
    const bucketSlotHex = ByteBuffer.fromUTF8(bucketSlot).toHex();
    return getBalanceHistoryPrefix(me).concat(bucketSlotHex);
  }

  export function getGrantPubKeyPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.accountGrantPubKeySubstore.concat(meHex).concat(_KEYS.sep);
  }

  // TODO: should the pubKey be string or crypto.PubKey?
  export function getgrantPubKeyKey(me: string, pubKey: string): string {
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

  export function getPostLikePrefix(permlink: string): string {
    const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
    return _KEYS.postLikeSubStore.concat(permlinkHex).concat(_KEYS.sep);
  }

  export function getPostLikeKey(permlink: string, likeUser: string): string {
    const likeUserHex = ByteBuffer.fromUTF8(likeUser).toHex();
    return getPostLikePrefix(permlink).concat(likeUserHex);
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
  export function getProposalKey(proposalID: string): string {
    const proposalIDHex = ByteBuffer.fromUTF8(proposalID).toHex();
    return _KEYS.proposalSubstore.concat(proposalIDHex);
  }

  export function getProposalListKey(): string {
    return _KEYS.proposalListSubStore;
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
}

export default Keys;
