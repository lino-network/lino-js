export interface Coin {
    amount: string;
}
export interface SDKCoin {
    denom: string;
    amount: number;
}
export interface MathInt {
    abs: number[];
    neg: boolean;
}
export interface MathRat {
    a: MathInt;
    b: MathInt;
}
export interface Rat {
    rat: MathRat;
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
    amount_of_consumption_exponent: Rat;
    consumption_time_adjust_base: string;
    consumption_time_adjust_offset: string;
    num_of_consumption_on_author_offset: string;
    total_amount_of_consumption_base: string;
    total_amount_of_consumption_offset: string;
}
export declare function isEvaluateOfContentValueParam(param: object): param is EvaluateOfContentValueParam;
export interface GlobalAllocationParam {
    global_growth_rate: Rat;
    infra_allocation: Rat;
    content_creator_allocation: Rat;
    developer_allocation: Rat;
    validator_allocation: Rat;
}
export declare function isGlobalAllocationParam(param: object): param is GlobalAllocationParam;
export interface InfraInternalAllocationParam {
    CDN_allocation: Rat;
    storage_allocation: Rat;
}
export declare function isInfraInternalAllocationParam(param: object): param is InfraInternalAllocationParam;
export interface VoteParam {
    min_stake_in: Coin;
    voter_coin_return_interval_second: string;
    voter_coin_return_times: string;
    DelegatorCoinReturnIntervalSec: string;
    delegator_coin_return_times: string;
}
export declare function isVoteParam(param: object): param is VoteParam;
export interface ProposalParam {
    content_censorship_decide_second: number;
    content_censorship_min_deposit: Coin;
    content_censorship_pass_ratio: Rat;
    content_censorship_pass_votes: Coin;
    ChangeParamDecideSec: number;
    ChangeParamExecutionSec: number;
    change_param_min_deposit: Coin;
    change_param_pass_ratio: Rat;
    change_param_pass_votes: Coin;
    protocol_upgrade_decide_second: number;
    protocol_upgrade_min_deposit: Coin;
    protocol_upgrade_pass_ratio: Rat;
    protocol_upgrade_pass_votes: Coin;
}
export declare function isProposalParam(param: object): param is ProposalParam;
export interface DeveloperParam {
    developer_min_deposit: Coin;
    developer_coin_return_interval: string;
    developer_coin_return_times: string;
}
export declare function isDeveloperParam(param: object): param is DeveloperParam;
export interface ValidatorParam {
    validator_min_withdraw: Coin;
    validator_min_voting_deposit: Coin;
    validator_min_commiting_deposit: Coin;
    validator_coin_return_second: number;
    validator_coin_return_times: string;
    penalty_miss_vote: Coin;
    penalty_miss_commit: Coin;
    penalty_byzantine: Coin;
    validator_list_size: string;
    absent_commit_limitation: string;
}
export declare function isValidatorParam(param: object): param is ValidatorParam;
export interface CoinDayParam {
    seconds_to_recover_coin_day: number;
}
export declare function isCoinDayParam(param: object): param is CoinDayParam;
export interface BandwidthParam {
    seconds_to_recover_bandwidth: number;
    capacity_usage_per_transaction: Coin;
    virtual_coin: Coin;
}
export declare function isBandwidthParam(param: object): param is BandwidthParam;
export interface AccountParam {
    minimum_balance: Coin;
    register_fee: Coin;
    first_deposit_full_stake_limit: Coin;
    max_num_frozen_money: number;
}
export declare function isAccountParam(param: object): param is AccountParam;
export interface PostParam {
    report_or_upvote_interval_second: string;
    post_interval_sec: string;
    max_report_reputation: Coin;
}
export declare function isPostParam(param: object): param is PostParam;
export interface ReputationParam {
    best_content_index_n: string;
}
export declare function isReputationParam(param: object): param is ReputationParam;
export interface GlobalMeta {
    total_lino_coin: Coin;
    last_year_cumulative_consumption: Coin;
    cumulative_consumption: Coin;
    growth_rate: Rat;
    ceiling: Rat;
    Floor: Rat;
}
export interface ConsumptionMeta {
    consumption_friction_rate: Rat;
    consumption_window: Coin;
    consumption_reward_pool: Coin;
    consumption_freezing_period: string;
}
export declare enum DETAILTYPE {
    TransferIn = "0",
    DonationIn = "1",
    ClaimReward = "2",
    ValidatorInflation = "3",
    DeveloperInflation = "4",
    InfraInflation = "5",
    VoteReturnCoin = "6",
    DelegationReturnCoin = "7",
    ValidatorReturnCoin = "8",
    DeveloperReturnCoin = "9",
    InfraReturnCoin = "10",
    ProposalReturnCoin = "11",
    GenesisCoin = "12",
    ClaimInterest = "13",
    TransferOut = "20",
    DonationOut = "21",
    Delegate = "22",
    VoterDeposit = "23",
    ValidatorDeposit = "24",
    DeveloperDeposit = "25",
    InfraDeposit = "26",
    ProposalDeposit = "27"
}
export declare enum PERMISSION_TYPE {
    UnknownPermission = "0",
    AppPermission = "1",
    TransactionPermission = "2",
    ResetPermission = "3",
    GrantAppPermissio = "4",
    PreAuthorizationPermission = "5"
}
