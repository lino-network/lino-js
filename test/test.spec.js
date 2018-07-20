const NODE_URL = 'http://localhost:26657/';
const testTxPrivHex = 'E1B0F79B2086806E31E8EF253D2ECA147E5E34D29C59222223154DC58B97ABD10ED0341A87';

const zhimaoTx =
  'A32889124042B7EC409FDA30BB1164122A85CC216CA1DBD6A56066B841AE6F4C9CAAE1C2E554F9F0E0BCCF033A67D43D97BDDCCE4E0EE187A45438009D11801F2405268821';
const testValidatorPubHex =
  '1624DE6220e008041ccafcc76788099b990531697ff4bf8eb2d1fabe204ee5fe0fc2c7c3f6';

const myUser = 'lino';
const myUserTxPrivKey =
  'A328891240C3EB3D287AA0D3EA41D8A016B9A602FB845EFD1F407CA65BFF0A4560AB8DFA517AC83395BC2F6AE32D5641D4A824B5B22ED6A23FC51C479A1C8BEBC7C94970DD';

// test utils
function makeid(len) {
  let text = '';
  let possible = 'abcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function getUnixTime() {
  return +new Date();
}

// XXX(yumin): this is bad, but I don't want to spend more time on this.
// a fake mutex.
let running = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBroadcast(query, willSuccess, f) {
  // good luck.
  await sleep(Math.floor(Math.random() * 1000));
  while (running) {
    await sleep(Math.floor(Math.random() * 10));
  }
  running = true;
  let old_seq = await query.getSeqNumber('lino');
  console.log('>>>  start process with old seq', old_seq);

  let rst;
  try {
    rst = await f();
    if (willSuccess) {
      while (true) {
        await sleep(Math.floor(Math.random() * 100));
        let new_seq = await query.getSeqNumber('lino');
        if (new_seq > old_seq) {
          console.log('>>>  finish with: ', new_seq);
          break;
        }
      }
    }
  } catch (e) {
    running = false;
    throw e;
  }

  running = false;
  return rst;
}

// testsuite
function addSuite(envName) {
  const { LINO, UTILS } = lino;

  describe('LINO', function() {
    const linoClient = new LINO({
      nodeUrl: NODE_URL,
      chainId: 'test-chain-QHLy66'
    });
    it('remote nodeUrl works', async function() {
      const result = await fetch(`${NODE_URL}block?height=1`).then(resp => resp.json());
      expect(result).to.exist;
    });
    describe('query', function() {
      const query = linoClient.query;

      it('getAllValidators', function() {
        return query.getAllValidators().then(v => {
          debug('getAllValidators', v);
          expect(v).to.have.all.keys(
            'oncall_validators',
            'all_validators',
            'pre_block_validators',
            'lowest_power',
            'lowest_validator'
          );
        });
      });

      it('getFollowingMeta', function() {
        return query.getFollowingMeta(myUser, 'lino').then(v => {
          debug('getFollowingMeta', v);
          expect(v).to.have.all.keys('created_at', 'following_name');
        });
      });

      // TODO: figure out how to check the results in array
      it.skip('getAllFollowingMeta', function() {
        return query.getAllFollowingMeta(myUser).then(v => {
          console.log('>>> test getAllFollowingMeta v: ', v);
          debug('getAllFollowingMeta', v);
          expect(v).to.have.all.keys('created_at', 'following_name');
        });
      });

      it('getValidator', function() {
        return query.getValidator('lino').then(v => {
          debug('getValidator', v);
          expect(v).to.have.all.keys(
            'ABCIValidator',
            'username',
            'deposit',
            'absent_commit',
            'byzantine_commit',
            'produced_blocks',
            'link'
          );
        });
      });

      it('getDevelopers', function() {
        return query.getDevelopers().then(v => {
          debug('getDevelopers', v);
        });
      });

      it('getDeveloper', function() {
        return query.getDeveloper('lino').then(v => {
          debug('getDeveloper', v);
          expect(v).to.have.all.keys(
            'username',
            'web_site',
            'app_meta_data',
            'description',
            'deposit',
            'app_consumption'
          );
        });
      });

      it('getInfraProviders', function() {
        return query.getInfraProviders().then(v => {
          debug('getInfraProviders', v);
          expect(v).to.have.all.keys('all_infra_providers');
        });
      });

      it('getInfraProvider', function() {
        return query.getInfraProvider('lino').then(v => {
          debug('getInfraProvider', v);
          expect(v).to.have.all.keys('username', 'usage');
        });
      });

      it('getGlobalAllocationParam', function() {
        return query.getGlobalAllocationParam().then(v => {
          debug('getGlobalAllocationParam', v);
          expect(v).to.have.all.keys(
            'infra_allocation',
            'content_creator_allocation',
            'developer_allocation',
            'validator_allocation'
          );
        });
      });

      it('getValidatorParam', function() {
        return query.getValidatorParam().then(v => {
          debug('getValidatorParam', v);
          expect(v).to.have.all.keys(
            'validator_min_withdraw',
            'validator_min_voting_deposit',
            'validator_min_commiting_deposit',
            'validator_coin_return_interval',
            'validator_coin_return_times',
            'penalty_miss_vote',
            'penalty_miss_commit',
            'penalty_byzantine',
            'validator_list_size',
            'absent_commit_limitation'
          );
        });
      });
      it('getAccountBank', function() {
        return query.getAccountBank('lino').then(v => {
          debug('getAccountBank', v);
          expect(v).to.have.all.keys(
            'saving',
            'stake',
            'frozen_money_list',
            'number_of_transaction',
            'number_of_reward'
          );
        });
      });

      it('getSeqNumber', function() {
        return query.getSeqNumber('lino').then(v => {
          debug('getSeqNumber', v);
          expect(v).to.be.a('number');
        });
      });

      it('getAllBalanceHistory', function() {
        return query.getAllBalanceHistory('lino').then(v => {
          debug('getAllBalanceHistory', v);
          expect(v).to.have.all.keys('details');
        });
      });

      it('getBalanceHistoryFromTo', function() {
        return query.getBalanceHistoryFromTo('lino', 0, 20).then(v => {
          debug('getBalanceHistoryFromTo', v);
          expect(v).to.have.all.keys('details');
        });
      });

      it('getRecentBalanceHistory', function() {
        return query.getRecentBalanceHistory('lino', 10).then(v => {
          debug('getRecentBalanceHistory', v);
          expect(v).to.have.all.keys('details');
        });
      });

      it('getProposal', function() {
        return query.getProposal('1').then(v => {
          debug('getProposal', v);
          expect(v).to.have.all.keys('type', 'value');
          expect(lino.isChangeParamProposalValue(v.value)).to.be.true;
          expect(lino.isGlobalAllocationParam(v.value.param.value)).to.be.true;
        });
      });

      it('getVote', function() {
        return query.getVote('1', 'lino').then(v => {
          debug('getVote', v);
          expect(v).to.have.all.keys('voter', 'result', 'voting_power');
        });
      });

      it('getOngoingProposal', function() {
        return query.getOngoingProposal().then(v => {
          debug('getOngoingProposal', v);
        });
      });

      it('getExpiredProposal', function() {
        return query.getExpiredProposal().then(v => {
          debug('getExpiredProposal', v);
        });
      });

      it('doesUsernameMatchPrivKey', function() {
        return query.doesUsernameMatchMasterPrivKey('lino', testTxPrivHex).then(v => {
          debug('doesUsernameMatchPrivKey', v);
          expect(v).to.be.false;
        });
      });

      it('getAllGrantPubKeys', function() {
        return query.getAllGrantPubKeys('yukai-tu11').then(v => {
          debug('getAllGrantPubKeys', v);
        });
      });

      it('getAllPosts', function() {
        this.timeout(0);
        return query.getAllPosts('yukai-tu11').then(v => {
          debug('getAllPosts', v);
        });
      });

      it('getAccountBank', function() {
        this.timeout(0);
        return query.getAccountBank('yukai-tu11').then(v => {
          debug('get acc bank', v);
        });
      });

      it('getDevelopers', function() {
        this.timeout(0);
        return query.getDevelopers().then(v => {
          debug('getDevelopers', v);
        });
      });
    });

    describe('broadcast', function() {
      const userName = makeid(10);
      const randomMasterPrivKey = UTILS.genPrivKeyHex();
      const derivedTxPrivKey = UTILS.derivePrivKey(randomMasterPrivKey);
      const derivedMicroPrivKey = UTILS.derivePrivKey(derivedTxPrivKey);
      const derivedPostPrivKey = UTILS.derivePrivKey(derivedMicroPrivKey);
      const query = linoClient.query;
      const broadcast = linoClient.broadcast;
      this.timeout(10000);

      it('register', function() {
        const masterPubKey = UTILS.pubKeyFromPrivate(randomMasterPrivKey);
        const txPubKey = UTILS.pubKeyFromPrivate(derivedTxPrivKey);
        const microPubKey = UTILS.pubKeyFromPrivate(derivedMicroPrivKey);
        const postPubKey = UTILS.pubKeyFromPrivate(derivedPostPrivKey);

        debug('register: ', userName);
        debug('MasterKey: ', randomMasterPrivKey);
        debug('txPrivKey: ', derivedTxPrivKey);
        debug('register pub key in input========: ', microPubKey);

        return runBroadcast(query, true, () => {
          return query
            .getSeqNumber('lino')
            .then(seq => {
              expect(seq).to.be.a('number');
              return seq;
            })
            .then(seq => {
              return broadcast
                .register(
                  'lino',
                  '10',
                  userName,
                  masterPubKey,
                  txPubKey,
                  microPubKey,
                  postPubKey,
                  testTxPrivHex,
                  seq
                )
                .then(v => {
                  debug('register', v);
                  expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
                  console.log('start recover');
                  return broadcast
                    .recover(
                      userName,
                      masterPubKey,
                      txPubKey,
                      microPubKey,
                      postPubKey,
                      randomMasterPrivKey,
                      0
                    )
                    .then(res => console.log(res));
                });
            });
        });
      });

      it('transfer', function() {
        return runBroadcast(query, true, () => {
          return query
            .getSeqNumber('lino')
            .then(seq => {
              debug('query seq number before transfer', seq);
              debug(getUnixTime());
              expect(seq).to.be.a('number');
              return seq;
            })
            .then(seq => {
              return broadcast
                .transfer('lino', userName, '10', 'memo1', testTxPrivHex, seq)
                .then(v => {
                  debug('transfer', v);
                  expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
                });
            });
        });
      });
      it('grantPermission', function() {
        return runBroadcast(query, true, () => {
          return query
            .getSeqNumber(userName)
            .then(seq => {
              debug('query seq number before grant', seq);
              debug(getUnixTime());
              expect(seq).to.be.a('number');
              return seq;
            })
            .then(seq => {
              return broadcast
                .grantPermission(userName, 'lino', 1000000, 1, 10, derivedTxPrivKey, seq)
                .then(v => {
                  debug('grant permission', v);
                  expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
                });
            });
        });
      });

      it('createPost', function() {
        let username = userName;
        let txKey = derivedTxPrivKey;
        let postId = makeid(20);
        return runBroadcast(query, false, () => {
          return query.getSeqNumber(username).then(seq => {
            let map = new Map();
            map.set('A', '1');
            map.set('B', '2');
            return broadcast
              .createPost(
                username,
                postId,
                'mytitle',
                'dummycontent',
                '',
                '',
                '',
                '',
                '0.5',
                map,
                txKey,
                seq
              )
              .then(v => {
                debug('createPost', v);
                expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
              });
          });
        });
      });

      it('changeParameter', function() {
        return runBroadcast(query, true, () => {
          return query.getSeqNumber('lino').then(seq => {
            return query.getGlobalAllocationParam().then(param => {
              param.content_creator_allocation.num = 70;
              param.developer_allocation.num = 5;
              return broadcast
                .changeGlobalAllocationParam('lino', param, testTxPrivHex, seq)
                .then(v => {
                  debug('changeGlobalAllocationParam', v);
                  expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
                });
            });
          });
        });
      });

      it('voteProposal', function() {
        return runBroadcast(query, true, () => {
          return query.getSeqNumber('lino').then(seq => {
            return broadcast.voteProposal('lino', '1', true, testTxPrivHex, seq).then(v => {
              debug('voteProposal', v);
              expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
            });
          });
        });
      });

      it('revokePermission', function() {
        return runBroadcast(query, true, () => {
          return query.getSeqNumber(username).then(seq => {
            return broadcast
              .revokePermission(
                username,
                'eb5ae98221037bb974cf968efd294714d01bdf9d848981147bf7fe7432aed3219aa63e307144',
                1,
                testTxPrivHex,
                seq
              )
              .then(v => {
                debug('revoke permission', v);
                expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
              });
          });
        });
      });

      it.skip('some other', function() {
        // return query.getSeqNumber('zhimao').then(seq => {
        //   return broadcast
        //     .deletePostContent('zhimao', 'zhimao', 'id', 'violence', zhimaoTx, seq)
        //     .then(v => {
        //       debug('make delete content proposal', v);
        //       expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
        //     });
        // });
      });

      it('throws error if fail', function() {
        return query.getSeqNumber('lino').then(seq => {
          debug('query seq number before transfer', seq);
          expect(seq).to.be.a('number');
          return runBroadcast(query, false, () => {
            return broadcast
              .transfer('lino', 'middle-man', 'INVALID_AMOUNT', 'hi', testTxPrivHex, seq)
              .catch(err => {
                debug('transfer error', err);
                expect(err).to.have.all.keys('code', 'type');
                expect(err).to.be.an.instanceOf(lino.BroadcastError);
              });
          });
        });
      });
    });

    describe('UTILS', function() {
      const query = linoClient.query;
      const broadcast = linoClient.broadcast;

      it('generate private key', function() {
        expect(UTILS.genPrivKeyHex()).to.exist;
      });

      it('private key match pub key', function() {
        const match = UTILS.isKeyMatch(testTxPrivHex, UTILS.pubKeyFromPrivate(testTxPrivHex));
        expect(match).to.equal(true);
      });

      it('invalid username', function() {
        const res = UTILS.isValidUsername('-register');
        expect(res).to.equal(false);
      });
    });
  });
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addSuite;
}
