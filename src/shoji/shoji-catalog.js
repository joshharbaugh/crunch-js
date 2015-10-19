'use strict'

module.exports = ShojiCatalogFactory

function ShojiCatalogFactory(_, url, ShojiObject, $q) {

    function Tuple(tupleKey, catalogUrl, data) {
        this.__tupleKey = tupleKey
        this.__catalogUrl = catalogUrl
        _.extend(this, data)
    }

    Tuple.prototype.map =   function() {
        var self = this
            ;

        return new ShojiObject(this.self).map().then(function(shojiObject) {
            return _.defaults(shojiObject, _.omit(self, '_self'))
        })
    }

    Object.defineProperties(Tuple.prototype, {
        self : {
            get : function() {
                return this._self || (this._self = url.resolve(this.__catalogUrl, this.__tupleKey))
            }
        }
    })

    function defineFinalProp(obj, prop, value) {
        Object.defineProperty(obj, prop, { value : value, enumerable : false })
        return obj[prop]
    }

    function CatalogIndex() {

    }

    CatalogIndex.prototype.forEach = function(fn, context) {
        this.values.forEach(fn, context || this)
    }

    CatalogIndex.prototype.tuple = function(id) {
        return this[id]
    }

    CatalogIndex.prototype.first = function() {
        return _.first(this.values)
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
                return this._keys || defineFinalProp(this, '_keys', Object.keys(this))
            }
        }

        , values : {
            get : function() {
                return this._values || defineFinalProp(this, '_values',  this.keys.map(function(key) {
                    return this[key]
                }, this))
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
            index[key] = new Tuple(key, self, tuple)
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

