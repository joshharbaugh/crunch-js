'use strict';

module.exports = UserPreferencesFactory

UserPreferencesFactory.$inject = [
    ,'bus'
    ,'iResourceUser'
]

function UserPreferencesFactory(bus, iResourceUser) {

    return {
        set: function(prefName, value){
            bus.send({
                command: 'setUserPreferences',
                prefName: prefName,
                value: value
            })
        }
        ,get: function(prefName){
            // current() takes care of caching
            return iResourceUser.current().then(function(user){
                return user.preferences[prefName]
            })
        }
    }
}
