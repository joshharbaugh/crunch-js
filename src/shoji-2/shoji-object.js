'use strict'

module.exports = ShojiObjectFactory

function ShojiObjectFactory($injector, shojiDataOperations, _, assert, $q, $log) {
    var metadataProps
        ;

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

        return shojiDataOperations.get(this.self).then(shojiParser.parse)
    }

    ShojiObject.prototype.reduce = function(accumulator, handlers) {
        var resource = this
            , promise
            ;

        function passThrough(acc) {
            return acc
        }

        accumulator = accumulator || resource

        handlers = handlers || [passThrough];
        handlers = handlers.map(function(h) {
            return _.partial(h.bind(accumulator), accumulator)
        })

        try {
            promise = handlers.reduce(function(accum, handler) {
                return accum.then(handler)
            }, $q.when(resource))
        } catch (err) {
            $log.error(err)
            promise = $q.reject(err)
        }

        return promise
    };

    ShojiObject.prototype.save = function(params) {
        return shojiDataOperations.post(this.self, params).then(function(newResourceLocation) {
            return new ShojiObject(newResourceLocation)
        })
    }

    ShojiObject.prototype.update = function(params) {
        var self = this.self
            ;

        return shojiDataOperations.put(self, params).then(function() {
            return new ShojiObject(self).map()
        })
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
    , '$q'
    , '$log'
]