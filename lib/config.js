var loc = process.env.TRIPOD_CONFIG,
    fs    = require('fs'),
    conf = require('nconf');

conf.env()
    .file({ file: loc });

conf.defaults({
    "namespaces":{
        "rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs":"http://www.w3.org/2000/01/rdf-schema#",
        "changeset":"http://purl.org/vocab/changeset/schema#"
    },
    "defaultContext" : "http://talis.com/",
    "databases" : {
        "defaultConnStr" : "mongodb://localhost"
    }
});

exports = module.exports = conf;