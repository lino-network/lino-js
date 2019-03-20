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
     * getAccountMeta returns account meta info for a specific user.
     *
     * @param username
     */
    getAccountMeta(username: string): Promise<AccountMeta>;
    /**
     * getPendingCoinDayQueue returns account pending coin day for a specific user.
     *
     * @param username
     */
    getPendingCoinDayQueue(username: string): Promise<PendingCoinDayQueue>;
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
     * @param grantTo
     * @param permission
     */
    getGrantPubKey(username: string, grantTo: string, permission: Types.PERMISSION_TYPE): Promise<GrantPubKey>;
    /**
     * getAllGrantPubKeys returns a list of all granted public keys of a user.
     *
     * @param username
     */
    getAllGrantPubKeys(username: string): Promise<GrantPubKey[]>;
    /**
     * getReward returns rewards of a user.
     *
     * @param username
     */
    getReward(username: string): Promise<Reward>;
    /**
     * getAllPosts returns all posts the author created.
     *
     * @param author
     */
    /**
     * getPostComment returns a specific comment of a post given the post permlink
     * and comment permlink.
     *
     * @param author
     * @param postID
     * @param commentPermlink
     */
    /**
     * getPostAllComments returns all comments that a post has.
     *
     * @param author
     * @param postID
     */
    /**
     * getPostView returns a view of a post performed by a user.
     *
     * @param author
     * @param postID
     * @param viewUser
     */
    /**
     * getPostAllViews returns all views that a post has.
     *
     * @param author
     * @param postID
     */
    /**
     * getPostDonations returns all donations that a user has given to a post.
     *
     * @param author
     * @param postID
     * @param donateUser
     */
    /**
     * getPostAllDonations returns all donations that a post has received.
     *
     * @param author
     * @param postID
     */
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
    /**
     * getDelegatorAllDelegation returns all delegations that a delegator has delegated to.
     *
     * @param delegatorName
     */
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
     * getPastDay returns the blockchain past day.
     */
    getPastDay(): any;
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
    /**
     * getAllEventAtAllTimeAtCertainHeight returns all registered events at certain height.
     */
    /**
     * getPostParam returns the PostParam.
     */
    getPostParam(): Promise<Types.PostParam>;
    /**
     * getReputationParam returns the ReputationParam.
     */
    getReputationParam(): Promise<Types.ReputationParam>;
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
     * getUserReputationMeta returns a user's reputation meta.
     *
     * @param username: user name
     */
    /**
     * getUserReputationMeta returns a user's reputation meta.
     *
     * @param username: user name
     */
    getUserReputation(username: string): Promise<Types.Coin>;
    /**
     * getPostReputationMeta returns a post's reputation meta.
     *
     * @param author: author of the post
     * @param postID: post ID of the post
     */
    /**
     * getPenaltyScore returns a post's penalty score.
     *
     * @param author: author of the post
     * @param postID: post ID of the post
     */
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
    grant_to: string;
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
