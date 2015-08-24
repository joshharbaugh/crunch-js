'use strict'

module.exports = AnalysisFactory

AnalysisFactory.$inject = [
    'lodash'
    , '$q'
    , 'machina'
    , 'VariableList'
    , 'MeasureList'
    , 'analysisGeneratorFactory'
]

function AnalysisFactory(_
    , $q
    , machina
    , VariableList
    , MeasureList
    , analysisGeneratorFactory ) {

    function hasSlideId(params) {
        return _.isString(params.slideId)
    }

    function assertDatasetId(cfg) {
        if(!cfg.datasetId) {
            throw new Error('please provide a valid datasetId')
        }
    }

    function assertSlideId(cfg) {
        if(!_.isString(cfg.slideId)) {
            throw new Error('please provide a valid slideId')
        }
    }

    var analysisOperations = {

        'add-variable' : function(variableId) {
            this.variables.add(variableId).then(function() {
                this.recalculate()
            }.bind(this))
        }

        , clean : function() {
            this.variables.clean()
            delete this.data
            this.transition('empty')
        }

        , 'remove-variable' : function(i, avoidRecalculate) {
            this.variables.remove(_.isString(i) ? this.variables.indexOf(i) : i)

            if(this.variables.isEmpty()) {
                delete this.data
                this.transition('empty')
            } else {
                if(!avoidRecalculate) {
                    this.recalculate()
                }
            }
        }

        , 'replace-variable' : function(index, variableId) {
            this.variables
                .replace(index, variableId)
                .then(this.recalculate.bind(this))
        }

        , 'insert-before' : function(index, variableId) {
            this.variables
                .insertBefore(index, variableId)
                .then(this.recalculate.bind(this))
        }

        , pivot : function() {
            this.variables.pivot()
            this.recalculate()
        }

        , 'recalculate' : function() {
            this.recalculate()
        }

        , 'measures-mean': function(variableId) {
            this.measures.add('mean', variableId).then(function() {
                this.recalculate()
            }.bind(this))
        }

        , 'measures-count': function(){
            this.measures.clean()
        }
    }

    var Analysis = machina.Fsm.extend({
        namespace : 'analysis'
        , initialState : 'uninitialized'
        , recalculate : function() {
            var generate = analysisGeneratorFactory.getGenerator({
                    datasetId : this.datasetId
                    , variables : this.variables
                    , measures: this.measures
                    , currentData : this.data
                })
                , self = this
                ;

            self.transition('loading')

            try {
                generate()
                .then(function(data) {
                    self.data = data
                    self.transition('loaded')
                })
                .catch(function() {
                    self.transition('error')
                })
            } catch(e) {
                self.transition('error')
            }
        }

        , isUnivariate : function() {
            return this.variables.count() === 1 && !this.variables.hasArrays()
        }

        , isBivariate : function() {
            return this.variables.count() === 2 && !this.variables.hasArrays()
        }

        , isEmpty : function() {
            return this.variables.count() === 0
        }

        , hasMeanMeasure : function() {
            return this.measures.hasMeasure('mean')
        }

        , hasArrayVariables : function() {
            return this.variables.hasArrays()
        }

        , hasBinnedRows : function() {
            return this.variables.at(0).type === 'numeric'
        }

        , destroy : function() {
            this.off()
        }

        , states : {
            uninitialized : {
                initialize : function(params) {
                    assertDatasetId(params)
                    this.datasetId = params.datasetId
                    this.variables = new VariableList(params.datasetId)
                    this.measures = new MeasureList(params.datasetId)
                    this.transition('empty')
                }
            }

            , empty : {
                _onEnter : function(){
                    this.measures.clean()
                }
                ,'add-variable' : function(variableId) {
                    this.variables.add(variableId).then(function() {
                        this.recalculate()
                    }.bind(this))
                }
                , 'insert-before' : function(index, variableId) {
                    this.variables
                        .insertBefore(index, variableId)
                        .then(this.recalculate.bind(this))
                }
                ,'measures-mean': function(variableId) {
                    this.measures.add('mean', variableId).then(function() {
                        this.recalculate()
                    }.bind(this))
                }
                ,'measures-count': function(){
                    this.measures.clean()
                }
            }
            , loading : {
                _onEnter : function() {
                    this.emit('analysis.loading')
                }
            }

            , error : _.extend({
                _onEnter : function() {
                    this.emit('analysis.error')
                }
            }, analysisOperations)

            , loaded : _.extend({
                 _onEnter : function() {
                    this.emit('analysis.loaded', this.data)
                }
            }, analysisOperations)
        }
    })

    Object.defineProperties(Analysis.prototype, {
        graphType : {
            get : function() {
                var variableTypes
                    , graphType = 'barchart'
                    ;

                if(this.hasMeanMeasure()) {
                    graphType = 'dotplot'
                } else {
                    variableTypes = this.variables.items.map(function(v) {
                        return v.type
                    })


                    variableTypes.forEach(function(t, i){
                        if(t === "numeric" && i === 0){
                            graphType = "histogram"
                        } else if (t === "datetime" && i === 1){
                            graphType = "timeplot"
                        }
                    })
                }

                return graphType
            }
        }

        , categoricalArray : {
            get : function() {
                var catArray = null
                    ;

                this.variables.items.some(function(v) {
                    var array = v.type === 'categorical_array'
                        ;

                    if(array) {
                        catArray = v
                    }

                    return array
                })

                return catArray
            }
        }

        , scalarVariable : {
            get : function() {
                var scalarFound = null
                    ;

                this.variables.items.some(function(v) {
                    var scalar = v.type !== 'categorical_array'
                        ;

                    if(scalar) {
                        scalarFound = v
                    }

                    return scalar
                })

                return scalarFound
            }
        }

        , topMostVariable : {
            get : function() {
                var varb
                    ;

                switch(this.variablesCount) {
                    case 1:
                    case 3:
                        varb = this.variables.at(0)
                        break
                    case 2:
                        varb = this.variables.at(1)
                        break
                    default:
                        varb = null
                }

                return varb
            }
        }

        , dimension : {
            get : function() {
                return this.data && this.data.cube.dimension
            }
        }

        , variablesCount : {
            get : function() {
                return this.variables.count()
            }
        }

        , displaySettings : {
            get : function() {
                return this.data &&
                       this.data.analysis &&
                       this.data.analysis.display_settings
            }
        }
    })

    var SavedAnalysis = Analysis.extend({
        states : {
            uninitialized : {
                initialize : function(params) {
                    assertDatasetId(params)
                    assertSlideId(params)

                    this.datasetId = params.datasetId
                    this.slideId = params.slideId
                    this.analysis = params.analysis || null
                    this.savedSettings = null
                    this.variables = new VariableList(params.datasetId)
                    this.measures = new MeasureList(params.datasetId)

                    this.transition('empty')
                }
            }

            , empty : {
                load : function() {
                    var generate
                        , self = this
                        ;

                    generate = analysisGeneratorFactory.getGenerator({
                        datasetId : self.datasetId
                        , slideId : self.slideId
                        , analysis : self.analysis
                    })

                    self.transition('loading')

                    generate()
                    .then(function(data) {
                        var promises = []
                            ;

                        self.data = data
                        promises.push(self.variables.add(data.variables))

                        if (data.measureVariables){
                            promises.push(self.measures.add("mean", data.measureVariables))
                        }

                        return $q.all(promises)
                    })
                    .then(function() {
                        self.emit('savedAnalysis.loaded', self.data)
                        self.transition('loaded')
                    })
                    .catch(function() {
                        self.transition('error')
                    })
                }
            }
        }
    })

    return {
        create : function(cfg) {
            var analysis
                ;

            cfg = cfg || {}

            analysis = hasSlideId(cfg) ? new SavedAnalysis() : new Analysis()
            analysis.handle('initialize', cfg)

            return analysis
        }
    }
}
