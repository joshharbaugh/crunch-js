'use strict';

module.exports = CubeMultitableQuery

CubeMultitableQuery.$inject = [
    'lodash'
    ,'$q'
]
function CubeMultitableQuery(_, $q){
    function build(multitable_variables, row_variable, measures){
        var types = {}
        measures = measures || {"count": {"function": "cube_count", "args": []}}

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

        return $q.when({
            'function': 'each',
            'args': [{
                'value': 'COLS'
            }, multitable_variables],
            'block': {
                'function': 'cube',
                'args': [
                    [
                        types[row_variable.type](row_variable),
                        {'variable': 'COLS'}
                    ],
                    {
                        "map": measures
                    },
                    {
                        "value": null
                    }
                ]
            }
        })
    }
    return {
        build: build
    }
}
