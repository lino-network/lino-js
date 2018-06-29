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
    transactionPubKeyHex: string,
    micropaymentPubKeyHex: string,
    postPubKeyHex: string,
    referrerPrivKeyHex: string,
    seq: number
  ) {
    const msg: RegisterMsg = {
      referrer: referrer,
      register_fee: register_fee,
      new_username: username,
      new_master_public_key: decodePubKey(masterPubKeyHex),
      new_transaction_public_key: decodePubKey(transactionPubKeyHex),
      new_micropayment_public_key: decodePubKey(micropaymentPubKeyHex),
      new_post_public_key: decodePubKey(postPubKeyHex)
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

  recover(
    username: string,
    new_master_public_key: string,
    new_transaction_public_key: string,
    new_micropayment_public_key: string,
    new_post_public_key: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: RecoverMsg = {
      username,
      new_master_public_key,
      new_transaction_public_key,
      new_micropayment_public_key,
      new_post_public_key
    };
    return this._broadcastTransaction(msg, _MSGTYPE.RecoverMsgType, privKeyHex, seq);
  }

  // post related
  createPost(
    author: string,
    postID: string,
    title: string,
    content: string,
    parentAuthor: string,
    parentPostID: string,
    sourceAuthor: string,
    sourcePostID: string,
    redistributionSplitRate: string,
    links: Map<string, string>,
    privKeyHex: string,
    seq: number
  ) {
    let mLinks: Types.IDToURLMapping[] | null = null;
    if (links != null) {
      mLinks = [];
      for (let entry of links.entries()) {
        const mapping: Types.IDToURLMapping = {
          identifier: entry[0],
          url: entry[1]
        };
        mLinks.push(mapping);
      }
    }

    const msg: CreatePostMsg = {
      author: author,
      post_id: postID,
      title: title,
      content: content,
      parent_author: parentAuthor,
      parent_postID: parentPostID,
      source_author: sourceAuthor,
      source_postID: sourcePostID,
      links: mLinks,
      redistribution_split_rate: redistributionSplitRate
    };

    return this._broadcastTransaction(msg, _MSGTYPE.CreatePostMsgType, privKeyHex, seq);
  }

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
    memo: string,
    is_micropayment: boolean,
    privKeyHex: string,
    seq: number
  ) {
    const msg: DonateMsg = {
      username,
      amount,
      author,
      post_id,
      from_app,
      memo,
      is_micropayment
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
    links: Map<string, string>,
    privKeyHex: string,
    seq: number
  ) {
    let mLinks: Types.IDToURLMapping[] | null = null;
    if (links != null) {
      mLinks = [];
      for (let entry of links.entries()) {
        const mapping: Types.IDToURLMapping = {
          identifier: entry[0],
          url: entry[1]
        };
        mLinks.push(mapping);
      }
    }

    const msg: UpdatePostMsg = {
      author: author,
      post_id: post_id,
      title: title,
      content: content,
      links: mLinks,
      redistribution_split_rate: redistribution_split_rate
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

  grantPermission(
    username: string,
    authenticate_app: string,
    validity_period: number,
    grant_level: number,
    times: number,
    privKeyHex: string,
    seq: number
  ) {
    const msg: GrantPermissionMsg = {
      username,
      authenticate_app,
      validity_period,
      grant_level,
      times
    };

    return this._broadcastTransaction(msg, _MSGTYPE.GrantPermissionMsg, privKeyHex, seq);
  }

  revokePermission(
    username: string,
    public_key: string,
    grant_level: number,
    privKeyHex: string,
    seq: number
  ) {
    const msg: RevokePermissionMsg = {
      username: username,
      public_key: decodePubKey(public_key),
      grant_level: grant_level
    };

    return this._broadcastTransaction(msg, _MSGTYPE.RevokePermissionMsg, privKeyHex, seq);
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
  voteProposal(
    voter: string,
    proposal_id: string,
    result: boolean,
    privKeyHex: string,
    seq: number
  ) {
    const msg: VoteProposalMsg = {
      voter,
      proposal_id,
      result
    };
    return this._broadcastTransaction(msg, _MSGTYPE.VoteProposalMsgType, privKeyHex, seq);
  }

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

  changePostParam(
    creator: string,
    parameter: Types.PostParam,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangePostParamMsg = {
      creator,
      parameter
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangePostParamMsgType, privKeyHex, seq);
  }

  deletePostContent(
    creator: string,
    postAuthor: string,
    postID: string,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const permlink = postAuthor.concat('#').concat(postID);
    const msg: DeletePostContentMsg = {
      creator,
      permlink,
      reason
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DeletePostContentMsgType, privKeyHex, seq);
  }

  upgradeProtocol(creator: string, link: string, privKeyHex: string, seq: number) {
    const msg: UpgradeProtocolMsg = {
      creator,
      link
    };

    return this._broadcastTransaction(msg, _MSGTYPE.UpgradeProtocolMsgType, privKeyHex, seq);
  }
  _broadcastTransaction(
    msg: object,
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
  new_transaction_public_key: string;
  new_micropayment_public_key: string;
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
  new_transaction_public_key: string;
  new_micropayment_public_key: string;
  new_post_public_key: string;
}

export interface UpdateAccountMsg {
  username: string;
  json_meta: string;
}

// post related messages
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
  is_micropayment: boolean;
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

export interface GrantPermissionMsg {
  username: string;
  authenticate_app: string;
  validity_period: number;
  grant_level: number;
  times: number;
}

export interface RevokePermissionMsg {
  username: string;
  public_key: string;
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
  permlink: string;
  reason: string;
}

export interface VoteProposalMsg {
  voter: string;
  proposal_id: string;
  result: boolean;
}

export interface UpgradeProtocolMsg {
  creator: string;
  link: string;
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

export interface ChangePostParamMsg {
  creator: string;
  parameter: Types.PostParam;
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

  VoterDepositMsgType: '9E6F93EDF45140',
  VoterWithdrawMsgType: '68E1FB898955A0',
  VoterRevokeMsgType: 'D8C93E26BD1E58',
  DelegateMsgType: '6F216E33C5CF98',
  DelegatorWithdrawMsgType: 'A77E9D3A6EA3D8',
  RevokeDelegationMsgType: 'C4D544FE5C83B0',

  DeveloperRegisterMsgType: '4A2EC4E5253D78',
  DeveloperRevokeMsgType: '94C5F456C3BAF8',
  GrantPermissionMsg: '1CF286AA038278',  // this might not be correct
  RevokePermissionMsg: '',

  ProviderReportMsgType: '108D925A05BE70',

  VoteProposalMsgType: '3126D3663EE938',
  DeletePostContentMsgType: '7E63F5F154D2C8',
  UpgradeProtocolMsgType: '862664E4E9F8A0',
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
  ChangePostParamMsgType: '',
};
