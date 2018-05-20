function addSuite(envName) {
  describe('lino', function() {
    it('remote nodeUrl works', async function() {
      const result = await fetch(
        'http://54.89.98.186:46657/block?height=1487'
      ).then(resp => resp.json());
      expect(result).to.exist;
    });
    it('query', async function() {
      const query = new LINO({ nodeUrl: 'http://54.89.98.186:46657/' }).query;
      query.getAllValidators().then(v => {
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
