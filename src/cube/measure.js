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
    function prod() { // avoid circular dependency
        return _.reduce(arguments, function(a, b) {
            return _.flatten(_.map(a, function(x) {
                return _.map(b, function(y) {
                    return x.concat([y])
                })
            }), true)
        }, [ [] ])
    }
    return {
        fromData : function(config) {
            config = config || {}
            assertType(config.type)

            return new Measure(config)
        }
    }
}
