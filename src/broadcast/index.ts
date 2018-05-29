import { ITransport } from '../transport';
import { ResultBroadcastTxCommit } from '../transport/rpc';

const InvalidSeqErrCode = 3;

export default class Broadcast {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  // account related
  register(
    username: string,
    masterPubKeyHex: string,
    postPubKeyHex: string,
    transactionPubKeyHex: string,
    masterPrivKeyHex: string
  ) {
    const msg: RegisterMsg = {
      new_user: username,
      new_post_public_key: postPubKeyHex,
      new_master_public_key: masterPubKeyHex,
      new_transaction_public_key: transactionPubKeyHex
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.RegisterMsgType,
      masterPrivKeyHex
    );
  }

  transfer(
    sender: string,
    receiver_name: string,
    receiver_addr: string,
    amount: string,
    memo: string,
    privKeyHex: string
  ) {
    const msg: TransferMsg = {
      sender,
      receiver_name,
      receiver_addr,
      amount,
      memo
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.TransferMsgType,
      privKeyHex
    );
  }

  follow(follower: string, followee: string, privKeyHex: string) {
    const msg: FollowMsg = {
      follower,
      followee
    };
    return this._broadcastTransaction(msg, _MSGTYPE.FollowMsgType, privKeyHex);
  }

  unfollow(follower: string, followee: string, privKeyHex: string) {
    const msg: UnfollowMsg = {
      follower,
      followee
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.UnfollowMsgType,
      privKeyHex
    );
  }

  claim(username: string, privKeyHex: string) {
    const msg: ClaimMsg = {
      username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ClaimMsgType, privKeyHex);
  }

  // post related
  like(
    username: string,
    author: string,
    weight: number,
    post_id: string,
    privKeyHex: string
  ) {
    const msg: LikeMsg = {
      username,
      weight,
      author,
      post_id
    };
    return this._broadcastTransaction(msg, _MSGTYPE.LikeMsgType, privKeyHex);
  }

  donate(
    username: string,
    author: string,
    amount: string,
    post_id: string,
    from_app: string,
    from_checking: boolean,
    memo: string,
    privKeyHex: string
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
    return this._broadcastTransaction(msg, _MSGTYPE.DonateMsgType, privKeyHex);
  }

  reportOrUpvote(
    username: string,
    author: string,
    post_id: string,
    is_report: boolean,
    privKeyHex: string
  ) {
    const msg: ReportOrUpvoteMsg = {
      username,
      author,
      post_id,
      is_report
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.ReportOrUpvoteMsgType,
      privKeyHex
    );
  }

  deletePost(author: string, post_id: string, privKeyHex: string) {
    const msg: DeletePostMsg = {
      author,
      post_id
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.DeletePostMsgType,
      privKeyHex
    );
  }

  view(username: string, author: string, post_id: string, privKeyHex: string) {
    const msg: ViewMsg = {
      username,
      author,
      post_id
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ViewMsgType, privKeyHex);
  }

  updatePost(
    author: string,
    title: string,
    post_id: string,
    content: string,
    redistribution_split_rate: string,
    links: IDToURLMapping[],
    privKeyHex: string
  ) {
    const msg: UpdatePostMsg = {
      author,
      post_id,
      title,
      content,
      links,
      redistribution_split_rate
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.UpdatePostMsgType,
      privKeyHex
    );
  }

  // validator related
  validatorDeposit(username: string, deposit: string, privKeyHex: string) {
    const msg: ValidatorDepositMsg = {
      username,
      deposit,
      validator_public_key: privKeyHex
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.ValidatorDepositMsgType,
      privKeyHex
    );
  }

  validatorWithdraw(username: string, amount: string, privKeyHex: string) {
    const msg: ValidatorWithdrawMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.ValidatorWithdrawMsgType,
      privKeyHex
    );
  }

  ValidatorRevoke(username: string, privKeyHex: string) {
    const msg: ValidatorRevokeMsg = {
      username
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.ValidatorRevokeMsgType,
      privKeyHex
    );
  }

  // vote related
  vote(
    voter: string,
    proposal_id: string,
    result: boolean,
    privKeyHex: string
  ) {
    const msg: VoteMsg = {
      voter,
      proposal_id,
      result
    };
    return this._broadcastTransaction(msg, _MSGTYPE.VoteMsgType, privKeyHex);
  }

  voterDeposit(username: string, deposit: string, privKeyHex: string) {
    const msg: VoterDepositMsg = {
      username,
      deposit
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.VoterDepositMsgType,
      privKeyHex
    );
  }

  voterWithdraw(username: string, amount: string, privKeyHex: string) {
    const msg: VoterWithdrawMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.VoterWithdrawMsgType,
      privKeyHex
    );
  }

  voterRevoke(username: string, privKeyHex: string) {
    const msg: VoterRevokeMsg = {
      username
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.VoterRevokeMsgType,
      privKeyHex
    );
  }

  delegate(
    delegator: string,
    voter: string,
    amount: string,
    privKeyHex: string
  ) {
    const msg: DelegateMsg = {
      delegator,
      voter,
      amount
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.DelegateMsgType,
      privKeyHex
    );
  }

  delegatorWithdraw(
    delegator: string,
    voter: string,
    amount: string,
    privKeyHex: string
  ) {
    const msg: DelegatorWithdrawMsg = {
      delegator,
      voter,
      amount
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.DelegatorWithdrawMsgType,
      privKeyHex
    );
  }

  revokeDelegation(delegator: string, voter: string, privKeyHex: string) {
    const msg: RevokeDelegationMsg = {
      delegator,
      voter
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.RevokeDelegationMsgType,
      privKeyHex
    );
  }

  developerRegister(username: string, deposit: string, privKeyHex: string) {
    const msg: DeveloperRegisterMsg = {
      username,
      deposit
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.DeveloperRegisterMsgType,
      privKeyHex
    );
  }

  developerRevoke(username: string, privKeyHex: string) {
    const msg: DeveloperRevokeMsg = {
      username
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.DeveloperRevokeMsgType,
      privKeyHex
    );
  }

  grantDeveloper(
    username: string,
    authenticate_app: string,
    validity_period: number,
    grant_level: number,
    privKeyHex: string
  ) {
    const msg: GrantDeveloperMsg = {
      username,
      authenticate_app,
      validity_period,
      grant_level
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.GrantDeveloperMsgType,
      privKeyHex
    );
  }

  providerReport(username: string, usage: number, privKeyHex: string) {
    const msg: ProviderReportMsg = {
      username,
      usage
    };

    return this._broadcastTransaction(
      msg,
      _MSGTYPE.ProviderReportMsgType,
      privKeyHex
    );
  }

  private _broadcastTransaction(
    msg: any,
    msgType: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    const reg = /expected (\d+)/;
    return this._transport
      .signBuildBroadcast(msg, msgType, privKeyHex, 0)
      .then(result => {
        if (result.check_tx.code === InvalidSeqErrCode) {
          const match = reg.exec(result.check_tx.log);
          if (!match) throw new Error('Wrong seq number');
          const newSeq = parseInt(match[0].substring(9), 10);
          return this._transport.signBuildBroadcast(
            msg,
            msgType,
            privKeyHex,
            newSeq
          );
        } else {
          return result;
        }
      })
      .then(result => {
        if (result.check_tx.code != null) {
          throw new Error(
            `CheckTx failed! Code: ${result.check_tx.code}\n ${
              result.check_tx.log
            }`
          );
        }
        if (result.deliver_tx.code != null) {
          throw new Error(
            `DeliverTx failed! Code: ${result.deliver_tx.code}\n${
              result.deliver_tx.log
            }`
          );
        }
        return result;
      });
  }
}

// Account related messages
export interface RegisterMsg {
  new_user: string;
  new_master_public_key: string;
  new_post_public_key: string;
  new_transaction_public_key: string;
}

export interface TransferMsg {
  sender: string;
  receiver_name: string;
  receiver_addr: string;
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
  links: IDToURLMapping[];
  redistribution_split_rate: string;
}

export interface IDToURLMapping {
  identifier: string;
  url: string;
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
  links: IDToURLMapping[];
  redistribution_split_rate: string;
}

// validator related messages
export interface ValidatorDepositMsg {
  username: string;
  deposit: string;
  validator_public_key: string;
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

const _MSGTYPE = {
  RegisterMsgType: '87780FA5DE6848',
  TransferMsgType: '27F576CAFBB260',
  FollowMsgType: 'A3CE0B6106CDB0',
  UnfollowMsgType: '84F010638F0200',
  ClaimMsgType: 'DD1B3C312CF7D8',
  RecoverMsgType: 'EC3915F542E0F8',

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

  ProviderReportMsgType: '108D925A05BE70'
};
