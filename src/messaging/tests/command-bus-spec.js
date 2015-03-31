'use strict';

var messagingModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
describe('CommandBus', function() {
    describe('when sending a command', function() {
        var mod;
        beforeEach(function() {
            mod = messagingModule( 'commandbus.test')
        });
        describe('given missing `command` property', function() {
            it('should throw', function() {
                var handled = null;
                angular.mock.module( 'commandbus.test');
                    inject(function(commandBus) {
                        function missingCommand() {
                            commandBus.send({
                                a: 1
                            })
                        }
                        missingCommand.should.throw(
                                /The `command` property is required when sending a command./
                        )
                    })
            })
        });
        describe('given no registered handler', function() {
            it('should throw', function() {
                var handled = null;
                angular.mock.module(
                    'commandbus.test');
                    inject(function(commandBus) {
                        function sendingBadCommand() {
                            commandBus.send({
                                command: 'myCommand'
                            })
                        }
                        sendingBadCommand.should
                        .
                            throw (
                                /command handler for 'myCommand' could not be found./i
                        )
                    })
            })
        });
        describe('given a registered handler', function() {
            var handled;
            beforeEach(function() {
                mod.factory(
                    'myCommandHandler', function() {
                    return function(
                        command) {
                        handled = command;
                        return 'ok'
                    }
                });
                angular.mock.module(
                    'commandbus.test')
            });
            it(
                'should execute the command handler matching convention', function() {
                inject(function(commandBus, $rootScope) {
                    commandBus.send({
                        command: 'myCommand'
                    });
                    handled.should.eql({
                        command: 'myCommand'
                    })
                })
            });
            it('should promise its execution', function() {
                inject(function(commandBus, $rootScope) {
                    var trx = commandBus.send({
                        command: 'myCommand'
                    });
                    var result;
                    trx.then(function(res) {
                        result = res
                    });
                    $rootScope.$apply();
                    result.should.eql([
                        'ok'
                    ])
                })
            })
        })
    })
})
