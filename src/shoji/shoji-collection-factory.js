'use strict';
module.exports = ShojiCollectionFactory

ShojiCollectionFactory.$inject = [
    '$q'
    , 'lodash'
    , '$log'
]


function ShojiCollectionFactory($q, _, $log) {
    $log = $log || console;

    function noop() {}

    function saneKey(key) {
        if (_.isString(key)) {
            return key.replace('_url', '')
        }
        return key
    }

    function ShojiCollection() {
        Object.defineProperty(this, '_collection', {
            value: {}
                , writable: true
                , enumerable: false
                , configurable: true
        });
        Object.defineProperty(this, 'clientId', {
            value: _.uniqueId('shoji_')
                , writable: false
                , enumerable: false
                , configurable: false
        });
        Object.defineProperty(this, 'keys', {
            value: []
                , writable: true
                , enumerable: false
                , configurable: true
        });
        Object.defineProperty(this, 'length', {
            value: 0
                , writable: true
                , enumerable: false
                , configurable: false
        })
    }
    ShojiCollection.parse = function(target, src) {
        var coll = new ShojiCollection();
        _.each(src || [], function(url, key) {
            return coll.add(key, target.chain(url))
        }, coll);
        return coll
    };
    ShojiCollection.collect = function(seed) {
        var coll = new ShojiCollection();
        _.each(seed || [], function(res, key) {
            return coll.add(key, res)
        }, coll);
        return coll
    };
    ShojiCollection.prototype.add = function(key, res) {
        var sane = saneKey(key);
        this.keys.push(sane);
        Object.defineProperty(this, sane, {
            value: res
                , writable: false
                , enumerable: true
                , configurable: true
        });
        this._collection[key] = res;
        this.length = _.size(this._collection);
        return res
    };
    ShojiCollection.prototype.accept = function(visitor) {
        this.forEach(function(res) {
            res.accept(visitor)
        })
    };
    ShojiCollection.prototype.clear = function() {
        _.each(this.keys, function(key) {
            delete this[key]
        }, this)
    };
    ShojiCollection.prototype.equals = function(other) {
        return other.clientId && other.clientId === this.clientId
    };
    ShojiCollection.prototype.reduce = function(fn, accumulator, ctx) {;
        fn = fn || _.identity;;
        accumulator = accumulator || [];;
        ctx = ctx || this;
        return _.reduce(this._collection, fn, accumulator, ctx)
    };
    ShojiCollection.prototype.filter = function(fn) {;
        fn = fn || _.identity;
        var coll = new ShojiCollection();
        this.forEach(function(res, key) {
            if (fn(res)) {
                coll.add(key, res)
            }
        });
        return coll
    };
    ShojiCollection.prototype.forEach = function(fn, ctx) {;
        fn = fn || noop;;
        ctx = ctx || this;
        return _.each(this.keys, function(key) {
            return fn.apply(ctx, [
                this[key], key
            ])
        }, this)
    };
    ShojiCollection.prototype.map = function(mapFn, ctx) {
        var self = this;;
        mapFn = mapFn || _.identity;;
        ctx = ctx || this;
        var all = _.map(this._collection, function(item, key) {
            return item.map()
            .then(function(it) {
                var xform = mapFn.apply(ctx, [it]);
                Object.defineProperty(self, saneKey(key), {
                    value: xform
                    , writable: false
                    , enumerable: true
                    , configurable: false
                });
                self._collection[key] = xform;
                return xform
            })
        }, this);
        return $q.all(all)
        .then(function(results) {
            return self
        })
    };
    ShojiCollection.prototype.toArray = function() {
        return _.toArray(this._collection)
    };
    ShojiCollection.prototype.reject = function(fn) {;
        fn = fn || _.identity;
        var coll = new ShojiCollection();
        this.forEach(function(res, key) {
            if (!fn(res)) {
                coll.add(key, res)
            }
        });
        return coll
    };
    ShojiCollection.prototype.toString = function() {
        return 'ShojiCollection ' + this.clientId +
            ' ; Length: ' + this.length + ' ; Keys: ' + this.keys
    };
    return ShojiCollection
}
