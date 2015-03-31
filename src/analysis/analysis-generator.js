'use strict'

module.exports = AnalysisGeneratorFactory

AnalysisGeneratorFactory.$inject = []

function AnalysisGeneratorFactory() {

    function AnalysisGenerator() {

    }

    AnalysisGenerator.prototype.generate = function(params) {
        var current = this
            ;

        do {
            if(current.accepts(params)) {
                return current.execute(params)
            }

            current = current.next
        } while(current)

        throw new Error('request could not be handled')
    }

    AnalysisGenerator.prototype.accepts = function() {
        return false
    }

    AnalysisGenerator.prototype.execute = function() {
        throw new Error('not implemented')
    }

    Object.defineProperties(AnalysisGenerator.prototype, {
        'next' : {
            set : function(value) {
                if(!(value instanceof AnalysisGenerator)) {
                    throw new Error('generator doesn\'t conform with interface')
                }

                this._next = value
            }

            , get : function() {
                return this._next
            }
        }
    })

    return new AnalysisGenerator()
}
