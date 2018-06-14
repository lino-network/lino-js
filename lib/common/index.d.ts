export interface Coin {
    amount: Int128;
}
export interface Int128 {
    Lo: number;
    Hi: number;
}
export interface Rat {
    num: number;
    denom: number;
}
export interface IDToURLMapping {
    identifier: string;
    url: string;
}
export interface Parameter {
    type: string;
    value: object;
}
export interface EvaluateOfContentValueParam {
    consumption_time_adjust_base: number;
    consumption_time_adjust_offset: number;
    num_of_consumption_on_author_offset: number;
    total_amount_of_consumption_base: number;
    total_amount_of_consumption_offset: number;
    amount_of_consumption_exponent: Rat;
}
export declare function isEvaluateOfContentValueParam(param: object): param is EvaluateOfContentValueParam;
export interface GlobalAllocationParam {
    infra_allocation: Rat;
    content_creator_allocation: Rat;
    developer_allocation: Rat;
    validator_allocation: Rat;
}
export declare function isGlobalAllocationParam(param: object): param is GlobalAllocationParam;
export interface InfraInternalAllocationParam {
    storage_allocation: Rat;
    CDN_allocation: Rat;
}
export declare function isInfraInternalAllocationParam(param: object): param is InfraInternalAllocationParam;
export interface VoteParam {
    voter_min_deposit: Coin;
    voter_min_withdraw: Coin;
    delegator_min_withdraw: Coin;
    voter_coin_return_interval: number;
    voter_coin_return_times: number;
    delegator_coin_return_interval: number;
    delegator_coin_return_times: number;
}
export declare function isVoteParam(param: object): param is VoteParam;
export interface ProposalParam {
    next_proposal_id: number;
    content_censorship_decide_hr: number;
    content_censorship_min_deposit: Coin;
    content_censorship_pass_ratio: Rat;
    content_censorship_pass_votes: Coin;
    change_param_decide_hr: number;
    change_param_min_deposit: Coin;
    change_param_pass_ratio: Rat;
    change_param_pass_votes: Coin;
    protocol_upgrade_decide_hr: number;
    protocol_upgrade_min_deposit: Coin;
    protocol_upgrade_pass_ratio: Rat;
    protocol_upgrade_pass_votes: Coin;
}
export declare function isProposalParam(param: object): param is ProposalParam;
export interface DeveloperParam {
    developer_min_deposit: Coin;
    developer_coin_return_interval: number;
    developer_coin_return_times: number;
}
export declare function isDeveloperParam(param: object): param is DeveloperParam;
export interface ValidatorParam {
    validator_min_withdraw: Coin;
    validator_min_voting_deposit: Coin;
    validator_min_commiting_deposit: Coin;
    validator_coin_return_interval: number;
    validator_coin_return_times: number;
    penalty_miss_vote: Coin;
    penalty_miss_commit: Coin;
    penalty_byzantine: Coin;
    validator_list_size: number;
    absent_commit_limitation: number;
}
export declare function isValidatorParam(param: object): param is ValidatorParam;
export interface CoinDayParam {
    days_to_recover_coin_day_stake: number;
    seconds_to_recover_coin_day_stake: number;
}
export declare function isCoinDayParam(param: object): param is CoinDayParam;
export interface BandwidthParam {
    seconds_to_recover_bandwidth: number;
    capacity_usage_per_transaction: Coin;
}
export declare function isBandwidthParam(param: object): param is BandwidthParam;
export interface AccountParam {
    minimum_balance: Coin;
    register_fee: Coin;
}
export declare function isAccountParam(param: object): param is AccountParam;
