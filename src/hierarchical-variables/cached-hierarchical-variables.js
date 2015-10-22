'use strict'

module.exports = CachedHierarchicalVariablesFactory

function CachedHierarchicalVariablesFactory(_, $q) {
    var executionQueue = []
        , waitForPopulationQueue = []
        , current
        , refreshing = false
        ;

    function CachedHierarchicalVariables() {

    }

    CachedHierarchicalVariables.prototype.executeAfterRefresh = function() {
        var deferred = $q.defer()
            ;

        if(refreshing === true) {
            executionQueue.push(deferred)
        } else {
            deferred.resolve(this.current)
        }

        return deferred.promise
    }

    CachedHierarchicalVariables.prototype.waitForCachePopulation = function() {
        var deferred = $q.defer()
            ;

        if(!current || refreshing) {
            waitForPopulationQueue.push(deferred)
        } else {
            deferred.resolve(this.current)
        }

        return deferred.promise
    }

    CachedHierarchicalVariables.prototype.reject = function(error) {
        executionQueue.forEach(function(deferred) {
            deferred.reject(error)
        })

        waitForPopulationQueue.forEach(function(deferred) {
            deferred.reject(error)
        })

        executionQueue.length = 0
        waitForPopulationQueue.length = 0
        refreshing = false
    }

    CachedHierarchicalVariables.prototype.refresh = function() {
        refreshing = true
    }

    Object.defineProperties(CachedHierarchicalVariables.prototype, {
        current : {
            get : function() {
                return current
            }

            , set : function(value) {
                current = value

                executionQueue.forEach(function(deferred) {
                    deferred.resolve(current)
                })

                waitForPopulationQueue.forEach(function(deferred) {
                    deferred.resolve(current)
                })

                executionQueue.length = 0
                waitForPopulationQueue.length = 0
                refreshing = false
            }
        }
    })

    return new CachedHierarchicalVariables()
}

CachedHierarchicalVariablesFactory.$inject = ['lodash', '$q']
