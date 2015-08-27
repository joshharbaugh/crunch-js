;
module.exports = (function() {
    'use strict';
    var mainModule = require('../index')
    var shojiMod = require('../../shoji/index')
    var commands = []

    describe('UserPreferences', function() {
        function buildModule() {
            var mod = mainModule('userpref.test');
            var shoji = shojiMod()
            mod.factory('bus', function(){
                return {
                    send: commands.push.bind(commands)
                }
            })
            mod.factory('iResourceUser', function($q){
                return {
                    current: function(){
                        return $q.when({
                            preferences: {}
                        })
                    }
                }
            })

            angular.mock.module('userpref.test', shoji.name)
        }

        beforeEach(function() {
            buildModule()
        });

        function flush() {
            angular.mock.inject(function($rootScope){
                $rootScope.$digest()
            })
        }

        describe.only('when getting a preference', function() {
            it('should have the correct value for individual', function() {
                inject(function(userPreferences){
                    userPreferences.get('my_pref').should.equal(true)
                })
            })
        })

        describe('when setting a preference', function() {
            it('should send a command when setting a preference', function(){
                inject(function(userPreferences){
                    userPreferences.set('my_pref', 123)
                    flush()
                    commands[0].should.eql({
                        command: 'setUserPreferences'
                        ,prefName: 'my_pref'
                        ,value: 123
                    })
                })
            })
        })
    })
}).call(this);
