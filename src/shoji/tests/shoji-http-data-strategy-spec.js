'use strict';
var shojiModule = require('../index')
    , _ = require('lodash')
    ,mocks = require('angular-mocks')

describe('ShojiHttpDataStrategy', function() {
    var $httpBackend
        , $http
        , $q
        , Strategy;;
    beforeEach(function() {
        shojiModule('shoji.http', {
            cacheable: false
            , offline: false
        })
    });
    beforeEach(angular.mock.module('shoji.http'));
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get(
            '$httpBackend');
        $http = $injector.get('$http');
        $q = $injector.get('$q');
        Strategy = $injector.get(
            'shojiDataStrategy')
    }));
    afterEach(function() {
        try {
            inject(function($rootScope) {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
                $rootScope.$destroy()
            })
        } catch (err) {
            console.error(err)
        }
    });
    describe('when GETting resource', function() {
        var sut;;
        beforeEach(function() {
            sut = new Strategy('/api/')
        });
        describe('given response filters', function() {
            it( 'should enumerate response filters to transform response', function(done) {
                    var allow = {
                        ALLOW: 'GET, HEAD, PUT, POST'
                    }
                        , instance;;
                    $httpBackend.expectGET(
                        '/api/')
                        .respond({
                            self: '/api/'
                            , name: 'meh'
                        }, allow);

                    function Fancy(data) {
                        this.self = data.self;
                        this.name = data.name
                    }
                    var through = function(
                        response) {
                        response.data.name += '-again';
                        return response
                    };
                    var map = function(response) {
                        var deferred = $q.defer();
                        var obj = new Fancy(
                            response.data);
                        deferred.resolve(obj);
                        return deferred.promise
                    };
                    sut.initialize({
                        responseFilters: [
                            through, map
                        ]
                    });
                    sut.get()
                        .then(function(result) {
                            instance = result
                        });
                    $httpBackend.flush();
                    instance.should.be.an.instanceof(
                        Fancy);
                    instance.self.should.equal(
                        '/api/');
                    instance.name.should.equal(
                        'meh-again');
                    done()
                });
            it( 'should apply on-the-fly filters last', function() {
                    var allow = {
                        ALLOW: 'GET, HEAD, PUT, POST'
                    }
                        , instance;;
                    $httpBackend.expectGET(
                        '/api/')
                        .respond({
                            self: '/api/'
                            , name: 'meh'
                        }, allow);

                    function Fancy(data) {
                        this.self = data.self;
                        this.name = data.name
                    }
                    var through = function(
                        response) {
                        response.data.name += '-again';
                        return response
                    };
                    var map = function(response) {
                        var deferred = $q.defer();
                        var obj = new Fancy(
                            response.data);
                        deferred.resolve(obj);
                        return deferred.promise
                    };
                    var odd = function(response) {
                        return response.name + '' +
                            ' is odd'
                    };
                    sut.initialize({
                        responseFilters: [
                            through, map
                        ]
                    });
                    var transformed;
                    sut.get({
                        responseFilters: [odd]
                    })
                        .then(function(result) {
                            transformed =
                                result
                        });
                    $httpBackend.flush();
                    transformed.should.equal(
                        'meh-again is odd')
                })
        })
    });
    describe('given writable resource', function() {
        var sut
            , allow;;
        beforeEach(function() {
            sut = new Strategy('/api/');
            allow = {
                ALLOW: 'GET, HEAD, POST, PUT, DELETE'
            };
            $httpBackend.expectGET('/api/')
                .respond({
                    self: '/api/'
                    , name: 'meh'
                }, allow);
            sut.get();
            $httpBackend.flush()
        });
        it( 'should resolve promises with response on DELETEs', function(done) {
                $httpBackend.expectDELETE('/api/')
                    .respond(200, {}, allow);
                sut.delete()
                    .then(function(response) {
                        response.config.method.should
                            .equal('DELETE');
                        done()
                    });
                $httpBackend.flush()
            });
        it('should resolve promises on POSTs', function(done) {
                $httpBackend.expectPOST('/api/')
                    .respond(200, {}, allow);
                sut.post({
                    name: 'zing'
                    , sync: false
                })
                    .then(function(response) {
                        response.config.method.should
                            .equal('POST');
                        done()
                    });
                $httpBackend.flush()
            });
        it('should resolve promises on PUTs', function(done) {
                $httpBackend.expectPUT('/api/')
                    .respond(200, {}, allow);
                sut.put({
                    name: 'zing'
                    , sync: false
                })
                    .then(function(response) {
                        response.config.method.should
                            .equal('PUT');
                        done()
                    });
                $httpBackend.flush()
            })
    });
    describe('given read only resource', function() {
        var sut
            , allow;;
        beforeEach(function() {
            sut = new Strategy('/api/');
            allow = {
                ALLOW: 'GET, HEAD'
            };
            $httpBackend.expectGET('/api/')
                .respond({
                    self: '/api/'
                    , name: 'meh'
                });
            sut.get();
            $httpBackend.flush()
        });
        it('should support GET requests', function() {
            $httpBackend.expectGET('/api/')
                .respond(200, {
                    self: '/api/'
                }, allow);
            sut.get()
                .should.not.
            throw;
            $httpBackend.flush()
        });
        it('should throw for POST', function() {
            function saving() {
                sut.post()
            }
            saving.should.
            throw (
                /Method 'POST' not permitted on "\/api\/"/
            )
        });
        it('should throw for PUT', function() {
            function saving() {
                sut.put()
            }
            saving.should.
            throw (
                /Method 'PUT' not permitted on "\/api\/"/
            )
        })
    })
})
