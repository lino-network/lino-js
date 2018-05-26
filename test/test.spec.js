function addSuite(envName) {
  describe('lino', function() {
    it('remote nodeUrl works', async function() {
      const result = await fetch(
        'http://34.235.130.1:46657/block?height=1'
      ).then(resp => resp.json());
      expect(result).to.exist;
    });
    it('query', async function() {
      const query = new LINO({
        nodeUrl: 'http://34.235.130.1:46657/'
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
        nodeUrl: 'http://34.235.130.1:46657/'
      });

      const broadcast = lino.broadcast;
      const testPrivHex =
        'ef105137f5ce2c6a6d4faf0840b22692e1c42bbdb779960f72983ae09b4de22a';
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
