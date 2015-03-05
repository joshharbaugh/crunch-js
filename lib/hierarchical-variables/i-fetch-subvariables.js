'use strict'

module.exports = IFetchSubvariablesFactory

IFetchSubvariablesFactory.$inject = ['Shoji', 'SubvariablesCatalogList']

function IFetchSubvariablesFactory(Shoji, SubvariablesCatalogList) {

    return function fetch(variable) {
        var url = variable.self + variable.subvariables_catalog.split('/')[1] + '/'
            , order = variable.subvariables
            ;

        return Shoji(url).map().then(function(subvariablesData) {
            return new SubvariablesCatalogList([subvariablesData])
        })
    }
}
