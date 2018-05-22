import { ITransport } from '../transport';
import Keys from './keys';

export default class Query {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  // validator related query
  getAllValidators(): Promise<AllValidators | null> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    return this._transport.query<AllValidators>(Keys.getValidatorListKey(), ValidatorKVStoreKey);
  }

  getValidator(username: string): Promise<Validator | null> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    return this._transport.query<Validator>(Keys.getValidatorKey(username), ValidatorKVStoreKey);
  }

  // account related query
  getAccountMeta(username: string): Promise<AccountMeta | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<AccountMeta>(Keys.getAccountMetaKey(username), AccountKVStoreKey);
  }

  getAccountBank(address: string): Promise<AccountBank | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<AccountBank>(Keys.getAccountBankKey(address), AccountKVStoreKey);
  }

  getAccountInfo(username: string): Promise<AccountInfo | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<AccountInfo>(Keys.getAccountInfoKey(username), AccountKVStoreKey);
  }

  getGrantList(username: string): Promise<GrantKeyList | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<GrantKeyList>(Keys.getGrantKeyListKey(username), AccountKVStoreKey);
  }

  getReward(username: string): Promise<Reward | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<Reward>(Keys.getRewardKey(username), AccountKVStoreKey);
  }

  getRelationship(me: string, other: string): Promise<Relationship | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<Relationship>(Keys.getRelationshipKey(me, other), AccountKVStoreKey);
  }

  getFollowerMeta(me: string, myFollower: string): Promise<FollowerMeta | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<FollowerMeta>(Keys.getFollowerKey(me, myFollower), AccountKVStoreKey);
  }

  getFollowingMeta(me: string, myFollowing: string): Promise<FollowingMeta | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<FollowingMeta>(Keys.getFollowingKey(me, myFollowing), AccountKVStoreKey);
  }

  // post related query
  getPostComment(author: string, postID: string, commentPostKey: string): Promise<Comment | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<Comment>(Keys.getPostCommentKey(PostKey, commentPostKey), PostKVStoreKey);
  }

  getPostView(author: string, postID: string, viewUser: string): Promise<View | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<View>(Keys.getPostViewKey(PostKey, viewUser), PostKVStoreKey);
  }

  getPostDonation(author: string, postID: string, donateUser: string): Promise<Donation | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<Donation>(Keys.getPostDonationKey(PostKey, donateUser), PostKVStoreKey);
  }

  getPostReportOrUpvote(author: string, postID: string, user: string): Promise<ReportOrUpvote | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<ReportOrUpvote>(Keys.getPostCommentKey(PostKey, user), PostKVStoreKey);
  }

  getPostInfo(author: string, postID: string): Promise<PostInfo | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<PostInfo>(Keys.getPostInfoKey(PostKey), PostKVStoreKey);
  }

  getPostMeta(author: string, postID: string): Promise<PostMeta | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<PostMeta>(Keys.getPostMetaKey(PostKey), PostKVStoreKey);
  }

  // vote related query
  getDelegation(voter: string, delegator: string): Promise<Delegation | null> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.query<Delegation>(Keys.getDelegationKey(voter, delegator), VoteKVStoreKey);
  }

  getVoter(voterName: string): Promise<Voter | null> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.query<Voter>(Keys.getVoterKey(voterName), VoteKVStoreKey);
  }

  // developer related query
  getDeveloper(developerName: string): Promise<Developer | null> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    return this._transport.query<Developer>(Keys.getDeveloperKey(developerName), DeveloperKVStoreKey);
  }

  getDevelopers(): Promise<DeveloperList | null> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    return this._transport.query<DeveloperList>(Keys.getDeveloperListKey(), DeveloperKVStoreKey);
  }

  // infra related query
  getInfraProvider(providerName: string): Promise<InfraProvider | null> {
    const InfraKVStoreKey = Keys.KVSTOREKEYS.InfraKVStoreKey;
    return this._transport.query<InfraProvider>(Keys.getInfraProviderKey(providerName), InfraKVStoreKey);
  }

  getInfraProviders(): Promise<InfraProviderList | null> {
    const InfraKVStoreKey = Keys.KVSTOREKEYS.InfraKVStoreKey;
    return this._transport.query<InfraProviderList>(Keys.getInfraProviderListKey(), InfraKVStoreKey);
  }

  // proposal related query
  getProposalList(): Promise<ProposalList | null> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    return this._transport.query<ProposalList>(Keys.getProposalListKey(), ProposalKVStoreKey);
  }
}

// Type defination
export interface Coin {
  amount: number;
}

export interface Rat {
  Num: number;
  Denom: number;
}

export interface IDToURLMapping {
  Identifier: string;
  URL: string;
}

// validator related struct
export interface AllValidators {
  oncallValidators: string[];
  allValidators: string[];
  preBlockValidators: string[];
  lowestPower: Coin;
  lowestValidator: string;
}

export interface ABCIValidator {
  PubKey: string;
  Power: number;
}


export interface Validator {
  abci: ABCIValidator;
  Username: string;
  Deposit: Coin;
  AbsentCommit: number;
  ProducedBlocks: number;
  Link: string;
}

// vote related struct
export interface Voter {
  Username: string;
  Deposit: Coin;
  DelegatedPower: Coin;
}

export interface Vote {
  Voter: string;
  Result: boolean;
}

export interface Delegation {
  Delegator: string;
  Amount: Coin;
}

// post related
export interface Comment {
  Author: string;
  PostID: string;
  Created: number;
}

export interface View {
  Username: string;
  Created: number;
  Times: number;
}

export interface Like {
  Username: string;
  Weight: number;
  Created: number;
}

export interface Donation {
  Amount: Coin;
  Created: number;
}

export interface ReportOrUpvote {
  Username: string;
  Stake: Coin;
  Created: number;
  IsReport: boolean;
}

export interface PostInfo {
  PostID: string;
  Title: string;
  Content: string;
  Author: string;
  ParentAuthor: string;
  ParentPostID: string;
  SourceAuthor: string;
  SourcePostID: string;
  Links: IDToURLMapping[];
}

export interface PostMeta {
  Created: number;
  LastUpdate: number;
  LastActivity: number;
  AllowReplies: boolean;
  TotalLikeCount: number;
  TotalDonateCount: number;
  TotalLikeWeight: number;
  TotalDislikeWeight: number;
  TotalReportStake: Coin;
  TotalUpvoteStake: Coin;
  TotalReward: Coin;
  PenaltyScore: Rat;
  RedistributionSplitRate: Rat;
}

// developer related
export interface Developer {
  Username: string;
  Deposit: Coin;
  AppConsumption: Coin;
}

export interface DeveloperList {
  AllDevelopers: string[];
}

// infra provider related

export interface InfraProvider {
  Username: string;
  Usage: number;
}

export interface InfraProviderList {
  AllInfraProviders: string[];
}

// account related
export interface AccountMeta {
  Sequence: number;
  LastActivity: number;
  TransactionCapacity: Coin;
}

export interface AccountInfo {
  Username: string;
  Created: number;
  //MasterKey:      crypto.PubKey;
  //TransactionKey: crypto.PubKey;
  //PostKey:        crypto.PubKey;
  Address: string;
}

export interface AccountBank {
  Address: string;
  Saving: Coin;
  Checking: Coin;
  Username: string;
  Stake: Coin;
  FrozenMoneyList: FrozenMoney[];
}

export interface FrozenMoney {
  Amount: Coin;
  StartAt: number;
  Times: number;
  Interval: number;
}

export interface GrantKeyList {
  GrantPubKeyList: GrantPubKey[];
}

export interface GrantPubKey {
  Username: string;
  //PubKey:   crypto.PubKey;
  Expire: number;
}

export interface Reward {
  OriginalIncome: Coin;
  FrictionIncome: Coin;
  ActualReward: Coin;
  UnclaimReward: Coin;
}

export interface Relationship {
  DonationTimes: number;
}

export interface FollowerMeta {
  CreatedAt: number;
  FollowerName: string;
}

export interface FollowingMeta {
  CreatedAt: number;
  FollowingName: string;
}

// proposal related
export interface ProposalList {
  OngoingProposal: string[];
  PastProposal: string[];
}

export interface ProposalInfo {
  Creator: string;
  ProposalID: string;
  AgreeVotes: Coin;
  DisagreeVotes: Coin;
  Result: number;
}
