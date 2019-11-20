require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });
require = require("esm")(module /*, options*/);
module.exports = require("./server.js");