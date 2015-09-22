'use strict';

module.exports = UserPreferencesFactory

UserPreferencesFactory.$inject = [
    'bus'
]

function UserPreferencesFactory(bus) {
    var userPrefs = {}

    return {
        init: function(prefs){
            userPrefs  = prefs || {}
        }
        ,set: function(prefName, value){
            userPrefs[prefName] = value
            bus.send({
                command: 'setUserPreferences',
                prefName: prefName,
                value: value
            })
        }
        ,get: function(prefName){
            return userPrefs[prefName]
        }
    }
}
