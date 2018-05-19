describe('test', function() {
  it('should return from request', async function() {
    const result = await fetch(
      'http://54.89.98.186:46657/block?height=1487'
    ).then(resp => resp.json());
    chai.expect(result).to.exist;
  });
});
