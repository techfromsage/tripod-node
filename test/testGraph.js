require('./conf');
var should = require('should');
var assert = require('assert');
var tripod = require('../index');

describe("TripodGraph test suite", function(){
    describe("Testing loading docs", function(){

        it("Should throw error if adding a tripod document without _id", function(done) {
            var addFn = function() {
                var graph = new tripod.TripleGraph();
                return graph.addTripodDoc({});
            };
            addFn.should.throw("doc had malformed _id");
            done();
        });

        it("Should allow adding of a tripod CBD doc", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title":
                    {
                        "l":"Title of resource 2"
                    }
                }
            );
            graph.should.have.property('_graphs');
            graph._graphs.should.have.property("http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"].should.have.property("dct:title");
            done();
        });

        it("Should allow adding of a tripod view doc", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/someuri",
                        "c":"http://talisaspire.com/"
                    },
                    "value": {
                        "_graphs": [
                            {
                                "_id": {
                                    "r":"http://life.ac.uk/resources/1",
                                    "c":"http://talisaspire.com/"
                                },
                                "dct:title":
                                {
                                    "l":"Title of resource 1"
                                }
                            },
                            {
                                "_id": {
                                    "r":"http://life.ac.uk/resources/2",
                                    "c":"http://talisaspire.com/"
                                },
                                "dct:title":
                                {
                                    "l":"Title of resource 2"
                                }
                            }
                        ]
                    }
                }
            );
            graph.should.have.property('_graphs');
            graph._graphs.should.not.have.property("http://life.ac.uk/resources/someuri");
            graph._graphs.should.have.property("http://life.ac.uk/resources/1");
            graph._graphs.should.have.property("http://life.ac.uk/resources/2");
            graph._graphs["http://life.ac.uk/resources/1"].should.have.property("dct:title");
            graph._graphs["http://life.ac.uk/resources/1"].should.have.property("dct:title").be.eql({"l":"Title of resource 1"});
            graph._graphs["http://life.ac.uk/resources/2"].should.have.property("dct:title");
            graph._graphs["http://life.ac.uk/resources/2"].should.have.property("dct:title").be.eql({"l":"Title of resource 2"});
            done();
        });

        it("Should correctly merge two CBD docs with same subject, two different literal values", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title":
                    {
                        "l":"Title of resource 1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title":
                    {
                        "l":"Title of resource 2"
                    }
                }
            );
            graph.should.have.property('_graphs');
            graph._graphs.should.have.property("http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"].should.have.property("dct:title");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["dct:title"].should.have.lengthOf(2);
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["dct:title"][0].should.have.property("l");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["dct:title"][1].should.have.property("l");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["dct:title"][0]["l"].should.be.exactly("Title of resource 1");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["dct:title"][1]["l"].should.be.exactly("Title of resource 2");
            done();
        });

        it("Should correctly merge two CBD docs with same subject, two different resource values", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53",
                        "c":"http://talisaspire.com/"
                    },
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53",
                        "c":"http://talisaspire.com/"
                    },
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/2"
                    }
                }
            );
            graph.should.have.property('_graphs');
            graph._graphs.should.have.property("http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"].should.have.property("rdfs:seeAlso");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["rdfs:seeAlso"].should.have.lengthOf(2);
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["rdfs:seeAlso"][0].should.have.property("u");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["rdfs:seeAlso"][1].should.have.property("u");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["rdfs:seeAlso"][0]["u"].should.be.exactly("http://life.ac.uk/resources/1");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["rdfs:seeAlso"][1]["u"].should.be.exactly("http://life.ac.uk/resources/2");
            done();
        });

        it("Should correctly merge  two CBD docs with same subject, two matching resource values", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53",
                        "c":"http://talisaspire.com/"
                    },
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53",
                        "c":"http://talisaspire.com/"
                    },
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.should.have.property('_graphs');
            graph._graphs.should.have.property("http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"].should.have.property("rdfs:seeAlso");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["rdfs:seeAlso"].should.have.lengthOf(1);
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["rdfs:seeAlso"][0].should.have.property("u");
            graph._graphs["http://life.ac.uk/resources/BFBC6A06-A8B0-DED8-53AA-8E80DB44CC53"]["rdfs:seeAlso"][0]["u"].should.be.exactly("http://life.ac.uk/resources/1");
            done();
        });

        it("Should correctly merge three CBD docs with same, mix of matching and distinct values", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title":
                    {
                        "l":"Some title"
                    },
                    "rdfs:seeAlso": [
                        {
                            "u":"http://life.ac.uk/resources/2"
                        },
                        {
                            "u":"http://life.ac.uk/resources/1"
                        }
                    ]
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        },
                        {
                            "l":"Some title 3"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/3"
                    }
                }
            );
            graph.should.have.property('_graphs');
            graph._graphs.should.have.property("http://life.ac.uk/resources/3");
            graph._graphs["http://life.ac.uk/resources/3"].should.have.property("rdfs:seeAlso");
            graph._graphs["http://life.ac.uk/resources/3"].should.have.property("dct:title");
            graph._graphs["http://life.ac.uk/resources/3"]["rdfs:seeAlso"].should.have.lengthOf(3);
            graph._graphs["http://life.ac.uk/resources/3"]["dct:title"].should.have.lengthOf(3);
            done();
        });

    });

    describe("Testing outputs", function(){
        it("Should output correct ntriples", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title":
                    {
                        "l":"Some title"
                    },
                    "rdfs:seeAlso": [
                        {
                            "u":"http://life.ac.uk/resources/2"
                        },
                        {
                            "u":"http://life.ac.uk/resources/1"
                        }
                    ]
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        },
                        {
                            "l":"Some title 3"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/3"
                    }
                }
            );
            var expected = "<http://life.ac.uk/resources/3> <http://purl.org/dc/terms/title> \"Some title\" . \n"+
                "<http://life.ac.uk/resources/3> <http://purl.org/dc/terms/title> \"Some title 2\" . \n"+
                "<http://life.ac.uk/resources/3> <http://purl.org/dc/terms/title> \"Some title 3\" . \n"+
                "<http://life.ac.uk/resources/3> <http://www.w3.org/2000/01/rdf-schema#seeAlso> <http://life.ac.uk/resources/1> . \n"+
                "<http://life.ac.uk/resources/3> <http://www.w3.org/2000/01/rdf-schema#seeAlso> <http://life.ac.uk/resources/2> . \n"+
                "<http://life.ac.uk/resources/3> <http://www.w3.org/2000/01/rdf-schema#seeAlso> <http://life.ac.uk/resources/3> . \n";
            graph.toNTriples().should.equal(expected);
            done();
        });
    });

    describe("Testing getters", function(){
        it("should output first literal value", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            var literalValue = graph.getFirstLiteral("http://life.ac.uk/resources/3","dct:title");
            literalValue.should.equal("Some title");
            var resourceValue = graph.getFirstResource("http://life.ac.uk/resources/3","dct:title");
            assert.equal(resourceValue,null)
            done();
        });

        it("should output all literal values", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            var literalValue = graph.getLiteralValues("http://life.ac.uk/resources/3","dct:title");
            literalValue.should.be.Array;
            literalValue.should.have.lengthOf(2);
            literalValue.should.containEql("Some title");
            literalValue.should.containEql("Some title 2");
            var resourceValue = graph.getResourceValues("http://life.ac.uk/resources/3","dct:title");
            resourceValue.should.be.Array;
            resourceValue.should.have.lengthOf(0);
            done();
        });

        it("should output first resource value", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            var resourceValue = graph.getResourceValues("http://life.ac.uk/resources/3","rdfs:seeAlso");
            resourceValue.should.be.Array;
            resourceValue.should.have.lengthOf(1);
            resourceValue.should.containEql("http://life.ac.uk/resources/1");
            var literalValue = graph.getLiteralValues("http://life.ac.uk/resources/3","rdfs:seeAlso");
            literalValue.should.be.Array;
            literalValue.should.have.lengthOf(0);
            done();
        });

        it("should output resource values", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            var resourceValue = graph.getFirstResource("http://life.ac.uk/resources/3","rdfs:seeAlso");
            resourceValue.should.equal("http://life.ac.uk/resources/1");
            var literalValue = graph.getFirstLiteral("http://life.ac.uk/resources/3","rdfs:seeAlso");
            assert.equal(literalValue,null)
            done();
        });

        it("should output subjects of a given type", function(done) {
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdf:type": [
                        {
                            "u":"http://life.ac.uk/type/1"
                        },
                        {
                            "u":"http://life.ac.uk/type/2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/4",
                        "c":"http://talisaspire.com/"
                    },
                    "rdf:type": [
                        {
                            "u":"http://life.ac.uk/type/1"
                        },
                        {
                            "u":"http://life.ac.uk/type/3"
                        }
                    ]
                }
            );
            var type1 = graph.getSubjectsOfType("http://life.ac.uk/type/1");
            type1.should.be.an.Array;
            type1.should.have.lengthOf(2);
            type1.should.containEql("http://life.ac.uk/resources/3");
            type1.should.containEql("http://life.ac.uk/resources/4");

            var type2 = graph.getSubjectsOfType("http://life.ac.uk/type/2");
            type2.should.be.an.Array;
            type2.should.have.lengthOf(1);
            type2.should.containEql("http://life.ac.uk/resources/3");

            var type3 = graph.getSubjectsOfType("http://life.ac.uk/type/3");
            type3.should.be.an.Array;
            type3.should.have.lengthOf(1);
            type3.should.containEql("http://life.ac.uk/resources/4");

            var type4 = graph.getSubjectsOfType("http://life.ac.uk/type/4");
            type4.should.be.an.Array;
            type4.should.have.lengthOf(0);

            done();
        });

        it("should return an Array of subjects", function(done) {
            done();
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdf:type": [
                        {
                            "u":"http://life.ac.uk/type/1"
                        },
                        {
                            "u":"http://life.ac.uk/type/2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/4",
                        "c":"http://talisaspire.com/"
                    },
                    "rdf:type": [
                        {
                            "u":"http://life.ac.uk/type/1"
                        },
                        {
                            "u":"http://life.ac.uk/type/3"
                        }
                    ]
                }
            );
            var subjects = graph.getSubjects();
            subjects.should.be.an.Array;
            subjects.should.have.lengthOf(2);
            subjects.should.containEql("http://life.ac.uk/resources/4");
            subjects.should.containEql("http://life.ac.uk/resources/3");
        });

        it("should return a subject sub-graph", function(done) {
            done();
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdf:type": [
                        {
                            "u":"http://life.ac.uk/type/1"
                        },
                        {
                            "u":"http://life.ac.uk/type/2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/4",
                        "c":"http://talisaspire.com/"
                    },
                    "rdf:type": [
                        {
                            "u":"http://life.ac.uk/type/1"
                        },
                        {
                            "u":"http://life.ac.uk/type/3"
                        }
                    ]
                }
            );
            var subGraph = graph.getSubjectSubgraph("http://life.ac.uk/resources/4");
            subGraph.getSubjects().should.have.lengthOf(1);
        });
    });

    describe("Testing removes", function() {
        it("should remove all triples about a subject", function(done) {
            done();
            var graph = new tripod.TripleGraph();
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/3",
                        "c":"http://talisaspire.com/"
                    },
                    "dct:title": [
                        {
                            "l":"Some title"
                        },
                        {
                            "l":"Some title 2"
                        }
                    ],
                    "rdf:type": [
                        {
                            "u":"http://life.ac.uk/type/1"
                        },
                        {
                            "u":"http://life.ac.uk/type/2"
                        }
                    ],
                    "rdfs:seeAlso":
                    {
                        "u":"http://life.ac.uk/resources/1"
                    }
                }
            );
            graph.addTripodDoc(
                {
                    "_id": {
                        "r":"http://life.ac.uk/resources/4",
                        "c":"http://talisaspire.com/"
                    },
                    "rdf:type": [
                        {
                            "u":"http://life.ac.uk/type/1"
                        },
                        {
                            "u":"http://life.ac.uk/type/3"
                        }
                    ]
                }
            );
            graph.getSubjects().should.have.lengthOf(2);
            graph.getSubjects().should.containEql("http://life.ac.uk/resources/3");
            graph.getSubjects().should.containEql("http://life.ac.uk/resources/4");
            graph.removeTriplesAbout("http://life.ac.uk/resources/4");
            graph.getSubjects().should.have.lengthOf(1);
            graph.getSubjects().should.containEql("http://life.ac.uk/resources/3");
            graph.getSubjects().should.not.containEql("http://life.ac.uk/resources/4");
        });
    })

});