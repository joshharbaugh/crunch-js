'use strict';
var _ = require('lodash')

IFetchCubes.$inject = [
    'currentDataset'
]

module.exports = IFetchCubes

function IFetchCubes(currentDataset) {
    return function execute(q) {
        return currentDataset.fetch().then(function(ds) {
                return ds.views.cube.map({params: {query: (q.query)}
            }).then(function(it){
                return it.value
            })
        })
    }
}
