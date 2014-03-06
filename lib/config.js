var loc = process.env.TRIPOD_CONFIG,
    fs    = require('fs'),
    conf = require('nconf');

conf.file({ file: loc });

conf.defaults({
    "namespaces":{
        "rdfs":"http://www.w3.org/2000/01/rdf-schema#"
    },
    "defaultContext" : "http://talis.com/",
    "view_specifications" : [],
    "table_specifications" : []
});

exports = module.exports = conf;