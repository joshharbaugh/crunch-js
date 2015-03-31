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
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/') {
                variableId = variableId.substring(0, variableId.length - 1)
            }
            return {variable: variableId}
        }
        types.categorical_array = function(varb){

            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/'){
                variableId = variableId.substring(0, variableId.length - 1)
            }

            var d = {}
            d[varb.dimension] = variableId
            return d
        }
        types.numeric = function(varb){
            //TODO allow a unique-values query instead,
            //inspecting some config on the varb
            //TODO bin 'breaks' arg??
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/'){
                variableId = variableId.substring(0, variableId.length - 1)
            }

            return {'function': 'bin', 'args': [{'variable': variableId}]}
        }
        types.text = function(varb){
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/'){
                variableId = variableId.substring(0, variableId.length - 1)
            }
            return {variable: variableId}
        }
        types.datetime = function(varb){
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/'){
                variableId = variableId.substring(0, variableId.length - 1)
            }
            var res = varb.view.rollup_resolution || NULL;
            var sanitizedRollup = res === "" ? NULL : res

            return {'function': 'rollup',
                'args': [
                    {'variable': variableId}
                    ,{'value': sanitizedRollup}
                ]}
        }
        types.multiple_response = function(varb){

            // TODO: push this into crlib/backendhttp??
            var variableId = varb.self
            if (variableId[variableId.length - 1] === '/'){
                variableId = variableId.substring(0, variableId.length - 1)
            }

           return [
                {'function': 'selected_array',
                    'args': [{'variable': variableId}]}
                ,{'each': variableId}
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
