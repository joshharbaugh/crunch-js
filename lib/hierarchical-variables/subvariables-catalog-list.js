'use strict'

module.exports = SubvariablesCatalogListFactory

SubvariablesCatalogListFactory.$inject = ['VariableCatalogList']

function SubvariablesCatalogListFactory(VariableCatalogList) {

    function SubvariablesCatalogList() {
        VariableCatalogList.apply(this, arguments)
    }

    SubvariablesCatalogList.prototype = new VariableCatalogList()

    SubvariablesCatalogList.prototype.getVariable = function(id) {
        var found
            ;

        this.catalogs.some(function(catalog) {
            var self
                ;

            catalog.index.keys.some(function(key) {
                var contains = key.indexOf(id) > -1
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
