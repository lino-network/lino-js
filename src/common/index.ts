//Common Type defination
export interface Coin {
  amount: Int128;
}

export interface SDKCoin {
  denom: string;
  amount: number;
}

export interface Int128 {
  Lo: number;
  Hi: number;
}

export interface MathInt {
  neg: boolean;
  abs: number[];
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
  consumption_time_adjust_base: number;
  consumption_time_adjust_offset: number;
  num_of_consumption_on_author_offset: number;
  total_amount_of_consumption_base: number;
  total_amount_of_consumption_offset: number;
  amount_of_consumption_exponent: Rat;
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
  infra_allocation: Rat;
  content_creator_allocation: Rat;
  developer_allocation: Rat;
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
  storage_allocation: Rat;
  CDN_allocation: Rat;
}
export function isInfraInternalAllocationParam(
  param: object
): param is InfraInternalAllocationParam {
  return 'storage_allocation' in param && 'CDN_allocation' in param;
}

export interface VoteParam {
  voter_min_deposit: Coin;
  voter_min_withdraw: Coin;
  delegator_min_withdraw: Coin;
  voter_coin_return_interval: number;
  voter_coin_return_times: number;
  delegator_coin_return_interval: number;
  delegator_coin_return_times: number;
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
export function isProposalParam(param: object): param is ProposalParam {
  return (
    'next_proposal_id' in param &&
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
  developer_coin_return_interval: number;
  developer_coin_return_times: number;
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
  validator_coin_return_interval: number;
  validator_coin_return_times: number;
  penalty_miss_vote: Coin;
  penalty_miss_commit: Coin;
  penalty_byzantine: Coin;
  validator_list_size: number;
  absent_commit_limitation: number;
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
}
export function isAccountParam(param: object): param is AccountParam {
  return 'minimum_balance' in param && 'register_fee' in param;
}

export interface PostParam {
  micropayment_limitation: Coin;
}
export function isPostParam(param: object): param is PostParam {
  return 'micropayment_limitation' in param;
}