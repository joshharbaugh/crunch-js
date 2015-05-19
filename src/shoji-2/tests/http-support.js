'use strict'

require('angular-mocks')

var fixtures = {
    'entity-fixture' : require('./entity-fixture')
    , 'entity-large-fixture' : require('./entity-large-fixture')
    , 'catalog-fixture' : require('./catalog-fixture')
}

module.exports = {
    expectGETFixture : function(fixtureName, responseCode) {
        var fixture = fixtures[fixtureName]
            ;

        this.expectGETUrl(fixture.self, fixture, responseCode)
    }

    , expectGETUrl : function(url, response, responseCode) {

        inject(function($httpBackend) {
            $httpBackend
                .expectGET(url)
                .respond((responseCode || 200), response)
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