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
    return this._broadcastTransaction(msg, masterPrivKeyHex);
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
    return this._broadcastTransaction(msg, privKeyHex);
  }

  follow(follower: string, followee: string, privKeyHex: string) {
    const msg: FollowMsg = {
      follower,
      followee
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  unfollow(follower: string, followee: string, privKeyHex: string) {
    const msg: UnfollowMsg = {
      follower,
      followee
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  claim(username: string, privKeyHex: string) {
    const msg: ClaimMsg = {
      username
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  savingToChecking(username: string, amount: string, privKeyHex: string) {
    const msg: SavingToCheckingMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  checkingToSaving(username: string, amount: string, privKeyHex: string) {
    const msg: CheckingToSavingMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  // validator related
  validatorDeposit(username: string, deposit: string, privKeyHex: string) {
    const msg: ValidatorDepositMsg = {
      username,
      deposit,
      validator_public_key: privKeyHex
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  validatorWithdraw(username: string, amount: string, privKeyHex: string) {
    const msg: ValidatorWithdrawMsg = {
      username,
      amount
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  ValidatorRevoke(username: string, privKeyHex: string) {
    const msg: ValidatorRevokeMsg = {
      username
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  // vote related
  voterDeposit(username: string, deposit: string, privKeyHex: string) {
    const msg: VoterDepositMsg = {
      username,
      deposit
    };
    return this._broadcastTransaction(msg, privKeyHex);
  }

  private _broadcastTransaction(msg: any, privKeyHex: string) {
    // SignBuildBroadcast
    return this._transport.signBuildBroadcast(msg, privKeyHex, 0);
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
