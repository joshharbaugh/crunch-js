'use strict'

module.exports = IResourceSourceFactory

IResourceSourceFactory.$inject = [
    'Shoji'
]

function IResourceSourceFactory(Shoji) {
    return function(params) {
        if(params && typeof params.sourceId === 'string') {
            return Shoji(params.sourceId).map()
        } else {
            throw new Error('You should provide a sourceId')
        }
    }
}
