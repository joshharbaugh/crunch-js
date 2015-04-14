'use strict'

module.exports = DimensionFactory

DimensionFactory.$inject = [
    'lodash'
    , 'CategoricalDimension'
    , 'BinnedDimension'
    , 'CompositeDimension'
    , 'MultiResponseDimension'
]

function DimensionFactory(_
    , CategoricalDimension
    , BinnedDimension
    , CompositeDimension
    , MultiResponseDimension) {

    function assertBasicDimensionStructure(data) {
        assertProperties(data, 'derived', 'references', 'type')
    }

    function isCategoricalDimension(data) {
        var type = data.type
            ;

        return type.hasOwnProperty('categories') && type.categories.every(function(cat) {
            return assertProperties(cat, 'id', 'missing', 'name', 'numeric_value', true)
        })
    }

    function isBinnedDimension(data) {
        var type = data.type
            ;

        return type.hasOwnProperty('elements') && type.elements.every(function(el) {
            return assertProperties(el, 'id', 'missing', 'value', true) &&
            !assertProperties(el.value, 'references', 'type', 'id', true)
        })
    }

    function isMultiResponseDimension(data) {
        var type = data.type
            , hasElements = type.hasOwnProperty('elements')
            , hasProps = hasElements && type.elements.every(function(el) {
                return assertProperties(el, 'id', 'missing', 'value', true)
            })
            , hasAnyAndNone = hasProps && type.elements.filter(function(el) {
                return el.value && (el.value.id === '__none__' || el.value.id === '__any__')
            }).length === 2
            ;

        return hasAnyAndNone
    }

    function isCategoricalArrayDimension(data) {
        var type = data.type
            , hasElements = type.hasOwnProperty('elements')
            , hasProps = hasElements && type.elements.every(function(el) {
                return assertProperties(el, 'id', 'missing', 'value', true) &&
                isCategoricalDimension(el.value)
            })
            ;

        return hasProps
    }

    function assertProperties(object) {
        var properties = Array.prototype.slice.call(arguments, 1)
            , silent = properties.pop()
            ;

        return properties.every(function(prop) {
            return assertProperty(object, prop, silent)
        })
    }

    function assertProperty(object, property, silent) {
        var has = object.hasOwnProperty(property)

        if(!has && !silent) {
            throw new Error('Object should have property ' + property)
        }

        return has
    }

    function AggregateDimension(data) {
        this.data = data
    }

    Object.defineProperties(AggregateDimension.prototype, {
        length : { value : 1}
        , validSubscripts : { value: [0] }
        , validLength : { value : 1}

        , missing : { value : [false] }

        , labels : {
            get : function() {
                return [this.data.name]
            }
        }
    })

    return {
        fromData : function(data) {
            var dimension
                ;

            assertBasicDimensionStructure(data)

            if(isCategoricalDimension(data)) {
                dimension = new CategoricalDimension(data)
            } else if(isBinnedDimension(data)) {
                dimension = new BinnedDimension(data)
            } else if(isMultiResponseDimension(data)) {
                dimension = new MultiResponseDimension(data)
            } else if(isCategoricalArrayDimension(data)) {
                dimension = new CompositeDimension(data)
            }

            dimension.reference = data.references.name

            return dimension
        }

        , aggregateDimension : function(name) {
            return new AggregateDimension({ name : name })
        }
    }
}
