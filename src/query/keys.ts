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
    validatorListSubstore: '01',
    validatorSubstore: '00',

    delegationSubstore: '00',
    voterSubstore: '01',
    voteSubstore: '02',
    referenceListSubStore: '03',
    delegateeListSubStore: '04',

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
    accountGrantListSubstore: '08',
    accountBalanceHistorySubstore: '09',

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

    sep: ByteBuffer.fromUTF8('/').toHex()
  };

  // validator related
  export function getValidatorListKey(): string {
    return _KEYS.validatorListSubstore;
  }

  export function getValidatorKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.validatorSubstore.concat(accKeyHex);
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

  export function getDelegatorPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.delegationSubstore.concat(meHex).concat(_KEYS.sep);
  }

  export function getDelegationKey(me: string, myDelegator: string): string {
    const myDelegatorHex = ByteBuffer.fromUTF8(myDelegator).toHex();
    return getDelegatorPrefix(me).concat(myDelegatorHex);
  }

  export function getVoterKey(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.voterSubstore.concat(meHex);
  }

  export function getDelegateeListKey(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.delegateeListSubStore.concat(meHex);
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

  export function getGrantKeyListKey(accKey: string): string {
    const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
    return _KEYS.accountGrantListSubstore.concat(accKeyHex);
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

  export function getBalanceHistoryPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.accountBalanceHistorySubstore.concat(meHex).concat(_KEYS.sep);
  }

  export function getBalanceHistoryKey(me: string, atWhen: string): string {
    const atWhenHex = ByteBuffer.fromUTF8(atWhen).toHex();
    return getBalanceHistoryPrefix(me).concat(atWhenHex);
  }

  // post related
  export function getPostInfoKey(postKey: string): string {
    const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
    return _KEYS.postInfoSubStore.concat(postKeyHex);
  }

  export function getPostKey(author: string, postID: string): string {
    return author.concat('#').concat(postID);
  }

  export function getPostMetaKey(postKey: string): string {
    const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
    return _KEYS.postMetaSubStore.concat(postKeyHex);
  }

  export function getPostLikePrefix(postKey: string): string {
    const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
    return _KEYS.postLikeSubStore.concat(postKeyHex).concat(_KEYS.sep);
  }

  export function getPostLikeKey(postKey: string, likeUser: string): string {
    const likeUserHex = ByteBuffer.fromUTF8(likeUser).toHex();
    return getPostLikePrefix(postKey).concat(likeUserHex);
  }

  export function getPostReportOrUpvotePrefix(postKey: string): string {
    const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
    return _KEYS.postReportOrUpvoteSubStore.concat(postKeyHex).concat(_KEYS.sep);
  }

  export function getPostReportOrUpvoteKey(postKey: string, user: string): string {
    const userHex = ByteBuffer.fromUTF8(user).toHex();
    return getPostReportOrUpvotePrefix(postKey).concat(userHex);
  }

  export function getPostViewPrefix(postKey: string): string {
    const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
    return _KEYS.postViewsSubStore.concat(postKeyHex).concat(_KEYS.sep);
  }

  export function getPostViewKey(postKey: string, viewUser: string): string {
    const viewUserHex = ByteBuffer.fromUTF8(viewUser).toHex();
    return getPostViewPrefix(postKey).concat(viewUserHex);
  }

  export function getPostCommentPrefix(postKey: string): string {
    const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
    return _KEYS.postCommentSubStore.concat(postKeyHex).concat(_KEYS.sep);
  }

  export function getPostCommentKey(postKey: string, commentPostKey: string): string {
    const commentPostKeyHex = ByteBuffer.fromUTF8(commentPostKey).toHex();
    return getPostCommentPrefix(postKey).concat(commentPostKeyHex);
  }

  export function getPostDonationPrefix(postKey: string): string {
    const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
    return _KEYS.postDonationsSubStore.concat(postKeyHex).concat(_KEYS.sep);
  }

  export function getPostDonationKey(postKey: string, donateUser: string): string {
    const donateUserHex = ByteBuffer.fromUTF8(donateUser).toHex();
    return getPostDonationPrefix(postKey).concat(donateUserHex);
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
}

export default Keys;
