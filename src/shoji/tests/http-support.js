'use strict'

require('angular-mocks')

var fixtures = {
    'entity-fixture' : require('./entity-fixture')
    , 'entity-large-fixture' : require('./entity-large-fixture')
    , 'catalog-fixture' : require('./catalog-fixture')
    , 'view-fixture' : require('./view-fixture')
    , 'order-fixture' : require('./order-fixture')
}

module.exports = {
    expectPOST : function(url, data, headers) {
        inject(function($httpBackend) {
            $httpBackend
            .expectPOST(url, data)
            .respond(201, '', headers)
        })
    }

    , expectPATCH : function(url, data, headers) {
        inject(function($httpBackend) {
            $httpBackend
                .expectPATCH(url, data)
                .respond(201, '', headers)
        })
    }

    , expectPUT : function(url, data, headers) {
        inject(function($httpBackend) {
            $httpBackend
                .expectPUT(url, data)
                .respond(201, '', headers)
        })
    }

    , expectDELETE : function(url, data, headers) {
        inject(function($httpBackend) {
            $httpBackend
            .expectDELETE(url)
            .respond(201, '', headers)
        })
    }

    , expectGETFixture : function(fixtureName, responseCode, headers) {
        var fixture = fixtures[fixtureName]
            ;

        this.expectGETUrl(fixture.self, fixture, responseCode, headers)
    }

    , expectGETUrl : function(url, response, responseCode, headers) {

        inject(function($httpBackend) {
            $httpBackend
                .expectGET(url, headers)
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