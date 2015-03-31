'use strict';
var EventBus = require('../event-bus')
    , postal = require('postal')
    , _ = require('lodash')
    , mocks = require('angular-mocks');
describe('EventBus', function() {
    describe('when raising an event', function() {
        beforeEach(function() {
            var mod = angular.module('test', []);
            mod.factory('eventBus', EventBus);
            mod.factory('postal', function() {
                return postal(_)
            })
        });
        beforeEach(angular.mock.module('test'));
        afterEach(function() {
            postal(_)
            .utils.reset()
        });
        function flush(){
            inject(function($rootScope){
                $rootScope.$digest()
            })
        }
        describe('given no `event` property', function() {
            it('should throw', inject(function(
                eventBus) {
                function raisingWithoutEvent() {
                    eventBus.publish({
                        some: 'data'
                    })
                }
                flush()
                raisingWithoutEvent.should.throw ( /`event` property is required for events./)
            }))
        });
        describe('given `event` property', function() {
            var events
                , doodads
                , others;;
            beforeEach(inject(function(postal) {
                events = [];
                doodads = [];
                others = [];
                postal.subscribe({
                    channel: 'doodads'
                        , topic: 'my.event'
                        , callback: function(
                    data) {
                            doodads.push(
                                data)
                        }
                });
                postal.subscribe({
                    channel: 'events'
                        , topic: 'my.event'
                        , callback: function(
                    data) {
                            events.push(
                                data)
                        }
                });
                postal.subscribe({
                    channel: 'events'
                        , topic: 'my.event'
                        , callback: function(
                    data) {
                            events.push(
                                data)
                        }
                });
                postal.subscribe({
                    channel: 'events'
                        , topic: 'other.event'
                        , callback: function(
                    data) {
                            others.push(
                                data)
                        }
                })
            }));
            it(
                'should invoke callback on events channel', function() {
                inject(function(eventBus) {
                    eventBus.publish({
                        event: 'my.event'
                                , name: 'mike'
                    });
                    flush()
                    events.length.should.equal(
                        2);
                        doodads.length.should
                        .equal(0);
                        others.length.should.equal(
                            0)
                })
            })
        })
    })
})
