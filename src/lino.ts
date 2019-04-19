import * as Types from './common';
import Broadcast from './broadcast';
import ByteBuffer from 'bytebuffer';
import Query from './query';
import {
  BroadcastError,
  BroadCastErrorEnum,
  ITransport,
  ITransportOptions,
  Transport
} from './transport';
import { ResultBroadcastTx, ResultBroadcastTxCommit } from './transport/rpc';
import shajs from 'sha.js';
import utils from 'minimalistic-crypto-utils';

export class LINO {
  private _options: ITransportOptions;
  private _transport: ITransport;
  private _query: Query;
  private _broadcast: Broadcast;
  private _timeout: number;
  private _maxAttempts: number;
  private _txConfirmInterval: number;
  private _txConfirmMaxAttempts: number;

  constructor(opt: ITransportOptions) {
    this._options = opt;
    this._transport = new Transport(opt);
    this._query = new Query(this._transport);
    this._broadcast = new Broadcast(this._transport);
    this._timeout = opt.timeout || 3000;
    this._maxAttempts = opt.maxAttempts || 5;
    this._txConfirmInterval = opt.txConfirmInterval || 1000;
    this._txConfirmMaxAttempts = opt.txConfirmMaxAttempts || 5;
  }

  get query(): Query {
    return this._query;
  }

  get broadcast(): Broadcast {
    return this._broadcast;
  }

  async transfer(
    sender: string,
    receiver: string,
    amount: string,
    memo: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(sender, function(seq) {
      return that._broadcast.makeTransferMsg(sender, receiver, amount, memo, privKeyHex, seq);
    });
  }

  async donate(
    username: string,
    author: string,
    amount: string,
    post_id: string,
    from_app: string,
    memo: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeDonate(
        username,
        author,
        amount,
        post_id,
        from_app,
        memo,
        privKeyHex,
        seq
      );
    });
  }

  async register(
    referrer: string,
    register_fee: string,
    username: string,
    resetPubKey: string,
    transactionPubKeyHex: string,
    appPubKeyHex: string,
    referrerPrivKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(referrer, function(seq) {
      return that._broadcast.makeRegister(
        referrer,
        register_fee,
        username,
        resetPubKey,
        transactionPubKeyHex,
        appPubKeyHex,
        referrerPrivKeyHex,
        seq
      );
    });
  }

  async claimContentBonus(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeClaim(username, privKeyHex, seq);
    });
  }

  async claimInterest(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeClaimInterest(username, privKeyHex, seq);
    });
  }

  async updateAccountMeta(
    username: string,
    json_meta: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeUpdateAccount(username, json_meta, privKeyHex, seq);
    });
  }

  async recover(
    username: string,
    new_reset_public_key: string,
    new_transaction_public_key: string,
    new_app_public_key: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeRecover(
        username,
        new_reset_public_key,
        new_transaction_public_key,
        new_app_public_key,
        privKeyHex,
        seq
      );
    });
  }

  async createPost(
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
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(author, function(seq) {
      return that._broadcast.makePost(
        author,
        postID,
        title,
        content,
        parentAuthor,
        parentPostID,
        sourceAuthor,
        sourcePostID,
        redistributionSplitRate,
        links,
        privKeyHex,
        seq
      );
    });
  }

  async reportOrUpvote(
    username: string,
    author: string,
    post_id: string,
    is_report: boolean,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeReportOrUpvote(
        username,
        author,
        post_id,
        is_report,
        privKeyHex,
        seq
      );
    });
  }

  async deletePost(
    author: string,
    post_id: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(author, function(seq) {
      return that._broadcast.makeDeletePost(author, post_id, privKeyHex, seq);
    });
  }

  async view(
    username: string,
    author: string,
    post_id: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeView(username, author, post_id, privKeyHex, seq);
    });
  }

  async updatePost(
    author: string,
    title: string,
    post_id: string,
    content: string,
    links: Map<string, string>,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(author, function(seq) {
      return that._broadcast.makeUpdatePost(
        author,
        title,
        post_id,
        content,
        links,
        privKeyHex,
        seq
      );
    });
  }

  async validatorDeposit(
    username: string,
    deposit: string,
    validator_public_key: string,
    link: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeValidatorDeposit(
        username,
        deposit,
        validator_public_key,
        link,
        privKeyHex,
        seq
      );
    });
  }

  async validatorWithdraw(
    username: string,
    amount: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeValidatorWithdraw(username, amount, privKeyHex, seq);
    });
  }

  async validatorRevoke(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeValidatorRevoke(username, privKeyHex, seq);
    });
  }

  async stakeIn(
    username: string,
    deposit: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeStakeIn(username, deposit, privKeyHex, seq);
    });
  }

  async stakeOut(
    username: string,
    amount: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeStakeOut(username, amount, privKeyHex, seq);
    });
  }

  async delegate(
    delegator: string,
    voter: string,
    amount: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(delegator, function(seq) {
      return that._broadcast.makeDelegate(delegator, voter, amount, privKeyHex, seq);
    });
  }

  async delegatorWithdraw(
    delegator: string,
    voter: string,
    amount: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(delegator, function(seq) {
      return that._broadcast.makeDelegatorWithdraw(delegator, voter, amount, privKeyHex, seq);
    });
  }

  async developerRegister(
    username: string,
    deposit: string,
    website: string,
    description: string,
    app_meta_data: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeDeveloperRegister(
        username,
        deposit,
        website,
        description,
        app_meta_data,
        privKeyHex,
        seq
      );
    });
  }

  async developerUpdate(
    username: string,
    website: string,
    description: string,
    app_meta_data: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeDeveloperUpdate(
        username,
        website,
        description,
        app_meta_data,
        privKeyHex,
        seq
      );
    });
  }

  async developerRevoke(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeDeveloperRevoke(username, privKeyHex, seq);
    });
  }

  async grantPermission(
    username: string,
    authorized_app: string,
    validity_period_second: number,
    grant_level: Types.PERMISSION_TYPE,
    amount: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeGrantPermission(
        username,
        authorized_app,
        validity_period_second,
        grant_level,
        amount,
        privKeyHex,
        seq
      );
    });
  }

  async revokePermission(
    username: string,
    appName: string,
    permission: Types.PERMISSION_TYPE,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeRevokePermission(username, appName, permission, privKeyHex, seq);
    });
  }

  async preAuthorizationPermission(
    username: string,
    authorized_app: string,
    validity_period_second: number,
    amount: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makePreAuthorizationPermission(
        username,
        authorized_app,
        validity_period_second,
        amount,
        privKeyHex,
        seq
      );
    });
  }

  async providerReport(
    username: string,
    usage: number,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(username, function(seq) {
      return that._broadcast.makeProviderReport(username, usage, privKeyHex, seq);
    });
  }

  async voteProposal(
    voter: string,
    proposal_id: string,
    result: boolean,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(voter, function(seq) {
      return that._broadcast.makeVoteProposal(voter, proposal_id, result, privKeyHex, seq);
    });
  }

  async changeGlobalAllocationParam(
    creator: string,
    parameter: Types.GlobalAllocationParam,
    reason: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(creator, function(seq) {
      return that._broadcast.makeChangeGlobalAllocationParam(
        creator,
        parameter,
        reason,
        privKeyHex,
        seq
      );
    });
  }

  // Does the private key decoding from hex, sign message,
  // build transaction to broadcast
  async _guaranteeBroadcast(
    signer: string,
    makeTxFunc: Function
  ): Promise<ResultBroadcastTxCommit> {
    var lastHash = '';
    for (let i = 0; i < this._maxAttempts; i++) {
      var res = await this._safeBroadcastAndWatch(signer, lastHash, makeTxFunc);
      if (res[0] === null) {
        lastHash = res[1];
      } else {
        return res[0] as ResultBroadcastTxCommit;
      }
    }
    throw new BroadcastError(BroadCastErrorEnum.CheckTx, 'transaction timeout', -1);
  }

  async _safeBroadcastAndWatch(
    username: string,
    lasthash: string,
    f: Function
  ): Promise<[ResultBroadcastTxCommit | null, string]> {
    var seq = 0;
    if (lasthash === '') {
      seq = await this._query.getSeqNumber(username);
    } else {
      var txSeq = await this._query.getTxAndSequence(username, lasthash);
      if (txSeq.tx != null) {
        if (txSeq.tx.code !== 0) {
          throw new BroadcastError(BroadCastErrorEnum.DeliverTx, txSeq.tx.log, txSeq.tx.code);
        }
        var response: ResultBroadcastTxCommit = {
          check_tx: null,
          deliver_tx: null,
          height: txSeq.tx.height,
          hash: txSeq.tx.hash
        };
        return [response, txSeq.tx.hash];
      }
      seq = txSeq.sequence;
    }
    var tx = f(seq);
    const hashResult = shajs('sha256')
      .update(ByteBuffer.atob(tx))
      .digest() as string;
    const txHash = utils.encode(hashResult, 'hex').toUpperCase();
    var res: ResultBroadcastTx;
    try {
      res = await this._broadcast.broadcastRawMsgBytesSync(tx, seq);
    } catch (err) {
      if (err.data && err.data.indexOf('Tx already exists in cache') >= 0) {
        // do nothing
      } else if (err.code && err.message) {
        if (err.code === 155) {
          var seqstr = err.message.substring(err.message.indexOf('seq:') + 4);
          var correctSeq = Number(seqstr.substring(0, seqstr.indexOf('"')));
          if (correctSeq === seq) {
            throw new BroadcastError(BroadCastErrorEnum.CheckTx, err.message, err.code);
          } else {
            return [null, txHash];
          }
        }
        throw new BroadcastError(BroadCastErrorEnum.CheckTx, err.message, err.code);
      } else {
        return [null, ''];
      }
    }

    for (let i = 0; i < this._txConfirmMaxAttempts; i++) {
      await delay(this._txConfirmInterval);

      var txSeq = await this._query.getTxAndSequence(username, txHash);
      if (txSeq.tx != null) {
        if (txSeq.tx.code !== 0) {
          throw new BroadcastError(BroadCastErrorEnum.DeliverTx, txSeq.tx.log, txSeq.tx.code);
        }
        var response: ResultBroadcastTxCommit = {
          check_tx: null,
          deliver_tx: null,
          height: txSeq.tx.height,
          hash: txSeq.tx.hash
        };
        return [response, txHash];
      }
    }
    return [null, txHash];
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
