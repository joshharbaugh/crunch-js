'use strict'

module.exports = IResourceBatchesFactory

IResourceBatchesFactory.$inject = [
    'iResourceDataset'
]

function IResourceBatchesFactory(iResourceDataset) {

    return function(params) {
        return iResourceDataset({ datasetId : params.datasetId }).then(function(dataset){
            return dataset.urls.batches.map({
                cache : false
            })
        })
    }
}
