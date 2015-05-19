'use strict'

module.exports = ShojiParserFactory

function ShojiParserFactory(assert, ShojiEntity, ShojiCatalog, ShojiView, ShojiOrder) {

    function ShojiParser() {

    }

    ShojiParser.prototype.parse = function(data) {
        var object
            ;

        assert(data, 'Invalid data object')

        switch(data.element) {
            case 'shoji:entity':
                object = new ShojiEntity(data.self).parse(data)
                break
            case 'shoji:catalog':
                object = new ShojiCatalog(data.self).parse(data)
                break
            case 'shoji:view':
                object = new ShojiView(data.self).parse(data)
                break
            case 'shoji:order':
                object = new ShojiOrder(data.self).parse(data)
                break
            default:
                throw new Error('Unrecognized shoji object ' + data.element)
        }

        return object
    }

    return new ShojiParser()
}

ShojiParserFactory.$inject = [
    'assert'
    , 'ShojiEntity'
    , 'ShojiCatalog'
    , 'ShojiView'
    , 'ShojiOrder'
]