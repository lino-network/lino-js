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
    validatorListSubstore: "01",
    validatorSubstore: "00",

    delegatorSubstore: "00",
    voterSubstore: "01",
    voteSubstore: "02",
    referenceListSubStore: "03",

    proposalSubstore: "00",
    proposalListSubStore: "01",

    developerSubstore: "00",
    developerListSubstore: "01",

    infraProviderSubstore: "00",
    infraProviderListSubstore: "01",

    accountInfoSubstore: "00",
    accountBankSubstore: "01",
    accountMetaSubstore: "02",
    accountFollowerSubstore: "03",
    accountFollowingSubstore: "04",
    accountRewardSubstore: "05",
    accountPendingStakeQueueSubstore: "06",
    accountRelationshipSubstore: "07",
    accountGrantListSubstore: "08",

    postInfoSubStore: "00",
    postMetaSubStore: "01",
    postLikeSubStore: "02",
    postReportOrUpvoteSubStore: "03",
    postCommentSubStore: "04",
    postViewsSubStore: "05",
    postDonationsSubStore: "06",

    allocationParamSubStore: "00",
    infraInternalAllocationParamSubStore: "01",
    evaluateOfContentValueParamSubStore: "02",
    developerParamSubStore: "03",
    voteParamSubStore: "04",
    proposalParamSubStore: "05",
    validatorParamSubStore: "06",
    coinDayParamSubStore: "07",
    bandwidthParamSubStore: "08",
    accountParamSubstore: "09",

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
    const sepHex = ByteBuffer.fromUTF8("/").toHex();
    return _KEYS.voteSubstore.concat(idHex).concat(sepHex);
  }

  export function getVoteKey(proposalID: string, voter: string): string {
    const voterHex = ByteBuffer.fromUTF8(voter).toHex();
    return getVotePrefix(proposalID).concat(voterHex);
  }

  export function getDelegatorPrefix(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    const sepHex = ByteBuffer.fromUTF8("/").toHex();
    return _KEYS.delegatorSubstore.concat(meHex).concat(sepHex);
  }

  export function getDelegationKey(me: string, myDelegator: string): string {
    const myDelegatorHex = ByteBuffer.fromUTF8(myDelegator).toHex();
    return getDelegatorPrefix(me).concat(myDelegatorHex);
  }

  export function getVoterKey(me: string): string {
    const meHex = ByteBuffer.fromUTF8(me).toHex();
    return _KEYS.voterSubstore.concat(meHex);
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
    return ""
  }

  export function getAccountBankKey(address: string): string {
    return ""
  }

  export function getAccountMetaKey(accKey: string): string {
    return ""
  }

  export function getGrantKeyListKey(address: string): string {
    return ""
  }

  export function getRewardKey(accKey: string): string {
    return ""
  }

  export function getRelationshipPrefix(me: string): string {
    return ""
  }

  export function getRelationshipKey(me: string, other: string): string {
    return ""
  }

  export function getFollowerPrefix(me: string): string {
    return ""
  }

  export function getFollowingPrefix(accKey: string): string {
    return ""
  }

  export function getFollowerKey(me: string, myFollower: string): string {
    return ""
  }

  export function getFollowingKey(me: string, myFollowing: string): string {
    return ""
  }

  // post related
  export function getPostInfoKey(postKey: string): string {
    return ""
  }

  export function getPostKey(author: string, postID: string): string {
    return ""
  }

  export function getPostMetaKey(postKey: string): string {
    return ""
  }

  export function getPostLikePrefix(postKey: string): string {
    return ""
  }

  export function getPostLikeKey(postKey: string, likeUser: string): string {
    return ""
  }

  export function getPostReportOrUpvotePrefix(postKey: string): string {
    return ""
  }

  export function getPostReportOrUpvoteKey(postKey: string, user: string): string {
    return ""
  }

  export function getPostViewPrefix(postKey: string): string {
    return ""
  }

  export function getPostViewKey(postKey: string, viewUser: string): string {
    return ""
  }

  export function getPostCommentPrefix(postKey: string): string {
    return ""
  }

  export function getPostCommentKey(postKey: string, commentPostKey: string): string {
    return ""
  }

  export function getPostDonationPrefix(postKey: string): string {
    return ""
  }

  export function getPostDonationKey(postKey: string, donateUser: string): string {
    return ""
  }

  // proposal related
  export function getProposalKey(proposalID: string): string {
    return ""
  }

  export function getProposalListKey(): string {
    return ""
  }

  // param related
  export function getEvaluateOfContentValueParamKey(): string {
    return ""
  }

  export function getGlobalAllocationParamKey(): string {
    return ""
  }

  export function getInfraInternalAllocationParamKey(): string {
    return ""
  }

  export function getDeveloperParamKey(): string {
    return ""
  }

  export function getVoteParamKey(): string {
    return ""
  }

  export function getValidatorParamKey(): string {
    return ""
  }

  export function getProposalParamKey(): string {
    return ""
  }

  export function getCoinDayParamKey(): string {
    return ""
  }

  export function getBandwidthParamKey(): string {
    return ""
  }

  export function getAccountParamKey(): string {
    return ""
  }


}

export default Keys;
