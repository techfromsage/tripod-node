require('./conf');
var should = require('should');
var assert = require('assert');
var tripod = require('../index');

describe("Tripod test suite", function(){
    describe("Testing constructor", function(){

        it("Should use default connStr", function(done) {
            var t = new tripod.Tripod("foobarbaz","CBD_testing");
            t._connStr.should.eql("mongodb://foobarbaz/foobarbaz");
            done();
        });

        it("Should use configured connStr", function(done) {
            var t = new tripod.Tripod("testing","CBD_testing");
            t._connStr.should.eql("mongodb://localhost/testing");
            done();
        });

        it("Should set collection name", function(done) {
            var t = new tripod.Tripod("testing","CBD_testing");
            t._collectionName.should.eql("CBD_testing");
            done();
        });

    });
});