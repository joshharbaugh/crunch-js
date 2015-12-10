'use strict';
module.exports = IResourceDatasets

IResourceDatasets.$inject = ['Shoji'];
function IResourceDatasets(Shoji) {

    function execute(q) {
        var catalog
            ;

        if(q && q.datasetId && (q.datasetId[0]==='/' || q.datasetId.indexOf('http') > -1)) {

            return Shoji.API.map(function(api) {
                return api.catalogs.datasets.map()
            })
            .then(function(datasets) {
                var tuple;

                catalog = datasets.self
                tuple = datasets.index.tuple(q.datasetId)
                tuple.catalog = catalog

                return tuple
            })
        }

        return Shoji.API.map(function(api) {
            return api.catalogs.datasets.map()
        })
    }

    return execute
}
