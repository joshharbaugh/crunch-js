'use strict'

module.exports = MeasureFactory

MeasureFactory.$inject = [
    'lodash',
    'ndarray',
    'ndarrayScratch',
    'ndarrayUnpack',
    'show'

]

function MeasureFactory(_, ndarray, scratch, unpack, show) {
    var allowedTypes = ['mean', 'stddev', 'count']
        ;

    function assertType(type) {
        if(allowedTypes.indexOf(type) === -1) {
            throw new Error('unsupported measure')
        }
    }

    function cleanMissingData(missingElements, data) {
        var missingEntries = prod.apply(this, missingElements)
            .map(function(indices){
                return indices.some(function(missing){
                    return missing
                })
            })

        return data.filter(function(d,i){
            return !missingEntries[i]
        })
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

    function Measure(type, dimensions, validData, rawData) {
        this.type = type
        this.dimensions = dimensions
        this.rawData = rawData
        this.cube = validData
    }

    Measure.prototype.transform = function(target, spec){
        var original = this.dimensions[target]
        var transformed = original.applyTransform(spec)
        this.dimensions[target] = transformed
        // update the cube and valid cube. 'raw' is misleading
        // fill a cube with new shape, in new order
        var subscripts = this.dimensions.map(function(dim){
            return dim.subscripts
        })
        subscripts[target] = transformed.targetPermutation
        var getThese = prod.apply(this, subscripts)
        var newShape = subscripts.map(function(d){ return d.length })
        var newComplete = scratch.malloc(newShape)
        newComplete.data = getThese.map(function(d){
            return this.rawData.get.apply(this.rawData, d)
        }, this)
        // now do it for the validcube
        subscripts = this.dimensions.map(function(dim){
            return dim.validSubscripts
        })
        newShape = subscripts.map(function(d){ return d.length })
        getThese = prod.apply(this, subscripts)
        var newValid = scratch.malloc(newShape)

        newValid.data = getThese.map(function(d){
            return newComplete.get.apply(newComplete, d)
        })
        this.rawData = newComplete
        this.cube = newValid
    }

    Object.defineProperties(Measure.prototype, {
        validShape : {
            get : function() {
                return this.dimensions.map(function(d) {
                    return d.validLength
                })
            }
        }

        , shape : {
            get : function() {
                return this.dimensions.map(function(d) {
                    return d.length
                })
            }

        }

        , slices : {
            get : function() {
                var slicedDimension = _.first(this.dimensions)
                    , sliceDimensions = _.rest(this.dimensions)
                    , sliceShape = sliceDimensions.map(function(d) {
                        return d.length
                    })
                    , sliceValidShape = sliceDimensions.map(function(d) {
                        return d.validLength
                    })
                    , sliceMissings = sliceDimensions.map(function(d) {
                        return d.missing
                    })
                    , slicedLength = slicedDimension.length
                    , type = this.type
                    , rawData = this.rawData
                    ;

                return this._slices || (this._slices = _.range(0, slicedLength).map(function(sliceIndex) {
                    slicedDimension
                    unpack
                    var rawSlice = scratch.clone(rawData.lo(sliceIndex).hi(1).pick(0))
                        , clone = [].slice.call(rawSlice.data)
                        , validData = cleanMissingData(sliceMissings, clone)
                        ;

                    scratch.free(rawSlice)

                    return new Measure(
                        type
                        , sliceDimensions
                        , ndarray(validData, sliceValidShape)
                        , ndarray(clone, sliceShape)
                    )
                }))
            }
        }
    })

    return {
        fromData : function(config) {
            var validData
                , meta
                ;

            config = config || {}
            assertType(config.type)

            meta = config.meta
            validData = cleanMissingData(meta.missing, config.data)

            return new Measure(
                config.type
                , meta.dimensions
                , ndarray(validData, meta.validShape)
                , ndarray(config.data, meta.shape))
        }
    }
}
