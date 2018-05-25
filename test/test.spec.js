function addSuite(envName) {
  describe('lino', function() {
    it('remote nodeUrl works', async function() {
      const result = await fetch('http://localhost:46657/block?height=1').then(
        resp => resp.json()
      );
      expect(result).to.exist;
    });
    it('query', async function() {
      const query = new LINO({
        nodeUrl: 'http://localhost:46657/'
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
    });

    it('broadcast', async function() {
      const lino = new LINO({
        nodeUrl: 'http://localhost:46657/'
      });

      const broadcast = lino.broadcast;
      // broadcast.transfer("Lino", "12", "1234", "100000", "memo", "priv").then(v => {
      //   console.log(v)
      //   expect(v).to.exist;
      // });
      lino.genPrivKeyHex();
      const testPrivHex =
        'bcdfa6724b79e3a45433ceeedabacff552007227f0f435bd2f1821fd10b56e5e';
      broadcast.voterDeposit('Lino', '123456', testPrivHex).then(v => {
        console.log(v);
        expect(v).to.exist;
      });
    });
  });
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addSuite;
}
