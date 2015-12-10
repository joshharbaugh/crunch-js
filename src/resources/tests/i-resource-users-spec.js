'use strict';
var mainModule = require('../index'),
    shojiModule = require('../../shoji/index'),
    mocks = require('angular-mocks'),
    fixtures = {
        account : require('../../test-support/fixtures/account-entity'),
        users : require('../../test-support/fixtures/account-user-catalog')
    };

describe('IResourceUsers', function() {
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
        main.factory('iResourceAccount', function(Shoji, $q) {
            return {
                current: function() {
                    var res = Shoji(
                        fixtures.account.self)
                        .parse(fixtures.account);
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
    describe('when fetching users for an account', function() {
            var result;
            describe('given no userid', function() {
                beforeEach(function() {
                    GET(fixtures.users);
                    inject(function(
                        iResourceUsers) {
                        iResourceUsers()
                            .then(function(
                                its) {
                                result =
                                    its
                            })
                    });
                    $httpBackend.flush()
                });
                it('should return the users entities', function() {
                        result.self.should.equal(
                            fixtures.users.self);
                        result.index.length.should
                            .equal(3)
                    })
            })
        })
})
