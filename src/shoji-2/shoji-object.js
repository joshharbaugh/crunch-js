'use strict'

module.exports = ShojiObjectFactory

function ShojiObjectFactory($injector, shojiDataOperations, _) {
    function ShojiObject(uri) {
        this.self = uri
    }

    function passThrough(data) {
        return data
    }

    function errorPassThrough(error) {
        return error
    }

    function processCallbacks() {
        var success = _.isFunction(arguments[0]) ? arguments[0] : passThrough
            , error = _.isFunction(arguments[1]) ? arguments[1] : errorPassThrough
            ;

        return [success, error]
    }

    ShojiObject.prototype.map = function() {
        var shojiParser = $injector.get('shojiParser')
            , promise = shojiDataOperations.get(this.self).then(shojiParser.parse)
            ;

        return promise.then.apply(promise, processCallbacks(arguments))
    }

    ShojiObject.prototype.parse = function() {
        throw new Error('Not implemented')
    }

    return ShojiObject
}

ShojiObjectFactory.$inject = [
    '$injector'
    , 'shojiDataOperations'
    , 'lodash'
]