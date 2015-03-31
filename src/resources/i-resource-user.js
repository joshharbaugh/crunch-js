'use strict';
module.exports = IResourceUser

IResourceUser.$inject = ['Shoji'];

function IResourceUser(Shoji) {
    return {
        current: function() {
            return Shoji.API.map(function(api) {
                return api.urls.user.map()
            })
        }
    }
}
