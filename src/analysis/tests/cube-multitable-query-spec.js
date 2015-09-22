'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , fixtures = require('./fixtures')
    ;

describe('Cube query builder', function(){
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

    describe('given two categorical variables objects', function(){
        beforeEach(function(){
            inject(function(cubeMultitableQuery){
                sut = cubeMultitableQuery.build([
                        {variable: '/api/datasets/123/variables/admit/'}
                        , {variable: '/api/datasets/123/variables/gender/'}
                ])
                .then(function(theQuery){
                    result = theQuery
                })
            })
            scope.$digest()
        })
        it('should make a query with them as the dimensions', function(){
            console.log(result)
            result.dimensions.should.eql(fixtures.query.dimensions)
        })
        it('should have a `count` measure', function(){
            result.measures.should.eql(fixtures.query.measures)
        })
    })
    // describe('given a multiple response objects', function(){
    //     beforeEach(function(){
    //         inject(function(cubeMultitableQuery){
    //             sut = cubeMultitableQuery.build([
    //                     {self: '/api/datasets/123/variables/gender/', type: 'multiple_response'}
    //             ])
    //             .then(function(theQuery){
    //                 result = theQuery
    //             })
    //         })
    //         scope.$digest()
    //     })
    //     it('should make a query with them as the dimensions', function(){
    //         var expected = [
    //             {function: 'selected_array', args: [{variable: '/api/datasets/123/variables/gender'}]}
    //             ,{each: '/api/datasets/123/variables/gender'}
    //         ]
    //         result.dimensions.should.eql(expected)
    //     })
    //     it('should have a `count` measure', function(){
    //         result.measures.should.eql(fixtures.query.measures)
    //     })
    // })
    // describe('given a numeric one', function(){
    //     beforeEach(function(){
    //         inject(function(cubeMultitableQuery){
    //             sut = cubeMultitableQuery.build([
    //                     {self: '/api/datasets/123/variables/age/', type: 'numeric'}
    //             ])
    //             .then(function(theQuery){
    //                 result = theQuery
    //             })
    //         })
    //         scope.$digest()
    //     })
    //     it('should bin by default', function(){
    //         var expected = [
    //             {function: 'bin', args: [{variable: '/api/datasets/123/variables/age'}]}
    //         ]
    //         result.dimensions.should.eql(expected)
    //     })
    // })
})
