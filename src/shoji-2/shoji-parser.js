'use strict'

module.exports = ShojiParserFactory

function ShojiParserFactory(assert, ShojiEntity) {

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
]