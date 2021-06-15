'use strict';

var elliptic = exports;

elliptic.version = "6.5.4";
elliptic.utils = require('./elliptic/utils');
elliptic.rand = require('iwcrypto/brorand.js');
elliptic.curve = require('./elliptic/curve');
elliptic.curves = require('./elliptic/curves');

// Protocols
elliptic.ec = require('./elliptic/ec');
elliptic.eddsa = require('./elliptic/eddsa');
