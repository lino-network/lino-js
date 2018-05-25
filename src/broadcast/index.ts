import { ITransport } from '../transport';

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

  savingToChecking(username: string, amount: string, privKeyHex: string) {
    const msg: SavingToCheckingMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.SavingToCheckingMsgType,
      privKeyHex
    );
  }

  checkingToSaving(username: string, amount: string, privKeyHex: string) {
    const msg: CheckingToSavingMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(
      msg,
      _MSGTYPE.CheckingToSavingMsgType,
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

  private _broadcastTransaction(msg: any, msgType: string, privKeyHex: string) {
    // SignBuildBroadcast
    return this._transport.signBuildBroadcast(msg, msgType, privKeyHex, 3);
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

export interface SavingToCheckingMsg {
  username: string;
  amount: string;
}

export interface CheckingToSavingMsg {
  username: string;
  amount: string;
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

const _MSGTYPE = {
  RegisterMsgType: '9E6F93EDF45140',
  TransferMsgType: '9E6F93EDF45140',
  FollowMsgType: '9E6F93EDF45140',
  UnfollowMsgType: '9E6F93EDF45140',
  ClaimMsgType: '9E6F93EDF45140',
  RecoverMsgType: '9E6F93EDF45140',
  SavingToCheckingMsgType: '9E6F93EDF45140',
  CheckingToSavingMsgType: '9E6F93EDF45140',

  ValidatorDepositMsgType: '9E6F93EDF45140',
  ValidatorWithdrawMsgType: '9E6F93EDF45140',
  ValidatorRevokeMsgType: '9E6F93EDF45140',

  VoterDepositMsgType: '9E6F93EDF45140'
};
