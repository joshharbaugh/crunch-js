'use strict'

require('angular-mocks')

var mainMod = require('../index'),
    cubeMod = require('../../cube'),
    multifixture = require('../../cube/tests/basic-categorical-multi'),
    ops = require('ndarray-ops'),
    unpack = require('ndarray-unpack');

describe('cube', function() {
    function buildModule() {
        var mod = mainMod(),
            cube = cubeMod('cube.test');
        mod.factory('iResourceVariable', function($q) {
            return function(resourceThis) {
                var result = $q.when({
                    id: resourceThis.variableId
                })
                return result
            }
        })
        mod.factory('labelFormatter', function() {
            return function() {
                return ['President Obama', 'Republicans in Congress', 'Both', 'Neither', 'Not sure']
            }
        })
        angular.mock.module(mod.name, cube.name)
    }

    function createDeps() {
        inject(function($rootScope) {
            scope = $rootScope.$new()
        })
    }

    function buildSut() {
        angular.mock.inject(function(MultiTable) {
            Sut = MultiTable
        })
    }

    function flush() {
        angular.mock.inject(function($rootScope) {
            $rootScope.$digest()
        })
    }
    var Sut, sut, scope, settings;
    beforeEach(buildModule)
    beforeEach(buildSut)
    beforeEach(createDeps)

    context('with a array cube of one cat. by two different cat.', function() {
        beforeEach(function() {
            settings = {
                countsOrPercents: {
                    value: 'percent'
                },
                sortSource: 'labels',
                sortDirection: -1
            }

            angular.mock.inject(function($q, cube) {
                var columns = ['/api/datasets/123/variables/abc/']
                    // columns should be like a VariableList

                cube.fromMultiCube(multifixture.value).then(function(it) {
                    sut = Sut.create({
                        columns: columns,
                        result: it
                    })
                })
                flush()
            })
            sut.then(function(it) {
                it.display(settings).then(function(inner) {
                    scope.xtabs = inner
                })
            })

            flush()
        })
        it('should display things', function() {
            // console.log(JSON.stringify(scope.xtabs), null, 2)
            var the = scope.xtabs
            the.rows.should.be.ok
            the.subtables.should.be.ok
            the.colLabels.should.eql(
                [{
                    "value": "All"
                }, {
                    "value": "18-29",
                    "class": "col-0"
                }, {
                    "value": "30-44",
                    "class": "col-1"
                }, {
                    "value": "45-64",
                    "class": "col-2"
                }, {
                    "value": "65+",
                    "class": "col-3"
                }])
            the.spans.should.eql([4])
            the.rowLabels.should.eql(
                [{
                   "value": "Both",
                   "class": "row-label"
               }, {
                   "value": "Neither",
                   "class": "row-label"
               }, {
                   "value": "Not sure",
                   "class": "row-label"
               }, {
                   "value": "President Obama",
                   "class": "row-label"
               }, {
                   "value": "Republicans in Congress",
                   "class": "row-label"
               }]
            )
        })
    })


})
