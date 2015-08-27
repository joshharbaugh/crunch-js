'use strict';

setUserPreferencesHandler.$inject = [
    'bus'
    ,'iResourceUser'
]

module.exports = setUserPreferencesHandler;

function setUserPreferencesHandler(bus, iResourceUser) {
    function raiseEvent(command){
        return function now(res){
            var e = {
                event: 'preferences.saved'
                ,prefName: command.prefName
                ,value: command.value
            }
            return bus.publish(e)
        }
    }
    return function handle(command){
        var raise = raiseEvent(command)
        return iResourceUser.current().then(function(usr){
            usr.preferences[command.prefName] = command.value
            usr.patch({
                data: {
                    element: 'shoji:entity'
                    ,body: {
                        preferences: usr.preferences
                    }
                }
            }).then(raise)
        })
    }
}
