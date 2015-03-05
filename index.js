'use strict'

var shojiModule = require('./lib/shoji/index'),
    hierarchicalVariablesMod = require('./lib/hierarchical-variables/index'),
    datasetContextMod = require('./lib/dataset-context/index'),
    resourcesMod = require('./lib/resources/index')
    ;

var hv = hierarchicalVariablesMod(),
    datasetContext = datasetContextMod(),
    resources = resourcesMod(),
    shoji = shojiModule()

