'use strict';

module.exports = CubeQuery

CubeQuery.$inject = [
    'lodash'
    ,'$q'
]
function CubeQuery(_, $q){
    function build(variables, measures){
        var types = {}
        measures = measures || {"count": {"function": "cube_count"}}

        types.categorical = function(varb){
            return {variable: varb.self }
        }
        types.categorical_array = function(varb){
            var d = {}
            d[varb.dimension] = varb.self
            return d
        }
        types.numeric = function(varb){
            //TODO allow a unique-values query instead,
            //inspecting some config on the varb
            //TODO bin 'breaks' arg??
            return {'function': 'bin', 'args': [{ 'variable': varb.self }] }
        }
        types.text = function(varb){
            return {variable: varb.self}
        }
        types.datetime = function(varb){
            var res = varb.view.rollup_resolution || null;
            var sanitizedRollup = res === "" ? null : res

            return {'function': 'rollup',
                'args': [
                    {'variable': varb.self }
                    ,{'value': sanitizedRollup}
                ]}
        }
        types.multiple_response = function(varb){

           return [
                {'function': 'selected_array',
                    'args': [ {'variable': varb.self } ] }
                , { 'each': varb.self }
            ]
        }

        var dimensions = _.flatten(variables.map(function(varb){
                return types[varb.type](varb)
            }, this), true)
        if(!!measures.mean && variables.length > 1){
            delete measures.stddev
        }
        return $q.when({
            dimensions: dimensions
            , measures: measures
        })
    }
    return {
        build: build
    }
}
