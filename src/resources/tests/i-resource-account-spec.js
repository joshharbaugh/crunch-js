module.exports = (function() {
    'use strict';
    var mainModule = require('../index'),
        shojiModule = require('../../shoji/index'),
        mocks = require('angular-mocks'),
        fixtures = {
            api : require('../../test-support/fixtures/root'),
            account : require('../../test-support/fixtures/account-entity')
        };

    describe('IResourceAccount', function() {
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
        beforeEach(function() {
            main = mainModule('resource.test');
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
                GET(fixtures.api)
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