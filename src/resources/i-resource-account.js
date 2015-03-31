'use strict';
module.exports = IResourceAccount

IResourceAccount.$inject = [
    'iResourceUser'
];

function IResourceAccount( iResourceUser) {
    return {
        current: function() {
            var account = iResourceUser.current()
                .then(function(user) {
                    return user.urls.account.map()
                });
            return account
        }
    }
}
