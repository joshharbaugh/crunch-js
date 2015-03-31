'use strict'

module.exports = MeasureListFactory

MeasureListFactory.$inject = [
    'lodash'
    , '$q'
    , 'cachedHierarchicalVariables'
]

function MeasureListFactory(_, $q, cachedHierarchicalVariables) {

    function assertDatasetId(datasetId) {
        if(!datasetId) {
            throw new Error('datasetId is required by the measure list')
        }
    }

    function MeasureList(datasetId) {
        assertDatasetId(datasetId)
        this.datasetId = datasetId
        this.measures = {}
    }

    function serialize (variables, measure) {
        return {
            "function": "cube_" + measure
            , args: _.map(variables, function(variable) {
                return { variable: variable.self }
            })
        }
    }

    MeasureList.prototype.add = function(type, variableId) {
        var measure = this.measures[type] || {}
            , promise
            , variable
            , self = this
            ;

        if(!measure.hasOwnProperty(variableId)) {
            measure = {}
            variable = cachedHierarchicalVariables.current.byId(variableId)

            //subvariable checking
            if(variable.contains(variableId)) {
                promise = variable.getSubvariables().then(function(varInfo) {
                    measure[variableId] = varInfo
                    self.measures[type] = measure
                })
            } else {
                measure[variableId] = variable
                self.measures[type] = measure
                promise = $.when(measure[variableId])
            }
        } else {
            promise = $q.when(measure[variableId])
        }

        return promise
    }

    MeasureList.prototype.hasMeasure = function(measure) {
        return _.isObject(this.measures[measure]) && Object.keys(this.measures[measure]).length > 0
    }

    MeasureList.prototype.getMeasureVariable = function(type, index) {
        var measure = this.measures[type] || {}
            , key = Object.keys(measure)[index]
            ;

        return measure[key]
    }

    MeasureList.prototype.clean = function() {
        this.measures = {}
    }

    MeasureList.prototype.valueOf = function() {
        var measures = _.cloneDeep(this.measures)
            ;

        if(Object.keys(measures).length === 0) {
            measures.count = {}
        }

        //If there is mean, there is stddev
        if(measures.hasOwnProperty('mean')) {
            measures.stddev = measures.mean
        }

        return _.mapValues(measures, serialize)
    }

    MeasureList.prototype.toJSON = function() {
        return this.valueOf()
    }

    return MeasureList
}
