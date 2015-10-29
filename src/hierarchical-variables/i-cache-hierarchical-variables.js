'use strict';

module.exports = {
    $get : getICacheHierarchicalVariablesFetching
}

getICacheHierarchicalVariablesFetching.$inject = [
    '$delegate'
    , '$q'
    , 'cachedHierarchicalVariables'
]

function getICacheHierarchicalVariablesFetching($delegate, $q , cachedHierarchicalVariables) {

    function cache(){
        var params = arguments[0] || {}
            ;

        if(!params.noCache) {
            cachedHierarchicalVariables.refresh()
        }

        return $delegate
            .apply($delegate, arguments)
            .then(function(hierarchicalVariables) {
                if(!params.noCache) {
                    cachedHierarchicalVariables.current = hierarchicalVariables
                }

                return hierarchicalVariables
            }, function(e) {
                cachedHierarchicalVariables.reject(e)
                return $q.reject(e)
            })
    }

    return cache
}
