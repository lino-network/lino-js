'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ByteBuffer = _interopDefault(require('bytebuffer'));
var shajs = _interopDefault(require('sha.js'));
var fetch = _interopDefault(require('cross-fetch'));
var elliptic = require('elliptic');

// return a new zero fee object
const getZeroFee = () => ({
    amount: [],
    gas: '0'
});
function encodeTx(msgs, rawPubKey, rawSigDER, seq) {
    const stdSig = {
        pub_key: convertToInternalPubKey(rawPubKey, _TYPE.PubKeySecp256k1),
        signature: ByteBuffer.fromHex(rawSigDER).toString('base64'),
        account_number: '0',
        sequence: String(seq)
    };
    const stdTx = {
        msg: msgs,
        signatures: [stdSig],
        fee: getZeroFee()
    };
    const authStdTx = {
        type: 'auth/StdTx',
        value: number2StringInObject(stdTx)
    };
    const jsonStr = JSON.stringify(authStdTx);
    return ByteBuffer.btoa(jsonStr);
}
function decodeObject(result) {
    var decodedResult = Object.assign({}, result);
    var keys = Object.keys(result);
    if (keys.length === 1 && keys[0] === 'amount' && !isNaN(decodedResult.amount)) {
        decodedResult.amount = String(Number(decodedResult.amount) / 100000);
        return decodedResult;
    }
    if (typeof result === 'string') {
        return String(result);
    }
    if (result instanceof Array) {
        decodedResult = [];
        result.forEach(element => {
            decodedResult.push(decodeObject(element));
        });
    }
    else {
        for (var index in keys) {
            var key = keys[index];
            if (key === 'memo' || key === 'title' || key === 'content' || key === 'description') {
                if (decodedResult[key] !== null) {
                    decodedResult[key] = decodeURIComponent(escape(result[key]));
                }
            }
            if (decodedResult[key] !== null &&
                typeof decodedResult[key] !== 'string' &&
                typeof decodedResult[key] !== 'boolean' &&
                typeof decodedResult[key] !== 'number') {
                decodedResult[key] = decodeObject(result[key]);
            }
        }
    }
    return decodedResult;
}
function encodeObject(result) {
    var encodeResult = Object.assign({}, result);
    var keys = Object.keys(result);
    if (keys.length === 1 && keys[0] === 'amount' && !isNaN(encodeResult.amount)) {
        encodeResult.amount = String(Number(encodeResult.amount) * 100000);
        return encodeResult;
    }
    if (typeof result === 'string') {
        return String(result);
    }
    if (result instanceof Array) {
        encodeResult = [];
        result.forEach(element => {
            encodeResult.push(encodeObject(element));
        });
    }
    else {
        for (var index in keys) {
            var key = keys[index];
            if (encodeResult[key] !== null &&
                typeof encodeResult[key] !== 'string' &&
                typeof encodeResult[key] !== 'boolean') {
                encodeResult[key] = encodeObject(result[key]);
            }
        }
    }
    return encodeResult;
}
function encodeMsg(msg) {
    var encodedMsg = Object.assign({}, msg);
    if ('new_reset_public_key' in msg) {
        encodedMsg.new_reset_public_key = convertToInternalPubKey(msg.new_reset_public_key, _TYPE.PubKeySecp256k1);
    }
    if ('new_transaction_public_key' in msg) {
        encodedMsg.new_transaction_public_key = convertToInternalPubKey(msg.new_transaction_public_key, _TYPE.PubKeySecp256k1);
    }
    if ('new_app_public_key' in msg) {
        encodedMsg.new_app_public_key = convertToInternalPubKey(msg.new_app_public_key, _TYPE.PubKeySecp256k1);
    }
    if ('validator_public_key' in msg) {
        encodedMsg.validator_public_key = convertToInternalPubKey(msg.validator_public_key, _TYPE.PubKeyEd25519);
    }
    if ('public_key' in msg) {
        encodedMsg.public_key = convertToInternalPubKey(msg.public_key, _TYPE.PubKeySecp256k1);
    }
    return encodedMsg;
}
function encodeSignMsg(stdMsg, chainId, seq) {
    const fee = getZeroFee();
    const stdSignMsg = {
        account_number: '0',
        chain_id: chainId,
        fee: fee,
        memo: '',
        msgs: stdMsg,
        sequence: String(seq)
    };
    const jsonStr = JSON.stringify(number2StringInObject(sortObject(stdSignMsg)));
    console.log('sign byte:', jsonStr);
    const signMsgHash = shajs('sha256')
        .update(jsonStr)
        .digest();
    return jsonStr;
}
function convertMsg(msg) {
    var encodedMsg = Object.assign({}, msg);
    if ('new_reset_public_key' in msg) {
        var buffer = ByteBuffer.fromHex(msg.new_reset_public_key);
        encodedMsg.new_reset_public_key = getByteArray(buffer);
    }
    if ('new_transaction_public_key' in msg) {
        var buffer = ByteBuffer.fromHex(msg.new_transaction_public_key);
        encodedMsg.new_transaction_public_key = getByteArray(buffer);
    }
    if ('new_app_public_key' in msg) {
        var buffer = ByteBuffer.fromHex(msg.new_app_public_key);
        encodedMsg.new_app_public_key = getByteArray(buffer);
    }
    if ('validator_public_key' in msg) {
        var buffer = ByteBuffer.fromHex(msg.validator_public_key);
        encodedMsg.validator_public_key = getByteArray(buffer);
    }
    return encodedMsg;
}
function getByteArray(buffer) {
    let res = [];
    for (var i = 0; i < buffer.limit; ++i) {
        res.push(buffer.readUint8());
    }
    return res;
}
//decode std key to raw key, only support secp256k1 for now
function decodePrivKey(privKeyHex) {
    privKeyHex = privKeyHex.toUpperCase();
    if (privKeyHex.startsWith(_PREFIX.PrefixPrivKeySecp256k1)) {
        return privKeyHex.slice(_PREFIX.PrefixPrivKeySecp256k1.length);
    }
    else if (privKeyHex.startsWith(_PREFIX.PrefixPrivKeyEd25519)) {
        return privKeyHex.slice(_PREFIX.PrefixPrivKeyEd25519.length);
    }
    throw new Error(`Decode priv key failed: ${privKeyHex}\n`);
}
function decodePubKey(pubKeyHex) {
    pubKeyHex = pubKeyHex.toUpperCase();
    if (pubKeyHex.startsWith(_PREFIX.PrefixPubKeySecp256k1)) {
        return pubKeyHex.slice(_PREFIX.PrefixPubKeySecp256k1.length);
    }
    else if (pubKeyHex.startsWith(_PREFIX.PrefixPubKeyEd25519)) {
        return pubKeyHex.slice(_PREFIX.PrefixPubKeyEd25519.length);
    }
    throw new Error(`Decode pub key failed: ${pubKeyHex}\n`);
}
//eoncde raw key to std key, only support secp256k1 for now
function encodePrivKey(privKeyHex) {
    return _PREFIX.PrefixPrivKeySecp256k1.concat(privKeyHex).toUpperCase();
}
function encodePubKey(pubKeyHex) {
    return _PREFIX.PrefixPubKeySecp256k1.concat(pubKeyHex).toUpperCase();
}
// convert raw pub key to internal pub key format
function convertToInternalPubKey(rawPubKey, type) {
    const res = {
        type: type,
        value: ByteBuffer.fromHex(rawPubKey).toString('base64')
    };
    return res;
}
// convert internal pub key to raw pub key
function convertToRawPubKey(internalPubKey) {
    return ByteBuffer.fromBase64(internalPubKey.value).toString('hex');
}
function sortObject(object) {
    var sortedObj = {}, keys = Object.keys(object);
    keys.sort(function (key1, key2) {
        (key1 = key1.toLowerCase()), (key2 = key2.toLowerCase());
        if (key1 < key2)
            return -1;
        if (key1 > key2)
            return 1;
        return 0;
    });
    for (var index in keys) {
        var key = keys[index];
        if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
            sortedObj[key] = sortObject(object[key]);
        }
        else if (typeof object[key] == 'object' && object[key] instanceof Array) {
            sortedObj[key] = [];
            object[key].forEach(element => {
                sortedObj[key].push(sortObject(element));
            });
        }
        else {
            sortedObj[key] = object[key];
        }
    }
    return sortedObj;
}
function number2StringInObject(object) {
    var resultObj = {}, keys = Object.keys(object);
    for (var index in keys) {
        var key = keys[index];
        if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
            resultObj[key] = number2StringInObject(object[key]);
        }
        else if (typeof object[key] == 'object' && object[key] instanceof Array) {
            resultObj[key] = [];
            object[key].forEach(element => {
                resultObj[key].push(number2StringInObject(element));
            });
        }
        else {
            if (typeof object[key] == 'number') {
                resultObj[key] = String(object[key]);
            }
            else {
                resultObj[key] = object[key];
            }
        }
    }
    return resultObj;
}
const _TYPE = {
    PubKeyEd25519: 'tendermint/PubKeyEd25519',
    PubKeySecp256k1: 'tendermint/PubKeySecp256k1',
    PrivKeyEd25519: 'tendermint/PrivKeyEd25519',
    PrivKeySecp256k1: 'tendermint/PrivKeySecp256k1',
    SignatureKeyEd25519: 'tendermint/SignatureEd25519',
    SignatureKeySecp256k1: 'tendermint/SignatureSecp256k1'
};
const _PREFIX = {
    PrefixPubKeyEd25519: '1624DE6420',
    PrefixPubKeySecp256k1: 'EB5AE98721',
    PrefixPrivKeyEd25519: 'A328891040',
    PrefixPrivKeySecp256k1: 'E1B0F79B20'
};

class Broadcast {
    constructor(transport) {
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
    register(referrer, register_fee, username, resetPubKey, transactionPubKeyHex, appPubKeyHex, referrerPrivKeyHex, seq) {
        const msg = {
            referrer: referrer,
            register_fee: register_fee,
            new_username: username,
            new_reset_public_key: decodePubKey(resetPubKey),
            new_transaction_public_key: decodePubKey(transactionPubKeyHex),
            new_app_public_key: decodePubKey(appPubKeyHex)
        };
        return this._broadcastTransaction(msg, _MSGTYPE.RegisterMsgType, referrerPrivKeyHex, seq);
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
    transfer(sender, receiver, amount, memo, privKeyHex, seq) {
        const msg = {
            amount: amount,
            memo: memo,
            receiver: receiver,
            sender: sender
        };
        return this._broadcastTransaction(msg, _MSGTYPE.TransferMsgType, privKeyHex, seq);
    }
    /**
     * Follow creates a social relationship between follower and followee.
     * It composes FollowMsg and then broadcasts the transaction to blockchain.
     *
     * @param follower: follower
     * @param followee: followee
     * @param privKeyHex: the private key of follower
     * @param seq: the sequence number of follower for the next transaction
     */
    follow(follower, followee, privKeyHex, seq) {
        const msg = {
            followee: followee,
            follower: follower
        };
        return this._broadcastTransaction(msg, _MSGTYPE.FollowMsgType, privKeyHex, seq);
    }
    /**
     * Unfollow revokes the social relationship between follower and followee.
     * It composes UnfollowMsg and then broadcasts the transaction to blockchain.
     *
     * @param follower: follower
     * @param followee: followee
     * @param privKeyHex: the private key of follower
     * @param seq: the sequence number of follower for the next transaction
     */
    unfollow(follower, followee, privKeyHex, seq) {
        const msg = {
            followee: followee,
            follower: follower
        };
        return this._broadcastTransaction(msg, _MSGTYPE.UnfollowMsgType, privKeyHex, seq);
    }
    /**
     * Claim claims rewards of a certain user.
     * It composes ClaimMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the user who wants to claim reward
     * @param privKeyHex: the private key of username
     * @param seq: the sequence number of user for the next transaction
     */
    claim(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ClaimMsgType, privKeyHex, seq);
    }
    /**
     * ClaimInterest claims interest of a certain user.
     * It composes ClaimInterestMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the user who wants to claim interest
     * @param privKeyHex: the private key of username
     * @param seq: the sequence number of user for the next transaction
     */
    claimInterest(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ClaimInterestMsgType, privKeyHex, seq);
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
    updateAccount(username, json_meta, privKeyHex, seq) {
        const msg = {
            json_meta: json_meta,
            username: username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.UpdateAccMsgType, privKeyHex, seq);
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
    recover(username, new_reset_public_key, new_transaction_public_key, new_app_public_key, privKeyHex, seq) {
        const msg = {
            username: username,
            new_reset_public_key: decodePubKey(new_reset_public_key),
            new_transaction_public_key: decodePubKey(new_transaction_public_key),
            new_app_public_key: decodePubKey(new_app_public_key)
        };
        return this._broadcastTransaction(msg, _MSGTYPE.RecoverMsgType, privKeyHex, seq);
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
     * @param parentAuthor: if this is a comment, parentAuthor is the author of post that this comment is added to
     * @param parentPostID: if this is a comment, parentPostID is the id of post that this comment is added to
     * @param sourceAuthor: if this is a re-post, sourceAuthor should be the original post author
     * @param sourcePostID: if this is a re-post, sourcePostID should be the original post id
     * @param redistributionSplitRate: how much percentage the source post wants to split for re-post
     * @param links: the links of the new post
     * @param privKeyHex: the private key of the user
     * @param seq: the sequence number of user for the next transaction
     */
    createPost(author, postID, title, content, parentAuthor, parentPostID, sourceAuthor, sourcePostID, redistributionSplitRate, links, privKeyHex, seq) {
        let mLinks = null;
        if (links != null) {
            mLinks = [];
            for (let entry of links.entries()) {
                const mapping = {
                    identifier: entry[0],
                    url: entry[1]
                };
                mLinks.push(mapping);
            }
        }
        const msg = {
            author: author,
            content: content,
            links: mLinks,
            parent_author: parentAuthor,
            parent_postID: parentPostID,
            post_id: postID,
            redistribution_split_rate: redistributionSplitRate,
            source_author: sourceAuthor,
            source_postID: sourcePostID,
            title: title
        };
        return this._broadcastTransaction(msg, _MSGTYPE.CreatePostMsgType, privKeyHex, seq);
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
    donate(username, author, amount, post_id, from_app, memo, privKeyHex, seq) {
        const msg = {
            amount,
            author,
            from_app,
            memo,
            post_id,
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DonateMsgType, privKeyHex, seq);
    }
    /**
     * ReportOrUpvote adds a report or upvote action to a post.
     * It composes ReportOrUpvoteMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the user who report or upvote the post
     * @param author: the author of the post
     * @param post_id: the id of the post
     * @param is_report: indicates this is a report if set to true
     * @param privKeyHex: the private key of the user
     * @param seq: the sequence number of the user for the next transaction
     */
    reportOrUpvote(username, author, post_id, is_report, privKeyHex, seq) {
        const msg = {
            author,
            is_report,
            post_id,
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ReportOrUpvoteMsgType, privKeyHex, seq);
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
    deletePost(author, post_id, privKeyHex, seq) {
        const msg = {
            author,
            post_id
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DeletePostMsgType, privKeyHex, seq);
    }
    /**
     * View increases the view count of a post by one.
     * It composes ViewMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the user who view the post
     * @param author: The author of the post
     * @param post_id: the id of the post
     * @param privKeyHex: the private key of the user
     * @param seq: the sequence number of the author for the next transaction
     */
    view(username, author, post_id, privKeyHex, seq) {
        const msg = {
            author,
            post_id,
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ViewMsgType, privKeyHex, seq);
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
    updatePost(author, title, post_id, content, links, privKeyHex, seq) {
        let mLinks = null;
        if (links != null) {
            mLinks = [];
            for (let entry of links.entries()) {
                const mapping = {
                    identifier: entry[0],
                    url: entry[1]
                };
                mLinks.push(mapping);
            }
        }
        const msg = {
            author: author,
            content: content,
            links: mLinks,
            post_id: post_id,
            title: title
        };
        return this._broadcastTransaction(msg, _MSGTYPE.UpdatePostMsgType, privKeyHex, seq);
    }
    // validator related
    /**
     * ValidatorDeposit deposits a certain amount of LINO token for a user
     * in order to become a validator. Before becoming a validator, the user
     * has to be a voter.
     * It composes ValidatorDepositMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the user who wants to deposit money for being a validator
     * @param deposit: the amount of LINO token the user wants to deposit
     * @param validator_public_key: the validator public key given by Tendermint
     * @param link: the link of the user
     * @param privKeyHex: the private key of the user
     * @param seq: the sequence number of the user for the next transaction
     */
    validatorDeposit(username, deposit, validator_public_key, link, privKeyHex, seq) {
        const msg = {
            deposit: deposit,
            link: link,
            username: username,
            validator_public_key: decodePubKey(validator_public_key)
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ValDepositMsgType, privKeyHex, seq);
    }
    /**
     * ValidatorWithdraw withdraws part of LINO token from a validator's deposit,
     * while still keep being a validator.
     * It composes ValidatorDepositMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the validator username
     * @param amount: the amount of LINO token the validator wants to withdraw
     * @param privKeyHex: the private key of the validator
     * @param seq: the sequence number of the validator for the next transaction
     */
    validatorWithdraw(username, amount, privKeyHex, seq) {
        const msg = {
            amount: amount,
            username: username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ValWithdrawMsgType, privKeyHex, seq);
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
    validatorRevoke(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ValRevokeMsgType, privKeyHex, seq);
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
    stakeIn(username, deposit, privKeyHex, seq) {
        const msg = {
            deposit: deposit,
            username: username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.StakeInMsgType, privKeyHex, seq);
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
    stakeOut(username, amount, privKeyHex, seq) {
        const msg = {
            amount: amount,
            username: username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.StakeOutMsgType, privKeyHex, seq);
    }
    /**
     * Delegate delegates a certain amount of LINO token of delegator to a voter, so
     * the voter will have more voting power.
     * It composes DelegateMsg and then broadcasts the transaction to blockchain.
     *
     * @param delegator: the user who wants to delegate money
     * @param voter: the voter that the delegator wants to delegate moeny to
     * @param amount: the amount of LINO token that the delegator wants to delegate
     * @param privKeyHex: the private key of the delegator
     * @param seq: the sequence number of the delegator for the next transaction
     */
    delegate(delegator, voter, amount, privKeyHex, seq) {
        const msg = {
            amount,
            delegator,
            voter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DelegateMsgType, privKeyHex, seq);
    }
    /**
     * DelegatorWithdraw withdraws part of delegated LINO token of a delegator
     * to a voter, while the delegation still exists.
     * It composes DelegatorWithdrawMsg and then broadcasts the transaction to blockchain.
     *
     * @param delegator: the delegator username
     * @param voter: the voter username
     * @param amount: the amount of money that the delegator wants to withdraw
     * @param privKeyHex: the private key of the delegator
     * @param seq: the sequence number of the delegator for the next transaction
     */
    delegatorWithdraw(delegator, voter, amount, privKeyHex, seq) {
        const msg = {
            delegator,
            voter,
            amount
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DelegateWithdrawMsgType, privKeyHex, seq);
    }
    // developer related
    /**
     * DeveloperRegsiter registers a developer with a certain amount of LINO token on blockchain.
     * It composes DeveloperRegisterMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the user who wants to become a developer
     * @param deposit: the amount of money the user wants to deposit
     * @param website: developer's website
     * @param description: developer's description
     * @param app_meta_data: developer's app meta data
     * @param privKeyHex: the private key of the user
     * @param seq: the sequence number of the user for the next transaction
     */
    developerRegister(username, deposit, website, description, app_meta_data, privKeyHex, seq) {
        const msg = {
            app_meta_data,
            deposit,
            description,
            username,
            website
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DevRegisterMsgType, privKeyHex, seq);
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
    developerUpdate(username, website, description, app_meta_data, privKeyHex, seq) {
        const msg = {
            username,
            website,
            description,
            app_meta_data
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DevUpdateMsgType, privKeyHex, seq);
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
    developerRevoke(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DevRevokeMsgType, privKeyHex, seq);
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
    grantPermission(username, authorized_app, validity_period_second, grant_level, amount, privKeyHex, seq) {
        const msg = {
            username,
            authorized_app,
            validity_period_second,
            grant_level,
            amount
        };
        return this._broadcastTransaction(msg, _MSGTYPE.GrantPermissionMsgType, privKeyHex, seq);
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
    revokePermission(username, appName, permission, privKeyHex, seq) {
        const msg = {
            username: username,
            revoke_from: appName,
            permission: permission
        };
        return this._broadcastTransaction(msg, _MSGTYPE.RevokePermissionMsgType, privKeyHex, seq);
    }
    /**
     * preAuthorizationPermission grants pre authorization permission to
     * an authorized app with a certain period of time and amount.
     * It composes GrantPermissionMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the user who grants the permission
     * @param authorized_app: the authenticated app of the developer
     * @param validity_period_second: how long does this app is valid
     * @param grant_level: the permission level granted
     * @param privKeyHex: the private key of the user
     * @param seq: the sequence number of the user for the next transaction
     */
    preAuthorizationPermission(username, authorized_app, validity_period_second, amount, privKeyHex, seq) {
        const msg = {
            username,
            authorized_app,
            validity_period_second,
            amount
        };
        return this._broadcastTransaction(msg, _MSGTYPE.PreAuthorizationMsgType, privKeyHex, seq);
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
    providerReport(username, usage, privKeyHex, seq) {
        const msg = {
            usage,
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ProviderReportMsgType, privKeyHex, seq);
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
    voteProposal(voter, proposal_id, result, privKeyHex, seq) {
        const msg = {
            proposal_id,
            result,
            voter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.VoteProposalMsgType, privKeyHex, seq);
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
    changeGlobalAllocationParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
            creator,
            parameter: encodeObject(parameter),
            reason
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeGlobalAllocationMsgType, privKeyHex, seq);
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
    changeEvaluateOfContentValueParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
            creator,
            parameter: encodeObject(parameter),
            reason
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeEvaluationMsgType, privKeyHex, seq);
    }
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
    changeInfraInternalAllocationParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
            creator,
            parameter: encodeObject(parameter),
            reason
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeInfraAllocationMsgType, privKeyHex, seq);
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
    changeVoteParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
            creator,
            parameter: encodeObject(parameter),
            reason
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeVoteParamMsgType, privKeyHex, seq);
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
    changeProposalParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
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
    changeDeveloperParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
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
    changeValidatorParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
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
    changeBandwidthParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
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
    changeAccountParam(creator, parameter, reason, privKeyHex, seq) {
        const msg = {
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
    changePostParam(creator, parameter, privKeyHex, reason, seq) {
        const msg = {
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
    deletePostContent(creator, postAuthor, postID, reason, privKeyHex, seq) {
        const permlink = postAuthor.concat('#').concat(postID);
        const msg = {
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
    upgradeProtocol(creator, link, privKeyHex, reason, seq) {
        const msg = {
            creator,
            link,
            reason
        };
        return this._broadcastTransaction(msg, _MSGTYPE.UpgradeProtocolMsgType, privKeyHex, seq);
    }
    _broadcastTransaction(msg, msgType, privKeyHex, seq) {
        return this._transport.signBuildBroadcast(msg, msgType, privKeyHex, seq);
    }
}
const _MSGTYPE = {
    RegisterMsgType: 'lino/register',
    FollowMsgType: 'lino/follow',
    UnfollowMsgType: 'lino/unfollow',
    TransferMsgType: 'lino/transfer',
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
    StakeOutMsgType: 'lino/stakeOut',
    VoteWithdrawMsgType: 'lino/voteWithdraw',
    DelegateMsgType: 'lino/delegate',
    DelegateWithdrawMsgType: 'lino/delegateWithdraw',
    ValDepositMsgType: 'lino/valDeposit',
    ValWithdrawMsgType: 'lino/valWithdraw',
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

function isJsonRpcSuccess(response) {
    return 'result' in response;
}

const DefaultABCIQueryOptions = {
    height: '0',
    trusted: false
};
class Rpc {
    constructor(nodeUrl) {
        this._nodeUrl = nodeUrl;
    }
    abciQuery(path, key, opts = DefaultABCIQueryOptions) {
        return fetch(this._nodeUrl, {
            headers: { 'Content-Type': 'text/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'jsonrpc-client',
                method: 'abci_query',
                params: Object.assign({}, opts, { path, data: key })
            }),
            method: 'POST',
            mode: 'cors'
        })
            .then(response => response.json())
            .then((data) => {
            if ('result' in data) {
                return data.result;
            }
            else {
                throw data.error;
            }
        });
    }
    broadcastTxCommit(tx) {
        return fetch(this._nodeUrl, {
            headers: { 'Content-Type': 'text/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'jsonrpc-client',
                method: 'broadcast_tx_commit',
                params: {
                    tx: tx
                }
            }),
            method: 'POST',
            mode: 'cors'
        })
            .then(response => response.json())
            .then((data) => {
            if (isJsonRpcSuccess(data)) {
                return data.result;
            }
            else {
                throw data.error;
            }
        });
    }
    block(height) {
        return fetch(this._nodeUrl, {
            headers: { 'Content-Type': 'text/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'jsonrpc-client',
                method: 'block',
                params: {
                    height: String(height)
                }
            }),
            method: 'POST',
            mode: 'cors'
        })
            .then(response => response.json())
            .then((data) => {
            if (isJsonRpcSuccess(data)) {
                return data.result;
            }
            else {
                throw data.error;
            }
        });
    }
}

//@ts-ignore
var Keys;
(function (Keys) {
    Keys.KVSTOREKEYS = {
        MainKVStoreKey: 'main',
        AccountKVStoreKey: 'account',
        PostKVStoreKey: 'post',
        ValidatorKVStoreKey: 'validator',
        GlobalKVStoreKey: 'global',
        VoteKVStoreKey: 'vote',
        InfraKVStoreKey: 'infra',
        DeveloperKVStoreKey: 'developer',
        ParamKVStoreKey: 'param',
        ProposalKVStoreKey: 'proposal',
        ReputationKVStoreKey: 'reputation',
        AccountInfoSubStore: 'info',
        AccountBankSubStore: 'bank',
        AccountMetaSubStore: 'meta',
        AccountRewardSubStore: 'reward',
        AccountPendingCoinDaySubStore: 'pendingCoinDay',
        AccountGrantPubKeySubStore: 'grantPubKey',
        AccountAllGrantPubKeys: 'allGrantPubKey',
        DeveloperSubStore: 'dev',
        DeveloperListSubStore: 'devList',
        TimeEventListSubStore: 'timeEventList',
        GlobalMetaSubStore: 'globalMeta',
        InflationPoolSubStore: 'inflationPool',
        ConsumptionMetaSubStore: 'consumptionMeta',
        TpsSubStore: 'tps',
        LinoStakeStatSubStore: 'linoStakeStat',
        GlobalTimeSubStore: 'globalTime',
        InfraProviderSubStore: 'infra',
        InfraListSubStore: 'infraList',
        PostInfoSubStore: 'info',
        PostMetaSubStore: 'meta',
        PostReportOrUpvoteSubStore: 'reportOrUpvote',
        PostCommentSubStore: 'comment',
        PostViewSubStore: 'view',
        NextProposalIDSubStore: 'next',
        OngoingProposalSubStore: 'ongoing',
        ExpiredProposalSubStore: 'expired',
        ValidatorSubStore: 'validator',
        ValidatorListSubStore: 'valList',
        DelegationSubStore: 'delegation',
        VoterSubStore: 'voter',
        VoteSubStore: 'vote',
        ReferenceListSubStore: 'refList',
        DelegateeSubStore: 'delegatee',
        AllocationParamSubStore: 'allocation',
        InfraInternalAllocationParamSubStore: 'infraInternal',
        DeveloperParamSubStore: 'developer',
        VoteParamSubStore: 'vote',
        ProposalParamSubStore: 'proposal',
        ValidatorParamSubStore: 'validator',
        CoinDayParamSubStore: 'coinday',
        BandwidthParamSubStore: 'bandwidth',
        AccountParamSubStore: 'account',
        PostParamSubStore: 'post',
        ReputationParamSubStore: 'reputation',
        ReputationSubStore: 'rep'
    };
    const _KEYS = {
        validatorSubstore: '00',
        validatorListSubstore: '01',
        delegationSubstore: '00',
        voterSubstore: '01',
        voteSubstore: '02',
        referenceListSubStore: '03',
        delegateeSubStore: '04',
        nextProposalIDSubstore: '00',
        ongoingProposalSubStore: '01',
        expiredProposalSubStore: '02',
        developerSubstore: '00',
        developerListSubstore: '01',
        infraProviderSubstore: '00',
        infraProviderListSubstore: '01',
        accountInfoSubstore: '00',
        accountBankSubstore: '01',
        accountMetaSubstore: '02',
        accountRewardSubstore: '03',
        accountPendingCoinDayQueueSubstore: '04',
        accountGrantPubKeySubstore: '05',
        postInfoSubStore: '00',
        postMetaSubStore: '01',
        postReportOrUpvoteSubStore: '02',
        postCommentSubStore: '03',
        postViewsSubStore: '04',
        postDonationsSubStore: '05',
        allocationParamSubStore: '00',
        infraInternalAllocationParamSubStore: '01',
        evaluateOfContentValueParamSubStore: '02',
        developerParamSubStore: '03',
        voteParamSubStore: '04',
        proposalParamSubStore: '05',
        validatorParamSubStore: '06',
        coinDayParamSubStore: '07',
        bandwidthParamSubStore: '08',
        accountParamSubstore: '09',
        postParamSubStore: '0a',
        reputationParamSubStore: '0b',
        timeEventListSubStore: '00',
        globalMetaSubStore: '01',
        inflationPoolSubStore: '02',
        consumptionMetaSubStore: '03',
        tpsSubStore: '04',
        timeSubStore: '05',
        linoStakeStatSubStore: '06',
        repUserMetaSubStore: '00',
        repPostMetaSubStore: '01',
        repUserPostMetaSubStore: '02',
        repRoundMetaSubstore: '03',
        repRoundPostMetaSubstore: '04',
        repRoundUserPostMetaPrefix: '05',
        repGameMetaPrefix: '06',
        sep: ByteBuffer.fromUTF8('/').toHex(),
        separator: '/'
    };
    function getHexSubstringAfterKeySeparator(key) {
        return key.substr(key.indexOf(_KEYS.separator) + 1, key.length);
    }
    Keys.getHexSubstringAfterKeySeparator = getHexSubstringAfterKeySeparator;
    function getSubstringAfterKeySeparator(key) {
        return key.substr(key.lastIndexOf(_KEYS.separator) + 1, key.length);
    }
    Keys.getSubstringAfterKeySeparator = getSubstringAfterKeySeparator;
    function getSubstringAfterSubstore(key) {
        return key.substr(2, key.length);
    }
    Keys.getSubstringAfterSubstore = getSubstringAfterSubstore;
    // validator related
    function getValidatorKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.validatorSubstore.concat(accKeyHex);
    }
    Keys.getValidatorKey = getValidatorKey;
    function getValidatorListKey() {
        return _KEYS.validatorListSubstore;
    }
    Keys.getValidatorListKey = getValidatorListKey;
    // vote related
    function getVotePrefix(id) {
        const idHex = ByteBuffer.fromUTF8(id).toHex();
        return _KEYS.voteSubstore.concat(idHex).concat(_KEYS.sep);
    }
    Keys.getVotePrefix = getVotePrefix;
    function getVoteKey(proposalID, voter) {
        const voterHex = ByteBuffer.fromUTF8(voter).toHex();
        return getVotePrefix(proposalID).concat(voterHex);
    }
    Keys.getVoteKey = getVoteKey;
    function getDelegationPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.delegationSubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getDelegationPrefix = getDelegationPrefix;
    function getDelegationKey(me, myDelegator) {
        const myDelegatorHex = ByteBuffer.fromUTF8(myDelegator).toHex();
        return getDelegationPrefix(me).concat(myDelegatorHex);
    }
    Keys.getDelegationKey = getDelegationKey;
    function getVoterKey(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.voterSubstore.concat(meHex);
    }
    Keys.getVoterKey = getVoterKey;
    function getDelegateePrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.delegateeSubStore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getDelegateePrefix = getDelegateePrefix;
    function getDelegateeKey(me, myDelegatee) {
        const myDelegateeHex = ByteBuffer.fromUTF8(myDelegatee).toHex();
        return getDelegateePrefix(me).concat(myDelegateeHex);
    }
    Keys.getDelegateeKey = getDelegateeKey;
    // developer related
    function getDeveloperKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.developerSubstore.concat(accKeyHex);
    }
    Keys.getDeveloperKey = getDeveloperKey;
    function getDeveloperPrefix() {
        return _KEYS.developerSubstore;
    }
    Keys.getDeveloperPrefix = getDeveloperPrefix;
    function getDeveloperListKey() {
        return _KEYS.developerListSubstore;
    }
    Keys.getDeveloperListKey = getDeveloperListKey;
    // infra related
    function getInfraProviderKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.infraProviderSubstore.concat(accKeyHex);
    }
    Keys.getInfraProviderKey = getInfraProviderKey;
    function getInfraProviderListKey() {
        return _KEYS.infraProviderListSubstore;
    }
    Keys.getInfraProviderListKey = getInfraProviderListKey;
    // account related
    function getAccountInfoKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.accountInfoSubstore.concat(accKeyHex);
    }
    Keys.getAccountInfoKey = getAccountInfoKey;
    function getAccountBankKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.accountBankSubstore.concat(accKeyHex);
    }
    Keys.getAccountBankKey = getAccountBankKey;
    function getAccountMetaKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.accountMetaSubstore.concat(accKeyHex);
    }
    Keys.getAccountMetaKey = getAccountMetaKey;
    function getAccountPendingCoinDayQueueKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.accountPendingCoinDayQueueSubstore.concat(accKeyHex);
    }
    Keys.getAccountPendingCoinDayQueueKey = getAccountPendingCoinDayQueueKey;
    function getRewardKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.accountRewardSubstore.concat(accKeyHex);
    }
    Keys.getRewardKey = getRewardKey;
    function getPendingCoinDayQueueKey(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountPendingCoinDayQueueSubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getPendingCoinDayQueueKey = getPendingCoinDayQueueKey;
    function getGrantPubKeyPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountGrantPubKeySubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getGrantPubKeyPrefix = getGrantPubKeyPrefix;
    // TODO: should the pubKey be string or crypto.PubKey?
    function getGrantPubKeyKey(me, pubKey) {
        const pubKeyHex = ByteBuffer.fromUTF8(pubKey).toHex();
        return getGrantPubKeyPrefix(me).concat(pubKeyHex);
    }
    Keys.getGrantPubKeyKey = getGrantPubKeyKey;
    // post related
    function getPermlink(author, postID) {
        return author.concat('#').concat(postID);
    }
    Keys.getPermlink = getPermlink;
    function getPostInfoPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.postInfoSubStore.concat(meHex);
    }
    Keys.getPostInfoPrefix = getPostInfoPrefix;
    function getPostInfoKey(permlink) {
        const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
        return _KEYS.postInfoSubStore.concat(permlinkHex);
    }
    Keys.getPostInfoKey = getPostInfoKey;
    function getPostMetaPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.postMetaSubStore.concat(meHex);
    }
    Keys.getPostMetaPrefix = getPostMetaPrefix;
    function getPostMetaKey(permlink) {
        const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
        return _KEYS.postMetaSubStore.concat(permlinkHex);
    }
    Keys.getPostMetaKey = getPostMetaKey;
    function getPostReportOrUpvotePrefix(permlink) {
        const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
        return _KEYS.postReportOrUpvoteSubStore.concat(permlinkHex).concat(_KEYS.sep);
    }
    Keys.getPostReportOrUpvotePrefix = getPostReportOrUpvotePrefix;
    function getPostReportOrUpvoteKey(permlink, user) {
        const userHex = ByteBuffer.fromUTF8(user).toHex();
        return getPostReportOrUpvotePrefix(permlink).concat(userHex);
    }
    Keys.getPostReportOrUpvoteKey = getPostReportOrUpvoteKey;
    function getPostViewPrefix(permlink) {
        const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
        return _KEYS.postViewsSubStore.concat(permlinkHex).concat(_KEYS.sep);
    }
    Keys.getPostViewPrefix = getPostViewPrefix;
    function getPostViewKey(permlink, viewUser) {
        const viewUserHex = ByteBuffer.fromUTF8(viewUser).toHex();
        return getPostViewPrefix(permlink).concat(viewUserHex);
    }
    Keys.getPostViewKey = getPostViewKey;
    function getPostCommentPrefix(permlink) {
        const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
        return _KEYS.postCommentSubStore.concat(permlinkHex).concat(_KEYS.sep);
    }
    Keys.getPostCommentPrefix = getPostCommentPrefix;
    function getPostCommentKey(permlink, commentPermlink) {
        const commentPermlinkHex = ByteBuffer.fromUTF8(commentPermlink).toHex();
        return getPostCommentPrefix(permlink).concat(commentPermlinkHex);
    }
    Keys.getPostCommentKey = getPostCommentKey;
    function getPostDonationsPrefix(permlink) {
        const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
        return _KEYS.postDonationsSubStore.concat(permlinkHex).concat(_KEYS.sep);
    }
    Keys.getPostDonationsPrefix = getPostDonationsPrefix;
    function getPostDonationsKey(permlink, donateUser) {
        const donateUserHex = ByteBuffer.fromUTF8(donateUser).toHex();
        return getPostDonationsPrefix(permlink).concat(donateUserHex);
    }
    Keys.getPostDonationsKey = getPostDonationsKey;
    // proposal related
    function getOngoingProposalKey(proposalID) {
        const proposalIDHex = ByteBuffer.fromUTF8(proposalID).toHex();
        return _KEYS.ongoingProposalSubStore.concat(proposalIDHex);
    }
    Keys.getOngoingProposalKey = getOngoingProposalKey;
    function getExpiredProposalKey(proposalID) {
        const proposalIDHex = ByteBuffer.fromUTF8(proposalID).toHex();
        return _KEYS.expiredProposalSubStore.concat(proposalIDHex);
    }
    Keys.getExpiredProposalKey = getExpiredProposalKey;
    function getNextProposalIDKey() {
        return _KEYS.nextProposalIDSubstore;
    }
    Keys.getNextProposalIDKey = getNextProposalIDKey;
    function getOngoingProposalPrefix() {
        return _KEYS.ongoingProposalSubStore;
    }
    Keys.getOngoingProposalPrefix = getOngoingProposalPrefix;
    function getExpiredProposalPrefix() {
        return _KEYS.expiredProposalSubStore;
    }
    Keys.getExpiredProposalPrefix = getExpiredProposalPrefix;
    // param related
    function getEvaluateOfContentValueParamKey() {
        return _KEYS.evaluateOfContentValueParamSubStore;
    }
    Keys.getEvaluateOfContentValueParamKey = getEvaluateOfContentValueParamKey;
    function getGlobalAllocationParamKey() {
        return _KEYS.allocationParamSubStore;
    }
    Keys.getGlobalAllocationParamKey = getGlobalAllocationParamKey;
    function getInfraInternalAllocationParamKey() {
        return _KEYS.infraInternalAllocationParamSubStore;
    }
    Keys.getInfraInternalAllocationParamKey = getInfraInternalAllocationParamKey;
    function getDeveloperParamKey() {
        return _KEYS.developerParamSubStore;
    }
    Keys.getDeveloperParamKey = getDeveloperParamKey;
    function getVoteParamKey() {
        return _KEYS.voteParamSubStore;
    }
    Keys.getVoteParamKey = getVoteParamKey;
    function getValidatorParamKey() {
        return _KEYS.validatorParamSubStore;
    }
    Keys.getValidatorParamKey = getValidatorParamKey;
    function getProposalParamKey() {
        return _KEYS.proposalParamSubStore;
    }
    Keys.getProposalParamKey = getProposalParamKey;
    function getCoinDayParamKey() {
        return _KEYS.coinDayParamSubStore;
    }
    Keys.getCoinDayParamKey = getCoinDayParamKey;
    function getBandwidthParamKey() {
        return _KEYS.bandwidthParamSubStore;
    }
    Keys.getBandwidthParamKey = getBandwidthParamKey;
    function getAccountParamKey() {
        return _KEYS.accountParamSubstore;
    }
    Keys.getAccountParamKey = getAccountParamKey;
    function getPostParamKey() {
        return _KEYS.postParamSubStore;
    }
    Keys.getPostParamKey = getPostParamKey;
    function getReputationParamKey() {
        return _KEYS.reputationParamSubStore;
    }
    Keys.getReputationParamKey = getReputationParamKey;
    function getGlobalMetaKey() {
        return _KEYS.globalMetaSubStore;
    }
    Keys.getGlobalMetaKey = getGlobalMetaKey;
    function getInflationPoolKey() {
        return _KEYS.inflationPoolSubStore;
    }
    Keys.getInflationPoolKey = getInflationPoolKey;
    function getConsumptionMetaKey() {
        return _KEYS.consumptionMetaSubStore;
    }
    Keys.getConsumptionMetaKey = getConsumptionMetaKey;
    function getTimeEventKey(time) {
        return _KEYS.timeEventListSubStore.concat(time);
    }
    Keys.getTimeEventKey = getTimeEventKey;
    function getTimeEventPrefix() {
        return _KEYS.timeEventListSubStore;
    }
    Keys.getTimeEventPrefix = getTimeEventPrefix;
    function getTPSKey() {
        return _KEYS.tpsSubStore;
    }
    Keys.getTPSKey = getTPSKey;
    function getTimeKey() {
        return _KEYS.timeSubStore;
    }
    Keys.getTimeKey = getTimeKey;
    function getLinoStakeStatKey(day) {
        const dayHex = ByteBuffer.fromUTF8(day).toHex();
        return _KEYS.linoStakeStatSubStore.concat(dayHex);
    }
    Keys.getLinoStakeStatKey = getLinoStakeStatKey;
    function getUserReputationMetaKey(username) {
        const usernameHex = ByteBuffer.fromUTF8(username).toHex();
        return _KEYS.repUserMetaSubStore.concat(usernameHex);
    }
    Keys.getUserReputationMetaKey = getUserReputationMetaKey;
    function getPostReputationMetaKey(permlink) {
        const permlinkHex = ByteBuffer.fromUTF8(permlink).toHex();
        return _KEYS.repPostMetaSubStore.concat(permlinkHex);
    }
    Keys.getPostReputationMetaKey = getPostReputationMetaKey;
})(Keys || (Keys = {}));
var Keys$1 = Keys;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var utils_1 = createCommonjsModule(function (module, exports) {

var utils = exports;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg !== 'string') {
    for (var i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
    return res;
  }
  if (enc === 'hex') {
    msg = msg.replace(/[^a-z0-9]+/ig, '');
    if (msg.length % 2 !== 0)
      msg = '0' + msg;
    for (var i = 0; i < msg.length; i += 2)
      res.push(parseInt(msg[i] + msg[i + 1], 16));
  } else {
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      var hi = c >> 8;
      var lo = c & 0xff;
      if (hi)
        res.push(hi, lo);
      else
        res.push(lo);
    }
  }
  return res;
}
utils.toArray = toArray;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
utils.zero2 = zero2;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

utils.encode = function encode(arr, enc) {
  if (enc === 'hex')
    return toHex(arr);
  else
    return arr;
};
});

class Transport {
    constructor(opt) {
        this._rpc = new Rpc(opt.nodeUrl); // create with nodeUrl
        this._chainId = opt.chainId || 'test-chain-z0QKeL';
    }
    query(keys, storeName, subStoreName) {
        // transport: get path and key for ABCIQuery and return result
        // get transport's node and do ABCIQuery
        // rpc client do rpc call
        // check resp
        var path = `/custom/${storeName}/${subStoreName}`;
        keys.forEach(key => {
            path += '/' + key;
        });
        return this._rpc.abciQuery(path, '').then(result => {
            if (!result.response || !result.response.value) {
                throw new Error('Query failed: Empty result');
            }
            const jsonStr = ByteBuffer.atob(result.response.value);
            return decodeObject(JSON.parse(jsonStr));
        });
    }
    querySubspace(subspace, storeName, getKeyBy) {
        // transport: get path and key for ABCIQuery and return result
        // get transport's node and do ABCIQuery
        // rpc client do rpc call
        // check resp
        const path = `/store/${storeName}/subspace-js`;
        return this._rpc.abciQuery(path, subspace).then(result => {
            if (!result.response || !result.response.value) {
                throw new Error('QuerySubspace failed: Empty result');
            }
            const resValStr = ByteBuffer.atob(result.response.value);
            let resKVs = JSON.parse(resValStr);
            let rst = [];
            if (resKVs === null) {
                return rst;
            }
            for (let i = 0; i < resKVs.length; i++) {
                const rawKey = ByteBuffer.atob(resKVs[i].key);
                let keyStr = '';
                switch (getKeyBy) {
                    case exports.GetKeyBy.GetHexSubstringAfterKeySeparator: {
                        keyStr = Keys$1.getHexSubstringAfterKeySeparator(rawKey);
                        break;
                    }
                    case exports.GetKeyBy.GetSubstringAfterKeySeparator: {
                        keyStr = Keys$1.getSubstringAfterKeySeparator(rawKey);
                        break;
                    }
                    default: {
                        keyStr = rawKey;
                    }
                }
                const jsonValueStr = ByteBuffer.atob(resKVs[i].value);
                let value = JSON.parse(jsonValueStr);
                let item = { key: keyStr, value: decodeObject(value) };
                rst.push(item);
            }
            return rst;
        });
    }
    block(height) {
        return this._rpc.block(height).then(result => {
            return result;
        });
    }
    // Does the private key decoding from hex, sign message,
    // build transaction to broadcast
    signBuildBroadcast(msg, msgType, privKeyHex, seq) {
        // private key from hex
        var ec = new elliptic.ec('secp256k1');
        var key = ec.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
        // XXX: side effect on msg
        convertMsg(msg);
        const stdMsg = {
            type: msgType,
            value: encodeMsg(msg)
        };
        // signmsg
        var msgs = new Array(stdMsg);
        const jsonStr = encodeSignMsg(msgs, this._chainId, seq);
        // sign to get signature
        const signMsgHash = shajs('sha256')
            .update(jsonStr)
            .digest();
        const sig = key.sign(signMsgHash, { canonical: true });
        const sigDERHex = utils_1.encode(sig.r.toArray().concat(sig.s.toArray()), 'hex');
        // build tx
        const tx = encodeTx(msgs, key.getPublic(true, 'hex'), sigDERHex, seq);
        // return broadcast
        return this._rpc.broadcastTxCommit(tx).then(result => {
            if (result.check_tx.code !== undefined) {
                throw new BroadcastError(exports.BroadCastErrorEnum.CheckTx, result.check_tx.log, result.check_tx.code);
            }
            else if (result.deliver_tx.code !== undefined) {
                throw new BroadcastError(exports.BroadCastErrorEnum.DeliverTx, result.deliver_tx.log, result.deliver_tx.code);
            }
            return result;
        });
    }
}
(function (BroadCastErrorEnum) {
    BroadCastErrorEnum[BroadCastErrorEnum["CheckTx"] = 0] = "CheckTx";
    BroadCastErrorEnum[BroadCastErrorEnum["DeliverTx"] = 1] = "DeliverTx";
})(exports.BroadCastErrorEnum || (exports.BroadCastErrorEnum = {}));
(function (GetKeyBy) {
    GetKeyBy[GetKeyBy["GetSubstringAfterKeySeparator"] = 0] = "GetSubstringAfterKeySeparator";
    GetKeyBy[GetKeyBy["GetHexSubstringAfterKeySeparator"] = 1] = "GetHexSubstringAfterKeySeparator";
    GetKeyBy[GetKeyBy["GetSubstringAfterSubstore"] = 2] = "GetSubstringAfterSubstore";
})(exports.GetKeyBy || (exports.GetKeyBy = {}));
// How to extend Error in TS2.1+:
// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
class BroadcastError extends Error {
    constructor(type, log, code) {
        super(log);
        Object.setPrototypeOf(this, BroadcastError.prototype);
        this.type = type;
        this.code = code;
    }
}

function genPrivKeyHex() {
    const ec = new elliptic.ec('secp256k1');
    const rawKey = ec.genKeyPair().getPrivate('hex');
    return encodePrivKey(rawKey);
}
function pubKeyFromPrivate(privKeyHex) {
    var ec = new elliptic.ec('secp256k1');
    var key = ec.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
    const rawKey = key.getPublic(true, 'hex');
    return encodePubKey(rawKey);
}
function isValidUsername(username) {
    const regValid = /^[a-z]([a-z0-9-\\.]){1,19}[a-z0-9]$/;
    const matchValid = regValid.exec(username);
    if (matchValid === null) {
        return false;
    }
    const regInvalid = /^[a-z0-9\\.-]*([-\\.]){2,}[a-z0-9\\.-]*$/;
    const matchInvalid = regInvalid.exec(username);
    return matchInvalid === null;
}
function isKeyMatch(privKeyHex, pubKeyHex) {
    const ec = new elliptic.ec('secp256k1');
    var key = ec.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
    return key.getPublic(true, 'hex').toUpperCase() == decodePubKey(pubKeyHex);
}
// deterministically generates new priv-key bytes from provided key.
function derivePrivKey(privKeyHex) {
    const ec = new elliptic.ec('secp256k1');
    const keyHash = shajs('sha256')
        .update(privKeyHex)
        .digest();
    var key = ec.genKeyPair({ entropy: keyHash });
    return encodePrivKey(key.getPrivate('hex'));
}
// Sign msg
function signWithSha256(msg, privKeyHex) {
    // private key from hex
    var ec = new elliptic.ec('secp256k1');
    var key = ec.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
    const signByte = shajs('sha256')
        .update(msg)
        .digest();
    // sign to get signature
    const sig = key.sign(signByte, { canonical: true });
    console.log('======>', utils_1.encode(sig.r.toArray().concat(sig.s.toArray()), 'hex'));
    const sigDERHex = utils_1.encode(sig.r.toArray().concat(sig.s.toArray()), 'hex');
    return sigDERHex;
}
// Sign msg
function verifyWithSha256(msg, pubKeyHex, signature) {
    // private key from hex
    var ec = new elliptic.ec('secp256k1');
    var key = ec.keyFromPublic(decodePubKey(pubKeyHex), 'hex');
    // signmsg
    const signByte = shajs('sha256')
        .update(msg)
        .digest();
    // sign to get signaturegit stat
    const res = key.verify(signByte, signature);
    return res;
}

var index = /*#__PURE__*/Object.freeze({
  genPrivKeyHex: genPrivKeyHex,
  pubKeyFromPrivate: pubKeyFromPrivate,
  isValidUsername: isValidUsername,
  isKeyMatch: isKeyMatch,
  derivePrivKey: derivePrivKey,
  signWithSha256: signWithSha256,
  verifyWithSha256: verifyWithSha256
});

class Query {
    constructor(transport) {
        this._transport = transport;
    }
    /**
     * doesUsernameMatchResetPrivKey returns true if a user has the reset private key.
     *
     * @param username
     * @param resetPrivKeyHex
     */
    doesUsernameMatchResetPrivKey(username, resetPrivKeyHex) {
        return this.getAccountInfo(username).then(info => {
            if (info == null) {
                return false;
            }
            return isKeyMatch(resetPrivKeyHex, info.reset_key);
        });
    }
    /**
     * doesUsernameMatchTxPrivKey returns true if a user has the transaction private key.
     *
     * @param username
     * @param txPrivKeyHex
     */
    doesUsernameMatchTxPrivKey(username, txPrivKeyHex) {
        return this.getAccountInfo(username).then(info => {
            if (info == null) {
                return false;
            }
            return isKeyMatch(txPrivKeyHex, info.transaction_key);
        });
    }
    /**
     * doesUsernameMatchAppPrivKey returns true if a user has the app private key.
     *
     * @param username
     * @param appPrivKeyHex
     */
    doesUsernameMatchAppPrivKey(username, appPrivKeyHex) {
        return this.getAccountInfo(username).then(info => {
            if (info == null) {
                return false;
            }
            return isKeyMatch(appPrivKeyHex, info.app_key);
        });
    }
    // validator related query
    /**
     * getAllValidators returns all oncall validators from blockchain.
     */
    getAllValidators() {
        const ValidatorKVStoreKey = Keys$1.KVSTOREKEYS.ValidatorKVStoreKey;
        const ValidatorListSubStore = Keys$1.KVSTOREKEYS.ValidatorListSubStore;
        return this._transport.query([''], ValidatorKVStoreKey, ValidatorListSubStore);
    }
    /**
     * getValidator returns validator info given a validator name from blockchain.
     *
     * @param username: the validator username
     */
    getValidator(username) {
        const ValidatorKVStoreKey = Keys$1.KVSTOREKEYS.ValidatorKVStoreKey;
        const ValidatorSubStore = Keys$1.KVSTOREKEYS.ValidatorSubStore;
        return this._transport.query([username], ValidatorKVStoreKey, ValidatorSubStore);
    }
    // account related query
    /**
     * getSeqNumber returns the next sequence number of a user which should
     * be used for broadcast.
     *
     * @param username
     */
    getSeqNumber(username) {
        return this.getAccountMeta(username).then(meta => {
            return +meta.sequence;
        });
    }
    /**
     * getAccountMeta returns account meta info for a specific user.
     *
     * @param username
     */
    getAccountMeta(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        const AccountMetaSubStore = Keys$1.KVSTOREKEYS.AccountMetaSubStore;
        return this._transport.query([username], AccountKVStoreKey, AccountMetaSubStore);
    }
    /**
     * getPendingCoinDayQueue returns account pending coin day for a specific user.
     *
     * @param username
     */
    getPendingCoinDayQueue(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        const AccountPendingCoinDaySubStore = Keys$1.KVSTOREKEYS.AccountPendingCoinDaySubStore;
        return this._transport.query([username], AccountKVStoreKey, AccountPendingCoinDaySubStore);
    }
    /**
     * getAccountBank returns account bank info for a specific user.
     *
     * @param username
     */
    getAccountBank(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        const AccountBankSubStore = Keys$1.KVSTOREKEYS.AccountBankSubStore;
        return this._transport.query([username], AccountKVStoreKey, AccountBankSubStore);
    }
    /**
     * getAccountInfo returns account info for a specific user.
     *
     * @param username
     */
    getAccountInfo(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        const AccountInfoSubStore = Keys$1.KVSTOREKEYS.AccountInfoSubStore;
        return this._transport
            .query([username], AccountKVStoreKey, AccountInfoSubStore)
            .then(info => {
            const res = {
                username: info.username,
                created_at: info.created_at,
                reset_key: encodePubKey(convertToRawPubKey(info.reset_key)),
                transaction_key: encodePubKey(convertToRawPubKey(info.transaction_key)),
                app_key: encodePubKey(convertToRawPubKey(info.app_key))
            };
            return res;
        });
    }
    /**
     * getGrantPubKey returns the specific granted pubkey info of a user
     * that has given to the pubKey.
     *
     * @param username
     * @param grantTo
     * @param permission
     */
    getGrantPubKey(username, grantTo, permission) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        const AccountGrantPubKeySubStore = Keys$1.KVSTOREKEYS.AccountGrantPubKeySubStore;
        return this._transport.query([username, grantTo, permission], AccountKVStoreKey, AccountGrantPubKeySubStore);
    }
    /**
     * getAllGrantPubKeys returns a list of all granted public keys of a user.
     *
     * @param username
     */
    getAllGrantPubKeys(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        const AccountAllGrantPubKeys = Keys$1.KVSTOREKEYS.AccountAllGrantPubKeys;
        return this._transport.query([username], AccountKVStoreKey, AccountAllGrantPubKeys);
    }
    /**
     * getReward returns rewards of a user.
     *
     * @param username
     */
    getReward(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        const AccountRewardSubStore = Keys$1.KVSTOREKEYS.AccountRewardSubStore;
        return this._transport.query([username], AccountKVStoreKey, AccountRewardSubStore);
    }
    // post related query
    /**
     * getAllPosts returns all posts the author created.
     *
     * @param author
     */
    // getAllPosts(author: string): Promise<ResultKV<string, PostInfo>[]> {
    //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    //   return this._transport.querySubspace<PostInfo>(
    //     Keys.getPostInfoPrefix(author),
    //     PostKVStoreKey,
    //     GetKeyBy.GetSubstringAfterSubstore
    //   );
    // }
    /**
     * getPostComment returns a specific comment of a post given the post permlink
     * and comment permlink.
     *
     * @param author
     * @param postID
     * @param commentPermlink
     */
    // getPostComment(author: string, postID: string, commentPermlink: string): Promise<Comment> {
    //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    //   const Permlink = Keys.getPermlink(author, postID);
    //   return this._transport.query<Comment>(
    //     Keys.getPostCommentKey(Permlink, commentPermlink),
    //     PostKVStoreKey
    //   );
    // }
    /**
     * getPostAllComments returns all comments that a post has.
     *
     * @param author
     * @param postID
     */
    // getPostAllComments(author: string, postID: string): Promise<ResultKV<string, Comment>[]> {
    //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    //   const Permlink = Keys.getPermlink(author, postID);
    //   return this._transport.querySubspace<Comment>(
    //     Keys.getPostCommentPrefix(Permlink),
    //     PostKVStoreKey,
    //     GetKeyBy.GetSubstringAfterKeySeparator
    //   );
    // }
    /**
     * getPostView returns a view of a post performed by a user.
     *
     * @param author
     * @param postID
     * @param viewUser
     */
    // getPostView(author: string, postID: string, viewUser: string): Promise<View> {
    //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    //   const Permlink = Keys.getPermlink(author, postID);
    //   return this._transport.query<View>(Keys.getPostViewKey(Permlink, viewUser), PostKVStoreKey);
    // }
    /**
     * getPostAllViews returns all views that a post has.
     *
     * @param author
     * @param postID
     */
    // getPostAllViews(author: string, postID: string): Promise<ResultKV<string, View>[]> {
    //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    //   const Permlink = Keys.getPermlink(author, postID);
    //   return this._transport.querySubspace<View>(
    //     Keys.getPostViewPrefix(Permlink),
    //     PostKVStoreKey,
    //     GetKeyBy.GetSubstringAfterKeySeparator
    //   );
    // }
    /**
     * getPostDonations returns all donations that a user has given to a post.
     *
     * @param author
     * @param postID
     * @param donateUser
     */
    // getPostDonations(author: string, postID: string, donateUser: string): Promise<Donations> {
    //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    //   const Permlink = Keys.getPermlink(author, postID);
    //   return this._transport.query<Donations>(
    //     Keys.getPostDonationsKey(Permlink, donateUser),
    //     PostKVStoreKey
    //   );
    // }
    /**
     * getPostAllDonations returns all donations that a post has received.
     *
     * @param author
     * @param postID
     */
    // getPostAllDonations(author: string, postID: string): Promise<ResultKV<string, Donations>[]> {
    //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    //   const Permlink = Keys.getPermlink(author, postID);
    //   return this._transport.querySubspace<Donations>(
    //     Keys.getPostDonationsPrefix(Permlink),
    //     PostKVStoreKey,
    //     GetKeyBy.GetSubstringAfterKeySeparator
    //   );
    // }
    /**
     * getPostReportOrUpvote returns report or upvote that a user has given to a post.
     *
     * @param author
     * @param postID
     * @param user
     */
    getPostReportOrUpvote(author, postID, user) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostReportOrUpvoteSubStore = Keys$1.KVSTOREKEYS.PostReportOrUpvoteSubStore;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query([Permlink, user], PostKVStoreKey, PostReportOrUpvoteSubStore);
    }
    /**
     * getPostAllReportOrUpvotes returns all reports or upvotes that a post has received.
     *
     * @param author
     * @param postID
     */
    // getPostAllReportOrUpvotes(
    //   author: string,
    //   postID: string
    // ): Promise<ResultKV<string, ReportOrUpvote>[]> {
    //   const PostKVStoreKey = Keys.KVSTOREKEYS.PostKVStoreKey;
    //   const Permlink = Keys.getPermlink(author, postID);
    //   return this._transport.querySubspace<ReportOrUpvote>(
    //     Keys.getPostReportOrUpvotePrefix(Permlink),
    //     PostKVStoreKey,
    //     GetKeyBy.GetSubstringAfterKeySeparator
    //   );
    // }
    /**
     * getPostInfo returns post info given a permlink(author#postID).
     *
     * @param author
     * @param postID
     */
    getPostInfo(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostInfoSubStore = Keys$1.KVSTOREKEYS.PostInfoSubStore;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query([Permlink], PostKVStoreKey, PostInfoSubStore);
    }
    /**
     * getPostMeta returns post meta given a permlink.
     *
     * @param author
     * @param postID
     */
    getPostMeta(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostMetaSubStore = Keys$1.KVSTOREKEYS.PostMetaSubStore;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query([Permlink], PostKVStoreKey, PostMetaSubStore);
    }
    // vote related query
    /**
     * GetDelegation returns the delegation relationship between
     * a voter and a delegator from blockchain.
     *
     * @param voter
     * @param delegator
     */
    getDelegation(voter, delegator) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        const DelegationSubStore = Keys$1.KVSTOREKEYS.DelegationSubStore;
        return this._transport
            .query([voter, delegator], VoteKVStoreKey, DelegationSubStore)
            .then(result => {
            return result;
        });
    }
    /**
     * getVoterAllDelegation returns all delegations that are delegated to a voter.
     *
     * @param voter
     */
    // getVoterAllDelegation(voter: string): Promise<ResultKV<string, Delegation>[]> {
    //   const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    //   return this._transport.querySubspace<Delegation>(
    //     Keys.getDelegationPrefix(voter),
    //     VoteKVStoreKey,
    //     GetKeyBy.GetSubstringAfterKeySeparator
    //   );
    // }
    /**
     * getDelegatorAllDelegation returns all delegations that a delegator has delegated to.
     *
     * @param delegatorName
     */
    // getDelegatorAllDelegation(delegatorName: string): Promise<ResultKV<string, Delegation>[]> {
    //   const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    //   return this._transport.querySubspace<Delegation>(
    //     Keys.getDelegateePrefix(delegatorName),
    //     VoteKVStoreKey,
    //     GetKeyBy.GetSubstringAfterKeySeparator
    //   );
    // }
    /**
     * getVoter returns voter info given a voter name from blockchain.
     *
     * @param voterName
     */
    getVoter(voterName) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        const VoterSubStore = Keys$1.KVSTOREKEYS.VoterSubStore;
        return this._transport.query([voterName], VoteKVStoreKey, VoterSubStore);
    }
    /**
     * getVote returns a vote performed by a voter for a given proposal.
     *
     * @param proposalID
     * @param voter
     */
    getVote(proposalID, voter) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        const VoteSubStore = Keys$1.KVSTOREKEYS.VoteSubStore;
        return this._transport.query([proposalID, voter], VoteKVStoreKey, VoteSubStore);
    }
    /**
     * getProposalAllVotes returns all votes of a given proposal.
     *
     * @param proposalID
     */
    // getProposalAllVotes(proposalID: string): Promise<ResultKV<string, Vote>[]> {
    //   const VoteKVStoreKey = Keys.KVSTOREKEYS.VoteKVStoreKey;
    //   return this._transport.querySubspace<Vote>(
    //     Keys.getVotePrefix(proposalID),
    //     VoteKVStoreKey,
    //     GetKeyBy.GetSubstringAfterKeySeparator
    //   );
    // }
    // developer related query
    /**
     * getDeveloper returns a specific developer info from blockchain
     *
     * @param developerName
     */
    getDeveloper(developerName) {
        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
        const DeveloperSubStore = Keys$1.KVSTOREKEYS.DeveloperSubStore;
        return this._transport.query([developerName], DeveloperKVStoreKey, DeveloperSubStore);
    }
    /**
     * getDevelopers returns a list of develop.
     */
    getDevelopers() {
        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
        const DeveloperListSubStore = Keys$1.KVSTOREKEYS.DeveloperListSubStore;
        return this._transport.query([], DeveloperKVStoreKey, DeveloperListSubStore);
    }
    /**
     * getDeveloperList returns a list of developer name.
     */
    getDeveloperList() {
        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
        const DeveloperListSubStore = Keys$1.KVSTOREKEYS.DeveloperListSubStore;
        return this._transport.query([], DeveloperKVStoreKey, DeveloperListSubStore);
    }
    // infra related query
    /**
     * getInfraProvider returns the infra provider info such as usage.
     *
     * @param providerName
     */
    getInfraProvider(providerName) {
        const InfraKVStoreKey = Keys$1.KVSTOREKEYS.InfraKVStoreKey;
        const InfraProviderSubStore = Keys$1.KVSTOREKEYS.InfraProviderSubStore;
        return this._transport.query([providerName], InfraKVStoreKey, InfraProviderSubStore);
    }
    /**
     * getInfraProviders returns a list of all infra providers.
     */
    getInfraProviders() {
        const InfraKVStoreKey = Keys$1.KVSTOREKEYS.InfraKVStoreKey;
        const InfraListSubStore = Keys$1.KVSTOREKEYS.InfraListSubStore;
        return this._transport.query([], InfraKVStoreKey, InfraListSubStore);
    }
    // proposal related query
    /**
     * GetProposalList returns a list of all ongoing proposals.
     */
    getOngoingProposalList() {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        return this._transport.querySubspace(Keys$1.getOngoingProposalPrefix(), ProposalKVStoreKey, exports.GetKeyBy.GetSubstringAfterSubstore);
    }
    /**
     * GetExpiredProposalList returns a list of all ongoing proposals.
     */
    getExpiredProposalList() {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        return this._transport.querySubspace(Keys$1.getExpiredProposalPrefix(), ProposalKVStoreKey, exports.GetKeyBy.GetSubstringAfterSubstore);
    }
    /**
     * getProposal returns ongoing proposal info of a specific proposalID.
     *
     * @param proposalID
     */
    getOngoingProposal(proposalID) {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        const OngoingProposalSubStore = Keys$1.KVSTOREKEYS.OngoingProposalSubStore;
        return this._transport.query([proposalID], ProposalKVStoreKey, OngoingProposalSubStore);
    }
    /**
     * getProposal returns expired proposal info of a specific proposalID.
     * @param proposalID
     */
    getExpiredProposal(proposalID) {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        const ExpiredProposalSubStore = Keys$1.KVSTOREKEYS.ExpiredProposalSubStore;
        return this._transport.query([proposalID], ProposalKVStoreKey, ExpiredProposalSubStore);
    }
    /**
     * getNextProposalID returns the next proposal id
     */
    getNextProposalID() {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        const NextProposalIDSubStore = Keys$1.KVSTOREKEYS.NextProposalIDSubStore;
        return this._transport.query([], ProposalKVStoreKey, NextProposalIDSubStore);
    }
    // param related query
    /**
     * getEvaluateOfContentValueParam returns the EvaluateOfContentValueParam.
     */
    // getEvaluateOfContentValueParam(): Promise<Types.EvaluateOfContentValueParam> {
    //   const ParamKVStoreKey = Keys.KVSTOREKEYS.ParamKVStoreKey;
    //   return this._transport.query<Types.EvaluateOfContentValueParam>(
    //     Keys.getEvaluateOfContentValueParamKey(),
    //     ParamKVStoreKey
    //   );
    // }
    /**
     * getGlobalAllocationParam returns the GlobalAllocationParam.
     */
    getGlobalAllocationParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const AllocationParamSubStore = Keys$1.KVSTOREKEYS.AllocationParamSubStore;
        return this._transport.query([], ParamKVStoreKey, AllocationParamSubStore);
    }
    /**
     * getInfraInternalAllocationParam returns the InfraInternalAllocationParam.
     */
    getInfraInternalAllocationParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const InfraInternalAllocationParamSubStore = Keys$1.KVSTOREKEYS.InfraInternalAllocationParamSubStore;
        return this._transport.query([], ParamKVStoreKey, InfraInternalAllocationParamSubStore);
    }
    /**
     * getDeveloperParam returns the DeveloperParam.
     */
    getDeveloperParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const DeveloperParamSubStore = Keys$1.KVSTOREKEYS.DeveloperParamSubStore;
        return this._transport.query([], ParamKVStoreKey, DeveloperParamSubStore);
    }
    /**
     * getVoteParam returns the VoteParam.
     */
    getVoteParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const VoteParamSubStore = Keys$1.KVSTOREKEYS.VoteParamSubStore;
        return this._transport.query([], ParamKVStoreKey, VoteParamSubStore);
    }
    /**
     * getProposalParam returns the ProposalParam.
     */
    getProposalParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const ProposalParamSubStore = Keys$1.KVSTOREKEYS.ProposalParamSubStore;
        return this._transport.query([], ParamKVStoreKey, ProposalParamSubStore);
    }
    /**
     * getValidatorParam returns the ValidatorParam.
     */
    getValidatorParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const ValidatorParamSubStore = Keys$1.KVSTOREKEYS.ValidatorParamSubStore;
        return this._transport.query([], ParamKVStoreKey, ValidatorParamSubStore);
    }
    /**
     * getCoinDayParam returns the CoinDayParam.
     */
    getCoinDayParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const CoinDayParamSubStore = Keys$1.KVSTOREKEYS.CoinDayParamSubStore;
        return this._transport.query([], ParamKVStoreKey, CoinDayParamSubStore);
    }
    /**
     * getBandwidthParam returns the BandwidthParam.
     */
    getBandwidthParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const BandwidthParamSubStore = Keys$1.KVSTOREKEYS.BandwidthParamSubStore;
        return this._transport.query([], ParamKVStoreKey, BandwidthParamSubStore);
    }
    /**
     * getAccountParam returns the AccountParam.
     */
    getAccountParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const AccountParamSubStore = Keys$1.KVSTOREKEYS.AccountParamSubStore;
        return this._transport.query([], ParamKVStoreKey, AccountParamSubStore);
    }
    /**
     * getGlobalMeta returns the GlobalMeta.
     */
    getGlobalMeta() {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        const GlobalMetaSubStore = Keys$1.KVSTOREKEYS.GlobalMetaSubStore;
        return this._transport.query([], GlobalKVStoreKey, GlobalMetaSubStore);
    }
    /**
     * getConsumptionMeta returns the consumption meta.
     */
    getConsumptionMeta() {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        const ConsumptionMetaSubStore = Keys$1.KVSTOREKEYS.ConsumptionMetaSubStore;
        return this._transport.query([], GlobalKVStoreKey, ConsumptionMetaSubStore);
    }
    /**
     * getGlobalTime returns the time in global storage.
     */
    getGlobalTime() {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        const GlobalTimeSubStore = Keys$1.KVSTOREKEYS.GlobalTimeSubStore;
        return this._transport.query([], GlobalKVStoreKey, GlobalTimeSubStore);
    }
    /**
     * getInterest returns the interest a voter can get.
     */
    getInterest(username) {
        return new Promise((resolve, reject) => {
            this.getVoter(username)
                .then(voter => {
                this.getGlobalTime()
                    .then(globalTime => {
                    var pastDay = Math.floor((Number(voter.last_power_change_at) - Number(globalTime.chain_start_time)) /
                        (3600 * 24));
                    pastDay = pastDay > 0 ? pastDay : 0;
                    var currentDay = Math.floor((Number(globalTime.last_block_time) - Number(globalTime.chain_start_time)) /
                        (3600 * 24));
                    currentDay = currentDay > 0 ? currentDay : 0;
                    var promises = [];
                    for (var day = pastDay; day < currentDay; day++) {
                        const stat = this.getLinoStakeStat(String(day)).then(linoStakeStat => {
                            return linoStakeStat;
                        });
                        promises.push(stat);
                    }
                    var interest = Number(voter.interest.amount);
                    Promise.all(promises).then(allInterest => {
                        if (allInterest != null) {
                            allInterest.forEach(stat => {
                                if (stat !== null && Number(stat.unclaimed_lino_power.amount) > 0) {
                                    interest += Number(((Number(voter.lino_stake.amount) /
                                        Number(stat.unclaimed_lino_power.amount)) *
                                        Number(stat.unclaimed_friction.amount)).toFixed(5));
                                }
                            });
                            resolve(interest.toFixed(5));
                        }
                    });
                })
                    .catch(err => {
                    reject(err);
                });
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    /**
     * getPastDay returns the blockchain past day.
     */
    getPastDay() {
        return new Promise((resolve, reject) => {
            this.getGlobalTime()
                .then(globalTime => {
                var currentDay = Math.floor((Number(globalTime.last_block_time) - Number(globalTime.chain_start_time)) / (3600 * 24));
                currentDay = currentDay > 0 ? currentDay : 0;
                resolve(currentDay);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    /**
     * getEventAtTime returns the events at certain second.
     */
    getLinoStakeStat(day) {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        const LinoStakeStatSubStore = Keys$1.KVSTOREKEYS.LinoStakeStatSubStore;
        return this._transport.query([day], GlobalKVStoreKey, LinoStakeStatSubStore);
    }
    /**
     * getEventAtTime returns the events at certain second.
     */
    getEventAtTime(time) {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        const TimeEventListSubStore = Keys$1.KVSTOREKEYS.TimeEventListSubStore;
        return this._transport.query([time], GlobalKVStoreKey, TimeEventListSubStore);
    }
    /**
     * getAllEventAtAllTime returns all registered events.
     */
    // getAllEventAtAllTime(): Promise<any> {
    //   const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    //   return this._transport.querySubspace<any>(
    //     Keys.getTimeEventPrefix(),
    //     GlobalKVStoreKey,
    //     GetKeyBy.GetSubstringAfterSubstore
    //   );
    // }
    /**
     * getAllEventAtAllTimeAtCertainHeight returns all registered events at certain height.
     */
    // getAllEventAtAllTimeAtCertainHeight(height): Promise<any> {
    //   const GlobalKVStoreKey = Keys.KVSTOREKEYS.GlobalKVStoreKey;
    //   return this._transport.querySubspace<any>(
    //     Keys.getTimeEventPrefix(),
    //     GlobalKVStoreKey,
    //     GetKeyBy.GetSubstringAfterSubstore
    //   );
    // }
    /**
     * getPostParam returns the PostParam.
     */
    getPostParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const PostParamSubStore = Keys$1.KVSTOREKEYS.PostParamSubStore;
        return this._transport.query([], ParamKVStoreKey, PostParamSubStore);
    }
    /**
     * getReputationParam returns the ReputationParam.
     */
    getReputationParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        const ReputationParamSubStore = Keys$1.KVSTOREKEYS.ReputationParamSubStore;
        return this._transport.query([], ParamKVStoreKey, ReputationParamSubStore);
    }
    // block related
    /**
     * getBlock returns a block at a certain height from blockchain.
     *
     * @param height
     */
    getBlock(height) {
        return this._transport.block(height);
    }
    /**
     * getTxsInBlock returns all transactions in a block at a certain height from blockchain.
     * @param height
     */
    getTxsInBlock(height) {
        return this._transport.block(height).then(v => {
            return v && v.block && v.block.data && v.block.data.txs
                ? v.block.data.txs.map(tx => JSON.parse(ByteBuffer.atob(tx)))
                : [];
        });
    }
    /**
     * getUserReputationMeta returns a user's reputation meta.
     *
     * @param username: user name
     */
    // getUserReputationMeta(username: string): Promise<UserRepMeta> {
    //   const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
    //   const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
    //   return this._transport.query<UserRepMeta>(
    //     Keys.getUserReputationMetaKey(username),
    //     repKVStoreKey
    //   );
    // }
    /**
     * getUserReputationMeta returns a user's reputation meta.
     *
     * @param username: user name
     */
    getUserReputation(username) {
        const repKVStoreKey = Keys$1.KVSTOREKEYS.ReputationKVStoreKey;
        const ReputationSubStore = Keys$1.KVSTOREKEYS.ReputationSubStore;
        return this._transport.query([username], repKVStoreKey, ReputationSubStore);
    }
    /**
     * getPostReputationMeta returns a post's reputation meta.
     *
     * @param author: author of the post
     * @param postID: post ID of the post
     */
    // getPostReputationMeta(author: string, postID: string): Promise<PostRepMeta> {
    //   const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
    //   const Permlink = Keys.getPermlink(author, postID);
    //   return this._transport.query<PostRepMeta>(
    //     Keys.getPostReputationMetaKey(Permlink),
    //     repKVStoreKey
    //   );
    // }
    /**
     * getPenaltyScore returns a post's penalty score.
     *
     * @param author: author of the post
     * @param postID: post ID of the post
     */
    // getPenaltyScore(author: string, postID: string): Promise<number> {
    //   return new Promise((resolve, reject) => {
    //     const repKVStoreKey = Keys.KVSTOREKEYS.ReputationKVStoreKey;
    //     const Permlink = Keys.getPermlink(author, postID);
    //     this.getPostReputationMeta(author, postID)
    //       .then(meta => {
    //         if (Number(meta.SumRep) > 0) {
    //           resolve(0);
    //           return;
    //         }
    //         this.getPostParam()
    //           .then(param => {
    //             if (-Number(meta.SumRep) > Number(param.max_report_reputation.amount) * 100000) {
    //               resolve(1);
    //               return;
    //             }
    //             resolve(-Number(meta.SumRep) / (Number(param.max_report_reputation.amount) * 100000));
    //           })
    //           .catch(err => {
    //             reject(err);
    //           });
    //       })
    //       .catch(err => {
    //         reject(err);
    //       });
    //   });
    // }
    // @return false negative or larger than safe int.
    isValidNat(num) {
        // XXX(yumin): js's MAX_SAFE_INTEGER is less than 2^64.
        // TODO(yumin): use bigint to support large seq number.
        if (num < 0 || num > Number.MAX_SAFE_INTEGER) {
            return false;
        }
        return true;
    }
}
function isChangeParamProposalValue(value) {
    return 'param' in value && 'reason' in value;
}
function isContentCensorshipProposalValue(value) {
    return 'permLink' in value && 'reason' in value;
}
function isProtocolUpgradeProposalValue(value) {
    return 'link' in value && 'reason' in value;
}

class LINO {
    constructor(opt) {
        this._options = opt;
        this._transport = new Transport(opt);
        this._query = new Query(this._transport);
        this._broadcast = new Broadcast(this._transport);
    }
    get query() {
        return this._query;
    }
    get broadcast() {
        return this._broadcast;
    }
}

function isEvaluateOfContentValueParam(param) {
    return ('consumption_time_adjust_base' in param &&
        'consumption_time_adjust_offset' in param &&
        'num_of_consumption_on_author_offset' in param &&
        'total_amount_of_consumption_base' in param &&
        'total_amount_of_consumption_offset' in param &&
        'amount_of_consumption_exponent' in param);
}
function isGlobalAllocationParam(param) {
    return ('global_growth_rate' in param &&
        'infra_allocation' in param &&
        'content_creator_allocation' in param &&
        'developer_allocation' in param &&
        'validator_allocation' in param);
}
function isInfraInternalAllocationParam(param) {
    return 'storage_allocation' in param && 'CDN_allocation' in param;
}
function isVoteParam(param) {
    return ('min_stake_in' in param &&
        'voter_coin_return_interval_second' in param &&
        'voter_coin_return_times' in param &&
        'DelegatorCoinReturnIntervalSec' in param &&
        'delegator_coin_return_times' in param);
}
function isProposalParam(param) {
    return ('content_censorship_decide_second' in param &&
        'content_censorship_min_deposit' in param &&
        'content_censorship_pass_ratio' in param &&
        'content_censorship_pass_votes' in param &&
        'ChangeParamDecideSec' in param &&
        'ChangeParamExecutionSec' in param &&
        'change_param_min_deposit' in param &&
        'change_param_pass_ratio' in param &&
        'change_param_pass_votes' in param &&
        'protocol_upgrade_decide_second' in param &&
        'protocol_upgrade_min_deposit' in param &&
        'protocol_upgrade_pass_ratio' in param &&
        'protocol_upgrade_pass_votes' in param);
}
function isDeveloperParam(param) {
    return ('developer_min_deposit' in param &&
        'developer_coin_return_interval' in param &&
        'developer_coin_return_times' in param);
}
function isValidatorParam(param) {
    return ('validator_min_withdraw' in param &&
        'validator_min_voting_deposit' in param &&
        'validator_min_commiting_deposit' in param &&
        'validator_coin_return_second' in param &&
        'validator_coin_return_times' in param &&
        'penalty_miss_vote' in param &&
        'penalty_miss_commit' in param &&
        'penalty_byzantine' in param &&
        'validator_list_size' in param &&
        'absent_commit_limitation' in param);
}
function isCoinDayParam(param) {
    return 'seconds_to_recover_coin_day' in param;
}
function isBandwidthParam(param) {
    return ('seconds_to_recover_bandwidth' in param &&
        'capacity_usage_per_transaction' in param &&
        'virtual_coin' in param);
}
function isAccountParam(param) {
    return ('minimum_balance' in param &&
        'register_fee' in param &&
        'first_deposit_full_stake_limit' in param &&
        'max_num_frozen_money' in param);
}
function isPostParam(param) {
    return ('report_or_upvote_interval_second' in param &&
        'post_interval_sec' in param &&
        'max_report_reputation' in param);
}
function isReputationParam(param) {
    return 'best_content_index_n' in param;
}
(function (DETAILTYPE) {
    // Different possible incomes
    DETAILTYPE["TransferIn"] = "0";
    DETAILTYPE["DonationIn"] = "1";
    DETAILTYPE["ClaimReward"] = "2";
    DETAILTYPE["ValidatorInflation"] = "3";
    DETAILTYPE["DeveloperInflation"] = "4";
    DETAILTYPE["InfraInflation"] = "5";
    DETAILTYPE["VoteReturnCoin"] = "6";
    DETAILTYPE["DelegationReturnCoin"] = "7";
    DETAILTYPE["ValidatorReturnCoin"] = "8";
    DETAILTYPE["DeveloperReturnCoin"] = "9";
    DETAILTYPE["InfraReturnCoin"] = "10";
    DETAILTYPE["ProposalReturnCoin"] = "11";
    DETAILTYPE["GenesisCoin"] = "12";
    DETAILTYPE["ClaimInterest"] = "13";
    // Different possible outcomes
    DETAILTYPE["TransferOut"] = "20";
    DETAILTYPE["DonationOut"] = "21";
    DETAILTYPE["Delegate"] = "22";
    DETAILTYPE["VoterDeposit"] = "23";
    DETAILTYPE["ValidatorDeposit"] = "24";
    DETAILTYPE["DeveloperDeposit"] = "25";
    DETAILTYPE["InfraDeposit"] = "26";
    DETAILTYPE["ProposalDeposit"] = "27";
})(exports.DETAILTYPE || (exports.DETAILTYPE = {}));
(function (PERMISSION_TYPE) {
    // Different possible incomes
    // Different permission level for msg
    PERMISSION_TYPE["UnknownPermission"] = "0";
    PERMISSION_TYPE["AppPermission"] = "1";
    PERMISSION_TYPE["TransactionPermission"] = "2";
    PERMISSION_TYPE["ResetPermission"] = "3";
    PERMISSION_TYPE["GrantAppPermissio"] = "4";
    PERMISSION_TYPE["PreAuthorizationPermission"] = "5";
    PERMISSION_TYPE["AppAndPreAuthorizationPermission"] = "6";
})(exports.PERMISSION_TYPE || (exports.PERMISSION_TYPE = {}));

exports.LINO = LINO;
exports.UTILS = index;
exports.isEvaluateOfContentValueParam = isEvaluateOfContentValueParam;
exports.isGlobalAllocationParam = isGlobalAllocationParam;
exports.isInfraInternalAllocationParam = isInfraInternalAllocationParam;
exports.isVoteParam = isVoteParam;
exports.isProposalParam = isProposalParam;
exports.isDeveloperParam = isDeveloperParam;
exports.isValidatorParam = isValidatorParam;
exports.isCoinDayParam = isCoinDayParam;
exports.isBandwidthParam = isBandwidthParam;
exports.isAccountParam = isAccountParam;
exports.isPostParam = isPostParam;
exports.isReputationParam = isReputationParam;
exports.isChangeParamProposalValue = isChangeParamProposalValue;
exports.isContentCensorshipProposalValue = isContentCensorshipProposalValue;
exports.isProtocolUpgradeProposalValue = isProtocolUpgradeProposalValue;
exports.Transport = Transport;
exports.BroadcastError = BroadcastError;
exports.genPrivKeyHex = genPrivKeyHex;
exports.pubKeyFromPrivate = pubKeyFromPrivate;
exports.isValidUsername = isValidUsername;
exports.isKeyMatch = isKeyMatch;
exports.derivePrivKey = derivePrivKey;
exports.signWithSha256 = signWithSha256;
exports.verifyWithSha256 = verifyWithSha256;
//# sourceMappingURL=lino-js.cjs.js.map
