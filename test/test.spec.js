const NODE_URL = 'http://18.188.188.164:46657/';
const testTxPrivHex = 'E1B0F79A20C25E4115AB6C421D457BFD2B7B545094718CBF27ADF6923BEF19F01580990DD2';
const zhimaoTx = 'E1B0F79A207965259AFE06EEC9528BC4F692D0F5DE5B97BCF68B8BAF2D1A6C1D0057F58079';
const testValidatorPubHex =
  '1624DE6220e008041ccafcc76788099b990531697ff4bf8eb2d1fabe204ee5fe0fc2c7c3f6';

function addSuite(envName) {
  const { LINO, UTILS } = lino;

  describe('LINO', function() {
    const linoClient = new LINO({
      nodeUrl: NODE_URL,
      chainId: 'test-chain-z0QKeL'
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

      it('getValidator', function() {
        return query.getValidator('Lino').then(v => {
          debug('getValidator', v);
          expect(v).to.have.all.keys(
            'ABCIValidator',
            'username',
            'deposit',
            'absent_commit',
            'produced_blocks',
            'link'
          );
        });
      });

      it('getDevelopers', function() {
        return query.getDevelopers().then(v => {
          debug('getDevelopers', v);
          expect(v).to.have.all.keys('all_developers');
        });
      });

      it('getDeveloper', function() {
        return query.getDeveloper('Lino').then(v => {
          debug('getDeveloper', v);
          expect(v).to.have.all.keys('username', 'deposit', 'app_consumption');
        });
      });

      it('getInfraProviders', function() {
        return query.getInfraProviders().then(v => {
          debug('getInfraProviders', v);
          expect(v).to.have.all.keys('all_infra_providers');
        });
      });

      it('getInfraProvider', function() {
        return query.getInfraProvider('Lino').then(v => {
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
        return query.getAccountBank('Lino').then(v => {
          debug('getAccountBank', v);
          expect(v).to.have.all.keys(
            'saving',
            'stake',
            'frozen_money_list',
            'number_of_transaction'
          );
        });
      });

      it('getSeqNumber', function() {
        return query.getSeqNumber('Lino').then(v => {
          debug('getSeqNumber', v);
          expect(v).to.be.a('number');
        });
      });

      it('getAllBalanceHistory', function() {
        return query.getAllBalanceHistory('Lino').then(v => {
          debug('getAllBalanceHistory', v);
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
        return query.getVote('2', 'zhimao').then(v => {
          debug('getVote', v);
          expect(v).to.have.all.keys('voter', 'result', 'voting_power');
        });
      });

      it('getDelegateeList', function() {
        return query.getDelegateeList('zhimao').then(v => {
          debug('getDelegateeList', v);
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

      it('getAllDelegation', function() {
        return query.getAllDelegation('zhimao').then(v => {
          debug('getAllDelegation', v);
        });
      });

      it('doesUsernameMatchPrivKey', function() {
        return query.doesUsernameMatchPrivKey('Lino', testTxPrivHex).then(v => {
          debug('doesUsernameMatchPrivKey', v);
          expect(v).to.be.false;
        });
      });
    });

    describe('broadcast', function() {
      const query = linoClient.query;
      const broadcast = linoClient.broadcast;

      const masterPrivKey = UTILS.genPrivKeyHex();
      const txPrivKey = UTILS.genPrivKeyHex();
      const postPrivKey = UTILS.genPrivKeyHex();

      const masterPubKey = UTILS.pubKeyFromPrivate(masterPrivKey);
      const txPubKey = UTILS.pubKeyFromPrivate(txPrivKey);
      const postPubKey = UTILS.pubKeyFromPrivate(postPrivKey);

      it('transfer', function() {
        return query
          .getSeqNumber('Lino')
          .then(seq => {
            debug('query seq number before transfer', seq);
            expect(seq).to.be.a('number');
            return seq;
          })
          .then(seq => {
            return broadcast.transfer('Lino', 'zhimao', '1', 'hi', testTxPrivHex, seq).then(v => {
              debug('transfer', v);
              expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
            });
          });
      });

      it('throws error if fail', function() {
        return query.getSeqNumber('Lino').then(seq => {
          debug('query seq number before transfer', seq);
          expect(seq).to.be.a('number');
          return broadcast
            .transfer('Lino', 'middle-man', 'INVALID_AMOUNT', 'hi', testTxPrivHex, seq)
            .catch(err => {
              debug('transfer error', err);
              expect(err).to.have.all.keys('code', 'type');
              expect(err).to.be.an.instanceOf(lino.BroadcastError);
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

      it.skip('use derive priv key', function() {
        const randomMasterPrivKey = UTILS.genPrivKeyHex();
        const derivedTxPrivKey = UTILS.derivePrivKey(randomMasterPrivKey);
        const derivedPostPrivKey = UTILS.derivePrivKey(derivedTxPrivKey);

        const masterPubKey = UTILS.pubKeyFromPrivate(randomMasterPrivKey);
        const txPubKey = UTILS.pubKeyFromPrivate(derivedTxPrivKey);
        const postPubKey = UTILS.pubKeyFromPrivate(derivedPostPrivKey);

        return query
          .getSeqNumber('Lino')
          .then(seq => {
            expect(seq).to.be.a('number');
            return seq;
          })
          .then(seq => {
            return broadcast
              .register(
                'Lino',
                '20000000',
                'zhimao',
                masterPubKey,
                txPubKey,
                postPubKey,
                testTxPrivHex,
                seq
              )
              .then(v => {
                debug('register', v);
                expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
              });
          });

        return query.getSeqNumber('zhimao').then(seq => {
          return broadcast
            .deletePostContent('zhimao', 'zhimao', 'id', 'violence', zhimaoTx, seq)
            .then(v => {
              debug('make delete content proposal', v);
              expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
            });
        });

        return query.getSeqNumber('zhimao').then(seq => {
          let map = new Map();
          map.set('A', '1');
          map.set('B', '2');

          return broadcast
            .createPost(
              'zhimao',
              'id',
              'mytitle',
              'dummycontent',
              '',
              '',
              '',
              '',
              '0.5',
              map,
              zhimaoTx,
              seq
            )
            .then(v => {
              debug('createPost', v);
              expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
            });
        });

        return query.getSeqNumber('Lino').then(seq => {
          return query.getGlobalAllocationParam().then(param => {
            param.content_creator_allocation.num = 70;
            param.developer_allocation.num = 5;
            return broadcast
              .changeGlobalAllocationParam('Lino', param, testTxPrivHex, seq)
              .then(v => {
                debug('changeGlobalAllocationParam', v);
                expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
              });
          });
        });
      });
    });
  });
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addSuite;
}
