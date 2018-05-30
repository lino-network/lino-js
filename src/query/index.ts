import { ITransport } from '../transport';
import { StdTx, encodePrivKey, encodePubKey } from '../transport/utils';
import Keys from './keys';
import { ResultBlock } from '../transport/rpc';
import ByteBuffer from 'bytebuffer';
import * as Types from '../util/index';
import * as Util from '../util/index';

export default class Query {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  isUsernameMatchPrivKey(
    username: string,
    privKeyHex: string
  ): Promise<boolean | null> {
    return this.getAccountInfo(username).then(result => {
      if (result == null) {
        return false;
      }
      const rawMasterPubKey = ByteBuffer.fromBase64(
        result.master_key.value
      ).toString('hex');
      const rawTxPubKey = ByteBuffer.fromBase64(
        result.transaction_key.value
      ).toString('hex');

      return (
        Util.isKeyMatch(privKeyHex, encodePubKey(rawMasterPubKey)) ||
        Util.isKeyMatch(privKeyHex, encodePubKey(rawTxPubKey))
      );
    });
  }
  // validator related query
  getAllValidators(): Promise<AllValidators | null> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    return this._transport.query<AllValidators>(
      Keys.getValidatorListKey(),
      ValidatorKVStoreKey
    );
  }

  getValidator(username: string): Promise<Validator | null> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    return this._transport.query<Validator>(
      Keys.getValidatorKey(username),
      ValidatorKVStoreKey
    );
  }

  // account related query
  getAccountMeta(username: string): Promise<AccountMeta | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<AccountMeta>(
      Keys.getAccountMetaKey(username),
      AccountKVStoreKey
    );
  }

  getAccountBank(address: string): Promise<AccountBank | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<AccountBank>(
      Keys.getAccountBankKey(address),
      AccountKVStoreKey
    );
  }

  getAccountInfo(username: string): Promise<AccountInfo | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<AccountInfo>(
      Keys.getAccountInfoKey(username),
      AccountKVStoreKey
    );
  }

  getGrantList(username: string): Promise<GrantKeyList | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<GrantKeyList>(
      Keys.getGrantKeyListKey(username),
      AccountKVStoreKey
    );
  }

  getReward(username: string): Promise<Reward | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<Reward>(
      Keys.getRewardKey(username),
      AccountKVStoreKey
    );
  }

  getRelationship(me: string, other: string): Promise<Relationship | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<Relationship>(
      Keys.getRelationshipKey(me, other),
      AccountKVStoreKey
    );
  }

  getFollowerMeta(
    me: string,
    myFollower: string
  ): Promise<FollowerMeta | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<FollowerMeta>(
      Keys.getFollowerKey(me, myFollower),
      AccountKVStoreKey
    );
  }

  getFollowingMeta(
    me: string,
    myFollowing: string
  ): Promise<FollowingMeta | null> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<FollowingMeta>(
      Keys.getFollowingKey(me, myFollowing),
      AccountKVStoreKey
    );
  }

  // post related query
  getPostComment(
    author: string,
    postID: string,
    commentPostKey: string
  ): Promise<Comment | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<Comment>(
      Keys.getPostCommentKey(PostKey, commentPostKey),
      PostKVStoreKey
    );
  }

  getPostView(
    author: string,
    postID: string,
    viewUser: string
  ): Promise<View | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<View>(
      Keys.getPostViewKey(PostKey, viewUser),
      PostKVStoreKey
    );
  }

  getPostDonation(
    author: string,
    postID: string,
    donateUser: string
  ): Promise<Donation | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<Donation>(
      Keys.getPostDonationKey(PostKey, donateUser),
      PostKVStoreKey
    );
  }

  getPostReportOrUpvote(
    author: string,
    postID: string,
    user: string
  ): Promise<ReportOrUpvote | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<ReportOrUpvote>(
      Keys.getPostCommentKey(PostKey, user),
      PostKVStoreKey
    );
  }

  getPostInfo(author: string, postID: string): Promise<PostInfo | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<PostInfo>(
      Keys.getPostInfoKey(PostKey),
      PostKVStoreKey
    );
  }

  getPostMeta(author: string, postID: string): Promise<PostMeta | null> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostKey = Keys.getPostKey(author, postID);
    return this._transport.query<PostMeta>(
      Keys.getPostMetaKey(PostKey),
      PostKVStoreKey
    );
  }

  // vote related query
  getDelegation(voter: string, delegator: string): Promise<Delegation | null> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.query<Delegation>(
      Keys.getDelegationKey(voter, delegator),
      VoteKVStoreKey
    );
  }

  getVoter(voterName: string): Promise<Voter | null> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.query<Voter>(
      Keys.getVoterKey(voterName),
      VoteKVStoreKey
    );
  }

  // developer related query
  getDeveloper(developerName: string): Promise<Developer | null> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    return this._transport.query<Developer>(
      Keys.getDeveloperKey(developerName),
      DeveloperKVStoreKey
    );
  }

  getDevelopers(): Promise<DeveloperList | null> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    return this._transport.query<DeveloperList>(
      Keys.getDeveloperListKey(),
      DeveloperKVStoreKey
    );
  }

  // infra related query
  getInfraProvider(providerName: string): Promise<InfraProvider | null> {
    const InfraKVStoreKey = Keys.KVSTOREKEYS.InfraKVStoreKey;
    return this._transport.query<InfraProvider>(
      Keys.getInfraProviderKey(providerName),
      InfraKVStoreKey
    );
  }

  getInfraProviders(): Promise<InfraProviderList | null> {
    const InfraKVStoreKey = Keys.KVSTOREKEYS.InfraKVStoreKey;
    return this._transport.query<InfraProviderList>(
      Keys.getInfraProviderListKey(),
      InfraKVStoreKey
    );
  }

  // proposal related query
  getProposalList(): Promise<ProposalList | null> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    return this._transport.query<ProposalList>(
      Keys.getProposalListKey(),
      ProposalKVStoreKey
    );
  }

  // param related query
  getEvaluateOfContentValueParam(): Promise<Types.EvaluateOfContentValueParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.EvaluateOfContentValueParam>(
      Keys.getEvaluateOfContentValueParamKey(),
      ParamKVStoreKey
    );
  }

  getGlobalAllocationParam(): Promise<Types.GlobalAllocationParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.GlobalAllocationParam>(
      Keys.getGlobalAllocationParamKey(),
      ParamKVStoreKey
    );
  }

  getInfraInternalAllocationParam(): Promise<Types.InfraInternalAllocationParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.InfraInternalAllocationParam>(
      Keys.getInfraInternalAllocationParamKey(),
      ParamKVStoreKey
    );
  }

  getDeveloperParam(): Promise<Types.DeveloperParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.DeveloperParam>(
      Keys.getDeveloperParamKey(),
      ParamKVStoreKey
    );
  }

  getVoteParam(): Promise<Types.VoteParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.VoteParam>(
      Keys.getVoteParamKey(),
      ParamKVStoreKey
    );
  }

  getProposalParam(): Promise<Types.ProposalParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.ProposalParam>(
      Keys.getProposalParamKey(),
      ParamKVStoreKey
    );
  }

  getValidatorParam(): Promise<Types.ValidatorParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.ValidatorParam>(
      Keys.getValidatorParamKey(),
      ParamKVStoreKey
    );
  }

  getCoinDayParam(): Promise<Types.CoinDayParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.CoinDayParam>(
      Keys.getCoinDayParamKey(),
      ParamKVStoreKey
    );
  }

  getBandwidthParam(): Promise<Types.BandwidthParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.BandwidthParam>(
      Keys.getBandwidthParamKey(),
      ParamKVStoreKey
    );
  }

  getAccountParam(): Promise<Types.AccountParam | null> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.AccountParam>(
      Keys.getAccountParamKey(),
      ParamKVStoreKey
    );
  }

  // block related
  getBlock(height: number): Promise<ResultBlock | null> {
    return this._transport.block(height);
  }

  getTxsInBlock(height: number): Promise<StdTx[] | null> {
    return this._transport.block(height).then(v => {
      if (v != null) {
        var txs = new Array<StdTx>();
        for (let tx of v.block.data.txs) {
          const jsonStr = ByteBuffer.atob(tx);
          txs.push(JSON.parse(jsonStr));
        }
        return txs;
      } else {
        return null;
      }
    });
  }
}

// validator related struct
export interface AllValidators {
  oncallValidators: string[];
  allValidators: string[];
  preBlockValidators: string[];
  lowestPower: Types.Coin;
  lowestValidator: string;
}

export interface ABCIValidator {
  PubKey: string;
  Power: number;
}

export interface Validator {
  abci: ABCIValidator;
  Username: string;
  Deposit: Types.Coin;
  AbsentCommit: number;
  ProducedBlocks: number;
  Link: string;
}

// vote related struct
export interface Voter {
  Username: string;
  Deposit: Types.Coin;
  DelegatedPower: Types.Coin;
}

export interface Vote {
  Voter: string;
  Result: boolean;
}

export interface Delegation {
  Delegator: string;
  Amount: Types.Coin;
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
  Amount: Types.Coin;
  Created: number;
}

export interface ReportOrUpvote {
  Username: string;
  Stake: Types.Coin;
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
  Links: Types.IDToURLMapping[];
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
  TotalReportStake: Types.Coin;
  TotalUpvoteStake: Types.Coin;
  TotalReward: Types.Coin;
  PenaltyScore: Types.Rat;
  RedistributionSplitRate: Types.Rat;
}

// developer related
export interface Developer {
  Username: string;
  Deposit: Types.Coin;
  AppConsumption: Types.Coin;
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
  TransactionCapacity: Types.Coin;
}

export interface AccountInfo {
  username: string;
  created_at: number;
  master_key: Types.Key;
  transaction_key: Types.Key;
  post_key: Types.Key;
  address: string;
}

export interface AccountBank {
  Address: string;
  Saving: Types.Coin;
  Checking: Types.Coin;
  Username: string;
  Stake: Types.Coin;
  FrozenMoneyList: FrozenMoney[];
}

export interface FrozenMoney {
  Amount: Types.Coin;
  StartAt: number;
  Times: number;
  Interval: number;
}

export interface GrantKeyList {
  GrantPubKeyList: GrantPubKey[];
}

export interface GrantPubKey {
  Username: string;
  PubKey: Types.Key;
  Expire: number;
}

export interface Reward {
  OriginalIncome: Types.Coin;
  FrictionIncome: Types.Coin;
  ActualReward: Types.Coin;
  UnclaimReward: Types.Coin;
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
  AgreeVotes: Types.Coin;
  DisagreeVotes: Types.Coin;
  Result: number;
}
