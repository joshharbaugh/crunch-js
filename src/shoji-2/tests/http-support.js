'use strict'

var mocks = require('angular-mocks')
    , fixtures = {
        'entity-fixture' : require('./entity-fixture')
        , 'entity-large-fixture' : require('./entity-large-fixture')
    }

module.exports = {
    expectGETFixture : function(fixtureName, responseCode) {
        var fixture = fixtures[fixtureName]
            ;

        inject(function($httpBackend) {
            $httpBackend
            .expectGET(fixture.self)
            .respond((responseCode || 200), fixture)
        })
    }

    , flushAndCheckExpectations : function() {
        inject(function($httpBackend, $rootScope) {
            $rootScope.$digest()
            $httpBackend.flush()
            $httpBackend.verifyNoOutstandingExpectation()
        })
    }
}