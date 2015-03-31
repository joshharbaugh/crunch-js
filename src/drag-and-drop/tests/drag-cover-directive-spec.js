'use strict';
var dragAndDropModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
describe('dragCoverDirective', function() {
    var el
        , e;
    beforeEach(function() {
        var mod = dragAndDropModule(
            'drag-and-drop.test');
        angular.mock.module('drag-and-drop.test')
    });
    beforeEach(function(){
        inject(function($rootScope){
            $rootScope.$safeApply = $rootScope.$apply
        })
    })
    describe('when the drag cover expand event is raised', function() {
            beforeEach(function() {
                inject(function($rootScope, $compile) {
                    var scope = $rootScope.$new();
                    el = angular.element(
                        '<div data-drag-cover data-drag-cover-expand-event="dragcover.variableDrag" data-drag-cover-contract-event="dragcover.variableDrop"                                                   data-drag-cover-contract-width="0px"                                                data-drag-cover-contract-height="0px"                                                data-drag-cover-expand-width="100%"                                                data-drag-cover-expand-height="100%"></div>'
                    );
                    $compile(el)(scope)
                        .appendTo('body');
                    scope.$digest();
                    el.scope()
                        .handleExpand({})
                })
            });
            it(
                'should add the "drag-cover" class to the element', function() {
                    el.hasClass('drag-cover')
                        .should.be.true
                })
        });
    describe(
        'when the drag cover contract event is raised', function() {
            beforeEach(function() {
                inject(function($rootScope, $compile) {
                    var scope = $rootScope.$new();
                    el = angular.element(
                        '<div data-drag-cover                                                data-drag-cover-expand-event="dragcover.variableDrag"                                                data-drag-cover-contract-event="dragcover.variableDrop"                                                data-drag-cover-contract-width="0px"                                                data-drag-cover-contract-height="0px"                                                data-drag-cover-expand-width="100%"                                                data-drag-cover-expand-height="100%"></div>'
                    );
                    $compile(el)(scope)
                        .appendTo('body');
                    scope.$digest();
                    el.scope()
                        .handleContract({})
                })
            });
            it(
                'should remove the "drag-cover" class from the element', function() {
                    el.hasClass('drag-cover')
                        .should.be.false
                })
        })
})
