var config = require("./config");
var MongoClient = require("mongodb").MongoClient;
var TripleGraph = require('./graph');

/**
 * Main tripod object
 * @constructor
 */
var Tripod = function(dbName,collectionName) {
    this._config = config;
    this._connStr = config.get("databases:"+dbName+":_connStr")+"/"+dbName;
    this._collectionName = collectionName;
    this._collection = null;
};

/**
 * Describe resource r in named context c
 * @param r
 * @param c if null will default to config.defaultContext
 * @param callback
 */
Tripod.prototype.describe = function(r,c,callback) {
    c = (c==null) ? this._config.get("defaultContext") : c;
    // todo: alias c and r
    this._getCollection(function(err,collection) {
        collection.findOne({_id:{"r":r,"c":c}},function(err,doc) {
            if (err) {
                callback(err,null);
            } else {
                var graph = new TripleGraph();
                graph.addTripodDoc(doc);
                callback(null,graph);
            }
        })
    })
};

/**
 * Lazy-load collection
 * @param callback
 * @private
 */
Tripod.prototype._getCollection = function(callback) {
    if (this._collection == null) {
        var self = this;
        MongoClient.connect(this._connStr,function(err,db) {
            if (err) {
                callback(err,null);
            } else {
                db.collection(self._collectionName, function(err,collection) { // todo: check if collection is in config...?
                    if (err) {
                        callback(err,null);
                    } else {
                        self._collection = collection;
                        callback(null,collection)
                    }
                });
            }
        });
    } else {
        callback(null,this._collection);
    }
};

exports = module.exports = Tripod;
