# Documentation
* [Install](#install)  
* [Browser](#browser)  
    * [Config](#config)
    * [RPC](#rpc)
* [API](#api)  
    * [Query](#query)  
        * [Account](#account)  
        * [Developer](#developer)  
        * [Infra](#infra)  
        * [Blockchain Parameters](#blockchain-parameters)  
        * [Post](#post)  
        * [Proposal](#proposal)  
        * [Meta](#meta)  
        * [Block](#block)  
        * [Validator](#validator)  
        * [Vote](#vote)  
    * [Broadcast](#broadcast)
        * [Synchronizing and Analyzing the Successful Transfers](#synchronizing-and-analyzing-the-successful-transfers)
        * [Account](#broadcast-account)  
        * [Post](#broadcast-post)  
        * [Validator](#broadcast-validator)  
        * [Vote](#broadcast-vote)  
        * [Developer](#broadcast-developer)  
        * [Infra](#broadcast-infra)  
        * [Proposal](#broadcast-proposal)  
    * [Utils](#utils)  
        * [Sign](#sign)  
        * [Verify](#verify)  
        * [Generate](#generate)  

## Install
```
npm install lino-js
```

## Browser
```
<script src="./.js"></script>
<script>
xxxxx
</script>
```

### Config
```
import { LINO, UTILS } from 'lino-js';

export const lino = new LINO({
  nodeUrl: 'https://fullnode.lino.network:443/',
  chainId: 'lino-testnet-upgrade2',
});

export const linoUtils = UTILS;
```

chainId can be found remotely from https://tracker.lino.network/ or locally from ~/.lino/config/genesis.json

For example,  
Remotely: chainID = "lino-testnet-upgrade2" and nodeURL = "https://fullnode.lino.network/"
Locally: chainID = "test-chain-q8lMWR" and nodeURL = "http://localhost:26657"  

### RPC
To query node information directly from a fullnode one can access fullnode's 26657 (http) or 443 (https) port. For example to query testnet blockchain status one can access https://fullnode.lino.network/ and check all available queries.

## API

### Query
#### Account 
##### Get AccountInfo
```
lino.query
    .getAccountInfo(username)
    .then(v => {
        console.log('getAccountInfo: ', v);
    }); 
```
##### Check Does Username Match Transaction Private Key
```
lino.query
    .doesUsernameMatchTxPrivKey(username, txPrivKeyHex)
    .then(v => {
        console.log('doesUsernameMatchTxPrivKey: ', v);
    }); 
```
##### Check Does Username Match Signing Private Key
```
lino.query
    .doesUsernameMatchSigningPrivKey(username, signingPrivKeyHex)
    .then(v => {
        console.log('doesUsernameMatchSigningPrivKey: ', v);
    }); 
```
##### Get AccountBank
```
lino.query
    .getAccountBank(username)
    .then(v => {
        console.log('getAccountBank: ', v);
    }); 
```
##### Get AccountBank By Address
```
lino.query
    .getAccountBankByAddress(address)
    .then(v => {
        console.log('getAccountBankByAddress: ', v);
    }); 
```
##### Get AccountMeta
```
lino.query
    .getAccountMeta(username)
    .then(v => {
        console.log('getAccountMeta: ', v);
    }); 
```
##### Get Next Sequence Number
```
clog('getSeqNumber: ', v);
    }); 
```
##### Get Granted Public Key
```
lino.query
    .getGrantPubKey(username, grantTo, permission)
    .then(v => {
        console.log('getGrantPubKey: ', v);
    }); 
```
##### Get All Granted Public Keys
```
lino.query
    .getAllGrantPubKeys(username)
    .then(v => {
        console.log('getAllGrantPubKeys: ', v);
    });
```
#### Developer
##### Get Developer 
```
lino.query
    .getDeveloper(username)
    .then(v => {
        console.log('getDeveloper: ', v);
    }); 
```
##### Get Developer List
```
lino.query
    .getDeveloperList()
    .then(v => {
        console.log('getDeveloperList: ', v);
    }); 
```

#### Infra
##### Get Infra Provider
```
lino.query
    .getInfraProvider(username)
    .then(v => {
        console.log('getInfraProvider: ', v);
    }); 
```

#### Blockchain Parameters
##### Get Evaluate Of Content Value Param
```
lino.query
    .getEvaluateOfContentValueParam()
    .then(v => {
        console.log('getEvaluateOfContentValueParam: ', v);
    }); 
```
##### Get Global Allocation Param
```
lino.query
    .getGlobalAllocationParam()
    .then(v => {
        console.log('getGlobalAllocationParam: ', v);
    }); 
```
##### Get Infra Internal Allocation Param
```
lino.query
    .getInfraInternalAllocationParam()
    .then(v => {
        console.log('getInfraInternalAllocationParam: ', v);
    }); 
```
##### Get Developer Param
```
lino.query
    .getDeveloperParam()
    .then(v => {
        console.log('getDeveloperParam: ', v);
    });
```
##### Get Vote Param
```
lino.query
    .getVoteParam()
    .then(v => {
        console.log('getVoteParam: ', v);
    });
```
##### Get Proposal Param
```
lino.query
    .getProposalParam()
    .then(v => {
        console.log('getProposalParam: ', v);
    });
```
##### Get Validator Param
```
lino.query
    .getValidatorParam()
    .then(v => {
        console.log('getValidatorParam: ', v);
    }); 
```
##### Get Coin Day Param
```
lino.query
    .getCoinDayParam()
    .then(v => {
        console.log('getCoinDayParam: ', v);
    }); 
```
##### Get Bandwidth Param
```
lino.query
    .getBandwidthParam()
    .then(v => {
        console.log('getBandwidthParam: ', v);
    }); 
```
##### Get Account Param
```
lino.query
    .getAccountParam()
    .then(v => {
        console.log('getAccountParam: ', v);
    }); 
```
##### Get Post Param
```
lino.query
    .getPostParam()
    .then(v => {
        console.log('getPostParam: ', v);
    }); 
```

#### Post
##### Get PostInfo
```
lino.query
    .getPostInfo(author, postID)
    .then(v => {
        console.log('getPostInfo: ', v);
    }); 
```
##### Get PostMeta
```
lino.query
    .getPostMeta(author, postID)
    .then(v => {
        console.log('getPostMeta: ', v);
    });
```
##### Get Post Comment
```
lino.query
    .getPostComment(author, postID, commentPermlink)
    .then(v => {
        console.log('getPostComment: ', v);
    }); 
```
##### Get Post View
```
lino.query
    .getPostView(author, postID, viewUser)
    .then(v => {
        console.log('getPostView: ', v);
    });
```
##### Get Post Donations
```
lino.query
    .getPostDonations(author, postID, donateUser)
    .then(v => {
        console.log('getPostDonations: ', v);
    });
```
##### Get Post ReportOrUpvote
```
lino.query
    .getPostReportOrUpvote(author, postID, user)
    .then(v => {
        console.log('getPostReportOrUpvote: ', v);
    });
```
##### Get User All Posts
```
lino.query
    .getAllPosts(author)
    .then(v => {
        console.log('getAllPosts: ', v);
    });
```
##### Get Post All Comments
```
lino.query
    .getPostAllComments(author, postID)
    .then(v => {
        console.log('getPostAllComments: ', v);
    });
```
##### Get Post All Views
```
lino.query
    .getPostAllViews(author, postID)
    .then(v => {
        console.log('getPostAllViews: ', v);
    });
```
##### Get Post All Donations
```
lino.query
    .getPostAllDonations(author, postID)
    .then(v => {
        console.log('getPostAllDonations: ', v);
    });
```
##### Get Post All ReportOrUpvotes
```
lino.query
    .getPostAllReportOrUpvotes(author, postID)
    .then(v => {
        console.log('getPostAllReportOrUpvotes: ', v);
    });
```

#### Proposal
##### Get Proposal List
```
lino.query
    .getProposalList()
    .then(v => {
        console.log('getProposalList: ', v);
    }); 
```
##### Get Ongoing Proposal 
```
lino.query
    .getOngoingProposal(proposalID)
    .then(v => {
        console.log('getOngoingProposal: ', v);
    }); 
```

##### Get Expired Proposal 
```
lino.query
    .getExpiredProposal(proposalID)
    .then(v => {
        console.log('getExpiredProposal: ', v);
    }); 
```

##### Get Ongoing Proposals
```
lino.query
    .getOngoingProposalList()
    .then(v => {
        console.log('getOngoingProposalList: ', v);
    }); 
```
##### Get Expired Proposals
```
lino.query
    .getExpiredProposalList()
    .then(v => {
        console.log('getExpiredProposalList: ', v);
    }); 
```
##### Get Next Proposal ID
```
lino.query
    .getNextProposalID()
    .then(v => {
        console.log('getNextProposalID: ', v);
    }); 
```

#### Meta
##### Global Meta
```
lino.query
    .getGlobalMeta()
    .then(v => {
        console.log('getGlobalMeta: ', v);
    }); 
```
##### Consumption Meta
```
lino.query
    .getConsumptionMeta()
    .then(v => {
        console.log('getConsumptionMeta: ', v);
    }); 
```

#### Block
##### Get Block
```
lino.query
    .getBlock(height)
    .then(v => {
        console.log('getBlock: ', v);
    }); 
```
##### Get Txs In Block
```
lino.query
    .getTxsInBlock(height)
    .then(v => {
        console.log('getTxsInBlock: ', v);
    }); 
```
##### Get Tx By Hash
```
lino.query
    .getTx(hash)
    .then(v => {
        console.log('getTx: ', v);
    }); 
```
##### Get Blockchain Status (last block height, last block time, etc)
```
lino.query
    .getStatus()
    .then(v => {
        console.log('getTxsInBlock: ', v);
    }); 
```

#### Validator
##### Get Validator
```
lino.query
    .getValidator(username)
    .then(v => {
        console.log('getValidator: ', v);
    }); 
```
##### Get All Validators
```
lino.query
    .getAllValidators()
    .then(v => {
        console.log('getAllValidators: ', v);
    }); 
```

#### Vote
##### Get Delegation
```
lino.query
    .getDelegation(voter, delegator)
    .then(v => {
        console.log('getDelegation: ', v);
    });
```
##### Get Voter All Delegations
```
lino.query
    .getVoterAllDelegation(voter)
    .then(v => {
        console.log('getVoterAllDelegation: ', v);
    });
```
##### Get Delegator All Delegations
```
lino.query
    .getDelegatorAllDelegation(delegatorName)
    .then(v => {
        console.log('getDelegatorAllDelegation: ', v);
    });
```
##### Get Voter
```
lino.query
    .getVoter(voterName)
    .then(v => {
        console.log('getVoter: ', v);
    });
```
##### Get Vote
```
lino.query
    .getVote(proposalID, voter)
    .then(v => {
        console.log('getVote: ', v);
    }); 
```
##### Get Proposal All Votes
```
lino.query
    .getProposalAllVotes(proposalID)
    .then(v => {
        console.log('getProposalAllVotes: ', v);
    });
```

### Broadcast
#### Synchronizing and Analyzing the Successful Transfers
```
linoClient
    .transfer(
        sender,
        receiver,
        amount,
        memo,
        priv
    )
    .then(res => {
        debug('commit hash', res.hash);
        debug('height', res.height);
        debug('res', res);
        return query.getTx(res.hash).then((res) => {
            if (res.tx_result.code) {
                console.log('transaction failed, reason is:', res.tx_result.log)
            } else {
                console.log('transaction success')
            }
        }).catch((err) => {
            console.log(err); // tx failed, can't query from the blockchain
        })
    })
    .catch(err => {
        console.log('err:', err); // transcation failed due to err
    });
```

#### Broadcast Account
##### Register A New User
```
lino.broadcast
    .transfer(
        sender,
        receiver,
        amount,
        memo,
        privKeyHex
    )
    .then(v => {
        console.log('transfer: ', v);
    });
```
##### Transfer LINO Between two users
```
lino.broadcast
    .transfer(
        sender,
        receiver,
        amount,
        memo,
        privKeyHex
    )
    .then(v => {
        console.log('transfer: ', v);
    });
```
##### Update Account
```
lino.broadcast
    .updateAccount(
        username,
        json_meta,
        privKeyHex
    )
    .then(v => {
        console.log('claim: ', v);
    });
```

#### Broadcast Post
##### Create Post
```
lino.broadcast
    .createPost(
        author,
        postID,
        title,
        content,
        createdBy,
        preauth,
        privKeyHex
    )
    .then(v => {
        console.log('createPost: ', v);
    });
```
##### Donate To A Post
```
lino.broadcast
    .donate(
        username,
        author,
        amount,
        post_id,
        from_app,
        memo,
        privKeyHex
    )
    .then(v => {
        console.log('donate: ', v);
    });
```
##### Delete Post
```
lino.broadcast
    .deletePost(
        author,
        post_id,
        privKeyHex
    )
    .then(v => {
        console.log('deletePost: ', v);
    });
```
##### Update Post
```
lino.broadcast
    .updatePost(
        author,
        title,
        post_id,
        content,
        privKeyHex
    )
    .then(v => {
        console.log('updatePost: ', v);
    });
```

#### Broadcast Validator
##### Validator Deposit
```
lino.broadcast
    .validatorDeposit(
        username,
        deposit,
        validator_public_key,
        link,
        privKeyHex
    )
    .then(v => {
        console.log('validatorDeposit: ', v);
    });
```
##### Validator Withdraw
```
lino.broadcast
    .validatorWithdraw(
        username,
        amount,
        privKeyHex
    )
    .then(v => {
        console.log('validatorWithdraw: ', v);
    });
```
##### Validator Revoke
```
lino.broadcast
    .ValidatorRevoke(
        username,
        privKeyHex,
        seq
    )
    .then(v => {
            console.log('ValidatorRevoke: ', v);
        });
    });
```

#### Broadcast Vote
##### Voter Deposit
```
lino.broadcast
    .voterDeposit(
        username,
        deposit,
        privKeyHex
    )
    .then(v => {
        console.log('voterDeposit: ', v);
    });
```
##### Voter Withdraw
```
lino.broadcast
    .voterWithdraw(
        username,
        amount,
        privKeyHex
    )
    .then(v => {
        console.log('voterWithdraw: ', v);
    });
```
##### Voter Revoke
```
lino.broadcast
    .voterRevoke(
        username,
        privKeyHex
    )
    .then(v => {
        console.log('voterRevoke: ', v);
    });
```
##### Delegate To Voter
```
lino.broadcast
    .delegate(
        delegator,
        voter,
        amount,
        privKeyHex
    )
    .then(v => {
        console.log('delegate: ', v);
    });
```

#### Broadcast Developer
##### Developer Register
```
lino.broadcast
    .developerRegister(
        username,
        deposit,
        website,
        description,
        app_meta_data,
        privKeyHex
    )
    .then(v => {
        console.log('developerRegister: ', v);
    });
```
##### DeveloperUpdate
```
lino.broadcast
    .developerUpdate(
        username,
        website,
        description,
        app_meta_data,
        privKeyHex
    )
    .then(v => {
        console.log('developerUpdate: ', v);
    });
```
##### DeveloperRevoke
```
lino.broadcast
    .developerRevoke(
        username,
        privKeyHex
    )
    .then(v => {
        console.log('developerRevoke: ', v);
    });
```
##### Grant Permission
```
lino.broadcast
    .grantPermission(
        username,
        authorized_app,
        validity_period_second,
        grant_level,
        privKeyHex
    )
    .then(v => {
        console.log('grantPermission: ', v);
    });
```
##### Revoke Permission
```
lino.broadcast
    .revokePermission(
        username,
        public_key,
        privKeyHex
    )
    .then(v => {
        console.log('revokePermission: ', v);
    });
```
##### Pre Authorization Permission
```
lino.broadcast
    .preAuthorizationPermission(
        username,
        authorized_app,
        validity_period_second,
        amount,
        privKeyHex
    )
    .then(v => {
            console.log('preAuthorizationPermission: ', v);
        });
    });
```

#### Broadcast Infra
##### Infra Provider Report
```
lino.broadcast
    .providerReport(
        username,
        usage,
        privKeyHex
    )
    .then(v => {
        console.log('providerReport: ', v);
    });
    });
```

#### Broadcast Proposal
##### Vote Proposal
```
lino.broadcast
    .voteProposal(
        voter,
        proposal_id,
        result,
        privKeyHex
    )
    .then(v => {
        console.log('voteProposal: ', v);
    });
```
##### Change Evaluate Of Content Value Param
```
lino.broadcast
    .changeEvaluateOfContentValueParam(
        creator,
        parameter,
        reason,
        privKeyHex
    )
    .then(v => {
        console.log('changeEvaluateOfContentValueParam: ', v);
    });
```
##### Change Global Allocation Param
```
lino.query
    .getGlobalAllocationParam()
    .then(parameter => {
        console.log('changeGlobalAllocationParam: ', parameter);
        parameter.content_creator_allocation = '2/10';
        return lino.broadcast
            .changeGlobalAllocationParam(
                creator,
                parameter,
                reason,
                privKeyHex
            )
            .then(v => {
                console.log('changeGlobalAllocationParam: ', v);
            });
    });
```
##### Change Infra Internal Allocation Param
```
lino.broadcast
    .changeInfraInternalAllocationParam(
        creator,
        parameter,
        reason,
        privKeyHex
    )
    .then(v => {
        console.log('changeInfraInternalAllocationParam: ', v);
    });
```
##### Change Vote Param
```
lino.broadcast
    .changeVoteParam(
        creator,
        parameter,
        reason,
        privKeyHex
    )
    .then(v => {
        console.log('changeVoteParam: ', v);
    });
```
##### Change Proposal Param
```
lino.broadcast
    .changeProposalParam(
        creator,
        parameter,
        reason,
        privKeyHex
    )
    .then(v => {
        console.log('changeProposalParam: ', v);
    });
```
##### Change Developer Param
```
lino.broadcast
    .changeDeveloperParam(
        creator,
        parameter,
        reason,
        privKeyHex
    )
    .then(v => {
        console.log('changeDeveloperParam: ', v);
    });
```
##### Change Validator Param
```
lino.broadcast
    .changeValidatorParam(
        creator,
        parameter,
        reason,
        privKeyHex
    )
    .then(v => {
        console.log('changeValidatorParam: ', v);
    });
```
##### Change Bandwidth Param
```
lino.broadcast
    .changeBandwidthParam(
        creator,
        parameter,
        reason,
        privKeyHex
    )
    .then(v => {
        console.log('changeBandwidthParam: ', v);
    });
```
##### Change Account Param
```
lino.query
    .getAccountParam()
    .then(parameter => {
        console.log('changeAccountParam: ', parameter);
        parameter.balance_history_bundle_size = '10000';
        return lino.broadcast
            .changeAccountParam(
                creator,
                parameter,
                reason,
                privKeyHex
            )
            .then(v => {
                console.log('changeAccountParam: ', v);
            });
    });
```
##### Change Post Param
```
lino.broadcast
    .changePostParam(
        creator,
        parameter,
        privKeyHex,
        reason
    )
    .then(v => {
        console.log('changePostParam: ', v);
    });
```
##### Delete Post Content
```
seq, err := api.GetSeqNumber(creator)
err = api.DeletePostContent(creator, postAuthor, postID, reason, privKeyHex, seq)

lino.broadcast
    .deletePostContent(
        creator,
        postAuthor,
        postID,
        reason,
        privKeyHex,
        seq
    )
    .then(v => {
        console.log('deletePostContent: ', v);
    });
```
##### Upgrade Protocol
```
lino.broadcast
    .upgradeProtocol(
        creator,
        link,
        reason,
        privKeyHex,
        seq
    )
    .then(v => {
        console.log('upgradeProtocol: ', v);
    });
```
### Utils
#### Sign
```
lino.UTILS.signWithSha256(msg, privHex);
```
#### Verify
```
lino.UTILS.verifyWithSha256(msg, pubKey, signature);
```
#### Generate
```
const testPrivKey = lino.UTILS.genPrivKeyHex();
const testPubKey = lino.UTILS.pubKeyFromPrivate(testPrivKey);
```
