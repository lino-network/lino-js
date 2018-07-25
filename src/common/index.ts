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
  content_creator_allocation: Rat;
  developer_allocation: Rat;
  infra_allocation: Rat;
  validator_allocation: Rat;
}
export function isGlobalAllocationParam(param: object): param is GlobalAllocationParam {
  return (
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
  delegator_min_withdraw: Coin;
  voter_coin_return_interval: string;
  voter_coin_return_times: string;
  voter_min_deposit: Coin;
  voter_min_withdraw: Coin;
  delegator_coin_return_interval: string;
  delegator_coin_return_times: string;
}
export function isVoteParam(param: object): param is VoteParam {
  return (
    'voter_min_deposit' in param &&
    'voter_min_withdraw' in param &&
    'delegator_min_withdraw' in param &&
    'voter_coin_return_interval' in param &&
    'voter_coin_return_times' in param &&
    'delegator_coin_return_interval' in param &&
    'delegator_coin_return_times' in param
  );
}

export interface ProposalParam {
  content_censorship_decide_hr: string;
  content_censorship_min_deposit: Coin;
  content_censorship_pass_ratio: Rat;
  content_censorship_pass_votes: Coin;
  change_param_decide_hr: string;
  change_param_min_deposit: Coin;
  change_param_pass_ratio: Rat;
  change_param_pass_votes: Coin;
  protocol_upgrade_decide_hr: string;
  protocol_upgrade_min_deposit: Coin;
  protocol_upgrade_pass_ratio: Rat;
  protocol_upgrade_pass_votes: Coin;
}
export function isProposalParam(param: object): param is ProposalParam {
  return (
    'content_censorship_decide_hr' in param &&
    'content_censorship_min_deposit' in param &&
    'content_censorship_pass_ratio' in param &&
    'content_censorship_pass_votes' in param &&
    'change_param_decide_hr' in param &&
    'change_param_min_deposit' in param &&
    'change_param_pass_ratio' in param &&
    'change_param_pass_votes' in param &&
    'protocol_upgrade_decide_hr' in param &&
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
  penalty_miss_vote: Coin;
  penalty_miss_commit: Coin;
  penalty_byzantine: Coin;
  validator_list_size: string;
  absent_commit_limitation: string;
  validator_min_withdraw: Coin;
  validator_min_voting_deposit: Coin;
  validator_min_commiting_deposit: Coin;
  validator_coin_return_interval: string;
  validator_coin_return_times: string;
}
export function isValidatorParam(param: object): param is ValidatorParam {
  return (
    'validator_min_withdraw' in param &&
    'validator_min_voting_deposit' in param &&
    'validator_min_commiting_deposit' in param &&
    'validator_coin_return_interval' in param &&
    'validator_coin_return_times' in param &&
    'penalty_miss_vote' in param &&
    'penalty_miss_commit' in param &&
    'penalty_byzantine' in param &&
    'validator_list_size' in param &&
    'absent_commit_limitation' in param
  );
}

export interface CoinDayParam {
  days_to_recover_coin_day_stake: number;
  seconds_to_recover_coin_day_stake: number;
}
export function isCoinDayParam(param: object): param is CoinDayParam {
  return 'days_to_recover_coin_day_stake' in param && 'seconds_to_recover_coin_day_stake' in param;
}

export interface BandwidthParam {
  seconds_to_recover_bandwidth: number;
  capacity_usage_per_transaction: Coin;
}
export function isBandwidthParam(param: object): param is BandwidthParam {
  return 'seconds_to_recover_bandwidth' in param && 'capacity_usage_per_transaction' in param;
}

export interface AccountParam {
  minimum_balance: Coin;
  register_fee: Coin;
  balance_history_bundle_size: string;
  reward_history_bundle_size: string;
}
export function isAccountParam(param: object): param is AccountParam {
  return (
    'minimum_balance' in param &&
    'register_fee' in param &&
    'balance_history_bundle_size' in param &&
    'reward_history_bundle_size' in param
  );
}

export interface PostParam {
  report_or_upvote_interval: string;
}
export function isPostParam(param: object): param is PostParam {
  return 'report_or_upvote_interval' in param;
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
  // Different possible outcomes
  TransferOut = '13',
  DonationOut = '14',
  Delegate = '15',
  VoterDeposit = '16',
  ValidatorDeposit = '17',
  DeveloperDeposit = '18',
  InfraDeposit = '19',
  ProposalDeposit = '20'
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
