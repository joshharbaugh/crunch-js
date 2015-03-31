'use strict';

var mainModule = require('..')
    ,mocks = require('angular-mocks')
    ,machina = require('../../machina-angular')
    ,MockMachine = require('../../test-support/mock-machine')
    ,shojiMod = require('../../shoji/index')
    ,mockBus = require('../../test-support/mock-bus')
    ;
describe('VariableDirective',function(){


    var el
        ,scope
        ,wrap
        ,behaviors
        ,variable
        ;
    function buildModule() {
        var mod = mainModule()
        machina('machina.test')
        shojiMod('shoji.hierarchical-directive')
        mod.run(function($templateCache){
            $templateCache.put('/hierarchical-variables-list/behavioral-variable.html',require('../behavioral-variable.html'))
            $templateCache.put('/hierarchical-variables-list/composite-variable.html',require('../composite-variable.html'))
            $templateCache.put('/hierarchical-variables-list/scalar-variable.html',require('../scalar-variable.html'))
        })

        mod.factory('bus', function() {
            return mockBus()
        })

        angular.mock.module(mod.name,'machina.test', 'shoji.hierarchical-directive')
    }

    afterEach(function(){
        if(wrap){
            wrap.remove()
        }
    })

    function element(){
        wrap = document.createElement('div')
        el = document.createElement('div')
        el.classList.add('hierarchical-variable')
        wrap.appendChild(el)
        return wrap
    }


    function compileVariable(variable) {
        inject(function($compile, $rootScope){
            scope = $rootScope.$new()
            scope.variable = variable
            var elm = $compile(element())(scope)
            scope.$digest()
            el = elm[0]

        })
        return el
    }
    function buildBehaviors(cfg) {
        var beh
        inject(function(hierarchicalBehaviors){
            beh =  hierarchicalBehaviors(cfg)
        })
        return beh

    }
    describe('when $compiled',function(){
        beforeEach(function(){
            buildModule()
        })
        describe('given scalar variable',function(){
            beforeEach(function(){
                inject(function(HierarchicalVariable){
                    var cfg = {
                        variable: {
                            self: '/a'
                            ,name: 'aa'
                        }
                        ,group: {
                            group: 'a'
                            , handle : angular.noop
                        }
                    }
                    variable = HierarchicalVariable.create(cfg)
                })
            })
            describe('that is not locatable',function(){
                beforeEach(function(){
                    behaviors = buildBehaviors({
                        locatable: false
                    })
                    variable.applyBehaviors(behaviors)
                })
                beforeEach(function(){
                    compileVariable(variable)
                })
                it('should be the right control',function(){
                    var scalar = el.querySelector('.scalar')
                    expect(scalar.querySelector('button')).to.exist
                })
            })
        })
        describe('given composite variable',function(){
            beforeEach(function(){
                inject(function(HierarchicalVariable){
                    var cfg = {
                        variable: {
                            self: '/leadershipMatrix'
                            ,name: 'leadership'
                            ,type: 'categorical_array'
                            ,subvariables: [
                                { self: '/leadershipbiden',name: 'idiot'}
                                ,{ self: '/leadershipobama', name:'waste'}
                                ,{ self: '/leadershipclinton',name:'mafia'}
                            ],
                            subvariables_catalog: "/leadershipMatrix/subvariables/"
                        }
                        ,behaviors: {
                            linkable : false
                        }
                        ,group: {
                            group: 'a'
                            , handle : angular.noop
                        }
                    }
                    variable = HierarchicalVariable.create(cfg)
                    // Fake loaded subvars so the test does not try to
                    // fetch the subvariables when expanding the variable
                    variable.expansion.subvarsLoaded = true
                })
            })
            describe('regardless of behaviors',function(){
                beforeEach(function(){
                    compileVariable(variable)
                })

                it('should be expandable / collapsable',function(){
                    var composite = el.querySelector('.composite')
                    var button = composite.querySelector('button.toggle')
                    button.click()
                    scope.$digest()
                    expect(el.querySelector('.subvariables')).to.exist
                    button.click()
                    scope.$digest()
                    expect(el.querySelector('.subvariables')).not.to.exist

                })
            })
            describe('that is linkable',function(){
                beforeEach(function(){
                    behaviors = buildBehaviors({
                        linkable: true
                    })
                    variable.applyBehaviors(behaviors)

                })
                beforeEach(function(){
                    compileVariable(variable)
                })
                it('should render draggable composite name',function(){
                    var composite = el.querySelector('.composite')
                    var header = composite.querySelector('.composite-header')
                    header.getAttribute('dragit').should.equal('variable')
                    header.getAttribute('dragit-operation').should.equal('link')
                })

            })
        })
    })
    describe('when clicking variable',function(){
        var event
        beforeEach(function(){
            buildModule()
        })
        describe('given composite variable',function(){
            var composite
            beforeEach(function(){
                inject(function(HierarchicalVariable){
                    var cfg = {
                        variable: {
                            self: '/leadershipMatrix'
                            ,name: 'leadership'
                            ,type: 'categorical_array'
                            ,subvariables: [
                                { self: '/leadershipbiden',name: 'idiot'}
                                ,{ self: '/leadershipobama', name:'waste'}
                                ,{ self: '/leadershipclinton',name:'mafia'}
                            ]
                        }
                        ,group: {
                            group: 'a'
                            , handle : angular.noop
                        }
                    }
                    variable = HierarchicalVariable.create(cfg)
                })
            })

            describe('that is clickable',function(){
                beforeEach(function(){
                    behaviors = buildBehaviors({
                        clickable: true
                    })
                    variable.applyBehaviors(behaviors)
                })
                beforeEach(function(){
                    compileVariable(variable)
                    composite = el.querySelector('.composite')
                })
                beforeEach(function(){
                    var header = composite.querySelector('.composite-header')
                    var button = header.querySelector('button')
                    variable.on('clicked',function(it){
                        event = it
                    })
                    button.click()
                    scope.$digest()

                })
                it('should raise event',function(){
                    event.should.be.ok
                })
                it('should not be selected',function(){
                    expect(composite.querySelector('.selected')).not.to.exist
                })
            })
        })

    })

})
