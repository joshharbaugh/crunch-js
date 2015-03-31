'use strict';
var crunchModule = require('../index'),
    mocks = require('angular-mocks');
describe('Bus', function() {
    beforeEach(function() {
        var mod = crunchModule('messaging.test');

        function KingHandler(eventBus) {
            return function handle(command) {
                eventBus.publish({
                    event: 'kong'
                        , name: command.name +
                    ' success'
                })
            }
        }

        function PingHandler(eventBus) {
            return function handle(command) {
                eventBus.publish({
                    event: 'pong'
                        , name: command.name +
                    ' success'
                })
            }
        }
        PingHandler.$inject = ['eventBus'];
        mod.factory('pingHandler', PingHandler);
        mod.factory('kingHandler', KingHandler);
        angular.mock.module('messaging.test')
    });
    afterEach(function() {
        try {
            inject(function(bus) {
                bus.reset()
            })
        } catch (err) {
            console.error(err)
        }
    });
    describe('given multiple commands', function() {
        it('send and receive works', function(done) {
            var pongs = 0;
            var kongs = 0;

            function finish() {
                if (pongs === 2 && kongs === 1) {
                    done()
                }
            }
            inject(function(bus, $rootScope) {
                bus.subscribe('kong', function(e) {
                    e.name.should.equal(
                        'king success');
                        kongs++;
                        finish()
                });
                bus.subscribe('pong', function(e) {
                    e.name.should.equal(
                        'ping success');
                        pongs++;
                        finish()
                });
                bus.subscribe('pong', function(e) {
                    e.name.should.equal(
                        'ping success');
                        pongs++;
                        finish()
                });
                bus.send([{
                    command: 'ping'
                    , name: 'ping'
                }
                        , {
                    command: 'king'
                            , name: 'king'
                        }
                ]);
                $rootScope.$digest()
            })
        })
    });
    describe('given ONE command', function() {
        it('send and receive works', function(done) {
            var receipts = 0;

            function finish() {
                if (receipts === 2) {
                    done()
                }
            }
            inject(function(bus, $rootScope) {
                bus.subscribe('pong', function(e) {
                    e.name.should.equal(
                        'ping success');
                        receipts++;
                        finish()
                });
                bus.subscribe('pong', function(e) {
                    e.name.should.equal(
                        'ping success');
                        receipts++;
                        finish()
                });
                bus.send({
                    command: 'ping'
                        , name: 'ping'
                });
                $rootScope.$digest()
            })
        })
    })
})
