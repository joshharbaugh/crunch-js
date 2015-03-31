'use strict';
var _ = require('lodash')

IFetchCubes.$inject = [
    'iResourceDataset'
]

module.exports = IFetchCubes

function IFetchCubes(iResourceDataset) {
    return function execute(q) {
        return iResourceDataset({datasetId: q.datasetId}).then(function(ds) {
                return ds.urls.cube.map({params: {query: (q.query)}
            }).then(function(it){
                return it.value
            })
        })
    }
}
