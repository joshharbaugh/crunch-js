'use strict';

var _ = require('lodash')
module.exports = ShojiTupleFactory

ShojiTupleFactory.$inject = [
    'url'
]

function ShojiTupleFactory(url) {
    function extend(data, instance){
        var payload = _.cloneDeep(data)
        _.extend(instance,payload)

        return instance

    }

    /** @class ShojiTuple
     * @classdesc Encapsulates an item in a shoji:catalog; a `tuple`, if you will.
     */
    function ShojiTuple(target, data){
        this.target = target
        this.self = target.self
        this.clientId = _.uniqueId('shoji_')
        this.memento = data || {}
        extend(data,this)
    }

    /**
     * @method create
     * @desc Creates a new ShojiTuple
     * @static
     * @param {Resource} context which exposes `chain` function for traversal
     * @param {String} key the url for the resource the returned tuple correlates to
     * @param {Object} data The value data of the tuple
     * @return ShojiTuple instance
     */
    ShojiTuple.create = function(context, key, data) {
        if(!context.chain){
            throw new Error('context expects a `chain` method for traversal ops')
        }

        var self = url.resolve(context.self, key)

        var target = context.chain(self)
        //@todo LSP `self`
        return new ShojiTuple(target, data)
    }
    /**
     * @method map
     * @desc fetch the resource found at `key`
     * @instance
     * @memberof ShojiTuple
     */
    ShojiTuple.prototype.map = function delegate(){
        var args = [].slice.call(arguments)
            , target = this.target
            ;

        target.self = this.self

        var resource = target.map.apply(target, args)
        return resource
    }
    return ShojiTuple

}
