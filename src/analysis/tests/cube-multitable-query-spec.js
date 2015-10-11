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
            inject(function($q, cubeMultitableQuery){
                sut = cubeMultitableQuery.build([
                        {self: '/api/datasets/123/variables/admit'}
                        , {self: '/api/datasets/123/variables/gender'}
                ], {self: '/api/datasets/123/variables/age/', type: 'categorical'})

                $q.all(sut).then(function(theQuery){
                    result = theQuery
                })
            })
            scope.$digest()
        })
        it('should build a query with them', function(){
            result.multi.should.eql(fixtures.multitable_query)
        })
        it('should contain array of two variables in the \'args\' object', function(){
            result.multi.args.should.eql(fixtures.multitable_query.args)
        })
        it('should contain row variable within the \'block\' object', function(){
            result.multi.block.args.should.eql(fixtures.multitable_query.block.args)
        })
        it('should have a `row` member', function(){
            result.row.should.be.ok
        })
    })
})
