const NODE_URL = 'http://34.235.130.1:46657/';
const testTxPrivHex = 'E1B0F79A2045793AD58ADA5872FC679754F43570BA0802520D3794508FBBDFA65694742601';
const testValidatorPubHex =
  '1624DE6220e008041ccafcc76788099b990531697ff4bf8eb2d1fabe204ee5fe0fc2c7c3f6';

function addSuite(envName) {
  describe('LINO', function() {
    it('remote nodeUrl works', async function() {
      const result = await fetch(`${NODE_URL}block?height=1`).then(resp => resp.json());
      expect(result).to.exist;
    });
    describe('query', function() {
      const query = new LINO({
        // chainId: 'test-chain-FdqWc7',
        nodeUrl: NODE_URL
      }).query;

      it('getAllValidators', function() {
        return query.getAllValidators().then(v => {
          console.log(v);
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
          console.log(v);
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
          console.log(v);
          expect(v).to.have.all.keys('all_developers');
        });
      });

      it('getDeveloper', function() {
        return query.getDeveloper('Lino').then(v => {
          console.log(v);
          expect(v).to.have.all.keys('username', 'deposit', 'app_consumption');
        });
      });

      it('getInfraProviders', function() {
        return query.getInfraProviders().then(v => {
          console.log(v);
          expect(v).to.have.all.keys('all_infra_providers');
        });
      });

      it('getInfraProvider', function() {
        return query.getInfraProvider('Lino').then(v => {
          console.log(v);
          expect(v).to.have.all.keys('username', 'usage');
        });
      });

      it('getGlobalAllocationParam', function() {
        return query.getGlobalAllocationParam().then(v => {
          console.log(v);
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
          console.log(v);
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
          console.log(v);
          expect(v).to.have.all.keys('saving', 'stake', 'frozen_money_list');
        });
      });

      it('getSeqNumber', function() {
        return query.getSeqNumber('Lino').then(v => {
          expect(v).to.be.a('number');
        });
      });

      it('doesUsernameMatchPrivKey', function() {
        return query.doesUsernameMatchPrivKey('Lino', testTxPrivHex).then(v => {
          expect(v).to.be.false;
        });
      });
    });

    // describe('broadcast', function() {
    //   const lino = new LINO({
    //     nodeUrl: NODE_URL
    //   });

    //   const broadcast = lino.broadcast;

    //   const masterPrivKey = UTILS.genPrivKeyHex();
    //   const txPrivKey = UTILS.genPrivKeyHex();
    //   const postPrivKey = UTILS.genPrivKeyHex();

    //   const masterPubKey = UTILS.pubKeyFromPrivate(masterPrivKey);
    //   const txPubKey = UTILS.pubKeyFromPrivate(txPrivKey);
    //   const postPubKey = UTILS.pubKeyFromPrivate(postPrivKey);
    // });
  });

  describe('UTILS', function() {
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

    it('use derive priv key', function() {
      const lino = new LINO({
        nodeUrl: NODE_URL
      });

      const broadcast = lino.broadcast;
      const query = lino.query;
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
              'new-test-user',
              masterPubKey,
              postPubKey,
              txPubKey,
              testTxPrivHex,
              seq
            )
            .then(v => {
              console.log(v);
              expect(v).to.have.all.keys('check_tx', 'deliver_tx', 'hash', 'height');
            });
        });
    });
  });
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addSuite;
}
