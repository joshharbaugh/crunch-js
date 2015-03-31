'use strict'

module.exports = MeasureFactory

MeasureFactory.$inject = [
    'lodash'
    , 'ndarray'
]

function MeasureFactory(_, ndarray) {
    var allowedTypes = ['mean', 'stddev', 'count']
        ;

    function assertType(type) {
        if(allowedTypes.indexOf(type) === -1) {
            throw new Error('unsupported measure')
        }
    }

    function Measure(config) {
        var dimensions = config.meta.dimensions
            , missing = config.meta.missing
            , shape = config.meta.shape
            , validShape = config.meta.validShape
            , type = config.type
            , data = config.data
            , isMissing
            , validData
        isMissing = prod.apply(this, missing)
        .map(function(indices){
            return indices.some(function(missing){
                return missing
            })
        })

        validData = data.filter(function(d,i){
            return !isMissing[i]
        })

        this.dimensions = dimensions
        this.type = type
        this.rawData = ndarray(data, shape)

        this.cube = ndarray(validData, validShape)
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
    return {
        fromData : function(config) {
            config = config || {}
            assertType(config.type)

            return new Measure(config)
        }
    }
}
