// Enable mocha's bdd style
mocha.setup('bdd');

// Add chai's expect to the global scope
window.expect = chai.expect;
window.debug = debug('LINO:test');
localStorage.debug = 'LINO:test';
// // Enable fake server
// before(function() {
//   this.server = sinon.createFakeServer({ autoRespond: true });

//   this.server.respondWith('GET', '//lquixa.da/succeed.txt', [
//     200,
//     { 'Content-Type': 'text/plain' },
//     'hello world.'
//   ]);

//   this.server.respondWith('GET', '//lquixa.da/fail.txt', [
//     404,
//     { 'Content-Type': 'text/plain' },
//     'good bye world.'
//   ]);
// });

// after(function() {
//   this.server.restore();
// });
