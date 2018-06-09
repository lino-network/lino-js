import * as Types from '../common';
import { ITransport } from '../transport';
import { decodePubKey } from '../transport/encoder';
import { ResultBroadcastTxCommit } from '../transport/rpc';

const InvalidSeqErrCode = 3;

export default class Broadcast {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  //account related
  register(
    referrer: string,
    register_fee: string,
    username: string,
    masterPubKeyHex: string,
    postPubKeyHex: string,
    transactionPubKeyHex: string,
    referrerPrivKeyHex: string,
    seq: number
  ) {
    const msg: RegisterMsg = {
      referrer: referrer,
      register_fee: register_fee,
      new_username: username,
      new_master_public_key: decodePubKey(masterPubKeyHex),
      new_post_public_key: decodePubKey(postPubKeyHex),
      new_transaction_public_key: decodePubKey(transactionPubKeyHex)
    };
    return this._broadcastTransaction(msg, _MSGTYPE.RegisterMsgType, referrerPrivKeyHex, seq);
  }

  transfer(
    sender: string,
    receiver: string,
    amount: string,
    memo: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: TransferMsg = {
      sender,
      receiver,
      amount,
      memo
    };
    return this._broadcastTransaction(msg, _MSGTYPE.TransferMsgType, privKeyHex, seq);
  }

  follow(follower: string, followee: string, privKeyHex: string, seq: number) {
    const msg: FollowMsg = {
      follower,
      followee
    };
    return this._broadcastTransaction(msg, _MSGTYPE.FollowMsgType, privKeyHex, seq);
  }

  unfollow(follower: string, followee: string, privKeyHex: string, seq: number) {
    const msg: UnfollowMsg = {
      follower,
      followee
    };
    return this._broadcastTransaction(msg, _MSGTYPE.UnfollowMsgType, privKeyHex, seq);
  }

  claim(username: string, privKeyHex: string, seq: number) {
    const msg: ClaimMsg = {
      username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ClaimMsgType, privKeyHex, seq);
  }

  updateAccount(username: string, json_meta: string, privKeyHex: string, seq: number) {
    const msg: UpdateAccountMsg = {
      username,
      json_meta
    };
    return this._broadcastTransaction(msg, _MSGTYPE.UpdateAccountMsgType, privKeyHex, seq);
  }

  // post related
  like(
    username: string,
    author: string,
    weight: number,
    post_id: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: LikeMsg = {
      username,
      weight,
      author,
      post_id
    };
    return this._broadcastTransaction(msg, _MSGTYPE.LikeMsgType, privKeyHex, seq);
  }

  donate(
    username: string,
    author: string,
    amount: string,
    post_id: string,
    from_app: string,
    from_checking: boolean,
    memo: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: DonateMsg = {
      username,
      amount,
      author,
      post_id,
      from_app,
      from_checking,
      memo
    };
    return this._broadcastTransaction(msg, _MSGTYPE.DonateMsgType, privKeyHex, seq);
  }

  reportOrUpvote(
    username: string,
    author: string,
    post_id: string,
    is_report: boolean,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ReportOrUpvoteMsg = {
      username,
      author,
      post_id,
      is_report
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ReportOrUpvoteMsgType, privKeyHex, seq);
  }

  deletePost(author: string, post_id: string, privKeyHex: string, seq: number) {
    const msg: DeletePostMsg = {
      author,
      post_id
    };
    return this._broadcastTransaction(msg, _MSGTYPE.DeletePostMsgType, privKeyHex, seq);
  }

  view(username: string, author: string, post_id: string, privKeyHex: string, seq: number) {
    const msg: ViewMsg = {
      username,
      author,
      post_id
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ViewMsgType, privKeyHex, seq);
  }

  updatePost(
    author: string,
    title: string,
    post_id: string,
    content: string,
    redistribution_split_rate: string,
    links: Types.IDToURLMapping[],
    privKeyHex: string,
    seq: number
  ) {
    const msg: UpdatePostMsg = {
      author,
      post_id,
      title,
      content,
      links,
      redistribution_split_rate
    };
    return this._broadcastTransaction(msg, _MSGTYPE.UpdatePostMsgType, privKeyHex, seq);
  }

  // validator related
  validatorDeposit(
    username: string,
    deposit: string,
    validator_public_key: string,
    link: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ValidatorDepositMsg = {
      username: username,
      deposit: deposit,
      validator_public_key: decodePubKey(validator_public_key),
      link: link
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ValidatorDepositMsgType, privKeyHex, seq);
  }

  validatorWithdraw(username: string, amount: string, privKeyHex: string, seq: number) {
    const msg: ValidatorWithdrawMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ValidatorWithdrawMsgType, privKeyHex, seq);
  }

  ValidatorRevoke(username: string, privKeyHex: string, seq: number) {
    const msg: ValidatorRevokeMsg = {
      username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ValidatorRevokeMsgType, privKeyHex, seq);
  }

  // vote related
  vote(voter: string, proposal_id: string, result: boolean, privKeyHex: string, seq: number) {
    const msg: VoteMsg = {
      voter,
      proposal_id,
      result
    };
    return this._broadcastTransaction(msg, _MSGTYPE.VoteMsgType, privKeyHex, seq);
  }

  voterDeposit(username: string, deposit: string, privKeyHex: string, seq: number) {
    const msg: VoterDepositMsg = {
      username,
      deposit
    };
    return this._broadcastTransaction(msg, _MSGTYPE.VoterDepositMsgType, privKeyHex, seq);
  }

  voterWithdraw(username: string, amount: string, privKeyHex: string, seq: number) {
    const msg: VoterWithdrawMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(msg, _MSGTYPE.VoterWithdrawMsgType, privKeyHex, seq);
  }

  voterRevoke(username: string, privKeyHex: string, seq: number) {
    const msg: VoterRevokeMsg = {
      username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.VoterRevokeMsgType, privKeyHex, seq);
  }

  delegate(delegator: string, voter: string, amount: string, privKeyHex: string, seq: number) {
    const msg: DelegateMsg = {
      delegator,
      voter,
      amount
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DelegateMsgType, privKeyHex, seq);
  }

  delegatorWithdraw(
    delegator: string,
    voter: string,
    amount: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: DelegatorWithdrawMsg = {
      delegator,
      voter,
      amount
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DelegatorWithdrawMsgType, privKeyHex, seq);
  }

  revokeDelegation(delegator: string, voter: string, privKeyHex: string, seq: number) {
    const msg: RevokeDelegationMsg = {
      delegator,
      voter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.RevokeDelegationMsgType, privKeyHex, seq);
  }

  // developer related
  developerRegister(username: string, deposit: string, privKeyHex: string, seq: number) {
    const msg: DeveloperRegisterMsg = {
      username,
      deposit
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DeveloperRegisterMsgType, privKeyHex, seq);
  }

  developerRevoke(username: string, privKeyHex: string, seq: number) {
    const msg: DeveloperRevokeMsg = {
      username
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DeveloperRevokeMsgType, privKeyHex, seq);
  }

  grantDeveloper(
    username: string,
    authenticate_app: string,
    validity_period: number,
    grant_level: number,
    privKeyHex: string,
    seq: number
  ) {
    const msg: GrantDeveloperMsg = {
      username,
      authenticate_app,
      validity_period,
      grant_level
    };

    return this._broadcastTransaction(msg, _MSGTYPE.GrantDeveloperMsgType, privKeyHex, seq);
  }

  // infra related
  providerReport(username: string, usage: number, privKeyHex: string, seq: number) {
    const msg: ProviderReportMsg = {
      username,
      usage
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ProviderReportMsgType, privKeyHex, seq);
  }

  // proposal related
  changeGlobalAllocationParam(
    creator: string,
    parameter: Types.GlobalAllocationParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeGlobalAllocationParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.ChangeGlobalAllocationParamMsgType,
      privKeyHex,
      seq
    );
  }

  changeEvaluateOfContentValueParam(
    creator: string,
    parameter: Types.EvaluateOfContentValueParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeEvaluateOfContentValueParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.ChangeEvaluateOfContentValueParamMsgType,
      privKeyHex,
      seq
    );
  }

  changeInfraInternalAllocationParam(
    creator: string,
    parameter: Types.InfraInternalAllocationParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeInfraInternalAllocationParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.ChangeInfraInternalAllocationParamMsgType,
      privKeyHex,
      seq
    );
  }

  changeVoteParam(creator: string, parameter: Types.VoteParam, privKeyHex: string, seq: number) {
    const msg: ChangeVoteParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeVoteParamMsgType, privKeyHex, seq);
  }

  changeProposalParam(
    creator: string,
    parameter: Types.ProposalParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeProposalParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeProposalParamMsgType, privKeyHex, seq);
  }

  changeDeveloperParam(
    creator: string,
    parameter: Types.DeveloperParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeDeveloperParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeDeveloperParamMsgType, privKeyHex, seq);
  }

  changeValidatorParam(
    creator: string,
    parameter: Types.ValidatorParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeValidatorParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeValidatorParamMsgType, privKeyHex, seq);
  }

  changeCoinDayParam(
    creator: string,
    parameter: Types.CoinDayParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeCoinDayParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeCoinDayParamMsgType, privKeyHex, seq);
  }

  changeBandwidthParam(
    creator: string,
    parameter: Types.BandwidthParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeBandwidthParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeBandwidthParamMsgType, privKeyHex, seq);
  }

  changeAccountParam(
    creator: string,
    parameter: Types.AccountParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeAccountParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeAccountParamMsgType, privKeyHex, seq);
  }

  deletePostContent(creator: string, permLink: string, privKeyHex: string, seq: number) {
    const msg: DeletePostContentMsg = {
      creator,
      permLink
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DeletePostContentMsgType, privKeyHex, seq);
  }
  _broadcastTransaction(
    msg: any,
    msgType: string,
    privKeyHex: string,
    seq: number
  ): Promise<ResultBroadcastTxCommit> {
    return this._transport.signBuildBroadcast(msg, msgType, privKeyHex, seq);
  }
}

// Account related messages
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

export interface UpdateAccountMsg {
  username: string;
  json_meta: string;
}

// post related messages
export interface CreatePostMsg {
  PostCreateParams;
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

// validator related messages
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

// vote related messages
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

// developer related messages
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

// infra related messages
export interface ProviderReportMsg {
  username: string;
  usage: number;
}

// proposal related messages
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

const _MSGTYPE = {
  RegisterMsgType: '87780FA5DE6848',
  TransferMsgType: '27F576CAFBB260',
  FollowMsgType: 'A3CE0B6106CDB0',
  UnfollowMsgType: '84F010638F0200',
  ClaimMsgType: 'DD1B3C312CF7D8',
  RecoverMsgType: 'EC3915F542E0F8',
  UpdateAccountMsgType: '688B831F24C188',

  CreatePostMsgType: '72231043BC1800',
  LikeMsgType: 'CAB2644828BCC0',
  DonateMsgType: '9B3E2278234D08',
  ReportOrUpvoteMsgType: '768472FB2FC620',
  DeletePostMsgType: '3479D4D590AC68',
  ViewMsgType: '2BCB43CBC8F6B0',
  UpdatePostMsgType: 'CD493C6F19B7B0',

  ValidatorDepositMsgType: '917127FC7429D8',
  ValidatorWithdrawMsgType: '32E51EDD228920',
  ValidatorRevokeMsgType: '0E2B2E4A3441E0',

  VoteMsgType: 'AB274474A6AA80',
  VoterDepositMsgType: '9E6F93EDF45140',
  VoterWithdrawMsgType: '68E1FB898955A0',
  VoterRevokeMsgType: 'D8C93E26BD1E58',
  DelegateMsgType: '6F216E33C5CF98',
  DelegatorWithdrawMsgType: 'A77E9D3A6EA3D8',
  RevokeDelegationMsgType: 'C4D544FE5C83B0',

  DeveloperRegisterMsgType: '4A2EC4E5253D78',
  DeveloperRevokeMsgType: '94C5F456C3BAF8',
  GrantDeveloperMsgType: '1CF286AA038278',

  ProviderReportMsgType: '108D925A05BE70',

  DeletePostContentMsgType: '7E63F5F154D2C8',
  ChangeGlobalAllocationParamMsgType: 'A9F46C097B5F50',
  ChangeEvaluateOfContentValueParamMsgType: '8A59091B1DCEF0',
  ChangeInfraInternalAllocationParamMsgType: 'D7296C8C03B1C8',
  ChangeVoteParamMsgType: 'DE608FB7F2ACF8',
  ChangeProposalParamMsgType: '4293B70D3658F0',
  ChangeDeveloperParamMsgType: 'E9222357A97CE0',
  ChangeValidatorParamMsgType: '2E975DC3A10710',
  ChangeCoinDayParamMsgType: 'FDFDD1B911C0F0',
  ChangeBandwidthParamMsgType: '6425F4408B8C48',
  ChangeAccountParamMsgType: '1FED1384B17F40'
};
