const NODE_URL = 'http://18.222.228.141:26657/';
const testTxPrivHex = 'E1B0F79B20149E17A2AF928AFE7774B93114E7EB62CCF56903E375EA1C4F62EAC5E4FE8D59';
const testAppPrivHex = 'E1B0F79B203011994492CFDA9319DDC2A78E216B040200CD06BDC2B912EA04479C0AFEC1BC';

const myUser = 'lino';
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
      chainId: 'lino-testnet'
    });
    it('remote nodeUrl works', async function() {
      const result = await fetch(`${NODE_URL}block?height=1`).then(resp => resp.json());
      expect(result).to.exist;
    });
    describe('query', function() {
      this.timeout(20000);
      const query = linoClient.query;

      // it('getAllValidators', function() {
      //   return query.getAllValidators().then(v => {
      //     debug('getAllValidators', v);
      //     expect(v).to.have.all.keys(
      //       'oncall_validators',
      //       'all_validators',
      //       'pre_block_validators',
      //       'lowest_power',
      //       'lowest_validator'
      //     );
      //   });
      // });

      // it('getFollowingMeta', function() {
      //   return query.getFollowingMeta(myUser, 'lino').then(v => {
      //     debug('getFollowingMeta', v);
      //     expect(v).to.have.all.keys('created_at', 'following_name');
      //   });
      // });

      it('getUserReputationMeta', function() {
        return query.getUserReputationMeta('ytu').then(v => {
          debug('getUserReputationMeta', v);
        });
      });

      // it('getTxsInBlock', function() {
      //   return query.getTxsInBlock(17187).then(v => {
      //     console.log('getTxsInBlock', v);
      //   });
      // });

      // // TODO: figure out how to check the results in array
      // it.skip('getAllFollowingMeta', function() {
      //   return query.getAllFollowingMeta(myUser).then(v => {
      //     console.log('>>> test getAllFollowingMeta v: ', v);
      //     debug('getAllFollowingMeta', v);
      //     expect(v).to.have.all.keys('created_at', 'following_name');
      //   });
      // });

      // it('getValidator', function() {
      //   return query.getValidator('lino').then(v => {
      //     debug('getValidator', v);
      //     expect(v).to.have.all.keys(
      //       'ABCIValidator',
      //       'username',
      //       'deposit',
      //       'absent_commit',
      //       'byzantine_commit',
      //       'produced_blocks',
      //       'link'
      //     );
      //   });
      // });

      // it('getDevelopers', function() {
      //   return query.getDevelopers().then(v => {
      //     debug('getDevelopers', v);
      //   });
      // });

      // it('getDeveloper', function() {
      //   return query.getDeveloper('lino').then(v => {
      //     debug('getDeveloper', v);
      //     expect(v).to.have.all.keys(
      //       'username',
      //       'web_site',
      //       'app_meta_data',
      //       'description',
      //       'deposit',
      //       'app_consumption'
      //     );
      //   });
      // });

      // it('getInfraProviders', function() {
      //   return query.getInfraProviders().then(v => {
      //     debug('getInfraProviders', v);
      //     expect(v).to.have.all.keys('all_infra_providers');
      //   });
      // });

      // it('getInfraProvider', function() {
      //   return query.getInfraProvider('lino').then(v => {
      //     debug('getInfraProvider', v);
      //     expect(v).to.have.all.keys('username', 'usage');
      //   });
      // });

      // it('getGlobalAllocationParam', function() {
      //   return query.getGlobalAllocationParam().then(v => {
      //     debug('getGlobalAllocationParam', v);
      //     expect(v).to.have.all.keys(
      //       'infra_allocation',
      //       'content_creator_allocation',
      //       'developer_allocation',
      //       'validator_allocation'
      //     );
      //   });
      // });

      // it('getValidatorParam', function() {
      //   return query.getValidatorParam().then(v => {
      //     debug('getValidatorParam', v);
      //     expect(v).to.have.all.keys(
      //       'validator_min_withdraw',
      //       'validator_min_voting_deposit',
      //       'validator_min_commiting_deposit',
      //       'validator_coin_return_interval',
      //       'validator_coin_return_times',
      //       'penalty_miss_vote',
      //       'penalty_miss_commit',
      //       'penalty_byzantine',
      //       'validator_list_size',
      //       'absent_commit_limitation'
      //     );
      //   });
      // });
      // it('getAccountBank', function() {
      //   return query.getAccountBank('lino').then(v => {
      //     debug('getAccountBank', v);
      //     expect(v).to.have.all.keys(
      //       'saving',
      //       'coin_day',
      //       'frozen_money_list',
      //       'number_of_transaction',
      //       'number_of_reward'
      //     );
      //   });
      // });

      // it('getSeqNumber', function() {
      //   return query.getSeqNumber('lino').then(v => {
      //     debug('getSeqNumber', v);
      //     expect(v).to.be.a('number');
      //   });
      // });

      // it('getAllBalanceHistory', function() {
      //   return query.getAllBalanceHistory('lino').then(v => {
      //     debug('getAllBalanceHistory', v);
      //     expect(v).to.have.all.keys('details');
      //   });
      // });

      // it('getBalanceHistoryFromTo', function() {
      //   return query.getBalanceHistoryFromTo('lino', 0, 20).then(v => {
      //     debug('getBalanceHistoryFromTo', v);
      //     expect(v).to.have.all.keys('details');
      //   });
      // });

      // it('getRecentBalanceHistory', function() {
      //   return query.getRecentBalanceHistory('lino', 10).then(v => {
      //     debug('getRecentBalanceHistory', v);
      //     expect(v).to.have.all.keys('details');
      //   });
      // });

      // it('getProposal', function() {
      //   return query.getProposal('1').then(v => {
      //     debug('getProposal', v);
      //     expect(v).to.have.all.keys('type', 'value');
      //   });
      // });

      // it('getProposal', function() {
      //   return query.getProposal('2').then(v => {
      //     debug('getProposal', v);
      //     expect(v).to.have.all.keys('type', 'value');
      //   });
      // });
      // it('getVote', function() {
      //   return query.getVote('1', 'lino').then(v => {
      //     debug('getVote', v);
      //     expect(v).to.have.all.keys('voter', 'result', 'voting_power');
      //   });
      // });

      it('getOngoingProposalList', function() {
        return query.getOngoingProposalList().then(v => {
          debug('getOngoingProposalList', v);
        });
      });
      it('getExpiredProposalList', function() {
        return query.getExpiredProposalList().then(v => {
          debug('getExpiredProposalList', v);
        });
      });

      // it('getAccountParam', function() {
      //   return query.getAccountParam().then(v => {
      //     debug('getAccountParam', v);
      //   });
      // });
      // it('getAllEventAtAllTime', function() {
      //   return query
      //     .getAllEventAtAllTime()
      //     .then(v => {
      //       debug('getAllEventAtAllTime', v);
      //     })
      //     .catch(err => {});
      // });
      it('getProposalParam', function() {
        return query
          .getProposalParam()
          .then(v => {
            debug('getProposalParam', v);
          })
          .catch(err => {});
      });

      // it('getTxsInBlock', function() {
      //   return query.getTxsInBlock('406428').then(v => {
      //     debug('getTxsInBlock', v);
      //   });
      // });
      // it('getConsumptionMeta', function() {
      //   return query.getConsumptionMeta().then(v => {
      //     debug('getConsumptionMeta', v);
      //   });
      // });
      // it('getExpiredProposal', function() {
      //   return query.getExpiredProposal().then(v => {
      //     debug('getExpiredProposal', v);
      //   });
      // });

      // it('doesUsernameMatchPrivKey', function() {
      //   return query.doesUsernameMatchResetPrivKey('lino', testTxPrivHex).then(v => {
      //     debug('doesUsernameMatchPrivKey', v);
      //     expect(v).to.be.false;
      //   });
      // });

      // it('getAllGrantPubKeys', function() {
      //   return query.getAllGrantPubKeys('lino').then(v => {
      //     debug('getAllGrantPubKeys', v);
      //   });
      // });

      // it('getAllPosts', function() {
      //   this.timeout(0);
      //   return query.getAllPosts('carrioner').then(v => {
      //     debug('getAllPosts', v);
      //   });
      // });

      it('getInterestAgain', function() {
        this.timeout(0);
        return query.getInterest('sq7').then(v => {
          debug('getInterestAgain', v);
        });
      });
      // it('getAccountBank', function() {
      //   this.timeout(0);
      //   return query.getAccountBank('lino').then(v => {
      //     debug('get acc bank', v);
      //   });
      // });

      // it('getDevelopers', function() {
      //   this.timeout(0);
      //   return query.getDevelopers().then(v => {
      //     debug('getDevelopers', v);
      //   });
      // });
    });

    describe('broadcast', function() {
      const userName = makeid(10);
      const pubkeyToRevoke = UTILS.pubKeyFromPrivate(testTxPrivHex);
      const randomResetPrivKey = UTILS.genPrivKeyHex();
      const derivedTxPrivKey = UTILS.derivePrivKey(randomResetPrivKey);
      const derivedAppPrivKey = UTILS.derivePrivKey(derivedTxPrivKey);
      const query = linoClient.query;
      const broadcast = linoClient.broadcast;
      this.timeout(20000);

      it('register', function() {
        const resetPubKey = UTILS.pubKeyFromPrivate(randomResetPrivKey);
        const txPubKey = UTILS.pubKeyFromPrivate(derivedTxPrivKey);
        const appPubKey = UTILS.pubKeyFromPrivate(derivedAppPrivKey);

        debug('register: ', userName);
        debug('resetKey: ', randomResetPrivKey);
        debug('txPrivKey: ', derivedTxPrivKey);
        debug('appKey ', appPubKey);

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
                  resetPubKey,
                  txPubKey,
                  appPubKey,
                  testTxPrivHex,
                  seq
                )
                .then(v => {
                  debug('register', v);
                  expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
                  console.log('start recover');
                  return broadcast
                    .recover(userName, resetPubKey, txPubKey, appPubKey, randomResetPrivKey, 0)
                    .then(res => console.log(res));
                });
            });
        });
      });

      it('claim interest', function() {
        return runBroadcast(query, true, () => {
          return query
            .getSeqNumber('validator7')
            .then(seq => {
              debug('query seq number before transfer', seq);
              debug(getUnixTime());
              expect(seq).to.be.a('number');
              return seq;
            })
            .then(seq => {
              return broadcast
                .claimInterest(
                  'validator7',
                  'E1B0F79B20797F9D3E44BFDBCB8C5016E9A2F75C5207A3E42EF662DBB93CF6033CF81D1A26',
                  seq
                )
                .then(v => console.log(v));
            });
        });
      });
      // // it('grantPermission', function() {
      // //   return runBroadcast(query, true, () => {
      // //     return query
      // //       .getSeqNumber(userName)
      // //       .then(seq => {
      // //         debug('query seq number before grant', seq);
      // //         debug(getUnixTime());
      // //         expect(seq).to.be.a('number');
      // //         return seq;
      // //       })
      // //       .then(seq => {
      // //         broadcast
      // //           .grantPermission(userName, 'lino', 1000000, '1', derivedTxPrivKey, seq)
      // //           .then(v => {
      // //             debug('grant permission', v);
      // //             done();
      // //           });
      // //       });
      // //   });
      // // });

      // console.log('create post');
      // it('createPost', function() {
      //   let username = userName;
      //   let txKey = derivedTxPrivKey;
      //   let postId = makeid(20);
      //   return runBroadcast(query, false, () => {
      //     return query.getSeqNumber(username).then(seq => {
      //       let map = new Map();
      //       map.set('A', '1');
      //       map.set('B', '2');
      //       return broadcast
      //         .createPost(
      //           username,
      //           postId,
      //           'mytitle',
      //           'dummycontent',
      //           '',
      //           '',
      //           '',
      //           '',
      //           '0.5',
      //           map,
      //           txKey,
      //           seq
      //         )
      //         .then(v => {
      //           debug('createPost', v);
      //           expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
      //         });
      //     });
      //   });
      // });

      // it('changeParameter', function() {
      //   return runBroadcast(query, true, () => {
      //     return query.getSeqNumber('lino').then(seq => {
      //       return query.getGlobalAllocationParam().then(param => {
      //         console.log('changeParameter', param);
      //         param.content_creator_allocation = '2/10';
      //         param.developer_allocation = '3/20';
      //         return broadcast
      //           .changeGlobalAllocationParam('lino', param, 'reason', testTxPrivHex, seq)
      //           .then(v => {
      //             debug('changeGlobalAllocationParam', v);
      //             expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
      //           });
      //       });
      //     });
      //   });
      // });

      // it('changeBandwidthParameter', function() {
      //   return runBroadcast(query, true, () => {
      //     return query.getSeqNumber('validator1').then(seq => {
      //       return query.getBandwidthParam().then(param => {
      //         console.log('changeBandwidthParameter', param);
      //         param.capacity_usage_per_transaction.amount = '1';
      //         return broadcast
      //           .changeBandwidthParam(
      //             'validator1',
      //             param,
      //             'reason',
      //             'E1B0F79B201881AA64D6104FAFAB67E6C5EB23AB381F3F04D417444A94B39EDC7347F83A65',
      //             seq
      //           )
      //           .then(v => {
      //             debug('changeBandwidthParameter', v);
      //             expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
      //           });
      //       });
      //     });
      //   });
      // });

      // it('changeValidatorParam', function() {
      //   return runBroadcast(query, true, () => {
      //     return query.getSeqNumber('lino').then(seq => {
      //       return query.getValidatorParam().then(param => {
      //         console.log('changeValidatorParam', param);
      //         param.validator_list_size = '23';
      //         return broadcast
      //           .changeValidatorParam('lino', param, 'reason', testTxPrivHex, seq)
      //           .then(v => {
      //             debug('changeValidatorParam', v);
      //             expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
      //           });
      //       });
      //     });
      //   });
      // });
      // it('voteProposal', function() {
      //   return runBroadcast(query, true, () => {
      //     return query.getSeqNumber('lino').then(seq => {
      //       return broadcast.voteProposal('lino', '1', true, testTxPrivHex, seq).then(v => {
      //         debug('voteProposal', v);
      //         expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
      //       });
      //     });
      //   });
      // });

      // it('revokePermission', function() {
      //   return runBroadcast(query, true, () => {
      //     return query.getSeqNumber(userName).then(seq => {
      //       return broadcast
      //         .revokePermission(
      //           userName,
      //           'eb5ae98721025d79562d58282e5a9b6cd97e3df328023b5b3a7e98d0e1855f66a4aeb5da862c',
      //           testTxPrivHex,
      //           seq
      //         )
      //         .then(v => {
      //           debug('revoke permission', v);
      //           expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
      //         });
      //     });
      //   });
      // });
      // it.skip('some other', function() {
      //   // return query.getSeqNumber('zhimao').then(seq => {
      //   //   return broadcast
      //   //     .deletePostContent('zhimao', 'zhimao', 'id', 'violence', zhimaoTx, seq)
      //   //     .then(v => {
      //   //       debug('make delete content proposal', v);
      //   //       expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
      //   //     });
      //   // });
      // });

      // it('throws error if fail', function() {
      //   return query.getSeqNumber('lino').then(seq => {
      //     debug('query seq number before transfer', seq);
      //     expect(seq).to.be.a('number');
      //     return runBroadcast(query, false, () => {
      //       return broadcast
      //         .transfer('lino', 'middle-man', 'INVALID_AMOUNT', 'hi', testTxPrivHex, seq)
      //         .catch(err => {
      //           debug('transfer error', err);
      //           expect(err).to.have.all.keys('code', 'type');
      //           expect(err).to.be.an.instanceOf(lino.BroadcastError);
      //         });
      //     });
      //   });
      // });
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

      it('sign with sha256 and verify', function() {
        const msg = makeid(10);
        const sig = UTILS.signWithSha256(msg, testAppPrivHex);
        console.log('base64 sig: ', msg, sig);
        const result = UTILS.verifyWithSha256(msg, UTILS.pubKeyFromPrivate(testAppPrivHex), sig);
        expect(result).to.equal(true);
      });

      it('sign with sha256 and verify with stringify', function() {
        const msg = makeid(10);
        const sig = UTILS.signWithSha256(msg, testTxPrivHex);
        const stringifySig = JSON.stringify(sig);
        const parseSig = JSON.parse(stringifySig);
        const result = UTILS.verifyWithSha256(
          msg,
          UTILS.pubKeyFromPrivate(testTxPrivHex),
          parseSig
        );
        expect(result).to.equal(true);
      });
      it('sign with sha256 and verify different sig', function() {
        const msg = makeid(10);
        const username = makeid(10);
        const fakemsg = makeid(10);
        const sig = UTILS.signWithSha256(msg, testTxPrivHex);
        const result = UTILS.verifyWithSha256(fakemsg, UTILS.pubKeyFromPrivate(testTxPrivHex), sig);
        expect(result).to.equal(false);
      });
    });
  });
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addSuite;
}
