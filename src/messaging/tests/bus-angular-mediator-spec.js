'use strict';
var crunchModule = require('../index')
    ,mocks = require('angular-mocks')
;
describe('BusAngularMediator', function() {
    beforeEach(function() {
        var mod = crunchModule('crunch.busmediator')
    });
    beforeEach(angular.mock.module('crunch.busmediator'));
    afterEach(function() {
        try {
            inject(function(bus, $rootScope) {
                $rootScope.$destroy();
                bus.reset()
            })
        } catch (err) {
            console.error(err)
        }
    });
    describe('angular scope subscriptions', function() {
        describe('published domain events', function() {
            it(
                'should be broadcast down from rootScope', function() {
                inject(function(bus, $rootScope) {
                    var scope =
                        $rootScope.$new();
                    var ev = null;
                    scope.$on('my.event', function(e, data) {
                        ev = data
                    });
                    bus.publish({
                        event: 'my.event'
                        , my: 'payload'
                    });
                    $rootScope.$digest();
                    ev.should.eql({
                        event: 'my.event'
                        , my: 'payload'
                    })
                })
            })
        })
    })
})
