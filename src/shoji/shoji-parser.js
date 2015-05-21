'use strict'

module.exports = ShojiParserFactory

function ShojiParserFactory(assert, _, ShojiEntity, ShojiCatalog, ShojiView, ShojiOrder) {

    var parsers = {
        'shoji:entity' : function(data) {
            assert(data, 'Invalid data object')

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

        , 'shoji:value' : function(data) {
            var object = new ShojiView(data.self, data)
                ;

            object.value = data
            return object
        }
    }

    function ShojiParser() {

    }

    ShojiParser.prototype.parse = function(data) {
        assert(data, 'Invalid data object')
        return (parsers[data.element || 'shoji:value'])(data)
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