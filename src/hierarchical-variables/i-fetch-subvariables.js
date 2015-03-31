'use strict'

module.exports = IFetchSubvariablesFactory

IFetchSubvariablesFactory.$inject = ['Shoji', 'SubvariablesCatalogList']

function IFetchSubvariablesFactory(Shoji, SubvariablesCatalogList) {

    return function fetch(variable) {
        var url = variable.self + 'subvariables/'
            , order = variable.subvariables
            ;

        return Shoji(url).map().then(function(subvariablesData) {
            return new SubvariablesCatalogList([subvariablesData])
        })
    }
}
