'use strict';
module.exports = IResourceDatasets

IResourceDatasets.$inject = ['iResourceUser'];
function IResourceDatasets(iResourceUser) {

    function execute(q) {
        var catalog
            ;

        if(q && q.datasetId && (q.datasetId[0]==='/' || q.datasetId.indexOf('http') > -1)) {

            //strategy for handling urls directly
            //@todo refactor upon landing in ui-routerless
            return iResourceUser.current()
            .then(function(user){
                return user.urls.datasets.map()
            })
            .then(function(datasets) {
                var tuple
                    ;

                catalog = datasets.self
                tuple = datasets.index.tuple(q.datasetId)
                tuple.catalog = catalog

                return tuple
            })
        }

        return iResourceUser.current()
        .then(function(user) {
            return user.urls.datasets.map()
        })
    }

    return execute
}
