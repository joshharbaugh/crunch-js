'use strict'

module.exports = CachedHierarchicalVariablesFactory

function CachedHierarchicalVariablesFactory(_, $q) {
    var executionQueue = []
        , waitForPopulationQueue = []
        , current
        , empty = true
        , refreshing = false
        , error
        ;

    function CachedHierarchicalVariables() {

    }

    CachedHierarchicalVariables.prototype.executeAfterRefresh = function() {
        var deferred = $q.defer()
            ;

        if(refreshing === true) {
            executionQueue.push(deferred)
        } else if (error) {
            deferred.reject(error)
        } else {
            deferred.resolve(this.current)
        }

        return deferred.promise
    }

    CachedHierarchicalVariables.prototype.waitForCachePopulation = function() {
        var deferred = $q.defer()
            ;

        if(empty || refreshing) {
            waitForPopulationQueue.push(deferred)
        } else if(error) {
            deferred.reject(error)
        } else {
            deferred.resolve(this.current)
        }

        return deferred.promise
    }

    CachedHierarchicalVariables.prototype.reject = function(e) {
        error = e

        executionQueue.forEach(function(deferred) {
            deferred.reject(error)
        })

        waitForPopulationQueue.forEach(function(deferred) {
            deferred.reject(error)
        })

        executionQueue.length = 0
        waitForPopulationQueue.length = 0
        refreshing = false
        empty = false
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

                error = null
                executionQueue.length = 0
                waitForPopulationQueue.length = 0
                refreshing = false
                empty = false
            }
        }
    })

    return new CachedHierarchicalVariables()
}

CachedHierarchicalVariablesFactory.$inject = ['lodash', '$q']
