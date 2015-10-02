'use strict'

module.exports = iGenerateMultitableFromCube

iGenerateMultitableFromCube.$inject = [
    'lodash'
    , '$q'
    , 'analysisGenerator'
    , 'cube'
    , 'cubeMultitableQuery'
    , 'iFetchCubes'
]

function iGenerateMultitableFromCube(_
    , $q
    , analysisGenerator
    , Cube
    , cubeMultitableQuery
    , iFetchCubes) {

    function assertVariables(params) {
        if(!_.isObject(params) || !_.isArray(params.multitable_variables)) {
            throw new Error('provide an array of variables')
        }
    }

    function getXtabFromCube(params){

        function buildQuery(params){
            return cubeMultitableQuery.build(
                params.multitable_variables.valueOf()
                , params.row_variable.valueOf()
            )
        }
        function fetchCube(q){
            return iFetchCubes({
                query: q
                , datasetId: params.datasetId
            })
        }
        function whaamCube(crunchCube){
            return Cube.fromMultiCube(crunchCube)
        }

        var handlers = [
            buildQuery
            , fetchCube
            , whaamCube
        ]

        return handlers.reduce($q.when, params)
    }

    var iGenerateMultitableFromCube = Object.create(analysisGenerator)

    iGenerateMultitableFromCube.accepts = function(params) {
        return params && params.multitable_variables && params.row_variable
    }

    iGenerateMultitableFromCube.execute = function(params) {
        params.multitable_variables = params.multitable_variables.valueOf()
        params.row_variable = params.row_variable.valueOf()
        assertVariables(params)
        return getXtabFromCube(params)
        .then(function(result){
            return {cube: result, columns: params.multitable_variables}
        })
    }

    return iGenerateMultitableFromCube
}
