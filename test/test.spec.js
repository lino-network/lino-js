const NODE_URL = 'http://34.235.130.1:46657/';
const testTxPrivHex =
  'E1B0F79A2045793AD58ADA5872FC679754F43570BA0802520D3794508FBBDFA65694742601';
const testValidatorPubHex =
  '1624DE6220e008041ccafcc76788099b990531697ff4bf8eb2d1fabe204ee5fe0fc2c7c3f6';

function addSuite(envName) {
  describe('LINO', function() {
    it('remote nodeUrl works', async function() {
      const result = await fetch(`${NODE_URL}block?height=1`).then(resp =>
        resp.json()
      );
      expect(result).to.exist;
    });
    it('query', async function() {
      const query = new LINO({
        // chainId: 'test-chain-FdqWc7',
        nodeUrl: NODE_URL
      }).query;
      query.getAllValidators().then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getValidator('Lino').then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getDevelopers().then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getDeveloper('Lino').then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getInfraProviders().then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getInfraProvider('Lino').then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getGlobalAllocationParam().then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getValidatorParam().then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getAccountBank('Lino').then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.doesUsernameMatchPrivKey('Lino', testTxPrivHex).then(v => {
        console.log(v);
        expect(v).to.exist;
      });
    });

    it('broadcast', async function() {
      const lino = new LINO({
        nodeUrl: NODE_URL
      });

      const broadcast = lino.broadcast;
      const query = lino.query;

      const masterPrivKey = UTILS.genPrivKeyHex();
      const txPrivKey = UTILS.genPrivKeyHex();
      const postPrivKey = UTILS.genPrivKeyHex();

      const masterPubKey = UTILS.pubKeyFromPrivate(masterPrivKey);
      const txPubKey = UTILS.pubKeyFromPrivate(txPrivKey);
      const postPubKey = UTILS.pubKeyFromPrivate(postPrivKey);
    });
  });

  describe('UTILS', function() {
    it('generate private key', function() {
      expect(UTILS.genPrivKeyHex()).to.exist;
    });

    it('private key match pub key', function() {
      const match = UTILS.isKeyMatch(
        testTxPrivHex,
        UTILS.pubKeyFromPrivate(testTxPrivHex)
      );
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
      const randomMasterPrivKey = UTILS.genPrivKeyHex();
      const derivedTxPrivKey = UTILS.derivePrivKey(randomMasterPrivKey);
      const derivedPostPrivKey = UTILS.derivePrivKey(derivedTxPrivKey);

      const masterPubKey = UTILS.pubKeyFromPrivate(randomMasterPrivKey);
      const txPubKey = UTILS.pubKeyFromPrivate(derivedTxPrivKey);
      const postPubKey = UTILS.pubKeyFromPrivate(derivedPostPrivKey);

      broadcast
        .register(
          'Lino',
          '20000000',
          'test-userx',
          masterPubKey,
          postPubKey,
          txPubKey,
          testTxPrivHex
        )
        .then(v => {
          console.log(v);
          expect(v).to.exist;
          sleep(3000).then(() => {
            broadcast
              .voterDeposit('test-userx', '15000', derivedPostPrivKey)
              .then(v => {
                console.log(v);
                expect(v).to.exist;
              });
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
