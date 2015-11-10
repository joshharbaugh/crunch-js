'use strict';

var mainModule = require('..')
    ,mocks = require('angular-mocks')
    ,machina = require('../../machina-angular')
    ,MockMachine = require('../../test-support/mock-machine')
    ,shojiMod = require('../../shoji/index')
    ,mockBus = require('../../test-support/mock-bus')
    ;

describe('HierarchicalVariable',function(){
    beforeEach(function(){
        var mod = mainModule()

        angular.mock.module(mod.name)
    })

    var variable
        , $httpBackend
        , $q
        ;
    function buildModule() {
        var mod = mainModule()
        machina('machina.test')
        shojiMod('shoji.hierarchical-variables')

        mod.factory('bus', function() {
            return mockBus()
        })

        angular.mock.module(mod.name,
            'machina.test',
            'shoji.hierarchical-variables')
    }

    function flush() {
        inject(function($rootScope) {
            $rootScope.$digest()
        })
    }

    describe('Given an array variable',function(){
        beforeEach(function(){
            buildModule()
            inject(function (_$httpBackend_, _$q_) {
                $httpBackend = _$httpBackend_
                $q = _$q_
            })
            // Fetches subvariables
            $httpBackend.expectGET('/url/to/subvariables/catalog/').
                respond(200, {
                    'element': 'shoji:catalog',
                    'self': '/url/to/subvariables/catalog/',
                    'description': 'subvariables catalog',
                    'index': {
                        '/leadershipbiden': {
                            'name': 'Biden'
                        }
                        , '/leadershipobama': {
                            'name': 'Obama'
                        }
                        , '/leadershipclinton': {
                            'name': 'Clinton'
                        }
                    }
            })
        })
        beforeEach(function(){
            inject(function(HierarchicalVariable){
                var cfg = {
                    variable: {
                        self: '/leadershipMatrix'
                        ,name: 'leadership'
                        ,type: 'categorical_array'
                        ,subvariables: [
                            '/leadershipbiden'
                            ,'/leadershipobama'
                            ,'/leadershipclinton'
                        ],
                        subvariables_catalog: '/url/to/subvariables/catalog/'
                    }
                    ,group: {
                        group: 'a'
                        , handle : angular.noop
                    }
                }
                variable = HierarchicalVariable.create(cfg)
                variable.data.getSubvariables = function() {
                    return $q.when([])
                }
            })
        })
        it('will fetch the subvariables on expand', function(){
            variable.expansion.subvarsLoaded.should.be.false
            variable.expansion.handle('toggle')
            flush()
            variable.expansion.subvarsLoaded.should.be.true

        })
    })

    describe('Given a multiple response variable',function(){
        beforeEach(function(){
            buildModule()
            inject(function (_$httpBackend_, _$q_) {
                $httpBackend = _$httpBackend_
                $q = _$q_
            })
            // Fetches subvariables
            $httpBackend.expectGET('/url/to/subvariables/catalog/').
                respond(200, {
                    'element': 'shoji:catalog',
                    'self': '/url/to/subvariables/catalog/',
                    'description': 'subvariables catalog',
                    'index': {
                        '/leadershipbiden': {
                            'name': 'Biden'
                        }
                        , '/leadershipobama': {
                            'name': 'Obama'
                        }
                        , '/leadershipclinton': {
                            'name': 'Clinton'
                        }
                    }
            })
        })
        beforeEach(function(){
            inject(function(HierarchicalVariable){
                var cfg = {
                    variable: {
                        self: '/leadershipMatrix'
                        ,name: 'leadership'
                        ,type: 'multiple_response'
                        ,subvariables: [
                            '/leadershipbiden'
                            ,'/leadershipobama'
                            ,'/leadershipclinton'
                        ],
                        subvariables_catalog: '/url/to/subvariables/catalog/'
                    }
                    ,group: {
                        group: 'a'
                        , handle : angular.noop
                    }
                }
                variable = HierarchicalVariable.create(cfg)
                variable.data.getSubvariables = function() {
                    return $q.when([])
                }
            })
        })
        it('will fetch the subvariables on expand', function(){
            variable.expansion.subvarsLoaded.should.be.false
            variable.expansion.handle('toggle')
            flush()
            variable.expansion.subvarsLoaded.should.be.true

        })
    })
})
