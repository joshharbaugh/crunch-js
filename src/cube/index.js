'use strict';
module.exports = buildModule

function buildModule(moduleName) {
    var angular = require('angular')
        ,ndarray = require('ndarray')
        ,ops = require('ndarray-ops')
        ,cwise = require('cwise')
        ,show = require('ndarray-show')
        ,unpack = require('ndarray-unpack')
        ,pack = require('ndarray-pack')
        ,zeros = require('zeros')
        ,scratch = require('ndarray-scratch')
        ,fill = require('ndarray-fill')
        ,normalDist = require('gaussian')
        ,ndgemm = require('ndgemm')
        ,_ = require('lodash')
    ;
    moduleName = moduleName || 'cube';
    var mod = angular.module(moduleName, [])

    mod.factory('ndarray', function(){
        return ndarray
    })
    mod.factory('ndarrayOps', function() {
        return ops
    })
    mod.factory('cwise', function() {
        return cwise
    })
    mod.factory('lodash', function() {
        return _
    })
    mod.factory('show', function(){
        return show
    })
    mod.factory('ndarrayUnpack', function(){
        return unpack
    })
    mod.factory('ndarrayPack', function() {
        return pack
    })
    mod.factory('zeros', function(){
        return zeros
    })
    mod.factory('ndarrayScratch', function(){
        return scratch
    })
    mod.factory('ndarrayFill', function(){
        return fill
    })
    mod.factory('ndgemm', function(){
        return ndgemm
    })
    mod.factory('normalDist', function(){
        return normalDist
    })

    mod.factory('dimension', require('./dimension'))
    mod.factory('CategoricalDimension', require('./categorical-dimension'))
    mod.factory('BinnedDimension', require('./binned-dimension'))
    mod.factory('CompositeDimension', require('./composite-dimension'))
    mod.factory('MultiResponseDimension', require('./multi-response-dimension'))
    mod.factory('measure', require('./measure'))
    mod.factory('cube', require('./cube'))
    mod.factory('crFindVariables', require('./cr-find-variables'))
    mod.factory('iXtabCubes', require('./i-xtab-cubes'))
    mod.factory('displayCube', require('./display-cube'))
    mod.factory('stats', require('./stats'))
    mod.factory('Tabulated', require('./tabulated'))
    return mod
}
