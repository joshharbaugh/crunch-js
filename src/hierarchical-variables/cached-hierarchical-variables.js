'use strict'

module.exports = CachedHierarchicalVariablesFactory

function CachedHierarchicalVariablesFactory(_, $q) {
    var executionQueue = []
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

                executionQueue.length = 0
                refreshing = false
            }
        }
    })

    return new CachedHierarchicalVariables()
}

CachedHierarchicalVariablesFactory.$inject = ['lodash', '$q']
