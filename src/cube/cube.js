'use strict';

module.exports = CubeFactory

CubeFactory.$inject = [
    '$log'
    ,'$q'
    ,'lodash'
    ,'dimension'
    ,'measure'
]

function CubeFactory($log, $q, _, dimension, measure){

    var Cube = function(measures, meta, margins){
        var shape = meta.shape
        var validShape = meta.validShape

        this.dimension = validShape.length
        this.n = meta.n
        this._dimensions = meta.dimensions
        this.query = meta.query
        this.valid = meta.n
        this.nMissing = meta.nMissing
        this.weightId = meta.weightId
        this.appliedFilters = _.cloneDeep(meta.appliedFilters)

        if(_.isObject(margins)) {
            this.margins = margins
        }

        _.extend(this, measures)

        return this
    }

    Object.defineProperties(Cube.prototype, {
        'labels': {
            'get' : function(){
                return this._dimensions.map(function(dim){
                    return dim.labels
                })
            }
        }
        ,'subscripts': {
            'get' : function(){
                return this._dimensions.map(function(dim){
                    return dim.validSubscripts
                })
            }
        }
    })

    Cube.fromCrCube = function(crunchCube){
        var raw = crunchCube
        var meta = {
            measures : Object.keys(raw.result.measures)
            ,query: raw.query
        }
        var result = {}

        var dims = (raw.result.dimensions || []).map(function(dim) {
            return dimension.fromData(dim)
        })

        if(meta.measures.indexOf('mean') > -1) {
            dims.push(dimension.aggregateDimension('Mean'))
        }

        meta = gatherMetadata(raw.result, dims, meta)
        meta.dimensions = dims
        meta.appliedFilters = raw.query ? raw.query.filters : []
        meta.weightId = raw.query ? raw.query.weight : undefined

        var measures = _.mapValues(raw.result.measures, function(m, type) {
            return measure.fromData({
                type : type
                , data : m.data
                , meta : meta
            })
        })

        result = new Cube(measures, meta, raw.margins)

        return $q.when(result)
    }

    function gatherMetadata(result, dims, meta){
        meta.nMissing = result.measures[meta.measures[0]].n_missing || 0
        // Not yet clear use case where other measures different n_missing
        meta.n = result.n - meta.nMissing

        meta.shape = dims.map(function(dim){
            return dim.length
        })

        meta.missing = dims.map(function(dim) {
            return dim.missing
        })

        meta.validShape = dims.map(function(dim){
            return dim.validLength
        })
        if(meta.validShape.length===1){
            meta.validShape.push(1)
        }

        meta.labels = dims.map(function(dim){
            return dim.labels
        })

        return meta
    }

    function prod() {
        return _.reduce(arguments, function(a, b) {
            return _.flatten(_.map(a, function(x) {
                return _.map(b, function(y) {
                    return x.concat([y])
                })
            }), true)
        }, [ [] ])
    }

    Cube.prod = prod

    Cube.prototype.ravelLabels = function(){
        return prod.apply(this, this.labels)
    }

    return Cube
}
