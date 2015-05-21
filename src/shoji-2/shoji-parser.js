'use strict'

module.exports = ShojiParserFactory

function ShojiParserFactory(assert, _, ShojiEntity, ShojiCatalog, ShojiView, ShojiOrder) {

    var parsers = {
        'shoji:entity' : function(data) {
            assert(data, 'Invalid data object')
            assert(data.body, 'Entities should have a body')

            return _.extend(new ShojiEntity(data.self, data), data.body)
        }

        , 'shoji:catalog' : function(data) {
            return new ShojiCatalog(data.self, data)
        }

        , 'shoji:view' : function(data) {
            var view = new ShojiView(data.self, data)
                ;

            view.value = data.value
            return view
        }

        , 'shoji:order' : function(data) {
            var order = new ShojiOrder(data.self, data)
                ;

            order.graph = data.graph
            return order
        }
    }

    function invalidElement(data) {
        throw new Error('Unrecognized shoji object ' + data.element)
    }

    function ShojiParser() {

    }

    ShojiParser.prototype.parse = function(data) {
        assert(data, 'Invalid data object')
        return (parsers[data.element] || invalidElement)(data)
    }

    return new ShojiParser()
}

ShojiParserFactory.$inject = [
    'assert'
    , 'lodash'
    , 'ShojiEntity'
    , 'ShojiCatalog'
    , 'ShojiView'
    , 'ShojiOrder'
]