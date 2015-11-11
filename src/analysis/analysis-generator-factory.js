'use strict'

module.exports = AnalysisGeneratorFactory

AnalysisGeneratorFactory.$inject = [
    'lodash'
    , 'iGenerateAnalysisFromCube'
    , 'iGenerateAnalysisFromSaved'
    , 'iGenerateAnalysisFromPublicAnalysis'
]

function AnalysisGeneratorFactory(_
    , iGenerateAnalysisFromCube
    , iGenerateAnalysisFromSaved
    , iGenerateAnalysisFromPublicAnalysis) {

    return {
        getGenerator : function(params) {
            var first = iGenerateAnalysisFromSaved
                ;

            iGenerateAnalysisFromSaved.next = iGenerateAnalysisFromCube
            iGenerateAnalysisFromCube.next = iGenerateAnalysisFromPublicAnalysis

            return _.partial(first.generate.bind(first), params)
        }
    }
}
