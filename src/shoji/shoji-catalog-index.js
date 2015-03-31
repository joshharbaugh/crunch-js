'use strict';

module.exports = ShojiCatalogIndexFactory

ShojiCatalogIndexFactory.$inject = [
    'lodash'
    ,'ShojiTuple'
    ,'$q'
]
function ShojiCatalogIndexFactory(_,ShojiTuple, $q){
    function assert(pred, msg){
        if(!pred) {
            throw new Error(msg)
        }
    }

    function ShojiCatalogIndex(){
        Object.defineProperty(this,'keys',{
            writable: true
            ,configurable: false
            ,enumerable: false
            ,value: []
        })
        Object.defineProperty(this,'length',{
            writable: true
            ,configurable: false
            ,enumerable: false
            ,value: 0
        })
        this.tuple = this.tuple.bind(this)
    }
    ShojiCatalogIndex.create = function(context, data) {
        assert(context,'context is required')
        assert(context.chain,'context must expose a `chain` method')
        //todo validate data
        var index = new ShojiCatalogIndex()
        ;(data = data || {})
        Object.keys(data).forEach(function(k){
            index.tuple(k,data[k],context)
        })

        return index

    }
    /**
     * @method mapResources
     * @desc Fetches all resources referenced by `index`
     * @instance
     * @memberof ShojiCatalogIndex
     * @return Array of {Resource} instances
     * */
    ShojiCatalogIndex.prototype.mapResources = function() {
        var promises = this.keys.map(function(key){
            return  this.tuple(key).map()
        }, this)
        return $q.all(promises)
    }

    /**
     * @todo more semantically correct name; this can be unpredictable
     * @deprecated
     * */
    ShojiCatalogIndex.prototype.first = function(){
        if(this.keys.length > 1) {
            throw new Error('you cannot meaningfully call `first` on an index with more than one tuple')
        }
        return this.tuple(this.keys[0])

    }
    ShojiCatalogIndex.prototype.tuple = function(key, data, context) {
        if(!data && !context) {
            return this[key]
        }

        this.keys.push(key)
        this.length = this.keys.length
        this[key] = ShojiTuple.create(context,key, data)
        return (this[key])
    }
    ShojiCatalogIndex.prototype.forEach = function(fn, ctx) {
        this.keys.forEach(function(k){
            var tuple = this.tuple(k)
            fn.apply(ctx || this, [tuple,k])
        }, this)
    }

    ShojiCatalogIndex.prototype.toObject = function(){
        var json = {}
        this.keys.forEach(function(k){
            json[k] = this.tuple(k).memento
            json[k].self = k
        },this)
        return json
    }

    return ShojiCatalogIndex

}
