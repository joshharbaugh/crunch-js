'use strict'

module.exports = buildModule

function buildModule(moduleName, cfg) {
    var angular = require('angular')
        , mod = angular.module(moduleName || 'analysis', [])
        ;

    mod.factory('lodash', function() {
        return require('lodash')
    })

    mod.factory('analysisGenerator', require('./analysis-generator'))
    mod.factory('iGenerateAnalysisFromCube', require('./i-generate-analysis-from-cube'))
    mod.factory('iGenerateAnalysisFromSaved', require('./i-generate-analysis-from-saved-analysis'))
    mod.factory('iGenerateMultitableFromCube', require('./i-generate-multitable-from-cube'))
    mod.factory('analysisGeneratorFactory', require('./analysis-generator-factory'))

    mod.factory('cubeQuery', require('./cube-query'))
    mod.factory('cubeMultitableQuery', require('./cube-multitable-query'))
    mod.factory('iFetchCubes', require('./i-fetch-cubes'))

    mod.factory('VariableList', require('./variable-list'))
    mod.factory('MeasureList', require('./measure-list'))
    mod.factory('Analysis', require('./analysis'))

    return mod
}
