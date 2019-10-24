//Common Type defination
export interface Coin {
  amount: string;
}

export interface MiniDollar {
  amount: string;
}

export class AccOrAddr {
  is_addr: boolean;
  addr: string;
  account_key: string;

  constructor(addr: string, is_addr: boolean, username: string) {
    this.is_addr = true;
    this.addr = addr;
    this.account_key = username;
  }
}

export class Addr {
  is_addr: boolean;
  addr: string;

  constructor(addr: string) {
    this.is_addr = true;
    this.addr = addr;
  }
}

export class Acc {
  account_key: string;

  constructor(username: string) {
    this.account_key = username;
  }
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

export interface GlobalAllocationParam {
  global_growth_rate: string;
  infra_allocation: string;
  content_creator_allocation: string;
  developer_allocation: string;
  validator_allocation: string;
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
  CDN_allocation: string;
  storage_allocation: string;
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
  delegator_coin_return_interval_second: string;
  delegator_coin_return_times: string;
}
export function isVoteParam(param: object): param is VoteParam {
  return (
    'min_stake_in' in param &&
    'voter_coin_return_interval_second' in param &&
    'voter_coin_return_times' in param &&
    'delegator_coin_return_interval_second' in param &&
    'delegator_coin_return_times' in param
  );
}

export interface ProposalParam {
  content_censorship_decide_second: string;
  content_censorship_min_deposit: Coin;
  content_censorship_pass_ratio: string;
  content_censorship_pass_votes: Coin;
  change_param_decide_second: string;
  change_param_execution_second: string;
  change_param_min_deposit: Coin;
  change_param_pass_ratio: string;
  change_param_pass_votes: Coin;
  protocol_upgrade_decide_second: string;
  protocol_upgrade_min_deposit: Coin;
  protocol_upgrade_pass_ratio: string;
  protocol_upgrade_pass_votes: Coin;
}
export function isProposalParam(param: object): param is ProposalParam {
  return (
    'content_censorship_decide_second' in param &&
    'content_censorship_min_deposit' in param &&
    'content_censorship_pass_ratio' in param &&
    'content_censorship_pass_votes' in param &&
    'change_param_decide_second' in param &&
    'change_param_execution_second' in param &&
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
  validator_min_deposit: Coin;
  validator_coin_return_second: string;
  validator_coin_return_times: string;
  penalty_miss_commit: Coin;
  penalty_byzantine: Coin;
  absent_commit_limitation: string;
  oncall_size: string;
  standby_size: string;
  validator_revoke_pending_sec: string;
  oncall_inflation_weight: string;
  standby_inflation_weight: string;
  max_voted_validators: string;
}
export function isValidatorParam(param: object): param is ValidatorParam {
  return (
    'validator_min_deposit' in param &&
    'validator_coin_return_second' in param &&
    'validator_coin_return_times' in param &&
    'penalty_miss_commit' in param &&
    'penalty_byzantine' in param &&
    'absent_commit_limitation' in param &&
    'oncall_size' in param &&
    'standby_size' in param &&
    'validator_revoke_pending_sec' in param &&
    'oncall_inflation_weight' in param &&
    'standby_inflation_weight' in param &&
    'max_voted_validators' in param
  );
}

export interface BandwidthParam {
  seconds_to_recover_bandwidth: string;
  capacity_usage_per_transaction: Coin;
  virtual_coin: Coin;
  general_msg_quota_ratio: string;
  general_msg_ema_factor: string;
  app_msg_quota_ratio: string;
  app_msg_ema_factor: string;
  expected_max_mps: string;
  msg_fee_factor_a: string;
  msg_fee_factor_b: string;
  max_mps_decay_rate: string;
  app_bandwidth_pool_size: string;
  app_vacancy_factor: string;
  app_punishment_factor: string;
}
export function isBandwidthParam(param: object): param is BandwidthParam {
  return (
    'seconds_to_recover_bandwidth' in param &&
    'capacity_usage_per_transaction' in param &&
    'general_msg_quota_ratio' in param &&
    'general_msg_ema_factor' in param &&
    'app_msg_quota_ratio' in param &&
    'app_msg_ema_factor' in param &&
    'expected_max_mps' in param &&
    'msg_fee_factor_a' in param &&
    'msg_fee_factor_b' in param &&
    'max_mps_decay_rate' in param &&
    'app_bandwidth_pool_size' in param &&
    'app_vacancy_factor' in param &&
    'app_punishment_factor' in param
  );
}

export interface AccountParam {
  minimum_balance: Coin;
  register_fee: Coin;
  first_deposit_full_coin_day_limit: Coin;
  max_num_frozen_money: number;
}
export function isAccountParam(param: object): param is AccountParam {
  return (
    'minimum_balance' in param &&
    'register_fee' in param &&
    'first_deposit_full_coin_day_limit' in param &&
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
  user_max_n: string;
}
export function isReputationParam(param: object): param is ReputationParam {
  return 'best_content_index_n' in param && 'user_max_n' in param;
}

export interface PriceParam {
  testnet_mode: boolean;
  update_every: string;
  feed_every: string;
  history_max_len: string;
  penalty_miss_feed: string;
}
export function isPriceParam(param: object): param is ReputationParam {
  return (
    'testnet_mode' in param &&
    'update_every' in param &&
    'feed_every' in param &&
    'history_max_len' in param &&
    'penalty_miss_feed' in param
  );
}

export interface GlobalMeta {
  total_lino_coin: Coin;
  last_year_cumulative_consumption: Coin;
}

export interface ConsumptionMeta {
  consumption_friction_rate: string;
  consumption_window: Coin;
  consumption_reward_pool: Coin;
  consumption_freezing_period: string;
}

export interface InflationPool {
  infra_inflation_pool: Coin;
  developer_inflation_pool: Coin;
  validator_inflation_pool: Coin;
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
  PreAuthorizationPermission = '5',
  AppAndPreAuthorizationPermission = '6',
  AppOrAffiliatedPermission = '7'
}

export interface TxAndSequenceNumber {
  username: string;
  sequence: number;
  tx: TxResult;
}

export interface TxResult {
  hash: string;
  height: number;
  code: number;
  log: string;
}
