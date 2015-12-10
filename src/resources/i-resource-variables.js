;
module.exports = (function() {
    'use strict';

    function IResourceVariables(iResourceDataset) {
        function assertQuery(q) {
            if (q && (q.variableAlias || q.variableId)) {
                var result = {};
                if ( !! q.variableAlias) {
                    result.alias = q.variableAlias
                }
                if ( !! q.variableId) {
                    var id = q.variableId
                    if (id[id.length - 1] === '/') {
                        id = id.substring(id, id.length - 1)
                    }
                    result.id = id
                }
                return result
            }
            return undefined
        }
        return function execute(q) {
            var params = assertQuery(q);
            return iResourceDataset(q)
                .then(function(dataset) {
                    return dataset.catalogs.variables.map({
                        params: params
                    })
                })
        }
    }
    IResourceVariables.$inject = ['iResourceDataset'];
    return IResourceVariables
})
    .call(this);
