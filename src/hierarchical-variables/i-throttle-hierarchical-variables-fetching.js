'use strict';

module.exports = {
    $get : getIThrottleHierarchicalVariablesFetching
}

getIThrottleHierarchicalVariablesFetching.$inject = [
    '$delegate'
    ,'$log'
    ,'$q'
    ,'$timeout'
]

function getIThrottleHierarchicalVariablesFetching($delegate, $log, $q, $timeout) {

    var cached = {}
        , pendingPromises = {}
        ;

    function assert(condition, messages) {
        if(!condition) {
            throw new Error(messages)
        }
    }

    function flush() {
        $log.debug('extracting cached hierarchical variables list')
        cached = {}
    }

    function throttle(params){
        var cachedResult
            , pendingPromise
            , promise
            , datasetId = params.datasetId
            ;

        assert(datasetId, 'Please provide a valid dataset id')

        cachedResult = cached[datasetId]
        pendingPromise = pendingPromises[datasetId]

        if(cachedResult) {
            promise = $q.when(cachedResult)
        } else if(pendingPromise) {
            promise = pendingPromise
        } else {
            promise = $delegate.apply(this, arguments)
                .then(function(result) {
                    cached[datasetId] = result
                    $timeout(flush, 1000)
                    delete pendingPromises[datasetId]
                    return result
                }, function(e) {
                    flush()
                    delete pendingPromises[datasetId]
                    return $q.reject(e)
                })

            pendingPromises[datasetId] = promise
        }

        return promise
    }

    return throttle
}
