'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , fixtures = require('./fixtures')
    ;

describe('Cube Multitable query builder', function(){
    function buildModule() {
        var mod = mainMod()
            ;
        mod.factory('iResourceVariable', function($q) {
            return function(resourceThis){
                var result = $q.when({id: resourceThis.variableId})
                return result
            }
        })
        angular.mock.module(mod.name)
    }

    function createDeps() {
        inject(function($rootScope) {
            scope = $rootScope.$new()
        })
    }
    var sut
        ,scope
        ,result
    ;
    beforeEach(buildModule)
    beforeEach(createDeps)

    describe('given two column variables objects and a row variable', function(){
        beforeEach(function(){
            inject(function(cubeMultitableQuery){
                sut = cubeMultitableQuery.build([
                        {variable: '/api/datasets/123/variables/admit'}
                        , {variable: '/api/datasets/123/variables/gender'}
                ], {self: '/api/datasets/123/variables/age/', type: 'categorical'})
                .then(function(theQuery){
                    result = theQuery
                })
            })
            scope.$digest()
        })
        it('should build a query with them', function(){
            result.should.eql(fixtures.multitable_query)
        })
        it('should contain array of two variables in the \'args\' object', function(){
            result.args.should.eql(fixtures.multitable_query.args)
        })
        it('should contain row variable within the \'block\' object', function(){
            result.block.args.should.eql(fixtures.multitable_query.block.args)
        })
    })
})
