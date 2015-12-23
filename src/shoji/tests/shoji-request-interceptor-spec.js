'use strict'

var mainMod = require('../index')
    ;

describe('shojiRequestInterceptorDecorator', function() {
    var sut

    function buildModule() {
        var mod = mainMod()
            ;

        angular.mock.module(mod.name)
    }

    function buildSut() {
        angular.mock.inject(function(shojiDataOperations) {
            sut = shojiDataOperations
        })
    }

    function flush() {
        angular.mock.inject(function($httpBackend, $rootScope) {
            $rootScope.$digest()
        })
    }

    beforeEach(buildModule)
    beforeEach(buildSut)

    describe('when intercepting a GET request', function() {
        var apiUrl = '/api/'

        context('given a url string that matches the request url', function() {
            var expectedResponse

            beforeEach(function() {
                expectedResponse = {
                    element : 'shoji:entity',
                    catalogs : {
                        datasets : '/api/datasets'
                    }
                }

                sut.interceptGET(apiUrl).respondSuccess(expectedResponse)
            })

            it('should return the expected response', function() {
                sut.get(apiUrl).then(function(response) {
                    expect(response).to.deep.equal(expectedResponse)
                })
                flush()
            })
        })

        context('given a url string that matches the request url and matching GET parameters', function() {
            var expectedResponse

            beforeEach(function() {
                expectedResponse = {
                    element : 'shoji:entity',
                    catalogs : {
                        datasets : '/api/datasets'
                    }
                }

                sut.interceptGET(apiUrl, {
                    params : {
                        refresh : true
                    }
                }).respondSuccess(expectedResponse)
            })

            it('should return the expected response', function() {
                sut.get(apiUrl, { params : { refresh : true } }).then(function(response) {
                    expect(response).to.deep.equal(expectedResponse)
                })
                flush()
            })
        })

        context('given a regexp that matches the request url', function() {
            var expectedResponse

            beforeEach(function() {
                expectedResponse = {
                    element : 'shoji:entity',
                    catalogs : {
                        datasets : '/api/datasets'
                    }
                }

                sut.interceptGET(/\/datasets\/\d+\//gi, {
                    params : {
                        refresh : true
                    }
                }).respondSuccess(expectedResponse)
            })

            it('should return the expected response', function() {
                sut.get('/datasets/123/').then(function(response) {
                    expect(response).to.deep.equal(expectedResponse)
                })
                flush()
            })
        })

        context('given a function that returns true when passing the url', function() {
            var expectedResponse

            beforeEach(function() {
                expectedResponse = {
                    element : 'shoji:entity',
                    catalogs : {
                        datasets : '/api/datasets'
                    }
                }

                sut.interceptGET(function(url) { return url === '/datasets/123/'})
                   .respondSuccess(expectedResponse)
            })

            it('should return the expected response', function() {
                sut.get('/datasets/123/').then(function(response) {
                    expect(response).to.deep.equal(expectedResponse)
                })
                flush()
            })
        })

        context('given the planned response is an error', function() {
            var expectedResponse

            beforeEach(function() {
                expectedResponse = 'error'

                sut.interceptGET(function(url) { return url === '/datasets/123/'})
                    .respondError(expectedResponse)
            })

            it('should return a rejected promise', function() {
                sut.get('/datasets/123/').catch(function(response) {
                    expect(response).to.deep.equal(expectedResponse)
                })
                flush()
            })
        })

    })
})