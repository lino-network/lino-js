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
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(sender, false, '')),
      function(seqs) {
        return that._broadcast.makeTransferMsg(sender, receiver, amount, memo, privKeyHex, seqs[0]);
      }
    );
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
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeDonate(
          username,
          author,
          amount,
          post_id,
          from_app,
          memo,
          privKeyHex,
          seqs[0]
        );
      }
    );
  }

  async register(
    referrer: string,
    registerFee: string,
    username: string,
    resetPubKey: string,
    transactionPubKeyHex: string,
    appPubKeyHex: string,
    referrerPrivKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(referrer, false, '')),
      function(seqs) {
        return that._broadcast.makeRegister(
          referrer,
          registerFee,
          username,
          resetPubKey,
          transactionPubKeyHex,
          appPubKeyHex,
          referrerPrivKeyHex,
          seqs[0]
        );
      }
    );
  }

  async claimInterest(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeClaimInterest(username, privKeyHex, seqs[0]);
      }
    );
  }

  async updateAccountMeta(
    username: string,
    json_meta: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeUpdateAccount(username, json_meta, privKeyHex, seqs[0]);
      }
    );
  }

  async createPost(
    author: string,
    postID: string,
    title: string,
    content: string,
    createdBy: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(author, false, '')),
      function(seqs) {
        return that._broadcast.makePost(
          author,
          postID,
          title,
          content,
          createdBy,
          privKeyHex,
          seqs[0]
        );
      }
    );
  }

  async deletePost(
    author: string,
    post_id: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(author, false, '')),
      function(seqs) {
        return that._broadcast.makeDeletePost(author, post_id, privKeyHex, seqs[0]);
      }
    );
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
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(author, false, '')),
      function(seqs) {
        return that._broadcast.makeUpdatePost(
          author,
          title,
          post_id,
          content,
          links,
          privKeyHex,
          seqs[0]
        );
      }
    );
  }

  async validatorRegister(
    username: string,
    validator_public_key: string,
    link: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeValidatorRegister(
          username,
          validator_public_key,
          link,
          privKeyHex,
          seqs[0]
        );
      }
    );
  }

  async voteValidator(
    username: string,
    validators: string[],
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeVoteValidator(username, validators, privKeyHex, seqs[0]);
      }
    );
  }

  async validatorRevoke(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeValidatorRevoke(username, privKeyHex, seqs[0]);
      }
    );
  }

  async stakeIn(
    username: string,
    deposit: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeStakeIn(username, deposit, privKeyHex, seqs[0]);
      }
    );
  }

  async stakeOut(
    username: string,
    amount: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeStakeOut(username, amount, privKeyHex, seqs[0]);
      }
    );
  }

  async developerRegister(
    username: string,
    website: string,
    description: string,
    app_meta_data: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeDeveloperRegister(
          username,
          website,
          description,
          app_meta_data,
          privKeyHex,
          seqs[0]
        );
      }
    );
  }

  async developerUpdate(
    username: string,
    website: string,
    description: string,
    app_meta_data: string,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeDeveloperUpdate(
          username,
          website,
          description,
          app_meta_data,
          privKeyHex,
          seqs[0]
        );
      }
    );
  }

  async developerRevoke(username: string, privKeyHex: string): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeDeveloperRevoke(username, privKeyHex, seqs[0]);
      }
    );
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
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeGrantPermission(
          username,
          authorized_app,
          validity_period_second,
          grant_level,
          amount,
          privKeyHex,
          seqs[0]
        );
      }
    );
  }

  async revokePermission(
    username: string,
    appName: string,
    permission: Types.PERMISSION_TYPE,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeRevokePermission(
          username,
          appName,
          permission,
          privKeyHex,
          seqs[0]
        );
      }
    );
  }

  async providerReport(
    username: string,
    usage: number,
    privKeyHex: string
  ): Promise<ResultBroadcastTxCommit> {
    var that = this;
    return this._guaranteeBroadcast(
      new Array<Types.AccOrAddr>(new Types.AccOrAddr(username, false, '')),
      function(seqs) {
        return that._broadcast.makeProviderReport(username, usage, privKeyHex, seqs[0]);
      }
    );
  }

  // Does the private key decoding from hex, sign message,
  // build transaction to broadcast
  async _guaranteeBroadcast(
    signers: Types.AccOrAddr[],
    makeTxFunc: Function
  ): Promise<ResultBroadcastTxCommit> {
    var lastHash = '';
    for (let i = 0; i < this._maxAttempts; i++) {
      var res = await this._safeBroadcastAndWatch(signers, lastHash, makeTxFunc);
      if (res[0] === null) {
        lastHash = res[1];
      } else {
        return res[0] as ResultBroadcastTxCommit;
      }
    }
    throw new BroadcastError(BroadCastErrorEnum.CheckTx, 'transaction timeout', -1);
  }

  async _safeBroadcastAndWatch(
    signers: Types.AccOrAddr[],
    lasthash: string,
    f: Function
  ): Promise<[ResultBroadcastTxCommit | null, string]> {
    var seqs: number[] = [];
    if (lasthash === '') {
      for (let i = 0; i < signers.length; i++) {
        if (!signers[i].isAddr) {
          var seq = await this._query.getSeqNumber(signers[i].username);
          seqs.push(seq);
        }
      }
    } else {
      for (let i = 0; i < signers.length; i++) {
        if (!signers[i].isAddr) {
          var txSeq = await this._query.getTxAndSequence(signers[i].username, lasthash);
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
          seqs.push(txSeq.sequence);
        }
      }
    }
    var tx = f(seqs);
    const hashResult = shajs('sha256')
      .update(ByteBuffer.atob(tx))
      .digest() as string;
    const txHash = utils.encode(hashResult, 'hex').toUpperCase();
    var res: ResultBroadcastTx;
    try {
      res = await this._broadcast.broadcastRawMsgBytesSync(tx);
    } catch (err) {
      if (err.data && err.data.indexOf('Tx already exists in cache') >= 0) {
        // do nothing
      } else if (err.code && err.message) {
        if (err.code === 155) {
          var seqstr = err.message.substring(err.message.indexOf('seq:') + 4);
          var correctSeq = Number(seqstr.substring(0, seqstr.indexOf('"')));
          if (correctSeq === seqs[0]) {
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

      var txSeq = await this._query.getTxAndSequence(signers[0].username, txHash);
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
