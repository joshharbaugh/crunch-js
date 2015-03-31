'use strict'

module.exports = CachedHierarchicalVariablesFactory

function CachedHierarchicalVariablesFactory(_, $q) {
    var executionQueue = []
        , current
        , refreshing = false
        ;

    function CachedHierarchicalVariables() {

    }

    CachedHierarchicalVariables.prototype.executeAfterRefresh = function(fn) {
        if(_.isFunction(fn)) {
            if(refreshing === true) {
                executionQueue.push(fn)
            } else {
                fn()
            }
        }
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

                executionQueue.forEach(function(fn) {
                    fn()
                })

                executionQueue.length = 0
                refreshing = false
            }
        }
    })

    return new CachedHierarchicalVariables()
}

CachedHierarchicalVariablesFactory.$inject = ['lodash', '$q']
