import { ITransport } from '../transport';
import { ResultBroadcastTxCommit } from '../transport/rpc';
import * as Types from '../common';
export default class Broadcast {
    private _transport;
    constructor(transport: ITransport);
    register(referrer: string, register_fee: string, username: string, masterPubKeyHex: string, postPubKeyHex: string, transactionPubKeyHex: string, referrerPrivKeyHex: string): Promise<ResultBroadcastTxCommit>;
    transfer(sender: string, receiver: string, amount: string, memo: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    follow(follower: string, followee: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    unfollow(follower: string, followee: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    claim(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    like(username: string, author: string, weight: number, post_id: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    donate(username: string, author: string, amount: string, post_id: string, from_app: string, from_checking: boolean, memo: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    reportOrUpvote(username: string, author: string, post_id: string, is_report: boolean, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    deletePost(author: string, post_id: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    view(username: string, author: string, post_id: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    updatePost(author: string, title: string, post_id: string, content: string, redistribution_split_rate: string, links: Types.IDToURLMapping[], privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    validatorDeposit(username: string, deposit: string, validator_public_key: string, link: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    validatorWithdraw(username: string, amount: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    ValidatorRevoke(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    vote(voter: string, proposal_id: string, result: boolean, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    voterDeposit(username: string, deposit: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    voterWithdraw(username: string, amount: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    voterRevoke(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    delegate(delegator: string, voter: string, amount: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    delegatorWithdraw(delegator: string, voter: string, amount: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    revokeDelegation(delegator: string, voter: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    developerRegister(username: string, deposit: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    developerRevoke(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    grantDeveloper(username: string, authenticate_app: string, validity_period: number, grant_level: number, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    providerReport(username: string, usage: number, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeGlobalAllocationParam(creator: string, parameter: Types.GlobalAllocationParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeEvaluateOfContentValueParam(creator: string, parameter: Types.EvaluateOfContentValueParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeInfraInternalAllocationParam(creator: string, parameter: Types.InfraInternalAllocationParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeVoteParam(creator: string, parameter: Types.VoteParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeProposalParam(creator: string, parameter: Types.ProposalParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeDeveloperParam(creator: string, parameter: Types.DeveloperParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeValidatorParam(creator: string, parameter: Types.ValidatorParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeCoinDayParam(creator: string, parameter: Types.CoinDayParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeBandwidthParam(creator: string, parameter: Types.BandwidthParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    changeAccountParam(creator: string, parameter: Types.AccountParam, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    deletePostContent(creator: string, permLink: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
    _broadcastTransaction(msg: any, msgType: string, privKeyHex: string): Promise<ResultBroadcastTxCommit>;
}
export interface RegisterMsg {
    referrer: string;
    register_fee: string;
    new_username: string;
    new_master_public_key: string;
    new_post_public_key: string;
    new_transaction_public_key: string;
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
    new_post_public_key: string;
    new_transaction_public_key: string;
}
export interface CreatePostMsg {
    PostCreateParams: any;
}
export interface PostCreateParams {
    post_id: string;
    title: string;
    content: string;
    author: string;
    parent_author: string;
    parent_postID: string;
    source_author: string;
    source_postID: string;
    links: Types.IDToURLMapping[];
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
    from_checking: boolean;
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
    links: Types.IDToURLMapping[];
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
