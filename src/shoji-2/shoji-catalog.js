'use strict'

module.exports = ShojiCatalogFactory

function ShojiCatalogFactory(_, url, ShojiObject, $q) {

    var tupleOperations = {
        map : function() {
            var self = this
                ;

            return new ShojiObject(this.self).map().then(function(shojiObject) {
                return _.extend(shojiObject, _.omit(self, '_self'))
            })
        }
    }

    function CatalogIndex() {

    }

    CatalogIndex.prototype.forEach = function(fn, context) {
        this.values.forEach(fn, context || this)
    }

    CatalogIndex.prototype.tuple = function(id) {
        return this[id]
    }

    CatalogIndex.prototype.toObject = function() {
        return this
    }

    CatalogIndex.prototype.mapResources = function() {
        return $q.all(this.values.map(function(t) { return t.map() }))
    }

    Object.defineProperties(CatalogIndex.prototype, {
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
    })

    function toShojiObjects(urls) {
        return Object.keys(urls).reduce(function(accum, key) {
            accum[key.replace('_url', '')] = new ShojiObject(urls[key])
            return accum
        }, {})
    }

    function extendIndex(self, indexData) {
        var index = new CatalogIndex()
            ;

        _.each(indexData, function(tuple, key) {
            index[key] = Object.defineProperties(_.extend(tuple, tupleOperations), {
                self : {
                    get : function() {
                        return this._self || (this._self = url.resolve(self, key))
                    }
                }
            })
        })

        return index
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

        , element : {
            value : 'shoji:catalog'
        }
    })

    return ShojiCatalog
}

ShojiCatalogFactory.$inject = ['lodash', 'url', 'ShojiObject', '$q']

