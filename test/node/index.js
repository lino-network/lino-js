global.expect = require('chai').expect;
global.fetch = require('cross-fetch');
global.debug = require('debug')('LINO:test');

global.lino = require('../../lib/lino-js.cjs');

require('../test.spec')('node');
