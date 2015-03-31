'use strict'

module.exports = SubvariablesCatalogListFactory

SubvariablesCatalogListFactory.$inject = [
    'VariableCatalogList'
    , 'iGetVariableHash'
]

function SubvariablesCatalogListFactory(VariableCatalogList, iGetVariableHash) {

    function SubvariablesCatalogList() {
        VariableCatalogList.apply(this, arguments)
    }

    SubvariablesCatalogList.prototype = new VariableCatalogList()

    SubvariablesCatalogList.prototype.getVariable = function(id) {
        var found
            , hash = iGetVariableHash(id)
            ;

        this.catalogs.some(function(catalog) {
            var self
                ;

            catalog.index.keys.some(function(key) {
                var contains = key.indexOf(hash) > -1
                    ;

                if(contains) {
                    self = key
                }

                return contains
            })

            if(self) {
                found = catalog.index[self]
                return true
            }
        })

        return found
    }

    return SubvariablesCatalogList
}
