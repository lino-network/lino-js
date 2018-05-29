const NODE_URL = 'http://34.235.130.1:46657/';

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
      query.getBlock(237210).then(v => {
        console.log(v);
        expect(v).to.exist;
      });
      query.getTxsInBlock(237210).then(v => {
        console.log(v);
        expect(v).to.exist;
      });
    });

    it('broadcast', async function() {
      const lino = new LINO({
        nodeUrl: NODE_URL
      });

      const broadcast = lino.broadcast;
      const testPrivHex =
        'E1B0F79A20EF105137F5CE2C6A6D4FAF0840B22692E1C42BBDB779960F72983AE09B4DE22A';
      broadcast.voterDeposit('Lino', '123456', testPrivHex).then(v => {
        console.log(v);
        expect(v).to.exist;
      });
    });
  });

  describe('UTILS', function() {
    it('generate private key', function() {
      expect(UTILS.genPrivKeyHex()).to.exist;
    });
  });
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addSuite;
}
