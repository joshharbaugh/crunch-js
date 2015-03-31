'use strict'

module.exports = IResourceSourceFactory

IResourceSourceFactory.$inject = [
    'Shoji'
]

function IResourceSourceFactory(Shoji) {

    function fetchWithId(sourceId) {
        return Shoji(sourceId).map()
    }

    return function(params) {
        if(params && typeof params.sourceId === 'string') {
            return fetchWithId(params.sourceId)
        } else {
            throw new Error('You should provide a sourceId')
        }
    }
}
