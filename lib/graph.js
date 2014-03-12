var _ = require('lodash');
var config = require("./config");
/**
 * A graph of triples.
 * @constructor
 */
var TripleGraph = function() {
    this._config = config;
    this._graphs = {}; // graphs array keyed by subject
};

/**
 * Add a tripod doc to the graph. Context is discarded.
 * @param doc
 */
TripleGraph.prototype.addTripodDoc = function(doc) {
    var self = this;
    if (doc._id && doc._id.r ) {
        if (doc.value && doc.value._graphs && doc.value._graphs.length > 0) {
            // this is a view, iterate around it's graphs
            doc.value._graphs.forEach(function(subDoc) {
                self.addTripodDoc(subDoc);
            })
        } else {
            var existingDoc = (this._graphs[doc._id.r]) ? this._graphs[doc._id.r] : {};
            for (var attrName in doc)
            {
                if (attrName!='_id') {
                    existingDoc[attrName] = (existingDoc[attrName]) ? this._mergePropertyValues(existingDoc[attrName],doc[attrName]) : doc[attrName] ;
                }
            }
            this._graphs[doc._id.r] = existingDoc;
        }
    } else {
        throw new Error("doc had malformed _id");
    }
};

/**
 * Returns an array representing all the subjects modelled by this graph
 * @return {*}
 */
TripleGraph.prototype.getSubjects = function() {
    return Object.keys(this._graphs);
};

/**
 * Returns a new TripleGraph object which contains only the triples for s contained within this graph
 * @param s
 * @return {*}
 */
TripleGraph.prototype.getSubjectSubgraph = function(s) {
    var graph = new TripleGraph();
    var doc = this._graphs[s];
    if (doc!=null) {
        doc['_id'] = { r: s }; // todo: what about c? revisit once this is > read-only
        graph.addTripodDoc(doc);
    }
    return graph;
}

/**
 * Gets all subjects of type
 * @param doc
 */
TripleGraph.prototype.getSubjectsOfType = function (t) {
    var resourcesOfType = [];
    for (var r in this._graphs) {
        if (_.indexOf(this.getResourceValues(r,"rdf:type"),t)!=-1) {
            resourcesOfType.push(r);
        }
    }
    return resourcesOfType;
};

/**
 * Return the graph as n triples
 * @return {String}
 */
TripleGraph.prototype.toNTriples = function() {
    var output = '';
    for (var r in this._graphs)
    {
        // iterate over all subjects
        var subject = this._qNameToAlias(r);
        var doc = this._graphs[r];
        for (var p in doc)
        {
            if (p.charAt(0)!="_")
            {
                var value = doc[p];
                if (_.isArray(value))
                {
                    for (var i=0;i<value.length;i++)
                    {
                        output += "<"+subject+"> <"+this._qNameToAlias(p)+"> "+this._prepareValueForOutput(value[i])+" . \n";
                    }
                }
                else
                {
                    output += "<"+subject+"> <"+this._qNameToAlias(p)+"> "+this._prepareValueForOutput(value)+" . \n";
                }
            }
        }
    }
    return output;
};

/**
 * Return a merged value object for
 * @param value1
 * @param value2
 * @private
 */
TripleGraph.prototype._mergePropertyValues = function (value1,value2)
{
    value1 = (_.isArray(value1)) ? value1 : [value1];
    value2 = (_.isArray(value2)) ? value2 : [value2];
    var mergedValues = _.cloneDeep(value1);
    value2.forEach(function(value) {
        if (_.findWhere(value1,value) == null) {
            mergedValues.push(value);
        }
    });
    return (mergedValues.length == 0) ? mergedValues[0] : mergedValues;
};

/**
 * Prepare a value (literal or uri) for output
 * @param val
 * @return {*}
 * @private
 */
TripleGraph.prototype._prepareValueForOutput = function(val) {
    if (val.u!=null)
    {
        return "<"+this._qNameToAlias(val.u)+">";
    }
    else if (val.l!=null)
    {
        return "\""+val.l+"\"";
    }
    else
    {
        throw new Error("object was neither literal or uri");
    }
};

/**
 * Given a potentialQname, return its fully qualified uri
 * @param potentialQname
 * @return {*}
 * @private
 */
TripleGraph.prototype._qNameToAlias = function (potentialQname) {
    if (potentialQname.indexOf('http://')!=-1 || potentialQname.indexOf('https://')!=-1) {
        return potentialQname; // suspect uri
    } else {
        if (potentialQname.indexOf(':') != -1) {
            var parts = potentialQname.split(':');
            var uriPrefix = this._config.get("namespaces")[parts[0]];
            if (uriPrefix!=null) {
                return uriPrefix + parts[1];
            }
            throw new Error("Could not find namespace '"+parts[0]+"' in namespace config")
        } else {
            throw new Error ("Value "+potentialQname+" could not be parsed as a uri");
        }
    }
};

/**
 * Given a potential uri, attempt to return its qName
 * @param potentialUri
 * @return {*}
 * @private
 */
TripleGraph.prototype._uriToAlias = function(potentialUri) {
    var namespaces = this._config.get("namespaces");
    for (var prefix in namespaces) {
        if (potentialUri.indexOf(namespaces[prefix])!=-1) {
            // hit
            return potentialUri.replace(namespaces[prefix],prefix+":");
        }
    }
    return potentialUri;
};

/**
 * Gets the first literal for resource s and predicate p
 * @param s
 * @param p can be either uri or qname
 * @return {*}
 */
TripleGraph.prototype.getFirstLiteral = function (s,p) {
    return this._getFirst(s,p,'l');
};

/**
 * Gets the first resource for resource s and predicate p
 * @param s
 * @param p can be either uri or qname
 * @return {*}
 */
TripleGraph.prototype.getFirstResource = function (s,p) {
    return this._getFirst(s,p,'u');
};

/**
 * Gets the literals for resource s and predicate p
 * @param s
 * @param p can be either uri or qname
 * @return {*}
 */
TripleGraph.prototype.getLiteralValues = function (s,p) {
    return this._getAll(s,p,'l');
};

/**
 * Gets the resources for resource s and predicate p
 * @param s
 * @param p can be either uri or qname
 * @return {*}
 */
TripleGraph.prototype.getResourceValues = function (s,p) {
    return this._getAll(s,p,'u');
};

TripleGraph.prototype.removeTriplesAbout = function (s) {
    if (_.has(this._graphs,s)) delete this._graphs[s];
}

/**
 * Helper function to get the first of type t for resource u and predicate p
 * @param s
 * @param p can be either uri or qname
 * @param t
 * @return {*}
 * @private
 */
TripleGraph.prototype._getFirst = function (s,p,t) {
    p = this._uriToAlias(p);
    var graph = this._graphs[s];
    if (graph!=null)
    {
        var values = graph[p];
        if (values!=null) {
            values = (!_.isArray(values)) ? [values] : values;
            for (var i = 0; i < values.length; i++) {
                if (values[i][t]) return values[i][t];
            }
        }
    }
    return null;
};

/**
 * Helper function to get the all of type t for resource u and predicate p
 * @param s
 * @param p can be either uri or qname
 * @param t
 * @return {*}
 * @private
 */
TripleGraph.prototype._getAll = function (s,p,t) {
    p = this._uriToAlias(p);
    var graph = this._graphs[s], allValues = [];
    if (graph!=null)
    {
        var values = graph[p];
        if (values!=null) {
            values = (!_.isArray(values)) ? [values] : values;
            for (var i = 0; i < values.length; i++) {
                if (values[i][t]) allValues.push(values[i][t]);
            }
        }
    }
    return allValues;
};

exports = module.exports = TripleGraph;

