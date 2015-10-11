'use strict';

module.exports = CubeFactory

CubeFactory.$inject = [
    '$q'
    , 'lodash'
    , 'dimension'
    , 'measure'
]

function CubeFactory($q, _, dimension, measure) {

    var Cube = function(measures, meta) {
        var validShape = meta.validShape

        this.dimension = validShape.length
        this.n = meta.n
        this._dimensions = meta.dimensions
        this.query = meta.query
        this.valid = meta.n
        this.nMissing = meta.nMissing
        this.weightId = meta.weightId
        this.appliedFilters = _.cloneDeep(meta.appliedFilters)

        _.extend(this, measures)

        return this
    }

    Cube.prototype.isValidSlice = function(index) {
        var valid = true
            ;

        try {
            valid = this.getSliceAtIndex(index)
        } catch(e) {
            valid = false
        }

        return valid
    }

    Cube.prototype.getSliceAtIndex = function(index) {
        // get the slice at a **valid** index
        // numeric binned ones put a Missing (?:-1) index at 0
        var firstSlice
            , measures = {}
            , measureTypes = ['count', 'mean']
            , self = this
            ;

        var validIndex = this._dimensions[0].validSubscripts[index]
        measureTypes.forEach(function(measure) {
            var slices
                ;
            if(measure in self) {
                slices = self[measure].slices

                if(validIndex >= slices.length || validIndex < 0) {
                    throw new Error('Invalid slice index')
                }

                measures[measure] = slices[validIndex]
                firstSlice = slices[validIndex]
            }
        })

        return new Cube(
            measures
            , {
                validShape : firstSlice.validShape
                , n : this.n
                , dimensions : firstSlice.dimensions
                , query : this.query
                , nMissing : this.nMissing
                , weightId : this.weightId
                , appliedFilters : this.appliedFilters
            }
        )
    }

    Object.defineProperties(Cube.prototype, {
        'labels': {
            'get': function() {
                return this._dimensions.map(function(dim) {
                    return dim.labels
                })
            }
        },
        'subscripts': {
            'get': function() {
                return this._dimensions.map(function(dim) {
                    return dim.validSubscripts
                })
            }
        }
    })

    Cube.fromCrCube = function(crunchCube) {
        var raw = crunchCube
        var meta = {
            measures: Object.keys(raw.result.measures),
            query: raw.query
        }
        var result = {}

        var dims = (raw.result.dimensions || []).map(function(dim) {
            return dimension.fromData(dim)
        })

        if (dims.length === 0) {
            // Special case of unconditional mean
            dims.push(dimension.aggregateDimension('Mean'))
        }

        meta = gatherMetadata(raw.result, dims, meta)
        meta.dimensions = dims
        meta.appliedFilters = raw.query ? raw.query.filters : []
        meta.weightId = raw.query ? raw.query.weight : undefined

        var measures = _.mapValues(raw.result.measures, function(m, type) {
            return measure.fromData({
                type: type,
                data: m.data,
                meta: meta
            })
        })

        result = new Cube(measures, meta)

        return $q.when(result)
    }

    Cube.fromMultiCube = function(raw) {
        var self=this;
        return $q.all(_.flatten(raw)).then(function(subcubes){
            return _.flatten(subcubes).map(function makeSingleCube(subcube){
                return self.fromCrCube(subcube)
            }, this)
        })
    }

    function gatherMetadata(result, dims, meta) {
        var qi = result.measures.hasOwnProperty('mean') ? 'mean' : 'count'
        meta.nMissing = result.measures[qi].n_missing || 0
            // Not yet clear use case where other measures different n_missing
        meta.n = result.n - meta.nMissing

        meta.shape = dims.map(function(dim) {
            return dim.length
        })

        meta.missing = dims.map(function(dim) {
            return dim.missing
        })

        meta.validShape = dims.map(function(dim) {
            return dim.validLength
        })
        if (meta.validShape.length === 1) {
            meta.validShape.push(1)
        }

        meta.labels = dims.map(function(dim) {
            return dim.labels
        })

        return meta
    }

    function prod() {
        var args = [].slice.call(arguments)
            ,end = args.length - 1;

        var result = []

        function addTo(curr, start) {
            var first = args[start],
                last = (start === end)

            for (var i = 0; i < first.length; ++i) {
                var copy = curr.slice()
                copy.push(first[i])

                if (last) {
                    result.push(copy)
                } else {
                    addTo(copy, start + 1)
                }
            }
        }

        if (args.length) {
            addTo([], 0)
        } else {
            result.push([])
        }
        return result
    }

    Cube.prod = prod

    Cube.prototype.ravelLabels = function() {
        return prod.apply(this, this.labels)
    }

    return Cube
}
