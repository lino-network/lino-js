import * as Types from '../common';
import { ITransport } from '../transport';
import { encodeObject, decodePubKey, encodeAddr } from '../transport/encoder';
import { ResultBroadcastTx, ResultBroadcastTxCommit } from '../transport/rpc';

const InvalidSeqErrCode = 3;

export default class Broadcast {
  private _transport: ITransport;

  constructor(transport: ITransport) {
    this._transport = transport;
  }

  //account related

  /**
   * Register registers a new user on blockchain.
   * It composes RegisterMsg and then broadcasts the transaction to blockchain.
   *
   * @param referrer: the user who refers the new user
   * @param register_fee: the amount of money used for registering
   * @param username: new username
   * @param resetPubKey: new user's reset key
   * @param transactionPubKeyHex: new user's transaction key
   * @param appPubKeyHex: new user's app key
   * @param referrerPrivKeyHex: referrer's private key
   * @param seq: the sequence number of referrer for the next transaction
   */

  makeRegister(
    referrer: Types.AccOrAddr,
    register_fee: string,
    username: string,
    transactionPubKeyHex: string,
    signingPubKeyHex: string,
    referrerPrivKeyHex: string,
    txPrivKeyHex: string,
    seq1: number,
    seq2: number
  ) {
    var r;
    if (referrer.is_addr) {
      r = new Types.Addr(encodeAddr(referrer.addr));
    } else if (referrer.is_addr == false) {
      r = new Types.Acc(referrer.account_key);
    }

    const msg: RegisterV2Msg = {
      referrer: r,
      register_fee: register_fee,
      new_username: username,
      new_signing_public_key: decodePubKey(signingPubKeyHex),
      new_transaction_public_key: decodePubKey(transactionPubKeyHex)
    };
    return this._transport.signAndBuildWithMultiSig(
      msg,
      _MSGTYPE.RegisterMsgType,
      [referrerPrivKeyHex, txPrivKeyHex],
      [seq1, seq2]
    );
  }

  /**
   * Transfer sends a certain amount of LINO token from the sender to the receiver.
   * It composes TransferMsg and then broadcasts the transaction to blockchain.
   *
   * @param sender: the user who wants to send money
   * @param receiver: the receiver whom the sender sends money to
   * @param amount: the amount LINO token in the transfer
   * @param memo: memos inthe transfer
   * @param privKeyHex: the private key of sender
   * @param seq: the sequence number of sender for the next transaction
   */
  transfer(
    sender: string,
    receiver: string,
    amount: string,
    memo: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: TransferMsg = {
      amount: amount,
      memo: memo,
      receiver: receiver,
      sender: sender
    };
    return this._broadcastTransaction(msg, _MSGTYPE.TransferMsgType, privKeyHex, seq);
  }

  makeTransferMsg(
    sender: string,
    receiver: string,
    amount: string,
    memo: string,
    privKeyHex: string,
    seq: number
  ): string {
    const msg: TransferMsg = {
      amount: amount,
      memo: memo,
      receiver: receiver,
      sender: sender
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.TransferMsgType, privKeyHex, seq);
  }

  /**
   * TransferV2 sends a certain amount of LINO token from the sender to the receiver.
   * It composes TransferMsg and then broadcasts the transaction to blockchain.
   *
   * @param sender: the user who wants to send money
   * @param receiver: the receiver whom the sender sends money to
   * @param amount: the amount LINO token in the transfer
   * @param memo: memos inthe transfer
   * @param privKeyHex: the private key of sender
   * @param seq: the sequence number of sender for the next transaction
   */
  transferV2(
    sender: Types.AccOrAddr,
    receiver: Types.AccOrAddr,
    amount: string,
    memo: string,
    privKeyHex: string,
    seq: number
  ) {
    var s;
    var r;
    if (sender.is_addr) {
      s = new Types.Addr(encodeAddr(sender.addr));
    } else if (sender.is_addr == false) {
      s = new Types.Acc(sender.account_key);
    }

    if (receiver.is_addr) {
      r = new Types.Addr(encodeAddr(receiver.addr));
    } else if (receiver.is_addr == false) {
      r = new Types.Acc(receiver.account_key);
    }

    const msg: TransferV2Msg = {
      amount: amount,
      memo: memo,
      receiver: r,
      sender: s
    };
    return this._broadcastTransaction(msg, _MSGTYPE.TransferV2MsgType, privKeyHex, seq);
  }

  makeTransferV2Msg(
    sender: Types.AccOrAddr,
    receiver: Types.AccOrAddr,
    amount: string,
    memo: string,
    privKeyHex: string,
    seq: number
  ): string {
    var s;
    var r;
    if (sender.is_addr) {
      s = new Types.Addr(encodeAddr(sender.addr));
    } else if (sender.is_addr == false) {
      s = new Types.Acc(sender.account_key);
    }

    if (receiver.is_addr) {
      r = new Types.Addr(encodeAddr(receiver.addr));
    } else if (receiver.is_addr == false) {
      r = new Types.Acc(receiver.account_key);
    }

    const msg: TransferV2Msg = {
      amount: amount,
      memo: memo,
      receiver: r,
      sender: s
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.TransferV2MsgType, privKeyHex, seq);
  }

  /**
   * ClaimInterest claims interest of a certain user.
   * It composes ClaimInterestMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user who wants to claim interest
   * @param privKeyHex: the private key of username
   * @param seq: the sequence number of user for the next transaction
   */
  claimInterest(username: string, privKeyHex: string, seq: number) {
    const msg: ClaimInterestMsg = {
      username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ClaimInterestMsgType, privKeyHex, seq);
  }

  makeClaimInterest(username: string, privKeyHex: string, seq: number) {
    const msg: ClaimInterestMsg = {
      username
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.ClaimInterestMsgType, privKeyHex, seq);
  }

  /**
   * UpdateAccount updates account related info in jsonMeta which are not
   * included in AccountInfo or AccountBank.
   * It composes UpdateAccountMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user who wants to update account meta
   * @param json_meta: the newly updated meta
   * @param privKeyHex: the private key of user
   * @param seq: the sequence number of user for the next transaction
   */
  updateAccount(username: string, json_meta: string, privKeyHex: string, seq: number) {
    const msg: UpdateAccountMsg = {
      json_meta: json_meta,
      username: username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.UpdateAccMsgType, privKeyHex, seq);
  }

  makeUpdateAccount(username: string, json_meta: string, privKeyHex: string, seq: number) {
    const msg: UpdateAccountMsg = {
      json_meta: json_meta,
      username: username
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.UpdateAccMsgType, privKeyHex, seq);
  }

  /**
   * Recover resets all keys of a user in case of losing or compromising.
   * It composes RecoverMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user who wants to recover account
   * @param new_reset_public_key: new reset public key for user
   * @param new_transaction_public_key: new transaction public key for user
   * @param new_app_public_key: new app public key for user
   * @param privKeyHex: the old private key of user
   * @param seq: the sequence number of user for the next transaction
   */
  // recover(
  //   username: string,
  //   new_reset_public_key: string,
  //   new_transaction_public_key: string,
  //   new_app_public_key: string,
  //   privKeyHex: string,
  //   seq: number
  // ) {
  //   const msg: RecoverMsg = {
  //     username: username,
  //     new_reset_public_key: decodePubKey(new_reset_public_key),
  //     new_transaction_public_key: decodePubKey(new_transaction_public_key),
  //     new_app_public_key: decodePubKey(new_app_public_key)
  //   };
  //   return this._broadcastTransaction(msg, _MSGTYPE.RecoverMsgType, privKeyHex, seq);
  // }

  makeRecover(
    username: string,
    new_tx_public_key: string,
    new_signing_public_key: string,
    priv_key_hex: string,
    new_transaction_private_key_hex: string,
    seq1: number,
    seq2: number
  ) {
    const msg: RecoverMsg = {
      username: username,
      new_tx_public_key: decodePubKey(new_tx_public_key),
      new_signing_public_key: decodePubKey(new_signing_public_key)
    };
    var res = this._transport.signAndBuildWithMultiSig(
      msg,
      _MSGTYPE.RecoverMsgType,
      [priv_key_hex, new_transaction_private_key_hex],
      [seq1, seq2]
    );
    return res;
  }

  // post related

  /**
   * CreatePost creates a new post on blockchain.
   * It composes CreatePostMsg and then broadcasts the transaction to blockchain.
   *
   * @param author: the user who creates the new post
   * @param postID: the post id of the new post
   * @param title: the title of the new post
   * @param content: the content of the new post
   * @param createdBy: the content of the new post
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of user for the next transaction
   */
  createPost(
    author: string,
    postID: string,
    title: string,
    content: string,
    createdBy: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: CreatePostMsg = {
      author: author,
      content: content,
      post_id: postID,
      title: title,
      created_by: createdBy,
      preauth: true
    };

    return this._broadcastTransaction(msg, _MSGTYPE.CreatePostMsgType, privKeyHex, seq);
  }

  makePost(
    author: string,
    postID: string,
    title: string,
    content: string,
    createdBy: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: CreatePostMsg = {
      author: author,
      content: content,
      post_id: postID,
      created_by: createdBy,
      title: title,
      preauth: true
    };

    return this._transport.signAndBuild(msg, _MSGTYPE.CreatePostMsgType, privKeyHex, seq);
  }

  /**
   * Donate adds a money donation to a post by a user.
   * It composes DonateMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user who wants to donate to the post
   * @param author: the author of the post
   * @param amount: the amount LINO token that the user wants to donate
   * @param post_id: the id of the post
   * @param from_app: which app that the donation is from
   * @param memo: memo of the donation
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of user for the next transaction
   */
  donate(
    username: string,
    author: string,
    amount: string,
    post_id: string,
    from_app: string,
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
      memo
    };
    return this._broadcastTransaction(msg, _MSGTYPE.DonateMsgType, privKeyHex, seq);
  }

  makeDonate(
    username: string,
    author: string,
    amount: string,
    post_id: string,
    from_app: string,
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
      memo
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.DonateMsgType, privKeyHex, seq);
  }

  /**
   * DeletePost deletes a post from the blockchain. It doesn't actually
   * remove the post from the blockchain, instead it sets IsDeleted to true
   * and clears all the other data.
   * It composes DeletePostMsg and then broadcasts the transaction to blockchain.
   *
   * @param author: the author of the post
   * @param post_id: the id of the post
   * @param privKeyHex: the private key of the author
   * @param seq: the sequence number of the author for the next transaction
   */
  deletePost(author: string, post_id: string, privKeyHex: string, seq: number) {
    const msg: DeletePostMsg = {
      author,
      post_id
    };
    return this._broadcastTransaction(msg, _MSGTYPE.DeletePostMsgType, privKeyHex, seq);
  }

  makeDeletePost(author: string, post_id: string, privKeyHex: string, seq: number) {
    const msg: DeletePostMsg = {
      author,
      post_id
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.DeletePostMsgType, privKeyHex, seq);
  }

  /**
   * UpdatePost updates post info with new data.
   * It composes UpdatePostMsg and then broadcasts the transaction to blockchain.
   *
   * @param author: the author of the post
   * @param title: new titile of the post
   * @param post_id: the id of the post
   * @param content: new content of the post
   * @param links: new links of the post
   * @param privKeyHex: the private key of the author
   * @param seq: the sequence number of the author for the next transaction
   */
  updatePost(
    author: string,
    title: string,
    post_id: string,
    content: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: UpdatePostMsg = {
      author: author,
      content: content,
      post_id: post_id,
      title: title
    };
    return this._broadcastTransaction(msg, _MSGTYPE.UpdatePostMsgType, privKeyHex, seq);
  }

  makeUpdatePost(
    author: string,
    title: string,
    post_id: string,
    content: string,
    links: Map<string, string>,
    privKeyHex: string,
    seq: number
  ) {
    const msg: UpdatePostMsg = {
      author: author,
      content: content,
      post_id: post_id,
      title: title
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.UpdatePostMsgType, privKeyHex, seq);
  }
  // validator related

  /**
   * ValidatorRegister deposits a certain amount of LINO token for a user
   * in order to become a validator. Before becoming a validator, the user
   * has to be a voter.
   * It composes ValidatorRegisterMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user who wants to deposit money for being a validator
   * @param deposit: the amount of LINO token the user wants to deposit
   * @param validator_public_key: the validator public key given by Tendermint
   * @param link: the link of the user
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of the user for the next transaction
   */
  validatorRegister(
    username: string,
    validator_public_key: string,
    link: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ValidatorRegisterMsg = {
      link: link,
      username: username,
      validator_public_key: decodePubKey(validator_public_key)
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ValRegisterMsgType, privKeyHex, seq);
  }

  makeValidatorRegister(
    username: string,
    validator_public_key: string,
    link: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ValidatorRegisterMsg = {
      link: link,
      username: username,
      validator_public_key: decodePubKey(validator_public_key)
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.ValRegisterMsgType, privKeyHex, seq);
  }

  /**
   * voteValidator vote for validators
   * It composes ValidatorDepositMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the validator username
   * @param validators: the voted validators
   * @param privKeyHex: the private key of the validator
   * @param seq: the sequence number of the validator for the next transaction
   */
  voteValidator(username: string, validators: string[], privKeyHex: string, seq: number) {
    const msg: VoteValidatorMsg = {
      voted_validators: validators,
      username: username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.VoteValMsgType, privKeyHex, seq);
  }

  makeVoteValidator(username: string, validators: string[], privKeyHex: string, seq: number) {
    const msg: VoteValidatorMsg = {
      voted_validators: validators,
      username: username
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.VoteValMsgType, privKeyHex, seq);
  }
  /**
   * ValidatorRevoke revokes all deposited LINO token of a validator
   * so that the user will not be a validator anymore.
   * It composes ValidatorRevokeMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the validator username
   * @param privKeyHex: the private key of the validator
   * @param seq: the sequence number of the validator
   */
  validatorRevoke(username: string, privKeyHex: string, seq: number) {
    const msg: ValidatorRevokeMsg = {
      username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ValRevokeMsgType, privKeyHex, seq);
  }

  makeValidatorRevoke(username: string, privKeyHex: string, seq: number) {
    const msg: ValidatorRevokeMsg = {
      username
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.ValRevokeMsgType, privKeyHex, seq);
  }

  // vote related

  /**
   * StakeIn deposits a certain amount of LINO token for a user
   * in order to become a voter.
   * It composes model.StakeInMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user whot wants to deposit money for being a voter
   * @param deposit: the amount of LINO token the user wants to deposit
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of the user for the next transaction
   */
  stakeIn(username: string, deposit: string, privKeyHex: string, seq: number) {
    const msg: StakeInMsg = {
      deposit: deposit,
      username: username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.StakeInMsgType, privKeyHex, seq);
  }

  makeStakeIn(username: string, deposit: string, privKeyHex: string, seq: number) {
    const msg: StakeInMsg = {
      deposit: deposit,
      username: username
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.StakeInMsgType, privKeyHex, seq);
  }
  /**
   * StakeIn deposits a certain amount of LINO token from user to receiver
   * in order to become a voter.
   * It composes model.StakeInMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user whot wants to deposit money for being a voter
   * @param deposit: the amount of LINO token the user wants to deposit
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of the user for the next transaction
   */
  stakeInFor(username: string, receiver: string, deposit: string, privKeyHex: string, seq: number) {
    const msg: StakeInForMsg = {
      deposit: deposit,
      username: username,
      receiver: receiver
    };
    return this._broadcastTransaction(msg, _MSGTYPE.StakeInForMsgType, privKeyHex, seq);
  }

  makeStakeInFor(
    username: string,
    receiver: string,
    deposit: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: StakeInForMsg = {
      deposit: deposit,
      username: username,
      receiver: receiver
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.StakeInMsgType, privKeyHex, seq);
  }

  /**
   * StakeOut withdraws part of LINO token from a voter's deposit,
   * while still keep being a voter.
   * It composes StakeOutMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the voter username
   * @param amount: the amount of LINO token the voter wants to withdraw
   * @param privKeyHex: the private key of the voter
   * @param seq: the sequence number of the voter for the next transaction
   */
  stakeOut(username: string, amount: string, privKeyHex: string, seq: number) {
    const msg: StakeOutMsg = {
      amount: amount,
      username: username
    };
    return this._broadcastTransaction(msg, _MSGTYPE.StakeOutMsgType, privKeyHex, seq);
  }

  makeStakeOut(username: string, amount: string, privKeyHex: string, seq: number) {
    const msg: StakeOutMsg = {
      amount: amount,
      username: username
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.StakeOutMsgType, privKeyHex, seq);
  }

  makeIDAConvertFromLino(
    username: string,
    app: string,
    amount: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: IDAConvertFromLinoMsg = {
      amount: amount,
      username: username,
      app: app
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.IDAConvertFromLinoMsgType, privKeyHex, seq);
  }

  // developer related
  /**
   * DeveloperRegsiter registers a developer with a certain amount of LINO token on blockchain.
   * It composes DeveloperRegisterMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user who wants to become a developer
   * @param website: developer's website
   * @param description: developer's description
   * @param app_meta_data: developer's app meta data
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of the user for the next transaction
   */
  developerRegister(
    username: string,
    website: string,
    description: string,
    app_meta_data: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: DeveloperRegisterMsg = {
      app_meta_data,
      description,
      username,
      website
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DevRegisterMsgType, privKeyHex, seq);
  }

  makeDeveloperRegister(
    username: string,
    website: string,
    description: string,
    app_meta_data: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: DeveloperRegisterMsg = {
      app_meta_data,
      description,
      username,
      website
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.DevRegisterMsgType, privKeyHex, seq);
  }
  /**
   * DeveloperUpdate updates a developer info on blockchain.
   * It composes DeveloperUpdateMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the developer's username
   * @param website: new developer's website
   * @param description: new developer's description
   * @param app_meta_data: new developer's app meta data
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of the user for the next transaction
   */
  developerUpdate(
    username: string,
    website: string,
    description: string,
    app_meta_data: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: DeveloperUpdateMsg = {
      username,
      website,
      description,
      app_meta_data
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DevUpdateMsgType, privKeyHex, seq);
  }

  makeDeveloperUpdate(
    username: string,
    website: string,
    description: string,
    app_meta_data: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: DeveloperUpdateMsg = {
      username,
      website,
      description,
      app_meta_data
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.DevUpdateMsgType, privKeyHex, seq);
  }
  /**
   * DeveloperRevoke reovkes all deposited LINO token of a developer
   * so the user will not be a developer anymore.
   * It composes DeveloperRevokeMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the developer username
   * @param privKeyHex: the private key of the developer
   * @param seq: the sequence number of the developer for the next transaction
   */
  developerRevoke(username: string, privKeyHex: string, seq: number) {
    const msg: DeveloperRevokeMsg = {
      username
    };

    return this._broadcastTransaction(msg, _MSGTYPE.DevRevokeMsgType, privKeyHex, seq);
  }

  makeDeveloperRevoke(username: string, privKeyHex: string, seq: number) {
    const msg: DeveloperRevokeMsg = {
      username
    };

    return this._transport.signAndBuild(msg, _MSGTYPE.DevRevokeMsgType, privKeyHex, seq);
  }
  /**
   * GrantPermission grants a certain (e.g. App) permission to
   * an authorized app with a certain period of time.
   * It composes GrantPermissionMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user who grants the permission
   * @param authorized_app: the authenticated app of the developer
   * @param validity_period_second: how long does this app is valid
   * @param grant_level: the permission level granted
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of the user for the next transaction
   */
  grantPermission(
    username: string,
    authorized_app: string,
    validity_period_second: number,
    grant_level: Types.PERMISSION_TYPE,
    amount: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: GrantPermissionMsg = {
      username,
      authorized_app,
      validity_period_second,
      grant_level,
      amount
    };

    return this._broadcastTransaction(msg, _MSGTYPE.GrantPermissionMsgType, privKeyHex, seq);
  }

  makeGrantPermission(
    username: string,
    authorized_app: string,
    validity_period_second: number,
    grant_level: Types.PERMISSION_TYPE,
    amount: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: GrantPermissionMsg = {
      username,
      authorized_app,
      validity_period_second,
      grant_level,
      amount
    };

    return this._transport.signAndBuild(msg, _MSGTYPE.GrantPermissionMsgType, privKeyHex, seq);
  }
  /**
   * RevokePermission revokes the permission given previously to a app.
   * It composes RevokePermissionMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the user who wants to revoke permission
   * @param public_key: the user's public key that will be revoked
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of the user for the next transaction
   */
  revokePermission(
    username: string,
    appName: string,
    permission: Types.PERMISSION_TYPE,
    privKeyHex: string,
    seq: number
  ) {
    const msg: RevokePermissionMsg = {
      username: username,
      revoke_from: appName,
      permission: permission
    };

    return this._broadcastTransaction(msg, _MSGTYPE.RevokePermissionMsgType, privKeyHex, seq);
  }

  makeRevokePermission(
    username: string,
    appName: string,
    permission: Types.PERMISSION_TYPE,
    privKeyHex: string,
    seq: number
  ) {
    const msg: RevokePermissionMsg = {
      username: username,
      revoke_from: appName,
      permission: permission
    };

    return this._transport.signAndBuild(msg, _MSGTYPE.RevokePermissionMsgType, privKeyHex, seq);
  }

  // infra related

  /**
   * ProviderReport reports infra usage of a infra provider in order to get infra inflation.
   * It composes ProviderReportMsg and then broadcasts the transaction to blockchain.
   *
   * @param username: the username of the infra provider
   * @param usage: the amount of data traffic consumed
   * @param privKeyHex: the private key of the user
   * @param seq: the sequence number of the user for the next transaction
   */
  providerReport(username: string, usage: number, privKeyHex: string, seq: number) {
    const msg: ProviderReportMsg = {
      usage,
      username
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ProviderReportMsgType, privKeyHex, seq);
  }

  makeProviderReport(username: string, usage: number, privKeyHex: string, seq: number) {
    const msg: ProviderReportMsg = {
      usage,
      username
    };

    return this._transport.signAndBuild(msg, _MSGTYPE.ProviderReportMsgType, privKeyHex, seq);
  }

  // proposal related
  /**
   * VoteProposal adds a vote to a certain proposal with agree/disagree.
   * It composes VoteProposalMsg and then broadcasts the transaction to blockchain.
   *
   * @param voter: the voter username
   * @param proposal_id: the proposal id
   * @param result: agree or disagree
   * @param privKeyHex: the private key of the voter
   * @param seq: the sequence number of the voter for the next transaction
   */
  voteProposal(
    voter: string,
    proposal_id: string,
    result: boolean,
    privKeyHex: string,
    seq: number
  ) {
    const msg: VoteProposalMsg = {
      proposal_id,
      result,
      voter
    };
    return this._broadcastTransaction(msg, _MSGTYPE.VoteProposalMsgType, privKeyHex, seq);
  }

  makeVoteProposal(
    voter: string,
    proposal_id: string,
    result: boolean,
    privKeyHex: string,
    seq: number
  ) {
    const msg: VoteProposalMsg = {
      proposal_id,
      result,
      voter
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.VoteProposalMsgType, privKeyHex, seq);
  }
  /**
   * ChangeGlobalAllocationParam changes GlobalAllocationParam with new value.
   * It composes ChangeGlobalAllocationParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the GlobalAllocationParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changeGlobalAllocationParam(
    creator: string,
    parameter: Types.GlobalAllocationParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeGlobalAllocationParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeGlobalAllocationMsgType, privKeyHex, seq);
  }

  makeChangeGlobalAllocationParamMsg(
    creator: string,
    parameter: Types.GlobalAllocationParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeGlobalAllocationParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };
    return this._transport.signAndBuild(
      msg,
      _MSGTYPE.ChangeGlobalAllocationMsgType,
      privKeyHex,
      seq
    );
  }

  /**
   * changeEvaluateOfContentValueParam changes EvaluateOfContentValueParam with new value.
   * It composes ChangeEvaluateOfContentValueParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the EvaluateOfContentValueParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  // changeEvaluateOfContentValueParam(
  //   creator: string,
  //   parameter: Types.EvaluateOfContentValueParam,
  //   reason: string,
  //   privKeyHex: string,
  //   seq: number
  // ) {
  //   const msg: ChangeEvaluateOfContentValueParamMsg = {
  //     creator,
  //     parameter: encodeObject(parameter),
  //     reason
  //   };

  //   return this._broadcastTransaction(msg, _MSGTYPE.ChangeEvaluationMsgType, privKeyHex, seq);
  // }

  /**
   * changeInfraInternalAllocationParam changes InfraInternalAllocationParam with new value.
   * It composes ChangeInfraInternalAllocationParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the InfraInternalAllocationParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changeInfraInternalAllocationParam(
    creator: string,
    parameter: Types.InfraInternalAllocationParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeInfraInternalAllocationParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ChangeInfraAllocationMsgType, privKeyHex, seq);
  }

  makeChangeInfraInternalAllocationParamMsg(
    creator: string,
    parameter: Types.InfraInternalAllocationParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeInfraInternalAllocationParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };
    return this._transport.signAndBuild(
      msg,
      _MSGTYPE.ChangeInfraAllocationMsgType,
      privKeyHex,
      seq
    );
  }

  /**
   * changeVoteParam changes VoteParam with new value.
   * It composes ChangeVoteParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the VoteParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changeVoteParam(
    creator: string,
    parameter: Types.VoteParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeVoteParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };
    return this._broadcastTransaction(msg, _MSGTYPE.ChangeVoteParamMsgType, privKeyHex, seq);
  }

  makeChangeVoteParamMsg(
    creator: string,
    parameter: Types.VoteParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeVoteParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };
    return this._transport.signAndBuild(msg, _MSGTYPE.ChangeVoteParamMsgType, privKeyHex, seq);
  }

  /**
   * changeProposalParam changes ProposalParam with new value.
   * It composes ChangeProposalParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the ProposalParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changeProposalParam(
    creator: string,
    parameter: Types.ProposalParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeProposalParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeProposalParamMsgType, privKeyHex, seq);
  }

  /**
   * changeDeveloperParam changes DeveloperParam with new value.
   * It composes ChangeDeveloperParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the DeveloperParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changeDeveloperParam(
    creator: string,
    parameter: Types.DeveloperParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeDeveloperParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeDeveloperParamMsgType, privKeyHex, seq);
  }

  /**
   * changeValidatorParam changes ValidatorParam with new value.
   * It composes ChangeValidatorParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the ValidatorParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changeValidatorParam(
    creator: string,
    parameter: Types.ValidatorParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeValidatorParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeValidatorParamMsgType, privKeyHex, seq);
  }

  /**
   * changeBandwidthParam changes BandwidthParam with new value.
   * It composes ChangeBandwidthParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the BandwidthParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changeBandwidthParam(
    creator: string,
    parameter: Types.BandwidthParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeBandwidthParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeBandwidthParamMsgType, privKeyHex, seq);
  }

  /**
   * changeAccountParam changes AccountParam with new value.
   * It composes ChangeAccountParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the AccountParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changeAccountParam(
    creator: string,
    parameter: Types.AccountParam,
    reason: string,
    privKeyHex: string,
    seq: number
  ) {
    const msg: ChangeAccountParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangeAccountParamMsgType, privKeyHex, seq);
  }

  /**
   * changePostParam changes PostParam with new value.
   * It composes ChangePostParamMsg and then broadcasts the transaction to blockchain.
   *
   * @param creator: the user who creates the proposal
   * @param parameter: the PostParam
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  changePostParam(
    creator: string,
    parameter: Types.PostParam,
    privKeyHex: string,
    reason: string,
    seq: number
  ) {
    const msg: ChangePostParamMsg = {
      creator,
      parameter: encodeObject(parameter),
      reason
    };

    return this._broadcastTransaction(msg, _MSGTYPE.ChangePostParamMsgType, privKeyHex, seq);
  }

  /**
   * DeletePostContent deletes the content of a post on blockchain, which is used
   * for content censorship.
   * It composes DeletePostContentMsg and then broadcasts the transaction to blockchain.
   * @param creator: the user who creates the proposal
   * @param postAuthor: the author of the post
   * @param postID: the id of the post
   * @param reason: the reason why to delete post content
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
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

  /**
   * UpgradeProtocol upgrades the protocol.
   * It composes UpgradeProtocolMsg and then broadcasts the transaction to blockchain.
   * @param creator: the user who creates the proposal
   * @param link: the link of the upgraded protocol
   * @param reason: the reason to make such change
   * @param privKeyHex: the private key of the creator
   * @param seq: the sequence number of the creator for the next transaction
   */
  upgradeProtocol(creator: string, link: string, privKeyHex: string, reason: string, seq: number) {
    const msg: UpgradeProtocolMsg = {
      creator,
      link,
      reason
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

  broadcastRawMsgBytesSync(tx: string): Promise<ResultBroadcastTx> {
    return this._transport.broadcastRawMsgBytesSync(tx);
  }
}

// Account related messages
export interface RegisterV2Msg {
  referrer: any;
  register_fee: string;
  new_username: string;
  new_transaction_public_key: string;
  new_signing_public_key: string;
}

export interface TransferMsg {
  sender: string;
  receiver: string;
  amount: string;
  memo: string;
}

export interface TransferV2Msg {
  sender: any;
  receiver: any;
  amount: string;
  memo: string;
}

export interface ClaimInterestMsg {
  username: string;
}

export interface RecoverMsg {
  username: string;
  new_tx_public_key: string;
  new_signing_public_key: string;
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
  created_by: string;
  preauth: boolean;
}

export interface DonateMsg {
  username: string;
  amount: string;
  author: string;
  post_id: string;
  from_app: string;
  memo: string;
}

export interface IDADonateMsg {
  username: string;
  app: string;
  amount: string;
  author: string;
  post_id: string;
  from_app: string;
  memo: string;
  signer: string;
}

export interface DeletePostMsg {
  author: string;
  post_id: string;
}

export interface UpdatePostMsg {
  author: string;
  post_id: string;
  title: string;
  content: string;
}

// validator related messages
export interface ValidatorRegisterMsg {
  username: string;
  validator_public_key: string;
  link: string;
}

export interface VoteValidatorMsg {
  username: string;
  voted_validators: string[];
}

export interface ValidatorRevokeMsg {
  username: string;
}

// vote related messages
export interface StakeInMsg {
  username: string;
  deposit: string;
}

export interface StakeInForMsg {
  username: string;
  receiver: string;
  deposit: string;
}

export interface StakeOutMsg {
  username: string;
  amount: string;
}

// developer related messages
export interface DeveloperRegisterMsg {
  username: string;
  website: string;
  description: string;
  app_meta_data: string;
}

export interface DeveloperUpdateMsg {
  username: string;
  website: string;
  description: string;
  app_meta_data: string;
}

export interface DeveloperRevokeMsg {
  username: string;
}

export interface GrantPermissionMsg {
  username: string;
  authorized_app: string;
  validity_period_second: number;
  grant_level: Types.PERMISSION_TYPE;
  amount: string;
}

export interface RevokePermissionMsg {
  username: string;
  revoke_from: string;
  permission: Types.PERMISSION_TYPE;
}

export interface IDAIssueMsg {
  username: string;
  ida_price: number;
}

export interface IDAMintMsg {
  username: string;
  amount: string;
}

export interface IDAConvertFromLinoMsg {
  username: string;
  app: string;
  amount: string;
}

export interface IDATransferMsg {
  app: string;
  from: string;
  to: string;
  signer: string;
  amount: string;
}

export interface IDAAuthorizeMsg {
  username: string;
  app: string;
  activate: boolean;
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
  reason: string;
}

export interface ChangeGlobalAllocationParamMsg {
  creator: string;
  parameter: Types.GlobalAllocationParam;
  reason: string;
}

// export interface ChangeEvaluateOfContentValueParamMsg {
//   creator: string;
//   parameter: Types.EvaluateOfContentValueParam;
//   reason: string;
// }

export interface ChangeInfraInternalAllocationParamMsg {
  creator: string;
  parameter: Types.InfraInternalAllocationParam;
  reason: string;
}

export interface ChangeVoteParamMsg {
  creator: string;
  parameter: Types.VoteParam;
  reason: string;
}

export interface ChangeProposalParamMsg {
  creator: string;
  parameter: Types.ProposalParam;
  reason: string;
}

export interface ChangeDeveloperParamMsg {
  creator: string;
  parameter: Types.DeveloperParam;
  reason: string;
}

export interface ChangeValidatorParamMsg {
  creator: string;
  parameter: Types.ValidatorParam;
  reason: string;
}

export interface ChangeBandwidthParamMsg {
  creator: string;
  parameter: Types.BandwidthParam;
  reason: string;
}

export interface ChangeAccountParamMsg {
  creator: string;
  parameter: Types.AccountParam;
  reason: string;
}

export interface ChangePostParamMsg {
  creator: string;
  parameter: Types.PostParam;
  reason: string;
}

const _MSGTYPE = {
  RegisterMsgType: 'lino/register',
  FollowMsgType: 'lino/follow',
  UnfollowMsgType: 'lino/unfollow',
  TransferMsgType: 'lino/transfer',
  TransferV2MsgType: 'lino/transferv2',
  IDAConvertFromLinoMsgType: 'lino/IDAConvertFromLino',
  ClaimMsgType: 'lino/claim',
  ClaimInterestMsgType: 'lino/claimInterest',
  RecoverMsgType: 'lino/recover',
  UpdateAccMsgType: 'lino/updateAcc',
  DevRegisterMsgType: 'lino/devRegister',
  DevUpdateMsgType: 'lino/devUpdate',
  DevRevokeMsgType: 'lino/devRevoke',
  GrantPermissionMsgType: 'lino/grantPermission',
  RevokePermissionMsgType: 'lino/revokePermission',
  PreAuthorizationMsgType: 'lino/preAuthorizationPermission',
  CreatePostMsgType: 'lino/createPost',
  UpdatePostMsgType: 'lino/updatePost',
  DeletePostMsgType: 'lino/deletePost',
  DonateMsgType: 'lino/donate',
  ViewMsgType: 'lino/view',
  ReportOrUpvoteMsgType: 'lino/reportOrUpvote',
  StakeInMsgType: 'lino/stakeIn',
  StakeInForMsgType: 'lino/stakeInFor',
  StakeOutMsgType: 'lino/stakeOut',
  VoteWithdrawMsgType: 'lino/voteWithdraw',
  DelegateMsgType: 'lino/delegate',
  DelegateWithdrawMsgType: 'lino/delegateWithdraw',
  ValRegisterMsgType: 'lino/valRegister',
  VoteValMsgType: 'lino/voteValidator',
  ValRevokeMsgType: 'lino/valRevoke',
  VoteProposalMsgType: 'lino/voteProposal',
  DeletePostContentMsgType: 'lino/deletePostContent',
  UpgradeProtocolMsgType: 'lino/upgradeProtocol',
  ChangeGlobalAllocationMsgType: 'lino/changeGlobalAllocation',
  ChangeEvaluationMsgType: 'lino/changeEvaluation',
  ChangeInfraAllocationMsgType: 'lino/changeInfraAllocation',
  ChangeVoteParamMsgType: 'lino/changeVoteParam',
  ChangeProposalParamMsgType: 'lino/changeProposalParam',
  ChangeDeveloperParamMsgType: 'lino/changeDeveloperParam',
  ChangeValidatorParamMsgType: 'lino/changeValidatorParam',
  ChangeBandwidthParamMsgType: 'lino/changeBandwidthParam',
  ChangeAccountParamMsgType: 'lino/changeAccountParam',
  ChangePostParamMsgType: 'lino/changePostParam',
  ProviderReportMsgType: 'lino/providerReport'
};
