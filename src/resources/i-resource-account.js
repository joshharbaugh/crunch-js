'use strict';
module.exports = IResourceAccount

IResourceAccount.$inject = [
    'Shoji'
];

function IResourceAccount(Shoji) {
    return {
        current: function() {
            return Shoji.API.map(function(api) {
                return api.urls.account.map()
            })
        }
    }
}
