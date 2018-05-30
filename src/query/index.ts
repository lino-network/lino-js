import { ITransport } from '../transport';
import { StdTx, encodePrivKey, encodePubKey } from '../transport/utils';
import Keys from './keys';
import { ResultBlock } from '../transport/rpc';
import ByteBuffer from 'bytebuffer';
import * as Types from '../common';
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
  oncall_validators: string[];
  all_validators: string[];
  pre_block_validators: string[];
  lowest_power: Types.Coin;
  lowest_validator: string;
}

export interface ABCIValidator {
  pub_key: string;
  power: number;
}

export interface Validator {
  abci: ABCIValidator;
  username: string;
  deposit: Types.Coin;
  absent_commit: number;
  produced_blocks: number;
  link: string;
}

// vote related struct
export interface Voter {
  username: string;
  deposit: Types.Coin;
  delegated_power: Types.Coin;
}

export interface Vote {
  voter: string;
  result: boolean;
}

export interface Delegation {
  delegator: string;
  amount: Types.Coin;
}

// post related
export interface Comment {
  author: string;
  post_key: string;
  created: number;
}

export interface View {
  username: string;
  created: number;
  times: number;
}

export interface Like {
  username: string;
  weight: number;
  created: number;
}

export interface Donation {
  amount: Types.Coin;
  created: number;
}

export interface ReportOrUpvote {
  username: string;
  stake: Types.Coin;
  created: number;
  is_report: boolean;
}

export interface PostInfo {
  post_id: string;
  title: string;
  content: string;
  author: string;
  parent_author: string;
  parent_postID: string;
  source_author: string;
  source_postID: string;
  links: Types.IDToURLMapping[];
}

export interface PostMeta {
  created: number;
  last_update: number;
  last_activity: number;
  allow_replies: boolean;
  total_like_count: number;
  total_donate_count: number;
  total_like_weight: number;
  total_dislike_weight: number;
  total_report_stake: Types.Coin;
  total_upvote_stake: Types.Coin;
  reward: Types.Coin;
  is_deleted: boolean;
  redistribution_split_rate: Types.Rat;
}

// developer related
export interface Developer {
  username: string;
  deposit: Types.Coin;
  app_consumption: Types.Coin;
}

export interface DeveloperList {
  all_developers: string[];
}

// infra provider related
export interface InfraProvider {
  username: string;
  usage: number;
}

export interface InfraProviderList {
  all_infra_providers: string[];
}

// account related
export interface AccountMeta {
  sequence: number;
  last_activity: number;
  transaction_capacity: Types.Coin;
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
  address: string;
  saving: Types.Coin;
  checking: Types.Coin;
  username: string;
  stake: Types.Coin;
  frozen_money_list: FrozenMoney[];
}

export interface FrozenMoney {
  amount: Types.Coin;
  start_at: number;
  times: number;
  interval: number;
}

export interface GrantKeyList {
  grant_public_key_list: GrantPubKey[];
}

export interface GrantPubKey {
  username: string;
  public_key: Types.Key;
  expire: number;
}

export interface Reward {
  original_income: Types.Coin;
  friction_income: Types.Coin;
  actual_reward: Types.Coin;
  unclaim_reward: Types.Coin;
}

export interface Relationship {
  donation_times: number;
}

export interface FollowerMeta {
  created_at: number;
  follower_name: string;
}

export interface FollowingMeta {
  created_at: number;
  following_name: string;
}

// proposal related
export interface ProposalList {
  ongoing_proposal: string[];
  past_proposal: string[];
}

export interface ProposalInfo {
  creator: string;
  proposal_id: string;
  agree_vote: Types.Coin;
  disagree_vote: Types.Coin;
  result: number;
}
