'use strict'

module.exports = ShojiCatalogFactory

function ShojiCatalogFactory(_, url, ShojiObject) {

    var tupleOperations
        , indexProperties
        ;

    indexProperties = {
        length : {
            get : function() {
                return this.keys.length
            }
        }

        , keys : {
            get : function() {
                return this._keys || (this._keys = Object.keys(this))
            }
        }

        , values : {
            get : function() {
                return this._values || (this._values = this.keys.map(function(key) { return this[key] }, this))
            }
        }
    }

    tupleOperations = {
        map : function() {
            var self = this
                ;

            return new ShojiObject(this.self).map().then(function(shojiObject) {
                return _.extend(shojiObject, _.omit(self, '_self'))
            })
        }
    }

    function toShojiObjects(urls) {
        return Object.keys(urls).reduce(function(accum, key) {
            accum[key.replace('_url', '')] = new ShojiObject(urls[key])
            return accum
        }, {})
    }

    function extendIndex(self, index) {
        var mapped = _.mapValues(index, function(tuple, key) {
            return Object.defineProperties(_.extend(tuple, tupleOperations), {
                self : {
                    get : function() {
                        return this._self || (this._self = url.resolve(self, key))
                    }
                }
            })
        })

        return Object.defineProperties(mapped, indexProperties)
    }

    function ShojiCatalog() {
        ShojiObject.apply(this, arguments)
    }

    ShojiCatalog.prototype = Object.create(ShojiObject.prototype)

    Object.defineProperties(ShojiCatalog.prototype, {
        index : {
            get : function() {
                return this._index || (this._index = extendIndex(this.self, this.data.index))
            }
        }

        , orders : {
            get : function() {
                return this._orders || (this._orders = toShojiObjects(this.data.orders))
            }
        }
    })

    return ShojiCatalog
}

ShojiCatalogFactory.$inject = ['lodash', 'url', 'ShojiObject']

