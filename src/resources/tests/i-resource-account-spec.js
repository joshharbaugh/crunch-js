;
module.exports = (function() {
    'use strict';
    var mainModule = require('../index')
        ,shojiModule = require('../../shoji/index')
        ,mocks = require('angular-mocks')
        ,fixtures = require('./i-resource-account-fixtures');;
    describe('IResourceAccount', function() {
        var $httpBackend
            , headers = {
                ALLOW: 'GET,POST,PUT,DELETE'
            }
            , main;;

        function GET(fixture, params) {
            $httpBackend.expectGET(fixture.self + (params ||
                ''))
                .respond(200, fixture, headers)
        }

        function mockServices(main) {
            main.factory('iResourceUser', function(Shoji, $q) {
                return {
                    current: function() {
                        var res = Shoji(
                            '/api/users***REMOVED***')
                            .parse({
                                self: '/api/users***REMOVED***'
                                , element: 'shoji:entity'
                                , urls: {
                                    account_url: fixtures
                                        .account.self
                                }
                            });
                        return $q.when(res)
                    }
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
        describe('when fetching current account', function() {
            var result;
            beforeEach(function() {
                GET(fixtures.account)
            });
            beforeEach(function() {
                inject(function(iResourceAccount) {
                    iResourceAccount.current()
                        .then(function(its) {
                            result = its
                        });
                    $httpBackend.flush()
                })
            });
            it('should return current account', function() {
                result.self.should.equal(fixtures.account
                    .self)
            })
        })
    })
})
    .call(this);