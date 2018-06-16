import * as Types from '../common';
import { ITransport } from '../transport';
import { ResultBroadcastTxCommit } from '../transport/rpc';
export default class Broadcast {
    private _transport;
    constructor(transport: ITransport);
    register(referrer: string, register_fee: string, username: string, masterPubKeyHex: string, transactionPubKeyHex: string, postPubKeyHex: string, referrerPrivKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    transfer(sender: string, receiver: string, amount: string, memo: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    follow(follower: string, followee: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    unfollow(follower: string, followee: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    claim(username: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    updateAccount(username: string, json_meta: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    recover(username: string, new_master_public_key: string, new_post_public_key: string, new_transaction_public_key: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    createPost(author: string, postID: string, title: string, content: string, parentAuthor: string, parentPostID: string, sourceAuthor: string, sourcePostID: string, redistributionSplitRate: string, links: Map<string, string>, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    like(username: string, author: string, weight: number, post_id: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    donate(username: string, author: string, amount: string, post_id: string, from_app: string, memo: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    reportOrUpvote(username: string, author: string, post_id: string, is_report: boolean, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    deletePost(author: string, post_id: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    view(username: string, author: string, post_id: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    updatePost(author: string, title: string, post_id: string, content: string, redistribution_split_rate: string, links: Map<string, string>, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    validatorDeposit(username: string, deposit: string, validator_public_key: string, link: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    validatorWithdraw(username: string, amount: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    ValidatorRevoke(username: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    vote(voter: string, proposal_id: string, result: boolean, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    voterDeposit(username: string, deposit: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    voterWithdraw(username: string, amount: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    voterRevoke(username: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    delegate(delegator: string, voter: string, amount: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    delegatorWithdraw(delegator: string, voter: string, amount: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    revokeDelegation(delegator: string, voter: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    developerRegister(username: string, deposit: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    developerRevoke(username: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    grantDeveloper(username: string, authenticate_app: string, validity_period: number, grant_level: number, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    providerReport(username: string, usage: number, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeGlobalAllocationParam(creator: string, parameter: Types.GlobalAllocationParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeEvaluateOfContentValueParam(creator: string, parameter: Types.EvaluateOfContentValueParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeInfraInternalAllocationParam(creator: string, parameter: Types.InfraInternalAllocationParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeVoteParam(creator: string, parameter: Types.VoteParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeProposalParam(creator: string, parameter: Types.ProposalParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeDeveloperParam(creator: string, parameter: Types.DeveloperParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeValidatorParam(creator: string, parameter: Types.ValidatorParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeCoinDayParam(creator: string, parameter: Types.CoinDayParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeBandwidthParam(creator: string, parameter: Types.BandwidthParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    changeAccountParam(creator: string, parameter: Types.AccountParam, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    deletePostContent(creator: string, postAuthor: string, postID: string, reason: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
    _broadcastTransaction(msg: object, msgType: string, privKeyHex: string, seq: number): Promise<ResultBroadcastTxCommit>;
}
export interface RegisterMsg {
    referrer: string;
    register_fee: string;
    new_username: string;
    new_master_public_key: string;
    new_transaction_public_key: string;
    new_post_public_key: string;
}
export interface TransferMsg {
    sender: string;
    receiver: string;
    amount: string;
    memo: string;
}
export interface FollowMsg {
    follower: string;
    followee: string;
}
export interface UnfollowMsg {
    follower: string;
    followee: string;
}
export interface ClaimMsg {
    username: string;
}
export interface RecoverMsg {
    username: string;
    new_master_public_key: string;
    new_post_public_key: string;
    new_transaction_public_key: string;
}
export interface UpdateAccountMsg {
    username: string;
    json_meta: string;
}
export interface CreatePostMsg {
    author: string;
    post_id: string;
    title: string;
    content: string;
    parent_author: string;
    parent_postID: string;
    source_author: string;
    source_postID: string;
    links: Types.IDToURLMapping[] | null;
    redistribution_split_rate: string;
}
export interface LikeMsg {
    username: string;
    weight: number;
    author: string;
    post_id: string;
}
export interface DonateMsg {
    username: string;
    amount: string;
    author: string;
    post_id: string;
    from_app: string;
    memo: string;
}
export interface ReportOrUpvoteMsg {
    username: string;
    author: string;
    post_id: string;
    is_report: boolean;
}
export interface DeletePostMsg {
    author: string;
    post_id: string;
}
export interface ViewMsg {
    username: string;
    author: string;
    post_id: string;
}
export interface UpdatePostMsg {
    author: string;
    post_id: string;
    title: string;
    content: string;
    links: Types.IDToURLMapping[] | null;
    redistribution_split_rate: string;
}
export interface ValidatorDepositMsg {
    username: string;
    deposit: string;
    validator_public_key: string;
    link: string;
}
export interface ValidatorWithdrawMsg {
    username: string;
    amount: string;
}
export interface ValidatorRevokeMsg {
    username: string;
}
export interface VoterDepositMsg {
    username: string;
    deposit: string;
}
export interface VoteMsg {
    voter: string;
    proposal_id: string;
    result: boolean;
}
export interface VoterWithdrawMsg {
    username: string;
    amount: string;
}
export interface VoterRevokeMsg {
    username: string;
}
export interface DelegateMsg {
    delegator: string;
    voter: string;
    amount: string;
}
export interface DelegatorWithdrawMsg {
    delegator: string;
    voter: string;
    amount: string;
}
export interface RevokeDelegationMsg {
    delegator: string;
    voter: string;
}
export interface DeveloperRegisterMsg {
    username: string;
    deposit: string;
}
export interface DeveloperRevokeMsg {
    username: string;
}
export interface GrantDeveloperMsg {
    username: string;
    authenticate_app: string;
    validity_period: number;
    grant_level: number;
}
export interface ProviderReportMsg {
    username: string;
    usage: number;
}
export interface DeletePostContentMsg {
    creator: string;
    permLink: string;
    reason: string;
}
export interface ChangeGlobalAllocationParamMsg {
    creator: string;
    parameter: Types.GlobalAllocationParam;
}
export interface ChangeEvaluateOfContentValueParamMsg {
    creator: string;
    parameter: Types.EvaluateOfContentValueParam;
}
export interface ChangeInfraInternalAllocationParamMsg {
    creator: string;
    parameter: Types.InfraInternalAllocationParam;
}
export interface ChangeVoteParamMsg {
    creator: string;
    parameter: Types.VoteParam;
}
export interface ChangeProposalParamMsg {
    creator: string;
    parameter: Types.ProposalParam;
}
export interface ChangeDeveloperParamMsg {
    creator: string;
    parameter: Types.DeveloperParam;
}
export interface ChangeValidatorParamMsg {
    creator: string;
    parameter: Types.ValidatorParam;
}
export interface ChangeCoinDayParamMsg {
    creator: string;
    parameter: Types.CoinDayParam;
}
export interface ChangeBandwidthParamMsg {
    creator: string;
    parameter: Types.BandwidthParam;
}
export interface ChangeAccountParamMsg {
    creator: string;
    parameter: Types.AccountParam;
}
