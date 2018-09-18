import * as Types from '../common';
import { ITransport, ResultKV } from '../transport';
import { StdTx } from '../transport/encoder';
import { ResultBlock } from '../transport/rpc';
export default class Query {
    private _transport;
    constructor(transport: ITransport);
    /**
     * doesUsernameMatchResetPrivKey returns true if a user has the reset private key.
     *
     * @param username
     * @param resetPrivKeyHex
     */
    doesUsernameMatchResetPrivKey(username: string, resetPrivKeyHex: string): Promise<boolean>;
    /**
     * doesUsernameMatchTxPrivKey returns true if a user has the transaction private key.
     *
     * @param username
     * @param txPrivKeyHex
     */
    doesUsernameMatchTxPrivKey(username: string, txPrivKeyHex: string): Promise<boolean>;
    /**
     * doesUsernameMatchAppPrivKey returns true if a user has the app private key.
     *
     * @param username
     * @param appPrivKeyHex
     */
    doesUsernameMatchAppPrivKey(username: string, appPrivKeyHex: string): Promise<boolean>;
    /**
     * getAllValidators returns all oncall validators from blockchain.
     */
    getAllValidators(): Promise<AllValidators>;
    /**
     * getValidator returns validator info given a validator name from blockchain.
     *
     * @param username: the validator username
     */
    getValidator(username: string): Promise<Validator>;
    /**
     * getSeqNumber returns the next sequence number of a user which should
     * be used for broadcast.
     *
     * @param username
     */
    getSeqNumber(username: string): Promise<number>;
    /**
     * getAllBalanceHistory returns all transaction history related to
     * a user's account balance, in reverse-chronological order.
     *
     * @param username
     */
    getAllBalanceHistory(username: string): Promise<BalanceHistory>;
    /**
     * getBalanceHistoryBundle returns all balance history in a certain bucket.
     *
     * @param username
     * @param index
     */
    getBalanceHistoryBundle(username: string, index: number): Promise<BalanceHistory>;
    /**
     * getAccountMeta returns account meta info for a specific user.
     *
     * @param username
     */
    getAccountMeta(username: string): Promise<AccountMeta>;
    /**
     * getAccountBank returns account bank info for a specific user.
     *
     * @param username
     */
    getAccountBank(username: string): Promise<AccountBank>;
    /**
     * getAccountInfo returns account info for a specific user.
     *
     * @param username
     */
    getAccountInfo(username: string): Promise<AccountInfo>;
    /**
     * getGrantPubKey returns the specific granted pubkey info of a user
     * that has given to the pubKey.
     *
     * @param username
     * @param pubKeyHex
     */
    getGrantPubKey(username: string, pubKeyHex: string): Promise<GrantPubKey>;
    /**
     * getAllGrantPubKeys returns a list of all granted public keys of a user.
     *
     * @param username
     */
    getAllGrantPubKeys(username: string): Promise<ResultKV<string, GrantPubKey>[]>;
    /**
     * getReward returns rewards of a user.
     *
     * @param username
     */
    getReward(username: string): Promise<Reward>;
    /**
     * getAllRewardHistory returns all reward history related to
     * a user's posts reward, in reverse-chronological order.
     *
     * @param username
     */
    getAllRewardHistory(username: string): Promise<RewardHistory>;
    /**
     * getRewardHistoryBundle returns all reward history in a certain bucket.
     *
     * @param username
     * @param index
     */
    getRewardHistoryBundle(username: string, index: number): Promise<RewardHistory>;
    /**
     * getRelationship returns the donation times of two users.
     *
     * @param me
     * @param other
     */
    getRelationship(me: string, other: string): Promise<Relationship>;
    /**
     * getAllRelationships returns all donation relationship of a user.
     *
     * @param username
     */
    getAllRelationships(username: string): Promise<ResultKV<string, Relationship>[]>;
    /**
     * getFollowerMeta returns the follower meta of two users.
     *
     * @param me
     * @param myFollower
     */
    getFollowerMeta(me: string, myFollower: string): Promise<FollowerMeta>;
    /**
     * getAllFollowerMeta returns all follower meta of a user.
     *
     * @param username
     */
    getAllFollowerMeta(username: string): Promise<ResultKV<string, FollowerMeta>[]>;
    /**
     * getFollowingMeta returns the following meta of two users.
     *
     * @param me
     * @param myFollowing
     */
    getFollowingMeta(me: string, myFollowing: string): Promise<FollowingMeta>;
    /**
     * getAllFollowingMeta returns all following meta of a user.
     *
     * @param username
     */
    getAllFollowingMeta(username: string): Promise<ResultKV<string, FollowingMeta>[]>;
    /**
     * getAllPosts returns all posts the author created.
     *
     * @param author
     */
    getAllPosts(author: string): Promise<ResultKV<string, PostInfo>[]>;
    /**
     * getPostComment returns a specific comment of a post given the post permlink
     * and comment permlink.
     *
     * @param author
     * @param postID
     * @param commentPermlink
     */
    getPostComment(author: string, postID: string, commentPermlink: string): Promise<Comment>;
    /**
     * getPostAllComments returns all comments that a post has.
     *
     * @param author
     * @param postID
     */
    getPostAllComments(author: string, postID: string): Promise<ResultKV<string, Comment>[]>;
    /**
     * getPostView returns a view of a post performed by a user.
     *
     * @param author
     * @param postID
     * @param viewUser
     */
    getPostView(author: string, postID: string, viewUser: string): Promise<View>;
    /**
     * getPostAllViews returns all views that a post has.
     *
     * @param author
     * @param postID
     */
    getPostAllViews(author: string, postID: string): Promise<ResultKV<string, View>[]>;
    /**
     * getPostDonations returns all donations that a user has given to a post.
     *
     * @param author
     * @param postID
     * @param donateUser
     */
    getPostDonations(author: string, postID: string, donateUser: string): Promise<Donations>;
    /**
     * getPostAllDonations returns all donations that a post has received.
     *
     * @param author
     * @param postID
     */
    getPostAllDonations(author: string, postID: string): Promise<ResultKV<string, Donations>[]>;
    /**
     * getPostReportOrUpvote returns report or upvote that a user has given to a post.
     *
     * @param author
     * @param postID
     * @param user
     */
    getPostReportOrUpvote(author: string, postID: string, user: string): Promise<ReportOrUpvote>;
    /**
     * getPostAllReportOrUpvotes returns all reports or upvotes that a post has received.
     *
     * @param author
     * @param postID
     */
    getPostAllReportOrUpvotes(author: string, postID: string): Promise<ResultKV<string, ReportOrUpvote>[]>;
    /**
     * getPostInfo returns post info given a permlink(author#postID).
     *
     * @param author
     * @param postID
     */
    getPostInfo(author: string, postID: string): Promise<PostInfo>;
    /**
     * getPostMeta returns post meta given a permlink.
     *
     * @param author
     * @param postID
     */
    getPostMeta(author: string, postID: string): Promise<PostMeta>;
    /**
     * GetDelegation returns the delegation relationship between
     * a voter and a delegator from blockchain.
     *
     * @param voter
     * @param delegator
     */
    getDelegation(voter: string, delegator: string): Promise<Delegation>;
    /**
     * getVoterAllDelegation returns all delegations that are delegated to a voter.
     *
     * @param voter
     */
    getVoterAllDelegation(voter: string): Promise<ResultKV<string, Delegation>[]>;
    /**
     * getDelegatorAllDelegation returns all delegations that a delegator has delegated to.
     *
     * @param delegatorName
     */
    getDelegatorAllDelegation(delegatorName: string): Promise<ResultKV<string, Delegation>[]>;
    /**
     * getVoter returns voter info given a voter name from blockchain.
     *
     * @param voterName
     */
    getVoter(voterName: string): Promise<Voter>;
    /**
     * getVote returns a vote performed by a voter for a given proposal.
     *
     * @param proposalID
     * @param voter
     */
    getVote(proposalID: string, voter: string): Promise<Vote>;
    /**
     * getProposalAllVotes returns all votes of a given proposal.
     *
     * @param proposalID
     */
    getProposalAllVotes(proposalID: string): Promise<ResultKV<string, Vote>[]>;
    /**
     * getDeveloper returns a specific developer info from blockchain
     *
     * @param developerName
     */
    getDeveloper(developerName: string): Promise<Developer>;
    /**
     * getDevelopers returns a list of develop.
     */
    getDevelopers(): Promise<ResultKV<string, Developer>[]>;
    /**
     * getDeveloperList returns a list of developer name.
     */
    getDeveloperList(): Promise<DeveloperList>;
    /**
     * getInfraProvider returns the infra provider info such as usage.
     *
     * @param providerName
     */
    getInfraProvider(providerName: string): Promise<InfraProvider>;
    /**
     * getInfraProviders returns a list of all infra providers.
     */
    getInfraProviders(): Promise<InfraProviderList>;
    /**
     * GetProposalList returns a list of all ongoing proposals.
     */
    getOngoingProposalList(): Promise<ResultKV<string, Proposal>[]>;
    /**
     * GetExpiredProposalList returns a list of all ongoing proposals.
     */
    getExpiredProposalList(): Promise<ResultKV<string, Proposal>[]>;
    /**
     * getProposal returns ongoing proposal info of a specific proposalID.
     *
     * @param proposalID
     */
    getOngoingProposal(proposalID: string): Promise<Proposal>;
    /**
     * getProposal returns expired proposal info of a specific proposalID.
     * @param proposalID
     */
    getExpiredProposal(proposalID: string): Promise<Proposal>;
    /**
     * getNextProposalID returns the next proposal id
     */
    getNextProposalID(): Promise<NextProposalID>;
    /**
     * getEvaluateOfContentValueParam returns the EvaluateOfContentValueParam.
     */
    getEvaluateOfContentValueParam(): Promise<Types.EvaluateOfContentValueParam>;
    /**
     * getGlobalAllocationParam returns the GlobalAllocationParam.
     */
    getGlobalAllocationParam(): Promise<Types.GlobalAllocationParam>;
    /**
     * getInfraInternalAllocationParam returns the InfraInternalAllocationParam.
     */
    getInfraInternalAllocationParam(): Promise<Types.InfraInternalAllocationParam>;
    /**
     * getDeveloperParam returns the DeveloperParam.
     */
    getDeveloperParam(): Promise<Types.DeveloperParam>;
    /**
     * getVoteParam returns the VoteParam.
     */
    getVoteParam(): Promise<Types.VoteParam>;
    /**
     * getProposalParam returns the ProposalParam.
     */
    getProposalParam(): Promise<Types.ProposalParam>;
    /**
     * getValidatorParam returns the ValidatorParam.
     */
    getValidatorParam(): Promise<Types.ValidatorParam>;
    /**
     * getCoinDayParam returns the CoinDayParam.
     */
    getCoinDayParam(): Promise<Types.CoinDayParam>;
    /**
     * getBandwidthParam returns the BandwidthParam.
     */
    getBandwidthParam(): Promise<Types.BandwidthParam>;
    /**
     * getAccountParam returns the AccountParam.
     */
    getAccountParam(): Promise<Types.AccountParam>;
    /**
     * getGlobalMeta returns the GlobalMeta.
     */
    getGlobalMeta(): Promise<Types.GlobalMeta>;
    /**
     * getConsumptionMeta returns the consumption meta.
     */
    getConsumptionMeta(): Promise<Types.ConsumptionMeta>;
    /**
     * getGlobalTime returns the time in global storage.
     */
    getGlobalTime(): Promise<Types.GlobalTime>;
    /**
     * getInterest returns the interest a voter can get.
     */
    getInterest(username: string): any;
    /**
     * getEventAtTime returns the events at certain second.
     */
    getLinoStakeStat(day: string): Promise<Types.LinoStakeStat>;
    /**
     * getEventAtTime returns the events at certain second.
     */
    getEventAtTime(time: string): Promise<any>;
    /**
     * getAllEventAtAllTime returns all registered events.
     */
    getAllEventAtAllTime(): Promise<any>;
    /**
     * getAllEventAtAllTimeAtCertainHeight returns all registered events at certain height.
     */
    getAllEventAtAllTimeAtCertainHeight(height: any): Promise<any>;
    /**
     * getPostParam returns the PostParam.
     */
    getPostParam(): Promise<Types.PostParam>;
    /**
     * getBlock returns a block at a certain height from blockchain.
     *
     * @param height
     */
    getBlock(height: number): Promise<ResultBlock>;
    /**
     * getTxsInBlock returns all transactions in a block at a certain height from blockchain.
     * @param height
     */
    getTxsInBlock(height: number): Promise<StdTx[]>;
    /**
     * getBalanceHistoryFromTo returns a list of transaction history in the range of [from, to],
     * that if to is larger than the number of tx, tx will be replaced by the larget tx number,
     * related to a user's account balance, in reverse-chronological order.
     *
     * @param username: user name
     * @param from: the start index of the balance history, inclusively
     * @param to: the end index of the balance history, inclusively
     */
    getBalanceHistoryFromTo(username: string, from: number, to: number): Promise<BalanceHistory>;
    /**
     * getRecentBalanceHistory returns a certain number of recent transaction history
     * related to a user's account balance, in reverse-chronological order.
     *
     * @param username: user name
     * @param numHistory: the number of balance history are wanted
     */
    getRecentBalanceHistory(username: string, numHistory: number): Promise<BalanceHistory>;
    /**
     * getRewardHistoryFromTo returns a list of reward history in the range of [from, to],
     * that if to is larger than the number of tx, tx will be replaced by the largest tx number,
     * related to a user's posts rewards, in reverse-chronological order.
     *
     * @param username: user name
     * @param from: the start index of the reward history, inclusively
     * @param to: the end index of the reward history, inclusively
     */
    getRewardHistoryFromTo(username: string, from: number, to: number): Promise<RewardHistory>;
    /**
     * getRecentRewardHistory returns a certain number of recent reward history
     * related to a user's posts reward, in reverse-chronological order.
     *
     * @param username: user name
     * @param numReward: the number of reward history are wanted
     */
    getRecentRewardHistory(username: string, numReward: number): Promise<RewardHistory>;
    isValidNat(num: number): boolean;
}
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
export interface InfraProvider {
    username: string;
    usage: number;
}
export interface InfraProviderList {
    all_infra_providers: string[];
}
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
export declare function isChangeParamProposalValue(value: ProposalValue): value is ChangeParamProposalValue;
export interface ContentCensorshipProposalValue extends ProposalValue {
    permLink: string;
    reason: string;
}
export declare function isContentCensorshipProposalValue(value: ProposalValue): value is ContentCensorshipProposalValue;
export interface ProtocolUpgradeProposalValue extends ProposalValue {
    link: string;
    reason: string;
}
export declare function isProtocolUpgradeProposalValue(value: ProposalValue): value is ProtocolUpgradeProposalValue;
