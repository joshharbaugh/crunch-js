'use strict'

module.exports = ShojiObjectFactory

function ShojiObjectFactory($injector, shojiDataOperations, _, assert) {
    var metadataProps
        ;

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

    function toShojiObjects(urls) {
        return Object.keys(urls).reduce(function(accum, key) {
            accum[key.replace('_url', '')] = new ShojiObject(urls[key])
            return accum
        }, {})
    }

    function ShojiObject(uri) {
        this.self = uri
    }

    ShojiObject.prototype.map = function() {
        var shojiParser = $injector.get('shojiParser')
            , promise = shojiDataOperations.get(this.self).then(shojiParser.parse)
            ;

        return promise.then.apply(promise, processCallbacks(arguments))
    }

    ShojiObject.prototype.parse = function(data) {
        //noinspection JSPotentiallyInvalidUsageOfThis
        this.data = data
        return this
    }

    metadataProps = (['urls', 'fragments', 'views', 'catalogs']).reduce(function(props, meta) {

        props[meta] = {
            get : function() {
                var store = '_' + meta
                    ;

                assert(this.data[meta], 'The shoji object does not contain ' + meta)
                return this[store] || (this[store] = toShojiObjects(this.data[meta]))
            }
        }

        return props
    }, {})

    Object.defineProperties(ShojiObject.prototype, metadataProps)

    return ShojiObject
}

ShojiObjectFactory.$inject = [
    '$injector'
    , 'shojiDataOperations'
    , 'lodash'
    , 'assert'
]