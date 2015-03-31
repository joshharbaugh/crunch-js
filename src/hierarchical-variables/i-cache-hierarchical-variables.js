'use strict';

module.exports = {
    $get : getICacheHierarchicalVariablesFetching
}

getICacheHierarchicalVariablesFetching.$inject = [
    '$delegate'
    , 'cachedHierarchicalVariables'
]

function getICacheHierarchicalVariablesFetching($delegate, cachedHierarchicalVariables) {

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
            })
    }

    return cache
}
