import ByteBuffer from 'bytebuffer';
import shajs from 'sha.js';
import { ec } from 'elliptic';
import fetch from 'cross-fetch';

// return a new zero fee object
const getZeroFee = () => ({
    Amount: [],
    Gas: 0
});
function encodeTx(msg, msgType, rawPubKey, rawSigDER, seq) {
    const stdMsg = {
        type: msgType,
        value: encodeMsg(msg)
    };
    const stdSig = {
        pub_key: convertToInternalPubKey(rawPubKey, _TYPE.PubKeySecp256k1),
        signature: convertToInternalSig(rawSigDER, _TYPE.SignatureKeySecp256k1),
        sequence: seq
    };
    const stdTx = {
        msg: stdMsg,
        signatures: [stdSig],
        fee: getZeroFee()
    };
    const jsonStr = JSON.stringify(stdTx);
    return ByteBuffer.btoa(jsonStr);
}
function encodeMsg(msg) {
    var encodedMsg = Object.assign({}, msg);
    if ('new_master_public_key' in msg) {
        encodedMsg.new_master_public_key = convertToInternalPubKey(msg.new_master_public_key, _TYPE.PubKeySecp256k1);
    }
    if ('new_post_public_key' in msg) {
        encodedMsg.new_post_public_key = convertToInternalPubKey(msg.new_post_public_key, _TYPE.PubKeySecp256k1);
    }
    if ('new_transaction_public_key' in msg) {
        encodedMsg.new_transaction_public_key = convertToInternalPubKey(msg.new_transaction_public_key, _TYPE.PubKeySecp256k1);
    }
    if ('validator_public_key' in msg) {
        encodedMsg.validator_public_key = convertToInternalPubKey(msg.validator_public_key, _TYPE.PubKeyEd25519);
    }
    return encodedMsg;
}
function encodeSignMsg(msg, chainId, seq) {
    const fee = getZeroFee();
    const converted = convertMsg(msg);
    const stdSignMsg = {
        chain_id: chainId,
        sequences: [seq],
        fee_bytes: ByteBuffer.btoa(JSON.stringify(fee)),
        msg_bytes: ByteBuffer.btoa(JSON.stringify(converted)),
        alt_bytes: null
    };
    const jsonStr = JSON.stringify(stdSignMsg);
    const signMsgHash = shajs('sha256')
        .update(jsonStr)
        .digest();
    return signMsgHash;
}
function convertMsg(msg) {
    var encodedMsg = Object.assign({}, msg);
    if ('new_master_public_key' in msg) {
        var buffer = ByteBuffer.fromHex(msg.new_master_public_key);
        encodedMsg.new_master_public_key = getByteArray(buffer);
    }
    if ('new_post_public_key' in msg) {
        var buffer = ByteBuffer.fromHex(msg.new_post_public_key);
        encodedMsg.new_post_public_key = getByteArray(buffer);
    }
    if ('new_transaction_public_key' in msg) {
        var buffer = ByteBuffer.fromHex(msg.new_transaction_public_key);
        encodedMsg.new_transaction_public_key = getByteArray(buffer);
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
// convert raw sig to internal sig format
function convertToInternalSig(rawSig, type) {
    const res = {
        type: type,
        value: ByteBuffer.fromHex(rawSig).toString('base64')
    };
    return res;
}
// convert internal pub key to raw pub key
function convertToRawPubKey(internalPubKey) {
    return ByteBuffer.fromBase64(internalPubKey.value).toString('hex');
}
const _TYPE = {
    PubKeyEd25519: 'AC26791624DE60',
    PubKeySecp256k1: 'F8CCEAEB5AE980',
    PrivKeyEd25519: '954568A3288910',
    PrivKeySecp256k1: '019E82E1B0F798',
    SignatureKeyEd25519: '6BF5903DA1DB28',
    SignatureKeySecp256k1: '6D1EA416E1FEE8'
};
const _PREFIX = {
    PrefixPubKeyEd25519: '1624DE6220',
    PrefixPubKeySecp256k1: 'EB5AE98221',
    PrefixPrivKeyEd25519: 'A328891240',
    PrefixPrivKeySecp256k1: 'E1B0F79A20'
};

class Broadcast {
    constructor(transport) {
        this._transport = transport;
    }
    //account related
    register(referrer, register_fee, username, masterPubKeyHex, transactionPubKeyHex, postPubKeyHex, referrerPrivKeyHex, seq) {
        const msg = {
            referrer: referrer,
            register_fee: register_fee,
            new_username: username,
            new_master_public_key: decodePubKey(masterPubKeyHex),
            new_transaction_public_key: decodePubKey(transactionPubKeyHex),
            new_post_public_key: decodePubKey(postPubKeyHex)
        };
        return this._broadcastTransaction(msg, _MSGTYPE.RegisterMsgType, referrerPrivKeyHex, seq);
    }
    transfer(sender, receiver, amount, memo, privKeyHex, seq) {
        const msg = {
            sender,
            receiver,
            amount,
            memo
        };
        return this._broadcastTransaction(msg, _MSGTYPE.TransferMsgType, privKeyHex, seq);
    }
    follow(follower, followee, privKeyHex, seq) {
        const msg = {
            follower,
            followee
        };
        return this._broadcastTransaction(msg, _MSGTYPE.FollowMsgType, privKeyHex, seq);
    }
    unfollow(follower, followee, privKeyHex, seq) {
        const msg = {
            follower,
            followee
        };
        return this._broadcastTransaction(msg, _MSGTYPE.UnfollowMsgType, privKeyHex, seq);
    }
    claim(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ClaimMsgType, privKeyHex, seq);
    }
    updateAccount(username, json_meta, privKeyHex, seq) {
        const msg = {
            username,
            json_meta
        };
        return this._broadcastTransaction(msg, _MSGTYPE.UpdateAccountMsgType, privKeyHex, seq);
    }
    // post related
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
    like(username, author, weight, post_id, privKeyHex, seq) {
        const msg = {
            username,
            weight,
            author,
            post_id
        };
        return this._broadcastTransaction(msg, _MSGTYPE.LikeMsgType, privKeyHex, seq);
    }
    donate(username, author, amount, post_id, from_app, from_checking, memo, privKeyHex, seq) {
        const msg = {
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
    reportOrUpvote(username, author, post_id, is_report, privKeyHex, seq) {
        const msg = {
            username,
            author,
            post_id,
            is_report
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ReportOrUpvoteMsgType, privKeyHex, seq);
    }
    deletePost(author, post_id, privKeyHex, seq) {
        const msg = {
            author,
            post_id
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DeletePostMsgType, privKeyHex, seq);
    }
    view(username, author, post_id, privKeyHex, seq) {
        const msg = {
            username,
            author,
            post_id
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ViewMsgType, privKeyHex, seq);
    }
    updatePost(author, title, post_id, content, redistribution_split_rate, links, privKeyHex, seq) {
        const msg = {
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
    validatorDeposit(username, deposit, validator_public_key, link, privKeyHex, seq) {
        const msg = {
            username: username,
            deposit: deposit,
            validator_public_key: decodePubKey(validator_public_key),
            link: link
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ValidatorDepositMsgType, privKeyHex, seq);
    }
    validatorWithdraw(username, amount, privKeyHex, seq) {
        const msg = {
            username,
            amount
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ValidatorWithdrawMsgType, privKeyHex, seq);
    }
    ValidatorRevoke(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ValidatorRevokeMsgType, privKeyHex, seq);
    }
    // vote related
    vote(voter, proposal_id, result, privKeyHex, seq) {
        const msg = {
            voter,
            proposal_id,
            result
        };
        return this._broadcastTransaction(msg, _MSGTYPE.VoteMsgType, privKeyHex, seq);
    }
    voterDeposit(username, deposit, privKeyHex, seq) {
        const msg = {
            username,
            deposit
        };
        return this._broadcastTransaction(msg, _MSGTYPE.VoterDepositMsgType, privKeyHex, seq);
    }
    voterWithdraw(username, amount, privKeyHex, seq) {
        const msg = {
            username,
            amount
        };
        return this._broadcastTransaction(msg, _MSGTYPE.VoterWithdrawMsgType, privKeyHex, seq);
    }
    voterRevoke(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.VoterRevokeMsgType, privKeyHex, seq);
    }
    delegate(delegator, voter, amount, privKeyHex, seq) {
        const msg = {
            delegator,
            voter,
            amount
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DelegateMsgType, privKeyHex, seq);
    }
    delegatorWithdraw(delegator, voter, amount, privKeyHex, seq) {
        const msg = {
            delegator,
            voter,
            amount
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DelegatorWithdrawMsgType, privKeyHex, seq);
    }
    revokeDelegation(delegator, voter, privKeyHex, seq) {
        const msg = {
            delegator,
            voter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.RevokeDelegationMsgType, privKeyHex, seq);
    }
    // developer related
    developerRegister(username, deposit, privKeyHex, seq) {
        const msg = {
            username,
            deposit
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DeveloperRegisterMsgType, privKeyHex, seq);
    }
    developerRevoke(username, privKeyHex, seq) {
        const msg = {
            username
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DeveloperRevokeMsgType, privKeyHex, seq);
    }
    grantDeveloper(username, authenticate_app, validity_period, grant_level, privKeyHex, seq) {
        const msg = {
            username,
            authenticate_app,
            validity_period,
            grant_level
        };
        return this._broadcastTransaction(msg, _MSGTYPE.GrantDeveloperMsgType, privKeyHex, seq);
    }
    // infra related
    providerReport(username, usage, privKeyHex, seq) {
        const msg = {
            username,
            usage
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ProviderReportMsgType, privKeyHex, seq);
    }
    // proposal related
    changeGlobalAllocationParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeGlobalAllocationParamMsgType, privKeyHex, seq);
    }
    changeEvaluateOfContentValueParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeEvaluateOfContentValueParamMsgType, privKeyHex, seq);
    }
    changeInfraInternalAllocationParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeInfraInternalAllocationParamMsgType, privKeyHex, seq);
    }
    changeVoteParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeVoteParamMsgType, privKeyHex, seq);
    }
    changeProposalParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeProposalParamMsgType, privKeyHex, seq);
    }
    changeDeveloperParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeDeveloperParamMsgType, privKeyHex, seq);
    }
    changeValidatorParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeValidatorParamMsgType, privKeyHex, seq);
    }
    changeCoinDayParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeCoinDayParamMsgType, privKeyHex, seq);
    }
    changeBandwidthParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeBandwidthParamMsgType, privKeyHex, seq);
    }
    changeAccountParam(creator, parameter, privKeyHex, seq) {
        const msg = {
            creator,
            parameter
        };
        return this._broadcastTransaction(msg, _MSGTYPE.ChangeAccountParamMsgType, privKeyHex, seq);
    }
    deletePostContent(creator, postAuthor, postID, reason, privKeyHex, seq) {
        const permLink = postAuthor.concat('#').concat(postID);
        const msg = {
            creator,
            permLink,
            reason
        };
        return this._broadcastTransaction(msg, _MSGTYPE.DeletePostContentMsgType, privKeyHex, seq);
    }
    _broadcastTransaction(msg, msgType, privKeyHex, seq) {
        return this._transport.signBuildBroadcast(msg, msgType, privKeyHex, seq);
    }
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

var index = /*#__PURE__*/Object.freeze({
  genPrivKeyHex: genPrivKeyHex,
  pubKeyFromPrivate: pubKeyFromPrivate,
  isValidUsername: isValidUsername,
  isKeyMatch: isKeyMatch,
  derivePrivKey: derivePrivKey
});

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
        validatorListSubstore: '01',
        validatorSubstore: '00',
        delegationSubstore: '00',
        voterSubstore: '01',
        voteSubstore: '02',
        referenceListSubStore: '03',
        delegateeListSubStore: '04',
        proposalSubstore: '00',
        proposalListSubStore: '01',
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
        accountGrantListSubstore: '08',
        accountBalanceHistorySubstore: '09',
        postInfoSubStore: '00',
        postMetaSubStore: '01',
        postLikeSubStore: '02',
        postReportOrUpvoteSubStore: '03',
        postCommentSubStore: '04',
        postViewsSubStore: '05',
        postDonationsSubStore: '06',
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
        sep: ByteBuffer.fromUTF8('/').toHex()
    };
    // validator related
    function getValidatorListKey() {
        return _KEYS.validatorListSubstore;
    }
    Keys.getValidatorListKey = getValidatorListKey;
    function getValidatorKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.validatorSubstore.concat(accKeyHex);
    }
    Keys.getValidatorKey = getValidatorKey;
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
    function getDelegatorPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.delegationSubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getDelegatorPrefix = getDelegatorPrefix;
    function getDelegationKey(me, myDelegator) {
        const myDelegatorHex = ByteBuffer.fromUTF8(myDelegator).toHex();
        return getDelegatorPrefix(me).concat(myDelegatorHex);
    }
    Keys.getDelegationKey = getDelegationKey;
    function getVoterKey(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.voterSubstore.concat(meHex);
    }
    Keys.getVoterKey = getVoterKey;
    function getDelegateeListKey(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.delegateeListSubStore.concat(meHex);
    }
    Keys.getDelegateeListKey = getDelegateeListKey;
    // developer related
    function getDeveloperKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.developerSubstore.concat(accKeyHex);
    }
    Keys.getDeveloperKey = getDeveloperKey;
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
    function getGrantKeyListKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.accountGrantListSubstore.concat(accKeyHex);
    }
    Keys.getGrantKeyListKey = getGrantKeyListKey;
    function getRewardKey(accKey) {
        const accKeyHex = ByteBuffer.fromUTF8(accKey).toHex();
        return _KEYS.accountRewardSubstore.concat(accKeyHex);
    }
    Keys.getRewardKey = getRewardKey;
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
    function getBalanceHistoryPrefix(me) {
        const meHex = ByteBuffer.fromUTF8(me).toHex();
        return _KEYS.accountBalanceHistorySubstore.concat(meHex).concat(_KEYS.sep);
    }
    Keys.getBalanceHistoryPrefix = getBalanceHistoryPrefix;
    function getBalanceHistoryKey(me, atWhen) {
        const atWhenHex = ByteBuffer.fromUTF8(atWhen).toHex();
        return getBalanceHistoryPrefix(me).concat(atWhenHex);
    }
    Keys.getBalanceHistoryKey = getBalanceHistoryKey;
    // post related
    function getPostInfoKey(postKey) {
        const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
        return _KEYS.postInfoSubStore.concat(postKeyHex);
    }
    Keys.getPostInfoKey = getPostInfoKey;
    function getPostKey(author, postID) {
        return author.concat('#').concat(postID);
    }
    Keys.getPostKey = getPostKey;
    function getPostMetaKey(postKey) {
        const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
        return _KEYS.postMetaSubStore.concat(postKeyHex);
    }
    Keys.getPostMetaKey = getPostMetaKey;
    function getPostLikePrefix(postKey) {
        const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
        return _KEYS.postLikeSubStore.concat(postKeyHex).concat(_KEYS.sep);
    }
    Keys.getPostLikePrefix = getPostLikePrefix;
    function getPostLikeKey(postKey, likeUser) {
        const likeUserHex = ByteBuffer.fromUTF8(likeUser).toHex();
        return getPostLikePrefix(postKey).concat(likeUserHex);
    }
    Keys.getPostLikeKey = getPostLikeKey;
    function getPostReportOrUpvotePrefix(postKey) {
        const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
        return _KEYS.postReportOrUpvoteSubStore.concat(postKeyHex).concat(_KEYS.sep);
    }
    Keys.getPostReportOrUpvotePrefix = getPostReportOrUpvotePrefix;
    function getPostReportOrUpvoteKey(postKey, user) {
        const userHex = ByteBuffer.fromUTF8(user).toHex();
        return getPostReportOrUpvotePrefix(postKey).concat(userHex);
    }
    Keys.getPostReportOrUpvoteKey = getPostReportOrUpvoteKey;
    function getPostViewPrefix(postKey) {
        const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
        return _KEYS.postViewsSubStore.concat(postKeyHex).concat(_KEYS.sep);
    }
    Keys.getPostViewPrefix = getPostViewPrefix;
    function getPostViewKey(postKey, viewUser) {
        const viewUserHex = ByteBuffer.fromUTF8(viewUser).toHex();
        return getPostViewPrefix(postKey).concat(viewUserHex);
    }
    Keys.getPostViewKey = getPostViewKey;
    function getPostCommentPrefix(postKey) {
        const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
        return _KEYS.postCommentSubStore.concat(postKeyHex).concat(_KEYS.sep);
    }
    Keys.getPostCommentPrefix = getPostCommentPrefix;
    function getPostCommentKey(postKey, commentPostKey) {
        const commentPostKeyHex = ByteBuffer.fromUTF8(commentPostKey).toHex();
        return getPostCommentPrefix(postKey).concat(commentPostKeyHex);
    }
    Keys.getPostCommentKey = getPostCommentKey;
    function getPostDonationPrefix(postKey) {
        const postKeyHex = ByteBuffer.fromUTF8(postKey).toHex();
        return _KEYS.postDonationsSubStore.concat(postKeyHex).concat(_KEYS.sep);
    }
    Keys.getPostDonationPrefix = getPostDonationPrefix;
    function getPostDonationKey(postKey, donateUser) {
        const donateUserHex = ByteBuffer.fromUTF8(donateUser).toHex();
        return getPostDonationPrefix(postKey).concat(donateUserHex);
    }
    Keys.getPostDonationKey = getPostDonationKey;
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
})(Keys || (Keys = {}));
var Keys$1 = Keys;

class Query {
    constructor(transport) {
        this._transport = transport;
    }
    doesUsernameMatchPrivKey(username, privKeyHex) {
        return this.getAccountInfo(username).then(info => {
            if (info == null) {
                return false;
            }
            return isKeyMatch(privKeyHex, info.master_key);
        });
    }
    // validator related query
    getAllValidators() {
        const ValidatorKVStoreKey = Keys$1.KVSTOREKEYS.ValidatorKVStoreKey;
        return this._transport.query(Keys$1.getValidatorListKey(), ValidatorKVStoreKey);
    }
    getValidator(username) {
        const ValidatorKVStoreKey = Keys$1.KVSTOREKEYS.ValidatorKVStoreKey;
        return this._transport.query(Keys$1.getValidatorKey(username), ValidatorKVStoreKey);
    }
    // account related query
    getSeqNumber(username) {
        return this.getAccountMeta(username).then(meta => {
            return meta.sequence;
        });
    }
    getAllBalanceHistory(username) {
        return this.getAccountBank(username).then(bank => {
            let numberOfbundle = bank.number_of_transaction / 100;
            let promises = [];
            for (var i = 0; i <= numberOfbundle; ++i) {
                promises.push(this.getBalanceHistoryBundle(username, i));
            }
            let res = { details: [] };
            return Promise.all(promises).then(bundles => {
                bundles.reduce((prev, curr) => {
                    prev.details.push(...curr.details);
                    return prev;
                }, res);
                return res;
            });
        });
    }
    getBalanceHistoryBundle(username, index) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getBalanceHistoryKey(username, index.toString()), AccountKVStoreKey);
    }
    getAccountMeta(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getAccountMetaKey(username), AccountKVStoreKey);
    }
    getAccountBank(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getAccountBankKey(username), AccountKVStoreKey);
    }
    getAccountInfo(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport
            .query(Keys$1.getAccountInfoKey(username), AccountKVStoreKey)
            .then(info => {
            const res = {
                username: info.username,
                created_at: info.created_at,
                master_key: encodePubKey(convertToRawPubKey(info.master_key)),
                transaction_key: encodePubKey(convertToRawPubKey(info.transaction_key)),
                post_key: encodePubKey(convertToRawPubKey(info.post_key))
            };
            return res;
        });
    }
    getGrantList(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport
            .query(Keys$1.getGrantKeyListKey(username), AccountKVStoreKey)
            .then(result => {
            var newList = new Array(result.grant_public_key_list.length);
            for (var i = 0; i < result.grant_public_key_list.length; i++) {
                newList[i].expires_at = result.grant_public_key_list[i].expires_at;
                newList[i].username = result.grant_public_key_list[i].username;
                newList[i].public_key = encodePubKey(convertToRawPubKey(result.grant_public_key_list[i].public_key));
            }
            var newResult = {
                grant_public_key_list: newList
            };
            return newResult;
        });
    }
    getReward(username) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getRewardKey(username), AccountKVStoreKey);
    }
    getRelationship(me, other) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getRelationshipKey(me, other), AccountKVStoreKey);
    }
    getFollowerMeta(me, myFollower) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getFollowerKey(me, myFollower), AccountKVStoreKey);
    }
    getFollowingMeta(me, myFollowing) {
        const AccountKVStoreKey = Keys$1.KVSTOREKEYS.AccountKVStoreKey;
        return this._transport.query(Keys$1.getFollowingKey(me, myFollowing), AccountKVStoreKey);
    }
    // post related query
    getPostComment(author, postID, commentPostKey) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostKey = Keys$1.getPostKey(author, postID);
        return this._transport.query(Keys$1.getPostCommentKey(PostKey, commentPostKey), PostKVStoreKey);
    }
    getPostView(author, postID, viewUser) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostKey = Keys$1.getPostKey(author, postID);
        return this._transport.query(Keys$1.getPostViewKey(PostKey, viewUser), PostKVStoreKey);
    }
    getPostDonation(author, postID, donateUser) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostKey = Keys$1.getPostKey(author, postID);
        return this._transport.query(Keys$1.getPostDonationKey(PostKey, donateUser), PostKVStoreKey);
    }
    getPostReportOrUpvote(author, postID, user) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostKey = Keys$1.getPostKey(author, postID);
        return this._transport.query(Keys$1.getPostCommentKey(PostKey, user), PostKVStoreKey);
    }
    getPostInfo(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostKey = Keys$1.getPostKey(author, postID);
        return this._transport.query(Keys$1.getPostInfoKey(PostKey), PostKVStoreKey);
    }
    getPostMeta(author, postID) {
        const PostKVStoreKey = Keys$1.KVSTOREKEYS.PostKVStoreKey;
        const PostKey = Keys$1.getPostKey(author, postID);
        return this._transport.query(Keys$1.getPostMetaKey(PostKey), PostKVStoreKey);
    }
    // vote related query
    getDelegation(voter, delegator) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        return this._transport.query(Keys$1.getDelegationKey(voter, delegator), VoteKVStoreKey);
    }
    getVoter(voterName) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        return this._transport.query(Keys$1.getVoterKey(voterName), VoteKVStoreKey);
    }
    getDelegateeList(delegatorName) {
        const VoteKVStoreKey = Keys$1.KVSTOREKEYS.VoteKVStoreKey;
        return this._transport.query(Keys$1.getDelegateeListKey(delegatorName), VoteKVStoreKey);
    }
    // developer related query
    getDeveloper(developerName) {
        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
        return this._transport.query(Keys$1.getDeveloperKey(developerName), DeveloperKVStoreKey);
    }
    getDevelopers() {
        const DeveloperKVStoreKey = Keys$1.KVSTOREKEYS.DeveloperKVStoreKey;
        return this._transport.query(Keys$1.getDeveloperListKey(), DeveloperKVStoreKey);
    }
    // infra related query
    getInfraProvider(providerName) {
        const InfraKVStoreKey = Keys$1.KVSTOREKEYS.InfraKVStoreKey;
        return this._transport.query(Keys$1.getInfraProviderKey(providerName), InfraKVStoreKey);
    }
    getInfraProviders() {
        const InfraKVStoreKey = Keys$1.KVSTOREKEYS.InfraKVStoreKey;
        return this._transport.query(Keys$1.getInfraProviderListKey(), InfraKVStoreKey);
    }
    // proposal related query
    getProposalList() {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        return this._transport.query(Keys$1.getProposalListKey(), ProposalKVStoreKey);
    }
    getProposal(proposalID) {
        const ProposalKVStoreKey = Keys$1.KVSTOREKEYS.ProposalKVStoreKey;
        return this._transport.query(Keys$1.getProposalKey(proposalID), ProposalKVStoreKey);
    }
    getOngoingProposal() {
        return this.getProposalList().then(list => Promise.all((list.ongoing_proposal || []).map(p => this.getProposal(p))));
    }
    getExpiredProposal() {
        return this.getProposalList().then(list => Promise.all((list.past_proposal || []).map(p => this.getProposal(p))));
    }
    // param related query
    getEvaluateOfContentValueParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getEvaluateOfContentValueParamKey(), ParamKVStoreKey);
    }
    getGlobalAllocationParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getGlobalAllocationParamKey(), ParamKVStoreKey);
    }
    getInfraInternalAllocationParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getInfraInternalAllocationParamKey(), ParamKVStoreKey);
    }
    getDeveloperParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getDeveloperParamKey(), ParamKVStoreKey);
    }
    getVoteParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getVoteParamKey(), ParamKVStoreKey);
    }
    getProposalParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getProposalParamKey(), ParamKVStoreKey);
    }
    getValidatorParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getValidatorParamKey(), ParamKVStoreKey);
    }
    getCoinDayParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getCoinDayParamKey(), ParamKVStoreKey);
    }
    getBandwidthParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getBandwidthParamKey(), ParamKVStoreKey);
    }
    getAccountParam() {
        const ParamKVStoreKey = Keys$1.KVSTOREKEYS.ParamKVStoreKey;
        return this._transport.query(Keys$1.getAccountParamKey(), ParamKVStoreKey);
    }
    // block related
    getBlock(height) {
        return this._transport.block(height);
    }
    getTxsInBlock(height) {
        return this._transport
            .block(height)
            .then(v => v && v.block && v.block.data && v.block.data.txs
            ? v.block.data.txs.map(tx => JSON.parse(ByteBuffer.atob(tx)))
            : []);
    }
}
function isChangeParamProposalValue(value) {
    return 'param' in value;
}
function isContentCensorshipProposalValue(value) {
    return 'perm_link' in value;
}
function isProtocolUpgradeProposalValue(value) {
    return 'link' in value;
}
// tx detail type
const DETAILTYPE = {
    // Different possible incomes
    TransferIn: 0,
    DonationIn: 1,
    ClaimReward: 2,
    ValidatorInflation: 3,
    DeveloperInflation: 4,
    InfraInflation: 5,
    VoteReturnCoin: 6,
    DelegationReturnCoin: 7,
    ValidatorReturnCoin: 8,
    DeveloperReturnCoin: 9,
    InfraReturnCoin: 10,
    ProposalReturnCoin: 11,
    GenesisCoin: 12,
    // Different possible outcomes
    TransferOut: 13,
    DonationOut: 14,
    Delegate: 15,
    VoterDeposit: 16,
    ValidatorDeposit: 17,
    DeveloperDeposit: 18,
    InfraDeposit: 19,
    ProposalDeposit: 20
};

function isJsonRpcSuccess(response) {
    return 'result' in response;
}

const DefaultABCIQueryOptions = {
    height: 0,
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
        const path = `/${storeName}/key`;
        return this._rpc.abciQuery(path, key).then(result => {
            if (!result.response || !result.response.value) {
                throw new Error('Query failed: Empty result');
            }
            const jsonStr = ByteBuffer.atob(result.response.value);
            return JSON.parse(jsonStr);
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
        // signmsg
        const signMsgHash = encodeSignMsg(msg, this._chainId, seq);
        // sign to get signature
        const sig = key.sign(signMsgHash, { canonical: true });
        const sigDERHex = sig.toDER('hex');
        // build tx
        const tx = encodeTx(msg, msgType, key.getPublic(true, 'hex'), sigDERHex, seq);
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
    return ('next_proposal_id' in param &&
        'content_censorship_decide_hr' in param &&
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
    return 'minimum_balance' in param && 'register_fee' in param;
}

export { LINO, index as UTILS, isEvaluateOfContentValueParam, isGlobalAllocationParam, isInfraInternalAllocationParam, isVoteParam, isProposalParam, isDeveloperParam, isValidatorParam, isCoinDayParam, isBandwidthParam, isAccountParam, isChangeParamProposalValue, isContentCensorshipProposalValue, isProtocolUpgradeProposalValue, DETAILTYPE, Transport, BroadCastErrorEnum, BroadcastError, genPrivKeyHex, pubKeyFromPrivate, isValidUsername, isKeyMatch, derivePrivKey };
//# sourceMappingURL=lino-js.esm.js.map
