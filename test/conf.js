process.env.TRIPOD_CONFIG = './test/conf.json';
process.env["databases:defaultConnStr"] = 'mongodb://foobarbaz';
require("../lib/config");