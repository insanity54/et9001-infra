var mocha = require('mocha');
var assert = require('chai').assert;
var request = require('supertest');
var app = require('../index');



describe('Integration - API', function() {
    describe('GET ', function() {
        it('should respond with array of conference objects given a page id', function(done) {
            
        request(app)
            .get('/api/conferences/555/')
            .set('Accept', 'application/json')
            .expect(function(res) {
                //console.log(res);
            })
            .expect('Content-Type', /json/)
            .expect(function(res) {
                assert.isDefined(res.body);
            })
            .expect(200, done);
        });
        
        it('should respond with conference object given a page id and conference id', function(done) {
            request(app)
                .get('/api/conferences/555/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    //console.log(res);
                    assert.isDefined(res.body);
                })
                .expect(200, done);
        });
    });
});


