//Common Type defination
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
export function isEvaluateOfContentValueParam(param: object): param is EvaluateOfContentValueParam {
  return (
    'consumption_time_adjust_base' in param &&
    'consumption_time_adjust_offset' in param &&
    'num_of_consumption_on_author_offset' in param &&
    'total_amount_of_consumption_base' in param &&
    'total_amount_of_consumption_offset' in param &&
    'amount_of_consumption_exponent' in param
  );
}

export interface GlobalAllocationParam {
  global_growth_rate: Rat;
  infra_allocation: Rat;
  content_creator_allocation: Rat;
  developer_allocation: Rat;
  validator_allocation: Rat;
}
export function isGlobalAllocationParam(param: object): param is GlobalAllocationParam {
  return (
    'global_growth_rate' in param &&
    'infra_allocation' in param &&
    'content_creator_allocation' in param &&
    'developer_allocation' in param &&
    'validator_allocation' in param
  );
}

export interface InfraInternalAllocationParam {
  CDN_allocation: Rat;
  storage_allocation: Rat;
}
export function isInfraInternalAllocationParam(
  param: object
): param is InfraInternalAllocationParam {
  return 'storage_allocation' in param && 'CDN_allocation' in param;
}

export interface VoteParam {
  min_stake_in: Coin;
  voter_coin_return_interval_second: string;
  voter_coin_return_times: string;
  DelegatorCoinReturnIntervalSec: string;
  delegator_coin_return_times: string;
}
export function isVoteParam(param: object): param is VoteParam {
  return (
    'min_stake_in' in param &&
    'voter_coin_return_interval_second' in param &&
    'voter_coin_return_times' in param &&
    'DelegatorCoinReturnIntervalSec' in param &&
    'delegator_coin_return_times' in param
  );
}

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
export function isProposalParam(param: object): param is ProposalParam {
  return (
    'content_censorship_decide_second' in param &&
    'content_censorship_min_deposit' in param &&
    'content_censorship_pass_ratio' in param &&
    'content_censorship_pass_votes' in param &&
    'ChangeParamDecideSec' in param &&
    'ChangeParamExecutionSec' in param &&
    'change_param_min_deposit' in param &&
    'change_param_pass_ratio' in param &&
    'change_param_pass_votes' in param &&
    'protocol_upgrade_decide_second' in param &&
    'protocol_upgrade_min_deposit' in param &&
    'protocol_upgrade_pass_ratio' in param &&
    'protocol_upgrade_pass_votes' in param
  );
}

export interface DeveloperParam {
  developer_min_deposit: Coin;
  developer_coin_return_interval: string;
  developer_coin_return_times: string;
}
export function isDeveloperParam(param: object): param is DeveloperParam {
  return (
    'developer_min_deposit' in param &&
    'developer_coin_return_interval' in param &&
    'developer_coin_return_times' in param
  );
}

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
export function isValidatorParam(param: object): param is ValidatorParam {
  return (
    'validator_min_withdraw' in param &&
    'validator_min_voting_deposit' in param &&
    'validator_min_commiting_deposit' in param &&
    'validator_coin_return_second' in param &&
    'validator_coin_return_times' in param &&
    'penalty_miss_vote' in param &&
    'penalty_miss_commit' in param &&
    'penalty_byzantine' in param &&
    'validator_list_size' in param &&
    'absent_commit_limitation' in param
  );
}

export interface CoinDayParam {
  seconds_to_recover_coin_day: number;
}
export function isCoinDayParam(param: object): param is CoinDayParam {
  return 'seconds_to_recover_coin_day' in param;
}

export interface BandwidthParam {
  seconds_to_recover_bandwidth: number;
  capacity_usage_per_transaction: Coin;
  virtual_coin: Coin;
}
export function isBandwidthParam(param: object): param is BandwidthParam {
  return (
    'seconds_to_recover_bandwidth' in param &&
    'capacity_usage_per_transaction' in param &&
    'virtual_coin' in param
  );
}

export interface AccountParam {
  minimum_balance: Coin;
  register_fee: Coin;
  first_deposit_full_stake_limit: Coin;
  max_num_frozen_money: number;
}
export function isAccountParam(param: object): param is AccountParam {
  return (
    'minimum_balance' in param &&
    'register_fee' in param &&
    'first_deposit_full_stake_limit' in param &&
    'max_num_frozen_money' in param
  );
}

export interface PostParam {
  report_or_upvote_interval_second: string;
  post_interval_sec: string;
  max_report_reputation: Coin;
}
export function isPostParam(param: object): param is PostParam {
  return (
    'report_or_upvote_interval_second' in param &&
    'post_interval_sec' in param &&
    'max_report_reputation' in param
  );
}

export interface ReputationParam {
  best_content_index_n: string;
}
export function isReputationParam(param: object): param is ReputationParam {
  return 'best_content_index_n' in param;
}

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

export interface GlobalTime {
  chain_start_time: string;
  last_block_time: string;
  past_minutes: string;
}

export interface LinoStakeStat {
  total_consumption_friction: Coin;
  unclaimed_friction: Coin;
  total_lino_power: Coin;
  unclaimed_lino_power: Coin;
}

// tx detail type
export enum DETAILTYPE {
  // Different possible incomes
  TransferIn = '0',
  DonationIn = '1',
  ClaimReward = '2',
  ValidatorInflation = '3',
  DeveloperInflation = '4',
  InfraInflation = '5',
  VoteReturnCoin = '6',
  DelegationReturnCoin = '7',
  ValidatorReturnCoin = '8',
  DeveloperReturnCoin = '9',
  InfraReturnCoin = '10',
  ProposalReturnCoin = '11',
  GenesisCoin = '12',
  ClaimInterest = '13',
  // Different possible outcomes
  TransferOut = '20',
  DonationOut = '21',
  Delegate = '22',
  VoterDeposit = '23',
  ValidatorDeposit = '24',
  DeveloperDeposit = '25',
  InfraDeposit = '26',
  ProposalDeposit = '27'
}

// permission type
export enum PERMISSION_TYPE {
  // Different possible incomes
  // Different permission level for msg
  UnknownPermission = '0',
  AppPermission = '1',
  TransactionPermission = '2',
  ResetPermission = '3',
  GrantAppPermissio = '4',
  PreAuthorizationPermission = '5'
}
