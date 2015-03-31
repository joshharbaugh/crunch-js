'use strict';
var mainModule = require('../index')
    ,shojiModule = require('../../shoji/index')
    ,mocks = require('angular-mocks')
    ,fixtures = require('./i-resource-variable-fixtures');
describe('IResourceVariable', function() {
    var $httpBackend
        , headers = {
            ALLOW: 'GET,POST,PUT,DELETE'
        }
        , main;

    function GET(fixture, params) {
        $httpBackend.expectGET(fixture.self + (params ||
            ''))
            .respond(200, fixture, headers)
    }

    function mockServices(main) {
        main.factory('iResourceVariables', function(Shoji, $q) {
            return function() {
                var res = Shoji(
                    '/api/dataset/123/variables/')
                    .parse({
                        self: '/api/datasets/123/variables/'
                        , element: 'shoji:catalog'
                        ,index: {
                            '/api/datasets/123/variables/abc/':{}
                        }
                    });
                return $q.when(res)
            }
        })
    }
    beforeEach(function() {
        main = mainModule('resource.test');
        mockServices(main);
        shojiModule('shoji.test');
        angular.mock.module('resource.test', 'shoji.test')
    });
    beforeEach(function() {
        inject(function(_$httpBackend_, _Shoji_) {
            $httpBackend = _$httpBackend_;
            _Shoji_.API = _Shoji_('/api/')
        })
    });
    describe('when invoked', function() {
        var result;
        beforeEach(function() {
            GET(fixtures.variable)
        });
        beforeEach(function() {
            inject(function(iResourceVariable) {
                var q = {
                    variableId: 'abc'
                    , datasetId: '123'
                };
                iResourceVariable(q)
                    .then(function(its) {
                        result = its
                    });
                $httpBackend.flush()
            })
        });
        it('should resolve a variable', function() {
            result.self.should.equal(fixtures.variable
                .self)
        })
    });
    describe('When invoked by variableId', function() {
        var result;
        beforeEach(function() {
            GET(fixtures.variable)
        });
        beforeEach(function() {
            inject(function(iResourceVariable) {
                var q = {
                    variableId: 'abc'
                    , datasetId: '123'
                };
                iResourceVariable(q)
                    .then(function(its) {
                        result = its
                    });
                $httpBackend.flush()
            })
        });
        it('should resolve a variable', function() {
            result.id.should.equal(fixtures.variable
                .body.id)
        })
    });
    describe('When invoked with bad parameters', function() {
        it('should raise an error', function() {
            inject(function(iResourceVariable) {
                try {
                    iResourceVariable();
                    expect(true)
                        .to.be.false
                } catch (Error) {
                    expect(true)
                        .to.be.true
                }
                try {
                    iResourceVariable({});
                    expect(true)
                        .to.be.false
                } catch (Error) {
                    expect(true)
                        .to.be.true
                }
                try {
                    iResourceVariable({
                        notRight: 1
                    });
                    expect(true)
                        .to.be.false
                } catch (Error) {
                    expect(true)
                        .to.be.true
                }
            })
        })
    })
})
