import ByteBuffer from 'bytebuffer';
import * as Types from '../common';
import { ITransport, GetKeyBy, ResultKV } from '../transport';
import { decodePubKey } from '../transport/encoder';
import { InternalPubKey, StdTx, convertToRawPubKey, encodePubKey } from '../transport/encoder';
import { ResultBlock } from '../transport/rpc';
import * as Util from '../util/index';
import Keys from './keys';

export default class Query {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  /**
   * doesUsernameMatchResetPrivKey returns true if a user has the reset private key.
   *
   * @param username
   * @param resetPrivKeyHex
   */
  doesUsernameMatchResetPrivKey(username: string, resetPrivKeyHex: string): Promise<boolean> {
    return this.getAccountInfo(username).then(info => {
      if (info == null) {
        return false;
      }
      return Util.isKeyMatch(resetPrivKeyHex, info.reset_key);
    });
  }

  /**
   * doesUsernameMatchTxPrivKey returns true if a user has the transaction private key.
   *
   * @param username
   * @param txPrivKeyHex
   */
  doesUsernameMatchTxPrivKey(username: string, txPrivKeyHex: string): Promise<boolean> {
    return this.getAccountInfo(username).then(info => {
      if (info == null) {
        return false;
      }
      return Util.isKeyMatch(txPrivKeyHex, info.transaction_key);
    });
  }

  /**
   * doesUsernameMatchAppPrivKey returns true if a user has the app private key.
   *
   * @param username
   * @param appPrivKeyHex
   */
  doesUsernameMatchAppPrivKey(username: string, appPrivKeyHex: string): Promise<boolean> {
    return this.getAccountInfo(username).then(info => {
      if (info == null) {
        return false;
      }
      return Util.isKeyMatch(appPrivKeyHex, info.app_key);
    });
  }

  // validator related query

  /**
   * getAllValidators returns all oncall validators from blockchain.
   */
  getAllValidators(): Promise<AllValidators> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    const ValidatorListSubStore = Keys.KVSTOREKEYS.ValidatorListSubStore;
    return this._transport.query<AllValidators>([''], ValidatorKVStoreKey, ValidatorListSubStore);
  }

  /**
   * getValidator returns validator info given a validator name from blockchain.
   *
   * @param username: the validator username
   */
  getValidator(username: string): Promise<Validator> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    const ValidatorSubStore = Keys.KVSTOREKEYS.ValidatorSubStore;
    return this._transport.query<Validator>([username], ValidatorKVStoreKey, ValidatorSubStore);
  }

  // account related query

  /**
   * getSeqNumber returns the next sequence number of a user which should
   * be used for broadcast.
   *
   * @param username
   */
  getSeqNumber(username: string): Promise<number> {
    return this.getAccountMeta(username).then(meta => {
      return +meta.sequence;
    });
  }

  /**
   * getAccountMeta returns account meta info for a specific user.
   *
   * @param username
   */
  getAccountMeta(username: string): Promise<AccountMeta> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    const AccountMetaSubStore = Keys.KVSTOREKEYS.AccountMetaSubStore;
    return this._transport.query<AccountMeta>([username], AccountKVStoreKey, AccountMetaSubStore);
  }

  /**
   * getPendingCoinDayQueue returns account pending coin day for a specific user.
   *
   * @param username
   */
  getPendingCoinDayQueue(username: string): Promise<PendingCoinDayQueue> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    const AccountPendingCoinDaySubStore = Keys.KVSTOREKEYS.AccountPendingCoinDaySubStore;
    return this._transport.query<PendingCoinDayQueue>(
      [username],
      AccountKVStoreKey,
      AccountPendingCoinDaySubStore
    );
  }

  /**
   * getAccountBank returns account bank info for a specific user.
   *
   * @param username
   */
  getAccountBank(username: string): Promise<AccountBank> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    const AccountBankSubStore = Keys.KVSTOREKEYS.AccountBankSubStore;
    return this._transport.query<AccountBank>([username], AccountKVStoreKey, AccountBankSubStore);
  }

  /**
   * getAccountInfo returns account info for a specific user.
   *
   * @param username
   */
  getAccountInfo(username: string): Promise<AccountInfo> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    const AccountInfoSubStore = Keys.KVSTOREKEYS.AccountInfoSubStore;
    return this._transport
      .query<AccountInfoInternal>([username], AccountKVStoreKey, AccountInfoSubStore)
      .then(info => {
        const res: AccountInfo = {
          username: info.username,
          created_at: info.created_at,
          reset_key: encodePubKey(convertToRawPubKey(info.reset_key)),
          transaction_key: encodePubKey(convertToRawPubKey(info.transaction_key)),
          app_key: encodePubKey(convertToRawPubKey(info.app_key))
        };
        return res;
      });
  }

  /**
   * getGrantPubKey returns the specific granted pubkey info of a user
   * that has given to the pubKey.
   *
   * @param username
   * @param pubKeyHex
   */
  getGrantPubKey(username: string, pubKeyHex: string): Promise<GrantPubKey> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    const AccountGrantPubKeySubStore = Keys.KVSTOREKEYS.AccountGrantPubKeySubStore;
    const publicKey = decodePubKey(pubKeyHex);
    return this._transport.query<GrantPubKey>(
      [username, publicKey],
      AccountKVStoreKey,
      AccountGrantPubKeySubStore
    );
  }

  /**
   * getAllGrantPubKeys returns a list of all granted public keys of a user.
   *
   * @param username
   */
  getAllGrantPubKeys(username: string): Promise<ResultKV<string, GrantPubKey>[]> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    const AccountAllGrantPubKeys = Keys.KVSTOREKEYS.AccountAllGrantPubKeys;
    return this._transport.query<ResultKV<string, GrantPubKey>[]>(
      [username],
      AccountKVStoreKey,
      AccountAllGrantPubKeys
    );
  }

  /**
   * getReward returns rewards of a user.
   *
   * @param username
   */
  getReward(username: string): Promise<Reward> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    const AccountRewardSubStore = Keys.KVSTOREKEYS.AccountRewardSubStore;
    return this._transport.query<Reward>([username], AccountKVStoreKey, AccountRewardSubStore);
  }

  // post related query

  /**
   * getAllPosts returns all posts the author created.
   *
   * @param author
   */
  // getAllPosts(author: string): Promise<ResultKV<string, PostInfo>[]> {
  //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
  //   return this._transport.querySubspace<PostInfo>(
  //     Keys.getPostInfoPrefix(author),
  //     PostKVStoreKey,
  //     GetKeyBy.GetSubstringAfterSubstore
  //   );
  // }

  /**
   * getPostComment returns a specific comment of a post given the post permlink
   * and comment permlink.
   *
   * @param author
   * @param postID
   * @param commentPermlink
   */
  // getPostComment(author: string, postID: string, commentPermlink: string): Promise<Comment> {
  //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
  //   const Permlink = Keys.getPermlink(author, postID);
  //   return this._transport.query<Comment>(
  //     Keys.getPostCommentKey(Permlink, commentPermlink),
  //     PostKVStoreKey
  //   );
  // }

  /**
   * getPostAllComments returns all comments that a post has.
   *
   * @param author
   * @param postID
   */
  // getPostAllComments(author: string, postID: string): Promise<ResultKV<string, Comment>[]> {
  //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
  //   const Permlink = Keys.getPermlink(author, postID);
  //   return this._transport.querySubspace<Comment>(
  //     Keys.getPostCommentPrefix(Permlink),
  //     PostKVStoreKey,
  //     GetKeyBy.GetSubstringAfterKeySeparator
  //   );
  // }

  /**
   * getPostView returns a view of a post performed by a user.
   *
   * @param author
   * @param postID
   * @param viewUser
   */
  // getPostView(author: string, postID: string, viewUser: string): Promise<View> {
  //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
  //   const Permlink = Keys.getPermlink(author, postID);
  //   return this._transport.query<View>(Keys.getPostViewKey(Permlink, viewUser), PostKVStoreKey);
  // }

  /**
   * getPostAllViews returns all views that a post has.
   *
   * @param author
   * @param postID
   */
  // getPostAllViews(author: string, postID: string): Promise<ResultKV<string, View>[]> {
  //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
  //   const Permlink = Keys.getPermlink(author, postID);
  //   return this._transport.querySubspace<View>(
  //     Keys.getPostViewPrefix(Permlink),
  //     PostKVStoreKey,
  //     GetKeyBy.GetSubstringAfterKeySeparator
  //   );
  // }

  /**
   * getPostDonations returns all donations that a user has given to a post.
   *
   * @param author
   * @param postID
   * @param donateUser
   */
  // getPostDonations(author: string, postID: string, donateUser: string): Promise<Donations> {
  //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
  //   const Permlink = Keys.getPermlink(author, postID);
  //   return this._transport.query<Donations>(
  //     Keys.getPostDonationsKey(Permlink, donateUser),
  //     PostKVStoreKey
  //   );
  // }

  /**
   * getPostAllDonations returns all donations that a post has received.
   *
   * @param author
   * @param postID
   */
  // getPostAllDonations(author: string, postID: string): Promise<ResultKV<string, Donations>[]> {
  //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
  //   const Permlink = Keys.getPermlink(author, postID);
  //   return this._transport.querySubspace<Donations>(
  //     Keys.getPostDonationsPrefix(Permlink),
  //     PostKVStoreKey,
  //     GetKeyBy.GetSubstringAfterKeySeparator
  //   );
  // }

  /**
   * getPostReportOrUpvote returns report or upvote that a user has given to a post.
   *
   * @param author
   * @param postID
   * @param user
   */
  getPostReportOrUpvote(author: string, postID: string, user: string): Promise<ReportOrUpvote> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostReportOrUpvoteSubStore = Keys.KVSTOREKEYS.PostReportOrUpvoteSubStore;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<ReportOrUpvote>(
      [Permlink, user],
      PostKVStoreKey,
      PostReportOrUpvoteSubStore
    );
  }

  /**
   * getPostAllReportOrUpvotes returns all reports or upvotes that a post has received.
   *
   * @param author
   * @param postID
   */
  // getPostAllReportOrUpvotes(
  //   author: string,
  //   postID: string
  // ): Promise<ResultKV<string, ReportOrUpvote>[]> {
  //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
  //   const Permlink = Keys.getPermlink(author, postID);
  //   return this._transport.querySubspace<ReportOrUpvote>(
  //     Keys.getPostReportOrUpvotePrefix(Permlink),
  //     PostKVStoreKey,
  //     GetKeyBy.GetSubstringAfterKeySeparator
  //   );
  // }

  /**
   * getPostInfo returns post info given a permlink(author#postID).
   *
   * @param author
   * @param postID
   */
  getPostInfo(author: string, postID: string): Promise<PostInfo> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostInfoSubStore = Keys.KVSTOREKEYS.PostInfoSubStore;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<PostInfo>([Permlink], PostKVStoreKey, PostInfoSubStore);
  }

  /**
   * getPostMeta returns post meta given a permlink.
   *
   * @param author
   * @param postID
   */
  getPostMeta(author: string, postID: string): Promise<PostMeta> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const PostMetaSubStore = Keys.KVSTOREKEYS.PostMetaSubStore;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<PostMeta>([Permlink], PostKVStoreKey, PostMetaSubStore);
  }

  // vote related query

  /**
   * GetDelegation returns the delegation relationship between
   * a voter and a delegator from blockchain.
   *
   * @param voter
   * @param delegator
   */
  getDelegation(voter: string, delegator: string): Promise<Delegation> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    const DelegationSubStore = Keys.KVSTOREKEYS.DelegationSubStore;
    return this._transport
      .query<Delegation>([voter, delegator], VoteKVStoreKey, DelegationSubStore)
      .then(result => {
        return result;
      });
  }

  /**
   * getVoterAllDelegation returns all delegations that are delegated to a voter.
   *
   * @param voter
   */
  // getVoterAllDelegation(voter: string): Promise<ResultKV<string, Delegation>[]> {
  //   const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
  //   return this._transport.querySubspace<Delegation>(
  //     Keys.getDelegationPrefix(voter),
  //     VoteKVStoreKey,
  //     GetKeyBy.GetSubstringAfterKeySeparator
  //   );
  // }

  /**
   * getDelegatorAllDelegation returns all delegations that a delegator has delegated to.
   *
   * @param delegatorName
   */
  // getDelegatorAllDelegation(delegatorName: string): Promise<ResultKV<string, Delegation>[]> {
  //   const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
  //   return this._transport.querySubspace<Delegation>(
  //     Keys.getDelegateePrefix(delegatorName),
  //     VoteKVStoreKey,
  //     GetKeyBy.GetSubstringAfterKeySeparator
  //   );
  // }

  /**
   * getVoter returns voter info given a voter name from blockchain.
   *
   * @param voterName
   */
  getVoter(voterName: string): Promise<Voter> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    const VoterSubStore = Keys.KVSTOREKEYS.VoterSubStore;
    return this._transport.query<Voter>([voterName], VoteKVStoreKey, VoterSubStore);
  }

  /**
   * getVote returns a vote performed by a voter for a given proposal.
   *
   * @param proposalID
   * @param voter
   */
  getVote(proposalID: string, voter: string): Promise<Vote> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    const VoteSubStore = Keys.KVSTOREKEYS.VoteSubStore;
    return this._transport.query<Vote>([proposalID, voter], VoteKVStoreKey, VoteSubStore);
  }

  /**
   * getProposalAllVotes returns all votes of a given proposal.
   *
   * @param proposalID
   */
  // getProposalAllVotes(proposalID: string): Promise<ResultKV<string, Vote>[]> {
  //   const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
  //   return this._transport.querySubspace<Vote>(
  //     Keys.getVotePrefix(proposalID),
  //     VoteKVStoreKey,
  //     GetKeyBy.GetSubstringAfterKeySeparator
  //   );
  // }

  // developer related query

  /**
   * getDeveloper returns a specific developer info from blockchain
   *
   * @param developerName
   */
  getDeveloper(developerName: string): Promise<Developer> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    const DeveloperSubStore = Keys.KVSTOREKEYS.DeveloperSubStore;
    return this._transport.query<Developer>(
      [developerName],
      DeveloperKVStoreKey,
      DeveloperSubStore
    );
  }

  /**
   * getDevelopers returns a list of develop.
   */
  getDevelopers(): Promise<ResultKV<string, Developer>[]> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    const DeveloperListSubStore = Keys.KVSTOREKEYS.DeveloperListSubStore;
    return this._transport.query<ResultKV<string, Developer>[]>(
      [],
      DeveloperKVStoreKey,
      DeveloperListSubStore
    );
  }

  /**
   * getDeveloperList returns a list of developer name.
   */
  getDeveloperList(): Promise<DeveloperList> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    const DeveloperListSubStore = Keys.KVSTOREKEYS.DeveloperListSubStore;
    return this._transport.query<DeveloperList>([], DeveloperKVStoreKey, DeveloperListSubStore);
  }

  // infra related query

  /**
   * getInfraProvider returns the infra provider info such as usage.
   *
   * @param providerName
   */
  getInfraProvider(providerName: string): Promise<InfraProvider> {
    const InfraKVStoreKey = Keys.KVSTOREKEYS.InfraKVStoreKey;
    const InfraProviderSubStore = Keys.KVSTOREKEYS.InfraProviderSubStore;
    return this._transport.query<InfraProvider>(
      [providerName],
      InfraKVStoreKey,
      InfraProviderSubStore
    );
  }

  /**
   * getInfraProviders returns a list of all infra providers.
   */
  getInfraProviders(): Promise<InfraProviderList> {
    const InfraKVStoreKey = Keys.KVSTOREKEYS.InfraKVStoreKey;
    const InfraListSubStore = Keys.KVSTOREKEYS.InfraListSubStore;
    return this._transport.query<InfraProviderList>([], InfraKVStoreKey, InfraListSubStore);
  }

  // proposal related query

  /**
   * GetProposalList returns a list of all ongoing proposals.
   */
  getOngoingProposalList(): Promise<ResultKV<string, Proposal>[]> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    return this._transport.querySubspace<Proposal>(
      Keys.getOngoingProposalPrefix(),
      ProposalKVStoreKey,
      GetKeyBy.GetSubstringAfterSubstore
    );
  }

  /**
   * GetExpiredProposalList returns a list of all ongoing proposals.
   */
  getExpiredProposalList(): Promise<ResultKV<string, Proposal>[]> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    return this._transport.querySubspace<Proposal>(
      Keys.getExpiredProposalPrefix(),
      ProposalKVStoreKey,
      GetKeyBy.GetSubstringAfterSubstore
    );
  }

  /**
   * getProposal returns ongoing proposal info of a specific proposalID.
   *
   * @param proposalID
   */
  getOngoingProposal(proposalID: string): Promise<Proposal> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    const OngoingProposalSubStore = Keys.KVSTOREKEYS.OngoingProposalSubStore;
    return this._transport.query<Proposal>(
      [proposalID],
      ProposalKVStoreKey,
      OngoingProposalSubStore
    );
  }

  /**
   * getProposal returns expired proposal info of a specific proposalID.
   * @param proposalID
   */
  getExpiredProposal(proposalID: string): Promise<Proposal> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    const ExpiredProposalSubStore = Keys.KVSTOREKEYS.ExpiredProposalSubStore;
    return this._transport.query<Proposal>(
      [proposalID],
      ProposalKVStoreKey,
      ExpiredProposalSubStore
    );
  }

  /**
   * getNextProposalID returns the next proposal id
   */
  getNextProposalID(): Promise<NextProposalID> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    const NextProposalIDSubStore = Keys.KVSTOREKEYS.NextProposalIDSubStore;
    return this._transport.query<NextProposalID>([], ProposalKVStoreKey, NextProposalIDSubStore);
  }

  // param related query

  /**
   * getEvaluateOfContentValueParam returns the EvaluateOfContentValueParam.
   */
  // getEvaluateOfContentValueParam(): Promise<Types.EvaluateOfContentValueParam> {
  //   const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
  //   return this._transport.query<Types.EvaluateOfContentValueParam>(
  //     Keys.getEvaluateOfContentValueParamKey(),
  //     ParamKVStoreKey
  //   );
  // }

  /**
   * getGlobalAllocationParam returns the GlobalAllocationParam.
   */
  getGlobalAllocationParam(): Promise<Types.GlobalAllocationParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const AllocationParamSubStore = Keys.KVSTOREKEYS.AllocationParamSubStore;
    return this._transport.query<Types.GlobalAllocationParam>(
      [],
      ParamKVStoreKey,
      AllocationParamSubStore
    );
  }

  /**
   * getInfraInternalAllocationParam returns the InfraInternalAllocationParam.
   */
  getInfraInternalAllocationParam(): Promise<Types.InfraInternalAllocationParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const InfraInternalAllocationParamSubStore =
      Keys.KVSTOREKEYS.InfraInternalAllocationParamSubStore;
    return this._transport.query<Types.InfraInternalAllocationParam>(
      [],
      ParamKVStoreKey,
      InfraInternalAllocationParamSubStore
    );
  }

  /**
   * getDeveloperParam returns the DeveloperParam.
   */
  getDeveloperParam(): Promise<Types.DeveloperParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const DeveloperParamSubStore = Keys.KVSTOREKEYS.DeveloperParamSubStore;
    return this._transport.query<Types.DeveloperParam>([], ParamKVStoreKey, DeveloperParamSubStore);
  }

  /**
   * getVoteParam returns the VoteParam.
   */
  getVoteParam(): Promise<Types.VoteParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const VoteParamSubStore = Keys.KVSTOREKEYS.VoteParamSubStore;
    return this._transport.query<Types.VoteParam>([], ParamKVStoreKey, VoteParamSubStore);
  }

  /**
   * getProposalParam returns the ProposalParam.
   */
  getProposalParam(): Promise<Types.ProposalParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const ProposalParamSubStore = Keys.KVSTOREKEYS.ProposalParamSubStore;
    return this._transport.query<Types.ProposalParam>([], ParamKVStoreKey, ProposalParamSubStore);
  }

  /**
   * getValidatorParam returns the ValidatorParam.
   */
  getValidatorParam(): Promise<Types.ValidatorParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const ValidatorParamSubStore = Keys.KVSTOREKEYS.ValidatorParamSubStore;
    return this._transport.query<Types.ValidatorParam>([], ParamKVStoreKey, ValidatorParamSubStore);
  }

  /**
   * getCoinDayParam returns the CoinDayParam.
   */
  getCoinDayParam(): Promise<Types.CoinDayParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const CoinDayParamSubStore = Keys.KVSTOREKEYS.CoinDayParamSubStore;
    return this._transport.query<Types.CoinDayParam>([], ParamKVStoreKey, CoinDayParamSubStore);
  }

  /**
   * getBandwidthParam returns the BandwidthParam.
   */
  getBandwidthParam(): Promise<Types.BandwidthParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const BandwidthParamSubStore = Keys.KVSTOREKEYS.BandwidthParamSubStore;
    return this._transport.query<Types.BandwidthParam>([], ParamKVStoreKey, BandwidthParamSubStore);
  }

  /**
   * getAccountParam returns the AccountParam.
   */
  getAccountParam(): Promise<Types.AccountParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const AccountParamSubStore = Keys.KVSTOREKEYS.AccountParamSubStore;
    return this._transport.query<Types.AccountParam>([], ParamKVStoreKey, AccountParamSubStore);
  }

  /**
   * getGlobalMeta returns the GlobalMeta.
   */
  getGlobalMeta(): Promise<Types.GlobalMeta> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    const GlobalMetaSubStore = Keys.KVSTOREKEYS.GlobalMetaSubStore;
    return this._transport.query<Types.GlobalMeta>([], GlobalKVStoreKey, GlobalMetaSubStore);
  }

  /**
   * getConsumptionMeta returns the consumption meta.
   */
  getConsumptionMeta(): Promise<Types.ConsumptionMeta> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    const ConsumptionMetaSubStore = Keys.KVSTOREKEYS.ConsumptionMetaSubStore;
    return this._transport.query<Types.ConsumptionMeta>(
      [],
      GlobalKVStoreKey,
      ConsumptionMetaSubStore
    );
  }

  /**
   * getGlobalTime returns the time in global storage.
   */
  getGlobalTime(): Promise<Types.GlobalTime> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    const GlobalTimeSubStore = Keys.KVSTOREKEYS.GlobalTimeSubStore;
    return this._transport.query<Types.GlobalTime>([], GlobalKVStoreKey, GlobalTimeSubStore);
  }

  /**
   * getInterest returns the interest a voter can get.
   */
  getInterest(username: string): any {
    return new Promise((resolve, reject) => {
      this.getVoter(username)
        .then(voter => {
          this.getGlobalTime()
            .then(globalTime => {
              var pastDay = Math.floor(
                (Number(voter.last_power_change_at) - Number(globalTime.chain_start_time)) /
                  (3600 * 24)
              );
              pastDay = pastDay > 0 ? pastDay : 0;
              var currentDay = Math.floor(
                (Number(globalTime.last_block_time) - Number(globalTime.chain_start_time)) /
                  (3600 * 24)
              );
              currentDay = currentDay > 0 ? currentDay : 0;
              var promises: Array<Promise<Types.LinoStakeStat | null>> = [];
              for (var day = pastDay; day < currentDay; day++) {
                const stat = this.getLinoStakeStat(String(day)).then(linoStakeStat => {
                  return linoStakeStat;
                });
                promises.push(stat);
              }
              var interest = Number(voter.interest.amount);
              Promise.all(promises).then(allInterest => {
                if (allInterest != null) {
                  allInterest.forEach(stat => {
                    if (stat !== null && Number(stat.unclaimed_lino_power.amount) > 0) {
                      interest += Number(
                        (
                          (Number(voter.lino_stake.amount) /
                            Number(stat.unclaimed_lino_power.amount)) *
                          Number(stat.unclaimed_friction.amount)
                        ).toFixed(5)
                      );
                    }
                  });
                  resolve(interest.toFixed(5));
                }
              });
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * getPastDay returns the blockchain past day.
   */
  getPastDay(): any {
    return new Promise((resolve, reject) => {
      this.getGlobalTime()
        .then(globalTime => {
          var currentDay = Math.floor(
            (Number(globalTime.last_block_time) - Number(globalTime.chain_start_time)) / (3600 * 24)
          );
          currentDay = currentDay > 0 ? currentDay : 0;
          resolve(currentDay);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * getEventAtTime returns the events at certain second.
   */
  getLinoStakeStat(day: string): Promise<Types.LinoStakeStat> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    const LinoStakeStatSubStore = Keys.KVSTOREKEYS.LinoStakeStatSubStore;
    return this._transport.query<Types.LinoStakeStat>(
      [day],
      GlobalKVStoreKey,
      LinoStakeStatSubStore
    );
  }

  /**
   * getEventAtTime returns the events at certain second.
   */
  getEventAtTime(time: string): Promise<any> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    const TimeEventListSubStore = Keys.KVSTOREKEYS.TimeEventListSubStore;
    return this._transport.query<any>([time], GlobalKVStoreKey, TimeEventListSubStore);
  }
  /**
   * getAllEventAtAllTime returns all registered events.
   */
  // getAllEventAtAllTime(): Promise<any> {
  //   const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
  //   return this._transport.querySubspace<any>(
  //     Keys.getTimeEventPrefix(),
  //     GlobalKVStoreKey,
  //     GetKeyBy.GetSubstringAfterSubstore
  //   );
  // }
  /**
   * getAllEventAtAllTimeAtCertainHeight returns all registered events at certain height.
   */
  // getAllEventAtAllTimeAtCertainHeight(height): Promise<any> {
  //   const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
  //   return this._transport.querySubspace<any>(
  //     Keys.getTimeEventPrefix(),
  //     GlobalKVStoreKey,
  //     GetKeyBy.GetSubstringAfterSubstore
  //   );
  // }

  /**
   * getPostParam returns the PostParam.
   */
  getPostParam(): Promise<Types.PostParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const PostParamSubStore = Keys.KVSTOREKEYS.PostParamSubStore;
    return this._transport.query<Types.PostParam>([], ParamKVStoreKey, PostParamSubStore);
  }

  /**
   * getReputationParam returns the ReputationParam.
   */
  getReputationParam(): Promise<Types.ReputationParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    const ReputationParamSubStore = Keys.KVSTOREKEYS.ReputationParamSubStore;
    return this._transport.query<Types.ReputationParam>(
      [],
      ParamKVStoreKey,
      ReputationParamSubStore
    );
  }

  // block related

  /**
   * getBlock returns a block at a certain height from blockchain.
   *
   * @param height
   */
  getBlock(height: number): Promise<ResultBlock> {
    return this._transport.block(height);
  }

  /**
   * getTxsInBlock returns all transactions in a block at a certain height from blockchain.
   * @param height
   */
  getTxsInBlock(height: number): Promise<StdTx[]> {
    return this._transport.block(height).then(v => {
      return v && v.block && v.block.data && v.block.data.txs
        ? v.block.data.txs.map(tx => JSON.parse(ByteBuffer.atob(tx)))
        : [];
    });
  }

  /**
   * getUserReputationMeta returns a user's reputation meta.
   *
   * @param username: user name
   */
  // getUserReputationMeta(username: string): Promise<UserRepMeta> {
  //   const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
  //   const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
  //   return this._transport.query<UserRepMeta>(
  //     Keys.getUserReputationMetaKey(username),
  //     repKVStoreKey
  //   );
  // }

  /**
   * getUserReputationMeta returns a user's reputation meta.
   *
   * @param username: user name
   */
  getUserReputation(username: string): Promise<Types.Coin> {
    const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
    const ReputationSubStore = Keys.KVSTOREKEYS.ReputationSubStore;
    return this._transport.query<Types.Coin>([username], repKVStoreKey, ReputationSubStore);
  }

  /**
   * getPostReputationMeta returns a post's reputation meta.
   *
   * @param author: author of the post
   * @param postID: post ID of the post
   */
  // getPostReputationMeta(author: string, postID: string): Promise<PostRepMeta> {
  //   const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
  //   const Permlink = Keys.getPermlink(author, postID);
  //   return this._transport.query<PostRepMeta>(
  //     Keys.getPostReputationMetaKey(Permlink),
  //     repKVStoreKey
  //   );
  // }

  /**
   * getPenaltyScore returns a post's penalty score.
   *
   * @param author: author of the post
   * @param postID: post ID of the post
   */
  // getPenaltyScore(author: string, postID: string): Promise<number> {
  //   return new Promise((resolve, reject) => {
  //     const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
  //     const Permlink = Keys.getPermlink(author, postID);
  //     this.getPostReputationMeta(author, postID)
  //       .then(meta => {
  //         if (Number(meta.SumRep) > 0) {
  //           resolve(0);
  //           return;
  //         }
  //         this.getPostParam()
  //           .then(param => {
  //             if (-Number(meta.SumRep) > Number(param.max_report_reputation.amount) * 100000) {
  //               resolve(1);
  //               return;
  //             }
  //             resolve(-Number(meta.SumRep) / (Number(param.max_report_reputation.amount) * 100000));
  //           })
  //           .catch(err => {
  //             reject(err);
  //           });
  //       })
  //       .catch(err => {
  //         reject(err);
  //       });
  //   });
  // }

  // @return false negative or larger than safe int.
  isValidNat(num: number): boolean {
    // XXX(yumin): js's MAX_SAFE_INTEGER is less than 2^64.
    // TODO(yumin): use bigint to support large seq number.
    if (num < 0 || num > Number.MAX_SAFE_INTEGER) {
      return false;
    }
    return true;
  }
}

// validator related struct
export interface PubKey {
  type: string;
  data: string;
}

export interface ABCIValidator {
  address: string;
  pub_key: PubKey;
  power: string;
}

export interface Validator {
  abci: ABCIValidator;
  username: string;
  deposit: Types.Coin;
  absent_commit: string;
  byzantine_commit: string;
  produced_blocks: string;
  link: string;
}

export interface AllValidators {
  oncall_validators: string[];
  all_validators: string[];
  pre_block_validators: string[];
  lowest_power: Types.Coin;
  lowest_validator: string;
}

// vote related struct
export interface Voter {
  username: string;
  lino_stake: Types.Coin;
  delegated_power: Types.Coin;
  delegate_to_others: Types.Coin;
  last_power_change_at: number;
  interest: Types.Coin;
}

export interface Vote {
  voter: string;
  voting_power: Types.Coin;
  result: boolean;
}

export interface Delegation {
  delegator: string;
  amount: Types.Coin;
}

// post related
export interface Comment {
  author: string;
  post_id: string;
  created: string;
}

export interface View {
  username: string;
  last_view_at: string;
  times: string;
}

export interface Donations {
  amount: Types.Coin;
  username: string;
  times: string;
}

export interface ReportOrUpvote {
  username: string;
  coin_day: Types.Coin;
  created_at: string;
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
  created_at: string;
  last_updated_at: string;
  last_activity_at: string;
  allow_replies: boolean;
  is_deleted: boolean;
  total_donate_count: string;
  total_report_coin_day: Types.Coin;
  total_upvote_coin_day: Types.Coin;
  total_view_count: string;
  total_reward: Types.Coin;
  redistribution_split_rate: Types.Rat;
}

// developer related
export interface Developer {
  username: string;
  deposit: Types.Coin;
  app_consumption: Types.Coin;
  website: string;
  description: string;
  app_meta_data: string;
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
export interface AccountInfo {
  username: string;
  created_at: string;
  reset_key: string;
  transaction_key: string;
  app_key: string;
}

export interface AccountBank {
  saving: Types.Coin;
  coin_day: Types.Coin;
  frozen_money_list: FrozenMoney[];
  number_of_transaction: string;
  number_of_reward: string;
}

export interface PendingCoinDayQueue {
  last_updated_at: string;
  total_coin_day: Types.Rat;
  total_coin: Types.Coin;
  pending_coin_days: PendingCoinDay[];
}

export interface PendingCoinDay {
  end_time: string;
  start_time: string;
  coin: Types.Coin;
}

export interface FrozenMoney {
  amount: Types.Coin;
  start_at: string;
  times: string;
  interval: string;
}

export interface GrantPubKey {
  username: string;
  permission: Types.PERMISSION_TYPE;
  created_at: string;
  expires_at: string;
  amount: string;
}

export interface AccountMeta {
  sequence: string;
  last_activity_at: string;
  transaction_capacity: Types.Coin;
  json_meta: string;
  last_report_or_upvote_at: string;
  last_post_at: string;
}

export interface FollowerMeta {
  created_at: string;
  follower_name: string;
}

export interface FollowingMeta {
  created_at: string;
  following_name: string;
}

export interface Reward {
  interest: Types.Coin;
  original_income: Types.Coin;
  friction_income: Types.Coin;
  actual_reward: Types.Coin;
  unclaim_reward: Types.Coin;
}

export interface RewardDetail {
  original_income: Types.Coin;
  friction_income: Types.Coin;
  actual_reward: Types.Coin;
  consumer: string;
  post_author: string;
  post_id: string;
}

export interface RewardHistory {
  details: RewardDetail[];
}

export interface Relationship {
  donation_times: string;
}

export interface RangeQueryResult<T> {
  key: string;
  result: T;
}

export interface BalanceHistory {
  details: Detail[];
}

export interface Detail {
  detail_type: Types.DETAILTYPE;
  from: string;
  to: string;
  amount: Types.Coin;
  created_at: number;
  balance: Types.Coin;
  memo: string;
}

// proposal related
export interface ProposalInfo {
  creator: string;
  proposal_id: string;
  agree_vote: Types.Coin;
  disagree_vote: Types.Coin;
  result: string;
  created_at: string;
  expired_at: string;
}

export interface NextProposalID {
  next_proposal_id: string;
}

export interface Proposal {
  type: string;
  value: ProposalValue;
}

export interface ProposalValue {
  ProposalInfo: ProposalInfo;
  [propName: string]: any;
}

export interface UserRepMeta {
  CustomerScore: number;
  FreeScore: number;
  LastSettled: string;
  LastDonationRound: string;
}

export interface PostRepMeta {
  SumRep: string;
}

export interface ChangeParamProposalValue extends ProposalValue {
  param: Types.Parameter;
  reason: string;
}
export function isChangeParamProposalValue(
  value: ProposalValue
): value is ChangeParamProposalValue {
  return 'param' in value && 'reason' in value;
}

export interface ContentCensorshipProposalValue extends ProposalValue {
  permLink: string;
  reason: string;
}
export function isContentCensorshipProposalValue(
  value: ProposalValue
): value is ContentCensorshipProposalValue {
  return 'permLink' in value && 'reason' in value;
}

export interface ProtocolUpgradeProposalValue extends ProposalValue {
  link: string;
  reason: string;
}
export function isProtocolUpgradeProposalValue(
  value: ProposalValue
): value is ProtocolUpgradeProposalValue {
  return 'link' in value && 'reason' in value;
}

const _TIMECONST = {
  HoursPerYear: 8766,
  MinutesPerYear: 8766 * 60,
  MinutesPerMonth: (8766 * 60) / 12,
  BalanceHistoryIntervalTime: ((8766 * 60) / 12) * 60
};

// internally used
interface AccountInfoInternal {
  username: string;
  created_at: string;
  reset_key: InternalPubKey;
  transaction_key: InternalPubKey;
  app_key: InternalPubKey;
}
