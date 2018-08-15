// Enable mocha's bdd style
mocha.setup('bdd');

window.expect = chai.expect;
window.debug = debug('LINO:test');
localStorage.debug = 'LINO:test';
