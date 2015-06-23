'use strict'

module.exports = VariableCatalogListFactory

VariableCatalogListFactory.$inject = ['lodash', 'iGetVariableHash']

function VariableCatalogListFactory(_, iGetVariableHash) {

    /**
     * Represents the set of variable catalogs that belongs
     * to a given dataset and its subordinates
     */
    function VariableCatalogList(catalogs) {
        this.catalogs = catalogs || []
    }

    VariableCatalogList.prototype.add = function(catalog) {
        this.catalogs.push(catalog)
    }

    /**
     * Look up a variable with a given url in the dataset's catalogs
     * @return {ShojiTuple} variable tuple
     */
    VariableCatalogList.prototype.getVariable = function(url, subordinate) {
        var variableFound = null
            , id = iGetVariableHash(url)
            , catalogs = subordinate ? _.rest(this.catalogs) : this.catalogs

        catalogs.some(function(catalog) {
            if((variableFound = catalog.index[id])) {
                return true
            }
        })

        return variableFound
    }

    VariableCatalogList.prototype.principal = function() {
        return this.catalogs[0]
    }

    VariableCatalogList.prototype.countVariables = function() {
        return this.catalogs.reduce(function(previous, catalog) {
            return previous + catalog.index.length
        }, 0)
    }

    Object.defineProperty(VariableCatalogList.prototype, 'length', {
        get : function() {
            return this.catalogs.length
        }
    })

    return VariableCatalogList
}
