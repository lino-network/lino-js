import ByteBuffer from 'bytebuffer';
import shajs from 'sha.js';
import fetch from 'cross-fetch';
import { ec } from 'elliptic';

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
    const jsonStr = JSON.stringify(number2StringInObject(stdTx));
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
            if (decodedResult[key] && typeof decodedResult[key] !== 'string') {
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
            if (encodeResult[key] && typeof encodeResult[key] !== 'string') {
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
    const signMsgHash = shajs('sha256')
        .update(jsonStr)
        .digest();
    return signMsgHash;
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
     * @param redistribution_split_rate: new re-spot split rate
     * @param links: new links of the post
     * @param privKeyHex: the private key of the author
     * @param seq: the sequence number of the author for the next transaction
     */
    updatePost(author, title, post_id, content, redistribution_split_rate, links, privKeyHex, seq) {
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
            redistribution_split_rate: redistribution_split_rate,
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
    ValidatorRevoke(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ValRevokeMsgType, privKeyHex, seq);
    }
    // vote related
    /**
     * VoterDeposit deposits a certain amount of LINO token for a user
     * in order to become a voter.
     * It composes VoterDepositMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the user whot wants to deposit money for being a voter
     * @param deposit: the amount of LINO token the user wants to deposit
     * @param privKeyHex: the private key of the user
     * @param seq: the sequence number of the user for the next transaction
     */
    voterDeposit(username, deposit, privKeyHex, seq) {
        const msg = {
            deposit: deposit,
            username: username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.VoteDepositMsgType, privKeyHex, seq);
    }
    /**
     * VoterWithdraw withdraws part of LINO token from a voter's deposit,
     * while still keep being a voter.
     * It composes VoterWithdrawMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the voter username
     * @param amount: the amount of LINO token the voter wants to withdraw
     * @param privKeyHex: the private key of the voter
     * @param seq: the sequence number of the voter for the next transaction
     */
    voterWithdraw(username, amount, privKeyHex, seq) {
        const msg = {
            amount: amount,
            username: username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.VoteWithdrawMsgType, privKeyHex, seq);
    }
    /**
     * VoterRevoke reovkes all deposited LINO token of a voter
     * so the user will not be a voter anymore.
     * It composes VoterRevokeMsg and then broadcasts the transaction to blockchain.
     *
     * @param username: the voter username
     * @param privKeyHex: the private key of the voter
     * @param seq: the sequence number of the voter for the next transaction
     */
    voterRevoke(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.VoteRevokeMsgType, privKeyHex, seq);
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
    /**
     * RevokeDelegation reovkes all delegated LINO token of a delegator to a voter
     * so there is no delegation between the two users.
     * It composes RevokeDelegationMsg and then broadcasts the transaction to blockchain    *
     *
     * @param delegator: the delegator username
     * @param voter: the voter username
     * @param privKeyHex: the private key of the delegator
     * @param seq: the sequence number of the delegator for the next transaction
     */
    revokeDelegation(delegator, voter, privKeyHex, seq) {
        const msg = {
            delegator,
            voter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DelegateRevokeMsgType, privKeyHex, seq);
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
    grantPermission(username, authorized_app, validity_period_second, grant_level, privKeyHex, seq) {
        const msg = {
            username,
            authorized_app,
            validity_period_second,
            grant_level
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
    revokePermission(username, public_key, privKeyHex, seq) {
        const msg = {
            username: username,
            public_key: decodePubKey(public_key)
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
    VoteDepositMsgType: 'lino/voteDeposit',
    VoteRevokeMsgType: 'lino/voteRevoke',
    VoteWithdrawMsgType: 'lino/voteWithdraw',
    DelegateMsgType: 'lino/delegate',
    DelegateWithdrawMsgType: 'lino/delegateWithdraw',
    DelegateRevokeMsgType: 'lino/delegateRevoke',
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

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

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
                    height: height
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
        ProposalKVStoreKey: 'proposal'
    };
    const _KEYS = {
        validatorSubstore: '00',
        validatorListSubstore: '01',
        delegationSubstore: '00',
        voterSubstore: '01',
        voteSubstore: '02',
        referenceListSubStore: '03',
        delegateeSubStore: '04',
        proposalSubstore: '00',
        proposalListSubStore: '01',
        nextProposalIDSubstore: '02',
        developerSubstore: '00',
        developerListSubstore: '01',
        infraProviderSubstore: '00',
        infraProviderListSubstore: '01',
        accountInfoSubstore: '00',
        accountBankSubstore: '01',
        accountMetaSubstore: '02',
        accountFollowerSubstore: '03',
        accountFollowingSubstore: '04',
        accountRewardSubstore: '05',
        accountPendingStakeQueueSubstore: '06',
        accountRelationshipSubstore: '07',
        accountBalanceHistorySubstore: '08',
        accountGrantPubKeySubstore: '09',
        accountRewardHistorySubstore: '0a',
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
        timeEventListSubStore: '00',
        globalMetaSubStore: '01',
        inflationPoolSubStore: '02',
        consumptionMetaSubStore: '03',
        tpsSubStore: '04',
        sep: ByteBuffer.fromUTF8('/').toHex(),
        separator: '/'
    };
    function getHexSubstringAfterKeySeparator(key) {
        return key.substr(key.indexOf(_KEYS.separator) + 1, key.length);
    }
    Keys.getHexSubstringAfterKeySeparator = getHexSubstringAfterKeySeparator;
    function getSubstringAfterKeySeparator(key) {
        return key.substr(key.indexOf(_KEYS.separator) + 1, key.length);
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
    function getFollowerPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountFollowerSubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getFollowerPrefix = getFollowerPrefix;
    function getFollowingPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountFollowingSubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getFollowingPrefix = getFollowingPrefix;
    function getFollowerKey(me, myFollower) {
        const myFollowerHex = ByteBuffer.fromUTF8(myFollower).toHex();
        return getFollowerPrefix(me).concat(myFollowerHex);
    }
    Keys.getFollowerKey = getFollowerKey;
    function getFollowingKey(me, myFollowing) {
        const myFollowingHex = ByteBuffer.fromUTF8(myFollowing).toHex();
        return getFollowingPrefix(me).concat(myFollowingHex);
    }
    Keys.getFollowingKey = getFollowingKey;
    function getRewardKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.accountRewardSubstore.concat(accKeyHex);
    }
    Keys.getRewardKey = getRewardKey;
    function getRewardHistoryPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountRewardHistorySubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getRewardHistoryPrefix = getRewardHistoryPrefix;
    function getRewardHistoryKey(me, bucketSlot) {
        const bucketSlotHex = ByteBuffer.fromUTF8(bucketSlot).toHex();
        return getRewardHistoryPrefix(me).concat(bucketSlotHex);
    }
    Keys.getRewardHistoryKey = getRewardHistoryKey;
    function getRelationshipPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountRelationshipSubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getRelationshipPrefix = getRelationshipPrefix;
    function getRelationshipKey(me, other) {
        const otherHex = ByteBuffer.fromUTF8(other).toHex();
        return getRelationshipPrefix(me).concat(otherHex);
    }
    Keys.getRelationshipKey = getRelationshipKey;
    function getBalanceHistoryPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountBalanceHistorySubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getBalanceHistoryPrefix = getBalanceHistoryPrefix;
    function getBalanceHistoryKey(me, bucketSlot) {
        const bucketSlotHex = ByteBuffer.fromUTF8(bucketSlot).toHex();
        return getBalanceHistoryPrefix(me).concat(bucketSlotHex);
    }
    Keys.getBalanceHistoryKey = getBalanceHistoryKey;
    function getGrantPubKeyPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountGrantPubKeySubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getGrantPubKeyPrefix = getGrantPubKeyPrefix;
    // TODO: should the pubKey be string or crypto.PubKey?
    function getgrantPubKeyKey(me, pubKey) {
        const pubKeyHex = ByteBuffer.fromUTF8(pubKey).toHex();
        return getGrantPubKeyPrefix(me).concat(pubKeyHex);
    }
    Keys.getgrantPubKeyKey = getgrantPubKeyKey;
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
    function getProposalKey(proposalID) {
        const proposalIDHex = ByteBuffer.fromUTF8(proposalID).toHex();
        return _KEYS.proposalSubstore.concat(proposalIDHex);
    }
    Keys.getProposalKey = getProposalKey;
    function getProposalListKey() {
        return _KEYS.proposalListSubStore;
    }
    Keys.getProposalListKey = getProposalListKey;
    function getNextProposalIDKey() {
        return _KEYS.nextProposalIDSubstore;
    }
    Keys.getNextProposalIDKey = getNextProposalIDKey;
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
})(Keys || (Keys = {}));
var Keys$1 = Keys;

class Transport {
    constructor(opt) {
        this._rpc = new Rpc(opt.nodeUrl); // create with nodeUrl
        this._chainId = opt.chainId || 'test-chain-z0QKeL';
    }
    query(key, storeName) {
        // transport: get path and key for ABCIQuery and return result
        // get transport's node and do ABCIQuery
        // rpc client do rpc call
        // check resp
        const path = `/store/${storeName}/key`;
        return this._rpc.abciQuery(path, key).then(result => {
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
                    case GetKeyBy.GetHexSubstringAfterKeySeparator: {
                        keyStr = Keys$1.getHexSubstringAfterKeySeparator(rawKey);
                        break;
                    }
                    case GetKeyBy.GetSubstringAfterKeySeparator: {
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
        var ec$$1 = new ec('secp256k1');
        var key = ec$$1.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
        // XXX: side effect on msg
        convertMsg(msg);
        const stdMsg = {
            type: msgType,
            value: encodeMsg(msg)
        };
        // signmsg
        var msgs = new Array(stdMsg);
        const signMsgHash = encodeSignMsg(msgs, this._chainId, seq);
        // sign to get signature
        const sig = key.sign(signMsgHash, { canonical: true });
        const sigDERHex = sig.toDER('hex');
        // build tx
        const tx = encodeTx(msgs, key.getPublic(true, 'hex'), sigDERHex, seq);
        // return broadcast
        return this._rpc.broadcastTxCommit(tx).then(result => {
            if (result.check_tx.code !== undefined) {
                throw new BroadcastError(BroadCastErrorEnum.CheckTx, result.check_tx.log, result.check_tx.code);
            }
            else if (result.deliver_tx.code !== undefined) {
                throw new BroadcastError(BroadCastErrorEnum.DeliverTx, result.deliver_tx.log, result.deliver_tx.code);
            }
            return result;
        });
    }
}
var BroadCastErrorEnum;
(function (BroadCastErrorEnum) {
    BroadCastErrorEnum[BroadCastErrorEnum["CheckTx"] = 0] = "CheckTx";
    BroadCastErrorEnum[BroadCastErrorEnum["DeliverTx"] = 1] = "DeliverTx";
})(BroadCastErrorEnum || (BroadCastErrorEnum = {}));
var GetKeyBy;
(function (GetKeyBy) {
    GetKeyBy[GetKeyBy["GetSubstringAfterKeySeparator"] = 0] = "GetSubstringAfterKeySeparator";
    GetKeyBy[GetKeyBy["GetHexSubstringAfterKeySeparator"] = 1] = "GetHexSubstringAfterKeySeparator";
    GetKeyBy[GetKeyBy["GetSubstringAfterSubstore"] = 2] = "GetSubstringAfterSubstore";
})(GetKeyBy || (GetKeyBy = {}));
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
    const ec$$1 = new ec('secp256k1');
    const rawKey = ec$$1.genKeyPair().getPrivate('hex');
    return encodePrivKey(rawKey);
}
function pubKeyFromPrivate(privKeyHex) {
    var ec$$1 = new ec('secp256k1');
    var key = ec$$1.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
    const rawKey = key.getPublic(true, 'hex');
    return encodePubKey(rawKey);
}
function isValidUsername(username) {
    const reg = /^[a-z0-9]([a-z0-9_-]){2,20}$/;
    const match = reg.exec(username);
    return match != null;
}
function isKeyMatch(privKeyHex, pubKeyHex) {
    const ec$$1 = new ec('secp256k1');
    var key = ec$$1.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
    return key.getPublic(true, 'hex').toUpperCase() == decodePubKey(pubKeyHex);
}
// deterministically generates new priv-key bytes from provided key.
function derivePrivKey(privKeyHex) {
    const ec$$1 = new ec('secp256k1');
    const keyHash = shajs('sha256')
        .update(privKeyHex)
        .digest();
    var key = ec$$1.genKeyPair({ entropy: keyHash });
    return encodePrivKey(key.getPrivate('hex'));
}
// Sign msg
function signWithSha256(msg, privKeyHex) {
    // private key from hex
    var ec$$1 = new ec('secp256k1');
    var key = ec$$1.keyFromPrivate(decodePrivKey(privKeyHex), 'hex');
    const signByte = shajs('sha256')
        .update(msg)
        .digest();
    // sign to get signature
    const sig = key.sign(signByte, { canonical: true });
    return sig.toDER('hex');
}
// Sign msg
function verifyWithSha256(msg, pubKeyHex, signature) {
    // private key from hex
    var ec$$1 = new ec('secp256k1');
    var key = ec$$1.keyFromPublic(decodePubKey(pubKeyHex), 'hex');
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
        return this._transport.query(Keys$1.getValidatorListKey(), ValidatorKVStoreKey);
    }
    /**
     * getValidator returns validator info given a validator name from blockchain.
     *
     * @param username: the validator username
     */
    getValidator(username) {
        const ValidatorKVStoreKey = Keys$1.KVSTOREKEYS.ValidatorKVStoreKey;
        return this._transport.query(Keys$1.getValidatorKey(username), ValidatorKVStoreKey);
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
     * getAllBalanceHistory returns all transaction history related to
     * a user's account balance, in reverse-chronological order.
     *
     * @param username
     */
    getAllBalanceHistory(username) {
        return this.getAccountBank(username).then(bank => {
            let res = { details: [] };
            if (Number(bank.number_of_transaction) == 0) {
                return res;
            }
            let numberOfbundle = (Number(bank.number_of_transaction) - 1) / 100;
            let promises = [];
            for (var i = 0; i <= numberOfbundle; ++i) {
                promises.push(this.getBalanceHistoryBundle(username, i));
            }
            return Promise.all(promises).then(bundles => {
                bundles.reduce((prev, curr) => {
                    prev.details.push(...curr.details);
                    return prev;
                }, res);
                res.details.reverse();
                return res;
            });
        });
    }
    /**
     * getBalanceHistoryBundle returns all balance history in a certain bucket.
     *
     * @param username
     * @param index
     */
    getBalanceHistoryBundle(username, index) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getBalanceHistoryKey(username, index.toString()), AccountKVStoreKey);
    }
    /**
     * getAccountMeta returns account meta info for a specific user.
     *
     * @param username
     */
    getAccountMeta(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getAccountMetaKey(username), AccountKVStoreKey);
    }
    /**
     * getAccountBank returns account bank info for a specific user.
     *
     * @param username
     */
    getAccountBank(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getAccountBankKey(username), AccountKVStoreKey);
    }
    /**
     * getAccountInfo returns account info for a specific user.
     *
     * @param username
     */
    getAccountInfo(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport
            .query(Keys$1.getAccountInfoKey(username), AccountKVStoreKey)
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
     * @param pubKeyHex
     */
    getGrantPubKey(username, pubKeyHex) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        const publicKey = decodePubKey(pubKeyHex);
        return this._transport.query(Keys$1.getgrantPubKeyKey(username, publicKey), AccountKVStoreKey);
    }
    /**
     * getAllGrantPubKeys returns a list of all granted public keys of a user.
     *
     * @param username
     */
    getAllGrantPubKeys(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.querySubspace(Keys$1.getGrantPubKeyPrefix(username), AccountKVStoreKey, GetKeyBy.GetHexSubstringAfterKeySeparator);
    }
    /**
     * getReward returns rewards of a user.
     *
     * @param username
     */
    getReward(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getRewardKey(username), AccountKVStoreKey);
    }
    /**
     * getAllRewardHistory returns all reward history related to
     * a user's posts reward, in reverse-chronological order.
     *
     * @param username
     */
    getAllRewardHistory(username) {
        return this.getAccountBank(username).then(bank => {
            let res = { details: [] };
            if (Number(bank.number_of_reward) == 0) {
                return res;
            }
            let numberOfbundle = (Number(bank.number_of_reward) - 1) / 100;
            let promises = [];
            for (var i = 0; i <= numberOfbundle; ++i) {
                promises.push(this.getRewardHistoryBundle(username, i));
            }
            return Promise.all(promises).then(bundles => {
                bundles.reduce((prev, curr) => {
                    prev.details.push(...curr.details);
                    return prev;
                }, res);
                res.details.reverse();
                return res;
            });
        });
    }
    /**
     * getRewardHistoryBundle returns all reward history in a certain bucket.
     *
     * @param username
     * @param index
     */
    getRewardHistoryBundle(username, index) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getRewardHistoryKey(username, index.toString()), AccountKVStoreKey);
    }
    /**
     * getRelationship returns the donation times of two users.
     *
     * @param me
     * @param other
     */
    getRelationship(me, other) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getRelationshipKey(me, other), AccountKVStoreKey);
    }
    /**
     * getAllRelationships returns all donation relationship of a user.
     *
     * @param username
     */
    getAllRelationships(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.querySubspace(Keys$1.getRelationshipPrefix(username), AccountKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    /**
     * getFollowerMeta returns the follower meta of two users.
     *
     * @param me
     * @param myFollower
     */
    getFollowerMeta(me, myFollower) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getFollowerKey(me, myFollower), AccountKVStoreKey);
    }
    /**
     * getAllFollowerMeta returns all follower meta of a user.
     *
     * @param username
     */
    getAllFollowerMeta(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.querySubspace(Keys$1.getFollowerPrefix(username), AccountKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    /**
     * getFollowingMeta returns the following meta of two users.
     *
     * @param me
     * @param myFollowing
     */
    getFollowingMeta(me, myFollowing) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getFollowingKey(me, myFollowing), AccountKVStoreKey);
    }
    /**
     * getAllFollowingMeta returns all following meta of a user.
     *
     * @param username
     */
    getAllFollowingMeta(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.querySubspace(Keys$1.getFollowingPrefix(username), AccountKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    // post related query
    /**
     * getAllPosts returns all posts the author created.
     *
     * @param author
     */
    getAllPosts(author) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        return this._transport.querySubspace(Keys$1.getPostInfoPrefix(author), PostKVStoreKey, GetKeyBy.GetSubstringAfterSubstore);
    }
    /**
     * getPostComment returns a specific comment of a post given the post permlink
     * and comment permlink.
     *
     * @param author
     * @param postID
     * @param commentPermlink
     */
    getPostComment(author, postID, commentPermlink) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query(Keys$1.getPostCommentKey(Permlink, commentPermlink), PostKVStoreKey);
    }
    /**
     * getPostAllComments returns all comments that a post has.
     *
     * @param author
     * @param postID
     */
    getPostAllComments(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.querySubspace(Keys$1.getPostCommentPrefix(Permlink), PostKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    /**
     * getPostView returns a view of a post performed by a user.
     *
     * @param author
     * @param postID
     * @param viewUser
     */
    getPostView(author, postID, viewUser) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query(Keys$1.getPostViewKey(Permlink, viewUser), PostKVStoreKey);
    }
    /**
     * getPostAllViews returns all views that a post has.
     *
     * @param author
     * @param postID
     */
    getPostAllViews(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.querySubspace(Keys$1.getPostViewPrefix(Permlink), PostKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    /**
     * getPostDonations returns all donations that a user has given to a post.
     *
     * @param author
     * @param postID
     * @param donateUser
     */
    getPostDonations(author, postID, donateUser) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query(Keys$1.getPostDonationsKey(Permlink, donateUser), PostKVStoreKey);
    }
    /**
     * getPostAllDonations returns all donations that a post has received.
     *
     * @param author
     * @param postID
     */
    getPostAllDonations(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.querySubspace(Keys$1.getPostDonationsPrefix(Permlink), PostKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    /**
     * getPostReportOrUpvote returns report or upvote that a user has given to a post.
     *
     * @param author
     * @param postID
     * @param user
     */
    getPostReportOrUpvote(author, postID, user) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query(Keys$1.getPostReportOrUpvoteKey(Permlink, user), PostKVStoreKey);
    }
    /**
     * getPostAllReportOrUpvotes returns all reports or upvotes that a post has received.
     *
     * @param author
     * @param postID
     */
    getPostAllReportOrUpvotes(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.querySubspace(Keys$1.getPostReportOrUpvotePrefix(Permlink), PostKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    /**
     * getPostInfo returns post info given a permlink(author#postID).
     *
     * @param author
     * @param postID
     */
    getPostInfo(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query(Keys$1.getPostInfoKey(Permlink), PostKVStoreKey);
    }
    /**
     * getPostMeta returns post meta given a permlink.
     *
     * @param author
     * @param postID
     */
    getPostMeta(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const Permlink = Keys$1.getPermlink(author, postID);
        return this._transport.query(Keys$1.getPostMetaKey(Permlink), PostKVStoreKey);
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
        return this._transport
            .query(Keys$1.getDelegationKey(voter, delegator), VoteKVStoreKey)
            .then(result => {
            return result;
        });
    }
    /**
     * getVoterAllDelegation returns all delegations that are delegated to a voter.
     *
     * @param voter
     */
    getVoterAllDelegation(voter) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        return this._transport.querySubspace(Keys$1.getDelegationPrefix(voter), VoteKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    /**
     * getDelegatorAllDelegation returns all delegations that a delegator has delegated to.
     *
     * @param delegatorName
     */
    getDelegatorAllDelegation(delegatorName) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        return this._transport.querySubspace(Keys$1.getDelegateePrefix(delegatorName), VoteKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    /**
     * getVoter returns voter info given a voter name from blockchain.
     *
     * @param voterName
     */
    getVoter(voterName) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        return this._transport.query(Keys$1.getVoterKey(voterName), VoteKVStoreKey);
    }
    /**
     * getVote returns a vote performed by a voter for a given proposal.
     *
     * @param proposalID
     * @param voter
     */
    getVote(proposalID, voter) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        return this._transport.query(Keys$1.getVoteKey(proposalID, voter), VoteKVStoreKey);
    }
    /**
     * getProposalAllVotes returns all votes of a given proposal.
     *
     * @param proposalID
     */
    getProposalAllVotes(proposalID) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        return this._transport.querySubspace(Keys$1.getVotePrefix(proposalID), VoteKVStoreKey, GetKeyBy.GetSubstringAfterKeySeparator);
    }
    // developer related query
    /**
     * getDeveloper returns a specific developer info from blockchain
     *
     * @param developerName
     */
    getDeveloper(developerName) {
        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
        return this._transport.query(Keys$1.getDeveloperKey(developerName), DeveloperKVStoreKey);
    }
    /**
     * getDevelopers returns a list of develop.
     */
    getDevelopers() {
        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
        return this._transport.querySubspace(Keys$1.getDeveloperPrefix(), DeveloperKVStoreKey, GetKeyBy.GetSubstringAfterSubstore);
    }
    /**
     * getDeveloperList returns a list of developer name.
     */
    getDeveloperList() {
        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
        return this._transport.query(Keys$1.getDeveloperListKey(), DeveloperKVStoreKey);
    }
    // infra related query
    /**
     * getInfraProvider returns the infra provider info such as usage.
     *
     * @param providerName
     */
    getInfraProvider(providerName) {
        const InfraKVStoreKey = Keys$1.KVSTOREKEYS.InfraKVStoreKey;
        return this._transport.query(Keys$1.getInfraProviderKey(providerName), InfraKVStoreKey);
    }
    /**
     * getInfraProviders returns a list of all infra providers.
     */
    getInfraProviders() {
        const InfraKVStoreKey = Keys$1.KVSTOREKEYS.InfraKVStoreKey;
        return this._transport.query(Keys$1.getInfraProviderListKey(), InfraKVStoreKey);
    }
    // proposal related query
    /**
     * GetProposalList returns a list of all proposals, including onging
     * proposals and past ones.
     */
    getProposalList() {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        return this._transport.query(Keys$1.getProposalListKey(), ProposalKVStoreKey);
    }
    /**
     * getProposal returns proposal info of a specific proposalID.
     *
     * @param proposalID
     */
    getProposal(proposalID) {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        return this._transport.query(Keys$1.getProposalKey(proposalID), ProposalKVStoreKey);
    }
    /**
     * getOngoingProposal returns all ongoing proposals.
     */
    getOngoingProposal() {
        return this.getProposalList().then(list => {
            return Promise.all((list.ongoing_proposal || []).map(p => this.getProposal(p)));
        });
    }
    /**
     * getExpiredProposal returns all past proposals.
     */
    getExpiredProposal() {
        return this.getProposalList().then(list => Promise.all((list.past_proposal || []).map(p => this.getProposal(p))));
    }
    /**
     * getNextProposalID returns the next proposal id
     */
    getNextProposalID() {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        return this._transport.query(Keys$1.getNextProposalIDKey(), ProposalKVStoreKey);
    }
    // param related query
    /**
     * getEvaluateOfContentValueParam returns the EvaluateOfContentValueParam.
     */
    getEvaluateOfContentValueParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getEvaluateOfContentValueParamKey(), ParamKVStoreKey);
    }
    /**
     * getGlobalAllocationParam returns the GlobalAllocationParam.
     */
    getGlobalAllocationParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getGlobalAllocationParamKey(), ParamKVStoreKey);
    }
    /**
     * getInfraInternalAllocationParam returns the InfraInternalAllocationParam.
     */
    getInfraInternalAllocationParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getInfraInternalAllocationParamKey(), ParamKVStoreKey);
    }
    /**
     * getDeveloperParam returns the DeveloperParam.
     */
    getDeveloperParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getDeveloperParamKey(), ParamKVStoreKey);
    }
    /**
     * getVoteParam returns the VoteParam.
     */
    getVoteParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getVoteParamKey(), ParamKVStoreKey);
    }
    /**
     * getProposalParam returns the ProposalParam.
     */
    getProposalParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getProposalParamKey(), ParamKVStoreKey);
    }
    /**
     * getValidatorParam returns the ValidatorParam.
     */
    getValidatorParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getValidatorParamKey(), ParamKVStoreKey);
    }
    /**
     * getCoinDayParam returns the CoinDayParam.
     */
    getCoinDayParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getCoinDayParamKey(), ParamKVStoreKey);
    }
    /**
     * getBandwidthParam returns the BandwidthParam.
     */
    getBandwidthParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getBandwidthParamKey(), ParamKVStoreKey);
    }
    /**
     * getAccountParam returns the AccountParam.
     */
    getAccountParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getAccountParamKey(), ParamKVStoreKey);
    }
    /**
     * getGlobalMeta returns the GlobalMeta.
     */
    getGlobalMeta() {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        return this._transport.query(Keys$1.getGlobalMetaKey(), GlobalKVStoreKey);
    }
    /**
     * getAccountParam returns the AccountParam.
     */
    getConsumptionMeta() {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        return this._transport.query(Keys$1.getConsumptionMetaKey(), GlobalKVStoreKey);
    }
    /**
     * getAccountParam returns the AccountParam.
     */
    getEventAtTime(time) {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        return this._transport.query(Keys$1.getTimeEventKey(time), GlobalKVStoreKey);
    }
    /**
     * getAccountParam returns the AccountParam.
     */
    getAllEventAtAllTime() {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        return this._transport.querySubspace(Keys$1.getTimeEventPrefix(), GlobalKVStoreKey, GetKeyBy.GetSubstringAfterSubstore);
    }
    /**
     * getAccountParam returns the AccountParam.
     */
    getAllEventAtAllTimeAtCertainHeight(height) {
        const GlobalKVStoreKey = Keys$1.KVSTOREKEYS.GlobalKVStoreKey;
        return this._transport.querySubspace(Keys$1.getTimeEventPrefix(), GlobalKVStoreKey, GetKeyBy.GetSubstringAfterSubstore);
    }
    /**
     * getPostParam returns the PostParam.
     */
    getPostParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getPostParamKey(), ParamKVStoreKey);
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
        return this._transport
            .block(height)
            .then(v => v && v.block && v.block.data && v.block.data.txs
            ? v.block.data.txs.map(tx => JSON.parse(ByteBuffer.atob(tx)))
            : []);
    }
    /**
     * getBalanceHistoryFromTo returns a list of transaction history in the range of [from, to],
     * that if to is larger than the number of tx, tx will be replaced by the larget tx number,
     * related to a user's account balance, in reverse-chronological order.
     *
     * @param username: user name
     * @param from: the start index of the balance history, inclusively
     * @param to: the end index of the balance history, inclusively
     */
    getBalanceHistoryFromTo(username, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidNat(from) || !this.isValidNat(to) || from > to) {
                throw new Error(`GetBalanceHistoryFromTo: from [${from}] or to [${to}] is invalid`);
            }
            let accountBank = yield this.getAccountBank(username);
            let rst = { details: [] };
            if (Number(accountBank.number_of_transaction) == 0) {
                return rst;
            }
            let maxTxIndex = Number(accountBank.number_of_transaction) - 1;
            if (from > maxTxIndex) {
                throw new Error(`GetBalanceHistoryFromTo: [${from}] is larger than total num of tx`);
            }
            if (to > maxTxIndex) {
                to = maxTxIndex;
            }
            // number of banlance history is wanted
            let numHistory = to - from + 1;
            let targetBucketOfTo = Math.floor(to / 100);
            let bucketSlot = targetBucketOfTo;
            // The index of 'to' in the target bucket
            let indexOfTo = to % 100;
            while (bucketSlot >= 0 && numHistory > 0) {
                let history = yield this.getBalanceHistoryBundle(username, bucketSlot);
                let startIndex = bucketSlot == targetBucketOfTo ? indexOfTo : history.details.length - 1;
                for (let i = startIndex; i >= 0 && numHistory > 0; i--) {
                    rst.details.push(history.details[i]);
                    numHistory--;
                }
                bucketSlot--;
            }
            return rst;
        });
    }
    /**
     * getRecentBalanceHistory returns a certain number of recent transaction history
     * related to a user's account balance, in reverse-chronological order.
     *
     * @param username: user name
     * @param numHistory: the number of balance history are wanted
     */
    getRecentBalanceHistory(username, numHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidNat(numHistory)) {
                throw new Error(`GetRecentBalanceHistory: numHistory is invalid: ${numHistory}`);
            }
            let accountBank = yield this.getAccountBank(username);
            let maxTxNo = Number(accountBank.number_of_transaction) - 1;
            let from = Math.max(0, maxTxNo - numHistory + 1);
            if (numHistory > Number(accountBank.number_of_transaction)) {
                from = 0;
            }
            return this.getBalanceHistoryFromTo(username, from, maxTxNo);
        });
    }
    /**
     * getRewardHistoryFromTo returns a list of reward history in the range of [from, to],
     * that if to is larger than the number of tx, tx will be replaced by the largest tx number,
     * related to a user's posts rewards, in reverse-chronological order.
     *
     * @param username: user name
     * @param from: the start index of the reward history, inclusively
     * @param to: the end index of the reward history, inclusively
     */
    getRewardHistoryFromTo(username, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidNat(from) || !this.isValidNat(to) || from > to) {
                throw new Error(`getRewardHistoryFromTo: from [${from}] or to [${to}] is invalid`);
            }
            let accountBank = yield this.getAccountBank(username);
            let rst = { details: [] };
            if (Number(accountBank.number_of_reward) == 0) {
                return rst;
            }
            let maxRewardIndex = Number(accountBank.number_of_reward) - 1;
            if (from > maxRewardIndex) {
                throw new Error(`getRewardHistoryFromTo: [${from}] is larger than total num of reward`);
            }
            if (to > maxRewardIndex) {
                to = maxRewardIndex;
            }
            // number of reward history is wanted
            let numReward = to - from + 1;
            let targetBucketOfTo = Math.floor(to / 100);
            let bucketSlot = targetBucketOfTo;
            // The index of 'to' in the target bucket
            let indexOfTo = to % 100;
            while (bucketSlot >= 0 && numReward > 0) {
                let history = yield this.getRewardHistoryBundle(username, bucketSlot);
                let startIndex = bucketSlot == targetBucketOfTo ? indexOfTo : history.details.length - 1;
                for (let i = startIndex; i >= 0 && numReward > 0; i--) {
                    rst.details.push(history.details[i]);
                    numReward--;
                }
                bucketSlot--;
            }
            return rst;
        });
    }
    /**
     * getRecentRewardHistory returns a certain number of recent reward history
     * related to a user's posts reward, in reverse-chronological order.
     *
     * @param username: user name
     * @param numReward: the number of reward history are wanted
     */
    getRecentRewardHistory(username, numReward) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidNat(numReward)) {
                throw new Error(`getRecentRewardHistory: numReward is invalid: ${numReward}`);
            }
            let accountBank = yield this.getAccountBank(username);
            let maxTxNo = Number(accountBank.number_of_reward) - 1;
            let from = Math.max(0, maxTxNo - numReward + 1);
            if (numReward > Number(accountBank.number_of_reward)) {
                from = 0;
            }
            return this.getRewardHistoryFromTo(username, from, maxTxNo);
        });
    }
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
    return ('infra_allocation' in param &&
        'content_creator_allocation' in param &&
        'developer_allocation' in param &&
        'validator_allocation' in param);
}
function isInfraInternalAllocationParam(param) {
    return 'storage_allocation' in param && 'CDN_allocation' in param;
}
function isVoteParam(param) {
    return ('voter_min_deposit' in param &&
        'voter_min_withdraw' in param &&
        'delegator_min_withdraw' in param &&
        'voter_coin_return_interval' in param &&
        'voter_coin_return_times' in param &&
        'delegator_coin_return_interval' in param &&
        'delegator_coin_return_times' in param);
}
function isProposalParam(param) {
    return ('content_censorship_decide_hr' in param &&
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
        'validator_coin_return_interval' in param &&
        'validator_coin_return_times' in param &&
        'penalty_miss_vote' in param &&
        'penalty_miss_commit' in param &&
        'penalty_byzantine' in param &&
        'validator_list_size' in param &&
        'absent_commit_limitation' in param);
}
function isCoinDayParam(param) {
    return 'days_to_recover_coin_day_stake' in param && 'seconds_to_recover_coin_day_stake' in param;
}
function isBandwidthParam(param) {
    return 'seconds_to_recover_bandwidth' in param && 'capacity_usage_per_transaction' in param;
}
function isAccountParam(param) {
    return ('minimum_balance' in param &&
        'register_fee' in param &&
        'first_deposit_full_stake_limit' in param);
}
function isPostParam(param) {
    return 'report_or_upvote_interval' in param;
}
// tx detail type
var DETAILTYPE;
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
    // Different possible outcomes
    DETAILTYPE["TransferOut"] = "13";
    DETAILTYPE["DonationOut"] = "14";
    DETAILTYPE["Delegate"] = "15";
    DETAILTYPE["VoterDeposit"] = "16";
    DETAILTYPE["ValidatorDeposit"] = "17";
    DETAILTYPE["DeveloperDeposit"] = "18";
    DETAILTYPE["InfraDeposit"] = "19";
    DETAILTYPE["ProposalDeposit"] = "20";
})(DETAILTYPE || (DETAILTYPE = {}));
// permission type
var PERMISSION_TYPE;
(function (PERMISSION_TYPE) {
    // Different possible incomes
    // Different permission level for msg
    PERMISSION_TYPE["UnknownPermission"] = "0";
    PERMISSION_TYPE["AppPermission"] = "1";
    PERMISSION_TYPE["TransactionPermission"] = "2";
    PERMISSION_TYPE["ResetPermission"] = "3";
    PERMISSION_TYPE["GrantAppPermissio"] = "4";
    PERMISSION_TYPE["PreAuthorizationPermission"] = "5";
})(PERMISSION_TYPE || (PERMISSION_TYPE = {}));

export { LINO, index as UTILS, isEvaluateOfContentValueParam, isGlobalAllocationParam, isInfraInternalAllocationParam, isVoteParam, isProposalParam, isDeveloperParam, isValidatorParam, isCoinDayParam, isBandwidthParam, isAccountParam, isPostParam, DETAILTYPE, PERMISSION_TYPE, isChangeParamProposalValue, isContentCensorshipProposalValue, isProtocolUpgradeProposalValue, Transport, BroadCastErrorEnum, GetKeyBy, BroadcastError, genPrivKeyHex, pubKeyFromPrivate, isValidUsername, isKeyMatch, derivePrivKey, signWithSha256, verifyWithSha256 };
//# sourceMappingURL=lino-js.esm.js.map
