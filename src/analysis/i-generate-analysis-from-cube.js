'use strict'

module.exports = IGenerateAnalysisFromCube

IGenerateAnalysisFromCube.$inject = [
    'lodash'
    , '$q'
    , 'analysisGenerator'
    , 'cube'
    , 'cubeQuery'
    , 'iFetchCubes'
]

function IGenerateAnalysisFromCube(_
    , $q
    , analysisGenerator
    , Cube
    , cubeQuery
    , iFetchCubes) {

    function assertVariables(params) {
        if(!_.isObject(params) || !_.isArray(params.variables)) {
            throw new Error('provide an array of variables')
        }
    }

    function getXtabFromCube(params){

        function buildQuery(params){
            // inconsistent here; measures valueOf is serialized
            // but variables is an array of its 'items'
            var measures = params.measures.valueOf() || {}
            return cubeQuery.build(
                params.variables.valueOf()
                ,measures
            )
        }
        function fetchCube(q){
            return iFetchCubes({
                query: q
                ,datasetId: params.datasetId
            })
        }
        function whaamCube(crunchCube){
            return Cube.fromCrCube(crunchCube)
        }

        var handlers = [
            buildQuery
            ,fetchCube
            ,whaamCube
        ]

        return handlers.reduce($q.when, params)
    }

    var iGenerateAnalysisFromCube = Object.create(analysisGenerator)

    iGenerateAnalysisFromCube.accepts = function(params) {
        return params && params.variables && params.measures
    }

    iGenerateAnalysisFromCube.execute = function(params) {
        params.variables = params.variables.valueOf()
        assertVariables(params)
        return getXtabFromCube(params)
        .then(function(result){
            return {cube: result}
        })
    }

    return iGenerateAnalysisFromCube
}
