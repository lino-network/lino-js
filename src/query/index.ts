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
    return this._transport.query<AllValidators>(Keys.getValidatorListKey(), ValidatorKVStoreKey);
  }

  /**
   * getValidator returns validator info given a validator name from blockchain.
   *
   * @param username: the validator username
   */
  getValidator(username: string): Promise<Validator> {
    const ValidatorKVStoreKey = Keys.KVSTOREKEYS.ValidatorKVStoreKey;
    return this._transport.query<Validator>(Keys.getValidatorKey(username), ValidatorKVStoreKey);
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
   * getAllBalanceHistory returns all transaction history related to
   * a user's account balance, in reverse-chronological order.
   *
   * @param username
   */
  getAllBalanceHistory(username: string): Promise<BalanceHistory> {
    return this.getAccountBank(username).then(bank => {
      let res: BalanceHistory = { details: [] };
      if (Number(bank.number_of_transaction) == 0) {
        return res;
      }

      let numberOfbundle = (Number(bank.number_of_transaction) - 1) / 100;
      let promises: Promise<BalanceHistory>[] = [];
      for (var i = 0; i <= numberOfbundle; ++i) {
        promises.push(this.getBalanceHistoryBundle(username, i));
      }

      return Promise.all(promises).then(bundles => {
        bundles.reduce((prev, curr) => {
          prev.details.push(...curr.details);
          return prev;
        }, res);

        res.details.reverse();
        return res;
      });
    });
  }

  /**
   * getBalanceHistoryBundle returns all balance history in a certain bucket.
   *
   * @param username
   * @param index
   */
  getBalanceHistoryBundle(username: string, index: number): Promise<BalanceHistory> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<BalanceHistory>(
      Keys.getBalanceHistoryKey(username, index.toString()),
      AccountKVStoreKey
    );
  }

  /**
   * getAccountMeta returns account meta info for a specific user.
   *
   * @param username
   */
  getAccountMeta(username: string): Promise<AccountMeta> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<AccountMeta>(Keys.getAccountMetaKey(username), AccountKVStoreKey);
  }

  /**
   * getAccountBank returns account bank info for a specific user.
   *
   * @param username
   */
  getAccountBank(username: string): Promise<AccountBank> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<AccountBank>(Keys.getAccountBankKey(username), AccountKVStoreKey);
  }

  /**
   * getAccountInfo returns account info for a specific user.
   *
   * @param username
   */
  getAccountInfo(username: string): Promise<AccountInfo> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport
      .query<AccountInfoInternal>(Keys.getAccountInfoKey(username), AccountKVStoreKey)
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
    const publicKey = decodePubKey(pubKeyHex);
    return this._transport.query<GrantPubKey>(
      Keys.getgrantPubKeyKey(username, publicKey),
      AccountKVStoreKey
    );
  }

  /**
   * getAllGrantPubKeys returns a list of all granted public keys of a user.
   *
   * @param username
   */
  getAllGrantPubKeys(username: string): Promise<ResultKV<string, GrantPubKey>[]> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.querySubspace<GrantPubKey>(
      Keys.getGrantPubKeyPrefix(username),
      AccountKVStoreKey,
      GetKeyBy.GetHexSubstringAfterKeySeparator
    );
  }

  /**
   * getReward returns rewards of a user.
   *
   * @param username
   */
  getReward(username: string): Promise<Reward> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<Reward>(Keys.getRewardKey(username), AccountKVStoreKey);
  }

  /**
   * getAllRewardHistory returns all reward history related to
   * a user's posts reward, in reverse-chronological order.
   *
   * @param username
   */
  getAllRewardHistory(username: string): Promise<RewardHistory> {
    return this.getAccountBank(username).then(bank => {
      let res: RewardHistory = { details: [] };
      if (Number(bank.number_of_reward) == 0) {
        return res;
      }

      let numberOfbundle = (Number(bank.number_of_reward) - 1) / 100;
      let promises: Promise<RewardHistory>[] = [];
      for (var i = 0; i <= numberOfbundle; ++i) {
        promises.push(this.getRewardHistoryBundle(username, i));
      }

      return Promise.all(promises).then(bundles => {
        bundles.reduce((prev, curr) => {
          prev.details.push(...curr.details);
          return prev;
        }, res);
        res.details.reverse();
        return res;
      });
    });
  }

  /**
   * getRewardHistoryBundle returns all reward history in a certain bucket.
   *
   * @param username
   * @param index
   */
  getRewardHistoryBundle(username: string, index: number): Promise<RewardHistory> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<RewardHistory>(
      Keys.getRewardHistoryKey(username, index.toString()),
      AccountKVStoreKey
    );
  }

  /**
   * getRelationship returns the donation times of two users.
   *
   * @param me
   * @param other
   */
  getRelationship(me: string, other: string): Promise<Relationship> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<Relationship>(
      Keys.getRelationshipKey(me, other),
      AccountKVStoreKey
    );
  }

  /**
   * getAllRelationships returns all donation relationship of a user.
   *
   * @param username
   */
  getAllRelationships(username: string): Promise<ResultKV<string, Relationship>[]> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.querySubspace<Relationship>(
      Keys.getRelationshipPrefix(username),
      AccountKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  /**
   * getFollowerMeta returns the follower meta of two users.
   *
   * @param me
   * @param myFollower
   */
  getFollowerMeta(me: string, myFollower: string): Promise<FollowerMeta> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<FollowerMeta>(
      Keys.getFollowerKey(me, myFollower),
      AccountKVStoreKey
    );
  }

  /**
   * getAllFollowerMeta returns all follower meta of a user.
   *
   * @param username
   */
  getAllFollowerMeta(username: string): Promise<ResultKV<string, FollowerMeta>[]> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.querySubspace<FollowerMeta>(
      Keys.getFollowerPrefix(username),
      AccountKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  /**
   * getFollowingMeta returns the following meta of two users.
   *
   * @param me
   * @param myFollowing
   */
  getFollowingMeta(me: string, myFollowing: string): Promise<FollowingMeta> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.query<FollowingMeta>(
      Keys.getFollowingKey(me, myFollowing),
      AccountKVStoreKey
    );
  }

  /**
   * getAllFollowingMeta returns all following meta of a user.
   *
   * @param username
   */
  getAllFollowingMeta(username: string): Promise<ResultKV<string, FollowingMeta>[]> {
    const AccountKVStoreKey = Keys.KVSTOREKEYS.AccountKVStoreKey;
    return this._transport.querySubspace<FollowingMeta>(
      Keys.getFollowingPrefix(username),
      AccountKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  // post related query

  /**
   * getAllPosts returns all posts the author created.
   *
   * @param author
   */
  getAllPosts(author: string): Promise<ResultKV<string, PostInfo>[]> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    return this._transport.querySubspace<PostInfo>(
      Keys.getPostInfoPrefix(author),
      PostKVStoreKey,
      GetKeyBy.GetSubstringAfterSubstore
    );
  }

  /**
   * getPostComment returns a specific comment of a post given the post permlink
   * and comment permlink.
   *
   * @param author
   * @param postID
   * @param commentPermlink
   */
  getPostComment(author: string, postID: string, commentPermlink: string): Promise<Comment> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<Comment>(
      Keys.getPostCommentKey(Permlink, commentPermlink),
      PostKVStoreKey
    );
  }

  /**
   * getPostAllComments returns all comments that a post has.
   *
   * @param author
   * @param postID
   */
  getPostAllComments(author: string, postID: string): Promise<ResultKV<string, Comment>[]> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.querySubspace<Comment>(
      Keys.getPostCommentPrefix(Permlink),
      PostKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  /**
   * getPostView returns a view of a post performed by a user.
   *
   * @param author
   * @param postID
   * @param viewUser
   */
  getPostView(author: string, postID: string, viewUser: string): Promise<View> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<View>(Keys.getPostViewKey(Permlink, viewUser), PostKVStoreKey);
  }

  /**
   * getPostAllViews returns all views that a post has.
   *
   * @param author
   * @param postID
   */
  getPostAllViews(author: string, postID: string): Promise<ResultKV<string, View>[]> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.querySubspace<View>(
      Keys.getPostViewPrefix(Permlink),
      PostKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  /**
   * getPostDonations returns all donations that a user has given to a post.
   *
   * @param author
   * @param postID
   * @param donateUser
   */
  getPostDonations(author: string, postID: string, donateUser: string): Promise<Donations> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<Donations>(
      Keys.getPostDonationsKey(Permlink, donateUser),
      PostKVStoreKey
    );
  }

  /**
   * getPostAllDonations returns all donations that a post has received.
   *
   * @param author
   * @param postID
   */
  getPostAllDonations(author: string, postID: string): Promise<ResultKV<string, Donations>[]> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.querySubspace<Donations>(
      Keys.getPostDonationsPrefix(Permlink),
      PostKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  /**
   * getPostReportOrUpvote returns report or upvote that a user has given to a post.
   *
   * @param author
   * @param postID
   * @param user
   */
  getPostReportOrUpvote(author: string, postID: string, user: string): Promise<ReportOrUpvote> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<ReportOrUpvote>(
      Keys.getPostReportOrUpvoteKey(Permlink, user),
      PostKVStoreKey
    );
  }

  /**
   * getPostAllReportOrUpvotes returns all reports or upvotes that a post has received.
   *
   * @param author
   * @param postID
   */
  getPostAllReportOrUpvotes(
    author: string,
    postID: string
  ): Promise<ResultKV<string, ReportOrUpvote>[]> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.querySubspace<ReportOrUpvote>(
      Keys.getPostReportOrUpvotePrefix(Permlink),
      PostKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  /**
   * getPostInfo returns post info given a permlink(author#postID).
   *
   * @param author
   * @param postID
   */
  getPostInfo(author: string, postID: string): Promise<PostInfo> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<PostInfo>(Keys.getPostInfoKey(Permlink), PostKVStoreKey);
  }

  /**
   * getPostMeta returns post meta given a permlink.
   *
   * @param author
   * @param postID
   */
  getPostMeta(author: string, postID: string): Promise<PostMeta> {
    const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    const Permlink = Keys.getPermlink(author, postID);
    return this._transport.query<PostMeta>(Keys.getPostMetaKey(Permlink), PostKVStoreKey);
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
    return this._transport
      .query<Delegation>(Keys.getDelegationKey(voter, delegator), VoteKVStoreKey)
      .then(result => {
        return result;
      });
  }

  /**
   * getVoterAllDelegation returns all delegations that are delegated to a voter.
   *
   * @param voter
   */
  getVoterAllDelegation(voter: string): Promise<ResultKV<string, Delegation>[]> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.querySubspace<Delegation>(
      Keys.getDelegationPrefix(voter),
      VoteKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  /**
   * getDelegatorAllDelegation returns all delegations that a delegator has delegated to.
   *
   * @param delegatorName
   */
  getDelegatorAllDelegation(delegatorName: string): Promise<ResultKV<string, Delegation>[]> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.querySubspace<Delegation>(
      Keys.getDelegateePrefix(delegatorName),
      VoteKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  /**
   * getVoter returns voter info given a voter name from blockchain.
   *
   * @param voterName
   */
  getVoter(voterName: string): Promise<Voter> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.query<Voter>(Keys.getVoterKey(voterName), VoteKVStoreKey);
  }

  /**
   * getVote returns a vote performed by a voter for a given proposal.
   *
   * @param proposalID
   * @param voter
   */
  getVote(proposalID: string, voter: string): Promise<Vote> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.query<Vote>(Keys.getVoteKey(proposalID, voter), VoteKVStoreKey);
  }

  /**
   * getProposalAllVotes returns all votes of a given proposal.
   *
   * @param proposalID
   */
  getProposalAllVotes(proposalID: string): Promise<ResultKV<string, Vote>[]> {
    const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    return this._transport.querySubspace<Vote>(
      Keys.getVotePrefix(proposalID),
      VoteKVStoreKey,
      GetKeyBy.GetSubstringAfterKeySeparator
    );
  }

  // developer related query

  /**
   * getDeveloper returns a specific developer info from blockchain
   *
   * @param developerName
   */
  getDeveloper(developerName: string): Promise<Developer> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    return this._transport.query<Developer>(
      Keys.getDeveloperKey(developerName),
      DeveloperKVStoreKey
    );
  }

  /**
   * getDevelopers returns a list of develop.
   */
  getDevelopers(): Promise<ResultKV<string, Developer>[]> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    return this._transport.querySubspace<Developer>(
      Keys.getDeveloperPrefix(),
      DeveloperKVStoreKey,
      GetKeyBy.GetSubstringAfterSubstore
    );
  }

  /**
   * getDeveloperList returns a list of developer name.
   */
  getDeveloperList(): Promise<DeveloperList> {
    const DeveloperKVStoreKey = Keys.KVSTOREKEYS.DeveloperKVStoreKey;
    return this._transport.query<DeveloperList>(Keys.getDeveloperListKey(), DeveloperKVStoreKey);
  }

  // infra related query

  /**
   * getInfraProvider returns the infra provider info such as usage.
   *
   * @param providerName
   */
  getInfraProvider(providerName: string): Promise<InfraProvider> {
    const InfraKVStoreKey = Keys.KVSTOREKEYS.InfraKVStoreKey;
    return this._transport.query<InfraProvider>(
      Keys.getInfraProviderKey(providerName),
      InfraKVStoreKey
    );
  }

  /**
   * getInfraProviders returns a list of all infra providers.
   */
  getInfraProviders(): Promise<InfraProviderList> {
    const InfraKVStoreKey = Keys.KVSTOREKEYS.InfraKVStoreKey;
    return this._transport.query<InfraProviderList>(
      Keys.getInfraProviderListKey(),
      InfraKVStoreKey
    );
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
    return this._transport.query<Proposal>(
      Keys.getOngoingProposalKey(proposalID),
      ProposalKVStoreKey
    );
  }

  /**
   * getProposal returns expired proposal info of a specific proposalID.
   * @param proposalID
   */
  getExpiredProposal(proposalID: string): Promise<Proposal> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    return this._transport.query<Proposal>(
      Keys.getExpiredProposalKey(proposalID),
      ProposalKVStoreKey
    );
  }

  /**
   * getNextProposalID returns the next proposal id
   */
  getNextProposalID(): Promise<NextProposalID> {
    const ProposalKVStoreKey = Keys.KVSTOREKEYS.ProposalKVStoreKey;
    return this._transport.query<NextProposalID>(Keys.getNextProposalIDKey(), ProposalKVStoreKey);
  }

  // param related query

  /**
   * getEvaluateOfContentValueParam returns the EvaluateOfContentValueParam.
   */
  getEvaluateOfContentValueParam(): Promise<Types.EvaluateOfContentValueParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.EvaluateOfContentValueParam>(
      Keys.getEvaluateOfContentValueParamKey(),
      ParamKVStoreKey
    );
  }

  /**
   * getGlobalAllocationParam returns the GlobalAllocationParam.
   */
  getGlobalAllocationParam(): Promise<Types.GlobalAllocationParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.GlobalAllocationParam>(
      Keys.getGlobalAllocationParamKey(),
      ParamKVStoreKey
    );
  }

  /**
   * getInfraInternalAllocationParam returns the InfraInternalAllocationParam.
   */
  getInfraInternalAllocationParam(): Promise<Types.InfraInternalAllocationParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.InfraInternalAllocationParam>(
      Keys.getInfraInternalAllocationParamKey(),
      ParamKVStoreKey
    );
  }

  /**
   * getDeveloperParam returns the DeveloperParam.
   */
  getDeveloperParam(): Promise<Types.DeveloperParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.DeveloperParam>(
      Keys.getDeveloperParamKey(),
      ParamKVStoreKey
    );
  }

  /**
   * getVoteParam returns the VoteParam.
   */
  getVoteParam(): Promise<Types.VoteParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.VoteParam>(Keys.getVoteParamKey(), ParamKVStoreKey);
  }

  /**
   * getProposalParam returns the ProposalParam.
   */
  getProposalParam(): Promise<Types.ProposalParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.ProposalParam>(Keys.getProposalParamKey(), ParamKVStoreKey);
  }

  /**
   * getValidatorParam returns the ValidatorParam.
   */
  getValidatorParam(): Promise<Types.ValidatorParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.ValidatorParam>(
      Keys.getValidatorParamKey(),
      ParamKVStoreKey
    );
  }

  /**
   * getCoinDayParam returns the CoinDayParam.
   */
  getCoinDayParam(): Promise<Types.CoinDayParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.CoinDayParam>(Keys.getCoinDayParamKey(), ParamKVStoreKey);
  }

  /**
   * getBandwidthParam returns the BandwidthParam.
   */
  getBandwidthParam(): Promise<Types.BandwidthParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.BandwidthParam>(
      Keys.getBandwidthParamKey(),
      ParamKVStoreKey
    );
  }

  /**
   * getAccountParam returns the AccountParam.
   */
  getAccountParam(): Promise<Types.AccountParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.AccountParam>(Keys.getAccountParamKey(), ParamKVStoreKey);
  }

  /**
   * getGlobalMeta returns the GlobalMeta.
   */
  getGlobalMeta(): Promise<Types.GlobalMeta> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    return this._transport.query<Types.GlobalMeta>(Keys.getGlobalMetaKey(), GlobalKVStoreKey);
  }

  /**
   * getConsumptionMeta returns the consumption meta.
   */
  getConsumptionMeta(): Promise<Types.ConsumptionMeta> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    return this._transport.query<Types.ConsumptionMeta>(
      Keys.getConsumptionMetaKey(),
      GlobalKVStoreKey
    );
  }

  /**
   * getGlobalTime returns the time in global storage.
   */
  getGlobalTime(): Promise<Types.GlobalTime> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    return this._transport.query<Types.GlobalTime>(Keys.getTimeKey(), GlobalKVStoreKey);
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
    return this._transport.query<Types.LinoStakeStat>(
      Keys.getLinoStakeStatKey(day),
      GlobalKVStoreKey
    );
  }

  /**
   * getEventAtTime returns the events at certain second.
   */
  getEventAtTime(time: string): Promise<any> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    return this._transport.query<any>(Keys.getTimeEventKey(time), GlobalKVStoreKey);
  }
  /**
   * getAllEventAtAllTime returns all registered events.
   */
  getAllEventAtAllTime(): Promise<any> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    return this._transport.querySubspace<any>(
      Keys.getTimeEventPrefix(),
      GlobalKVStoreKey,
      GetKeyBy.GetSubstringAfterSubstore
    );
  }
  /**
   * getAllEventAtAllTimeAtCertainHeight returns all registered events at certain height.
   */
  getAllEventAtAllTimeAtCertainHeight(height): Promise<any> {
    const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    return this._transport.querySubspace<any>(
      Keys.getTimeEventPrefix(),
      GlobalKVStoreKey,
      GetKeyBy.GetSubstringAfterSubstore
    );
  }
  /**
   * getPostParam returns the PostParam.
   */
  getPostParam(): Promise<Types.PostParam> {
    const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    return this._transport.query<Types.PostParam>(Keys.getPostParamKey(), ParamKVStoreKey);
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
   * getBalanceHistoryFromTo returns a list of transaction history in the range of [from, to],
   * that if to is larger than the number of tx, tx will be replaced by the larget tx number,
   * related to a user's account balance, in reverse-chronological order.
   *
   * @param username: user name
   * @param from: the start index of the balance history, inclusively
   * @param to: the end index of the balance history, inclusively
   */
  async getBalanceHistoryFromTo(
    username: string,
    from: number,
    to: number
  ): Promise<BalanceHistory> {
    if (!this.isValidNat(from) || !this.isValidNat(to) || from > to) {
      throw new Error(`GetBalanceHistoryFromTo: from [${from}] or to [${to}] is invalid`);
    }

    let accountBank = await this.getAccountBank(username);
    let rst: BalanceHistory = { details: [] };

    if (Number(accountBank.number_of_transaction) == 0) {
      return rst;
    }

    let maxTxIndex = Number(accountBank.number_of_transaction) - 1;

    if (from > maxTxIndex) {
      throw new Error(`GetBalanceHistoryFromTo: [${from}] is larger than total num of tx`);
    }
    if (to > maxTxIndex) {
      to = maxTxIndex;
    }

    // number of banlance history is wanted
    let numHistory = to - from + 1;
    let targetBucketOfTo = Math.floor(to / 100);
    let bucketSlot = targetBucketOfTo;

    // The index of 'to' in the target bucket
    let indexOfTo = to % 100;

    while (bucketSlot >= 0 && numHistory > 0) {
      let history = await this.getBalanceHistoryBundle(username, bucketSlot);
      let startIndex = bucketSlot == targetBucketOfTo ? indexOfTo : history.details.length - 1;

      for (let i = startIndex; i >= 0 && numHistory > 0; i--) {
        rst.details.push(history.details[i]);
        numHistory--;
      }
      bucketSlot--;
    }

    return rst;
  }

  /**
   * getRecentBalanceHistory returns a certain number of recent transaction history
   * related to a user's account balance, in reverse-chronological order.
   *
   * @param username: user name
   * @param numHistory: the number of balance history are wanted
   */
  async getRecentBalanceHistory(username: string, numHistory: number): Promise<BalanceHistory> {
    if (!this.isValidNat(numHistory)) {
      throw new Error(`GetRecentBalanceHistory: numHistory is invalid: ${numHistory}`);
    }
    let accountBank = await this.getAccountBank(username);
    let maxTxNo = Number(accountBank.number_of_transaction) - 1;

    let from = Math.max(0, maxTxNo - numHistory + 1);
    if (numHistory > Number(accountBank.number_of_transaction)) {
      from = 0;
    }

    return this.getBalanceHistoryFromTo(username, from, maxTxNo);
  }

  /**
   * getRewardHistoryFromTo returns a list of reward history in the range of [from, to],
   * that if to is larger than the number of tx, tx will be replaced by the largest tx number,
   * related to a user's posts rewards, in reverse-chronological order.
   *
   * @param username: user name
   * @param from: the start index of the reward history, inclusively
   * @param to: the end index of the reward history, inclusively
   */
  async getRewardHistoryFromTo(username: string, from: number, to: number): Promise<RewardHistory> {
    if (!this.isValidNat(from) || !this.isValidNat(to) || from > to) {
      throw new Error(`getRewardHistoryFromTo: from [${from}] or to [${to}] is invalid`);
    }

    let accountBank = await this.getAccountBank(username);
    let rst: RewardHistory = { details: [] };

    if (Number(accountBank.number_of_reward) == 0) {
      return rst;
    }

    let maxRewardIndex = Number(accountBank.number_of_reward) - 1;

    if (from > maxRewardIndex) {
      throw new Error(`getRewardHistoryFromTo: [${from}] is larger than total num of reward`);
    }
    if (to > maxRewardIndex) {
      to = maxRewardIndex;
    }

    // number of reward history is wanted
    let numReward = to - from + 1;
    let targetBucketOfTo = Math.floor(to / 100);
    let bucketSlot = targetBucketOfTo;

    // The index of 'to' in the target bucket
    let indexOfTo = to % 100;

    while (bucketSlot >= 0 && numReward > 0) {
      let history = await this.getRewardHistoryBundle(username, bucketSlot);
      let startIndex = bucketSlot == targetBucketOfTo ? indexOfTo : history.details.length - 1;

      for (let i = startIndex; i >= 0 && numReward > 0; i--) {
        rst.details.push(history.details[i]);
        numReward--;
      }
      bucketSlot--;
    }

    return rst;
  }

  /**
   * getRecentRewardHistory returns a certain number of recent reward history
   * related to a user's posts reward, in reverse-chronological order.
   *
   * @param username: user name
   * @param numReward: the number of reward history are wanted
   */
  async getRecentRewardHistory(username: string, numReward: number): Promise<RewardHistory> {
    if (!this.isValidNat(numReward)) {
      throw new Error(`getRecentRewardHistory: numReward is invalid: ${numReward}`);
    }
    let accountBank = await this.getAccountBank(username);
    let maxTxNo = Number(accountBank.number_of_reward) - 1;

    let from = Math.max(0, maxTxNo - numReward + 1);
    if (numReward > Number(accountBank.number_of_reward)) {
      from = 0;
    }

    return this.getRewardHistoryFromTo(username, from, maxTxNo);
  }

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
