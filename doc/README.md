# Documentation
* [Install](#install)  
* [Browser](#browser)  
    * [Config](#config)
    * [JSON RPC](#json-rpc)
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
  nodeUrl: 'https://fullnode.linovalidator.io/',
  chainId: 'lino-testnet',
});

export const linoUtils = UTILS;
```

chainId and nodeUrl can be found remotely from https://tracker.lino.network/ 
or locally from ~/.lino/config/genesis.json

For example,  
Remotely: chainID = "lino-stg-upgrade7" and nodeURL = "https://fullnode.lino.network/"  
Locally: chainID = "test-chain-q8lMWR" and nodeURL = "http://localhost:26657"  

### JSON-RPC
xxxxx

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
##### Check Does Username Match Reset Private Key
```
lino.query
    .doesUsernameMatchResetPrivKey(username, resetPrivKeyHex)
    .then(v => {
        console.log('doesUsernameMatchResetPrivKey: ', v);
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
##### Check Does Username Match App Private Key
```
lino.query
    .doesUsernameMatchAppPrivKey(username, appPrivKeyHex)
    .then(v => {
        console.log('doesUsernameMatchAppPrivKey: ', v);
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
lino.query
    .getSeqNumber(username)
    .then(v => {
        console.log('getSeqNumber: ', v);
    }); 
```
##### Get All Balance History From All Buckets
```
lino.query
    .getAllBalanceHistory(username)
    .then(v => {
        console.log('getAllBalanceHistory: ', v);
    }); 
```
##### Get A Certain Number Of Recent Balance History
```
lino.query
    .getRecentBalanceHistory(username, numHistory)
    .then(v => {
        console.log('getRecentBalanceHistory: ', v);
    }); 
```
##### Get Balance History In The Range Of Index [from, to] Inclusively
```
lino.query
    .getBalanceHistoryFromTo(username, from, to)
    .then(v => {
        console.log('getBalanceHistoryFromTo: ', v);
    }); 
```
##### Get Balance History From A Certain Bucket
```
lino.query
    .getBalanceHistoryBundle(username, index)
    .then(v => {
        console.log('getBalanceHistoryBundle: ', v);
    }); 
```
##### Get Granted Public Key
```
lino.query
    .getGrantPubKey(username, pubKeyHex)
    .then(v => {
        console.log('getGrantPubKey: ', v);
    }); 
```
##### Get Reward
```
lino.query
    .getReward(username)
    .then(v => {
        console.log('getReward: ', v);
    }); 
```
##### Get All Reward History From All Buckets
```
lino.query
    .getAllRewardHistory(username)
    .then(v => {
        console.log('getAllRewardHistory: ', v);
    }); 
```
##### Get A Certain Number Of Recent Reward History
```
lino.query
    .getRecentRewardHistory(username, numReward)
    .then(v => {
        console.log('getRecentRewardHistory: ', v);
    });
```
##### Get Reward History In The Range Of Index [from, to] Inclusively
```
lino.query
    .getRewardHistoryFromTo(username, from, to)
    .then(v => {
        console.log('getRewardHistoryFromTo: ', v);
    });
```
##### Get Reward History From A Certain Bucket
```
lino.query
    .getRewardHistoryBundle(username, index)
    .then(v => {
        console.log('getRewardHistoryBundle: ', v);
    }); 
```
##### Get Donation Relationship
```
lino.query
    .getRelationship(me, other)
    .then(v => {
        console.log('getRelationship: ', v);
    }); 
```
##### Get Follower Meta
```
lino.query
    .getFollowerMeta(me, myFollower)
    .then(v => {
        console.log('getFollowerMeta: ', v);
    });
```
##### Get Following Meta
```
lino.query
    .getFollowingMeta(me, myFollowing)
    .then(v => {
        console.log('getFollowingMeta: ', v);
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
##### Get All Donation Relationships 
```
lino.query
    .getAllRelationships(me)
    .then(v => {
        console.log('getRelationship: ', v);
    }); 
```
##### Get All Follower Meta
```
lino.query
    .getAllFollowerMeta(username)
    .then(v => {
        console.log('getAllFollowerMeta: ', v);
    });
```
##### Get All Following Meta
```
lino.query
    .getAllFollowingMeta(username)
    .then(v => {
        console.log('getAllFollowingMeta: ', v);
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
##### Get All Developers
```
lino.query
    .getDevelopers()
    .then(v => {
        console.log('getDevelopers: ', v);
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
##### Get All Infra Providers
```
lino.query
    .getInfraProviders()
    .then(v => {
        console.log('getInfraProviders: ', v);
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
#### Broadcast Account
##### Register A New User
```
lino.query
    .getSeqNumber(referrer)
    .then(seq => {
        return lino.broadcast
            .register(
                referrer,
                register_fee,
                username,
                resetPubKey,
                transactionPubKeyHex,
                appPubKeyHex,
                referrerPrivKeyHex,
                seq
            )
            .then(v => {
                  console.log('register: ', v);
                });
            });
```
##### Transfer LINO Between two users
```
lino.query
    .getSeqNumber(sender)
    .then(seq => {
        return lino.broadcast
            .transfer(
                sender,
                receiver,
                amount,
                memo,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('transfer: ', v);
                });
            });
```
##### Follow 
```
lino.query
    .getSeqNumber(follower)
    .then(seq => {
        return lino.broadcast
            .follow(
                follower,
                followee,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('follow: ', v);
                });
            });
```
##### Unfollow 
```
lino.query
    .getSeqNumber(follower)
    .then(seq => {
        return lino.broadcast
            .unfollow(
                follower,
                followee,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('unfollow: ', v);
                });
            });
```
##### Claim Reward
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .claim(
                username,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('claim: ', v);
                });
            });
```
##### Update Account
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .updateAccount(
                username,
                json_meta,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('claim: ', v);
                });
            });
```
##### Recover 
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .recover(
                username,
                new_reset_public_key,
                new_transaction_public_key,
                new_app_public_key,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('recover: ', v);
                });
            });
```

#### Broadcast Post
##### Create Post
```
lino.query
    .getSeqNumber(author)
    .then(seq => {
        return lino.broadcast
            .createPost(
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
            )
            .then(v => {
                  console.log('createPost: ', v);
                });
            });
```
##### Donate To A Post
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .donate(
                username,
                author,
                amount,
                post_id,
                from_app,
                memo,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('donate: ', v);
                });
            });
```
##### ReportOrUpvote To A Post
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .reportOrUpvote(
                username,
                author,
                post_id,
                is_report,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('reportOrUpvote: ', v);
                });
            });
```
##### Delete Post
```
lino.query
    .getSeqNumber(author)
    .then(seq => {
        return lino.broadcast
            .deletePost(
                author,
                post_id,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('deletePost: ', v);
                });
            });
```
##### View A Post
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .view(
                username,
                author,
                post_id,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('view: ', v);
                });
            });
```
##### Update Post
```
lino.query
    .getSeqNumber(author)
    .then(seq => {
        return lino.broadcast
            .updatePost(
                author,
                title,
                post_id,
                content,
                redistribution_split_rate,
                links,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('updatePost: ', v);
                });
            });
```

#### Broadcast Validator
##### Validator Deposit
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .validatorDeposit(
                username,
                deposit,
                validator_public_key,
                link,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('validatorDeposit: ', v);
                });
            });
```
##### Validator Withdraw
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .validatorWithdraw(
                username,
                amount,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('validatorWithdraw: ', v);
                });
            });
```
##### Validator Revoke
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
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
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .voterDeposit(
                username,
                deposit,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('voterDeposit: ', v);
                });
            });
```
##### Voter Withdraw
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .voterWithdraw(
                username,
                amount,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('voterWithdraw: ', v);
                });
            });
```
##### Voter Revoke
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .voterRevoke(
                username,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('voterRevoke: ', v);
                });
            });
```
##### Delegate To Voter
```
lino.query
    .getSeqNumber(delegator)
    .then(seq => {
        return lino.broadcast
            .delegate(
                delegator,
                voter,
                amount,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('delegate: ', v);
                });
            });
```
##### Delegator Withdraw
```
lino.query
    .getSeqNumber(delegator)
    .then(seq => {
        return lino.broadcast
            .delegatorWithdraw(
                delegator,
                voter,
                amount,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('delegatorWithdraw: ', v);
                });
            });
```
##### RevokeDelegation
```
lino.query
    .getSeqNumber(delegator)
    .then(seq => {
        return lino.broadcast
            .revokeDelegation(
                delegator,
                voter,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('revokeDelegation: ', v);
                });
            });
```

#### Broadcast Developer
##### Developer Register
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .developerRegister(
                username,
                deposit,
                website,
                description,
                app_meta_data,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('developerRegister: ', v);
                });
            });
```
##### DeveloperUpdate
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .developerUpdate(
                username,
                website,
                description,
                app_meta_data,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('developerUpdate: ', v);
                });
            });
```
##### DeveloperRevoke
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .developerRevoke(
                username,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('developerRevoke: ', v);
                });
            });
```
##### Grant Permission
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .grantPermission(
                username,
                authorized_app,
                validity_period_second,
                grant_level,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('grantPermission: ', v);
                });
            });
```
##### Revoke Permission
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .revokePermission(
                username,
                public_key,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('revokePermission: ', v);
            });
    });
```
##### Pre Authorization Permission
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .preAuthorizationPermission(
                username,
                authorized_app,
                validity_period_second,
                amount,
                privKeyHex,
                seq
            )
            .then(v => {
                  console.log('preAuthorizationPermission: ', v);
                });
            });
```

#### Broadcast Infra
##### Infra Provider Report
```
lino.query
    .getSeqNumber(username)
    .then(seq => {
        return lino.broadcast
            .providerReport(
                username,
                usage,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('providerReport: ', v);
            });
    });
```

#### Broadcast Proposal
##### Vote Proposal
```
lino.query
    .getSeqNumber(voter)
    .then(seq => {
        return lino.broadcast
            .voteProposal(
                voter,
                proposal_id,
                result,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('voteProposal: ', v);
            });
    });
```
##### Change Evaluate Of Content Value Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
            .changeEvaluateOfContentValueParam(
                creator,
                parameter,
                reason,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('changeEvaluateOfContentValueParam: ', v);
            });
    });
```
##### Change Global Allocation Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.query
            .getGlobalAllocationParam()
            .then(parameter => {
                console.log('changeGlobalAllocationParam: ', parameter);
                parameter.content_creator_allocation = '2/10';
                return lino.broadcast
                    .changeGlobalAllocationParam(
                        creator,
                        parameter,
                        reason,
                        privKeyHex,
                        seq
                    )
                    .then(v => {
                        console.log('changeGlobalAllocationParam: ', v);
                    });
            });
    });
```
##### Change Infra Internal Allocation Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
            .changeInfraInternalAllocationParam(
                creator,
                parameter,
                reason,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('changeInfraInternalAllocationParam: ', v);
            });
    });
```
##### Change Vote Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
            .changeVoteParam(
                creator,
                parameter,
                reason,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('changeVoteParam: ', v);
            });
    });
```
##### Change Proposal Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
            .changeProposalParam(
                creator,
                parameter,
                reason,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('changeProposalParam: ', v);
            });
    });
```
##### Change Developer Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
            .changeDeveloperParam(
                creator,
                parameter,
                reason,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('changeDeveloperParam: ', v);
            });
    });
```
##### Change Validator Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
            .changeValidatorParam(
                creator,
                parameter,
                reason,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('changeValidatorParam: ', v);
            });
    });
```
##### Change Bandwidth Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
            .changeBandwidthParam(
                creator,
                parameter,
                reason,
                privKeyHex,
                seq
            )
            .then(v => {
                console.log('changeBandwidthParam: ', v);
            });
    });
```
##### Change Account Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.query
            .getAccountParam()
            .then(parameter => {
                console.log('changeAccountParam: ', parameter);
                parameter.balance_history_bundle_size = '10000';
                return lino.broadcast
                    .changeAccountParam(
                        creator,
                        parameter,
                        reason,
                        privKeyHex,
                        seq
                    )
                    .then(v => {
                        console.log('changeAccountParam: ', v);
                    });
            });
    });
```
##### Change Post Param
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
            .changePostParam(
                creator,
                parameter,
                privKeyHex,
                reason,
                seq
            )
            .then(v => {
                console.log('changePostParam: ', v);
            });
    });

```
##### Delete Post Content
```
seq, err := api.GetSeqNumber(creator)
err = api.DeletePostContent(creator, postAuthor, postID, reason, privKeyHex, seq)

lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
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
    });
```
##### Upgrade Protocol
```
lino.query
    .getSeqNumber(creator)
    .then(seq => {
        return lino.broadcast
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
