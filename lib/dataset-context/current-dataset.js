'use strict'

module.exports = CurrentDatasetFactory

CurrentDatasetFactory.$inject = [
    'lodash'
    ,'$q'
    ,'$injector'
]

function CurrentDatasetFactory(_, $q, $injector) {
    var currentDatasetId
        ,currentDataset
        ,pendingDatasetRequest
        ;

    return {
        fetch : function() {
            var promise = $q.reject({})
                ,iResourceDataset
                ;

            iResourceDataset = $injector.get('iResourceDataset')

            if(_.isObject(currentDataset)) {
                promise = $q.when(currentDataset)
            } else if(_.isObject(pendingDatasetRequest)) {
                promise = pendingDatasetRequest
            } else if(_.isString(currentDatasetId)) {
                pendingDatasetRequest = iResourceDataset({ datasetId : currentDatasetId, noCache : true })
                pendingDatasetRequest.then(function(dataset) {
                    currentDataset = dataset
                })
                promise = pendingDatasetRequest
            }

            return promise
        }
        ,set : function(datasetId) {
            if(currentDatasetId !== datasetId) {
                currentDataset = null
                pendingDatasetRequest = null
                currentDatasetId = datasetId
            }
        }
        ,clean : function() {
            currentDataset = null
            pendingDatasetRequest = null
        }
        ,reset : function() {
            currentDatasetId = null
            this.clean()
        }
    }
}
