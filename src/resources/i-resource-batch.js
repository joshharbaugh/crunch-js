'use strict'

module.exports = IResourceBatchFactory

IResourceBatchFactory.$inject = [
    'Shoji'
]

function IResourceBatchFactory(Shoji) {

    function fetchWithId(batchId) {
        return Shoji(batchId).map()
    }

    return function(params) {
        if(params && typeof params.batchId === 'string') {
            return fetchWithId(params.batchId)
        } else {
            throw new Error('You should provide a batchId')
        }
    }
}
