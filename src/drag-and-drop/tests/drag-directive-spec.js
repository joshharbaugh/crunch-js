'use strict';
var dragAndDropModule = require('../index')
    ,mocks = require('angular-mocks')
    ;
describe('dragDirective', function() {
    var el
        , e;
    beforeEach(function() {
        var mod = dragAndDropModule(
            'drag-and-drop.test');
        mod.factory('myObjectSerializer', function() {
            return {
                serialize: function(it) {
                    return 'SERIALIZED'
                }
            }
        });
        angular.mock.module('drag-and-drop.test')
    });
    beforeEach(function(){
        inject(function($rootScope){
            $rootScope.$safeApply = $rootScope.$apply
        })
    })
    describe('when compiling', function() {
        beforeEach(function() {
            inject(function($rootScope, $compile) {
                var scope = $rootScope.$new();
                scope.myObject = {
                    'a': 'b'
                };
                el = angular.element(
                    '<a data-drag=\'myObject\'></a>'
                );
                $compile(el)(scope);
                scope.$digest()
            })
        });
        it('should make the el draggable', function() {
            el.attr('draggable')
                .should.equal('true')
        })
    });
    describe('on dragstart', function() {
        describe('given serializer specification', function() {
                beforeEach(function() {
                    inject(function($rootScope, $compile) {
                        e = {
                            dataTransfer: {
                                setDatas: {}
                                , setData: function(
                                    type, content) {
                                    this.setDatas[
                                        type] =
                                        content
                                }
                                , effectAllowed: null
                            }
                        };
                        var scope =
                            $rootScope.$new();
                        scope.myObject = {
                            'a': 'b'
                            ,'__serializer': 'myObjectSerializer'
                        };
                        el = angular.element(
                            '<a data-drag=\'myObject\' data-drag-key=\'myKey\'></a>'
                        );
                        $compile(el)(scope);
                        scope.$digest();
                        el.scope()
                            .handleDragStart(
                                e)
                    })
                });
                it('should serialize the drag data', function() {
                        var myObjectSerialized =
                            'SERIALIZED';
                        e.dataTransfer.setDatas[
                            'application/json'].should
                            .equal(myObjectSerialized)
                    });
                it('it should allow effect', function() {
                    e.dataTransfer.effectAllowed.should
                        .equal('move')
                });
                it('should have the correct key', function() {
                        e.dataTransfer.setDatas[
                            'text/plain'].should.equal(
                            'myKey')
                    })
            });
        describe('given no serialization specified', function() {
                beforeEach(function() {
                    inject(function($rootScope, $compile) {
                        e = {
                            dataTransfer: {
                                setDatas: {}
                                , setData: function(
                                    type, content) {
                                    this.setDatas[
                                        type] =
                                        content
                                }
                                , effectAllowed: null
                            }
                        };
                        var scope =
                            $rootScope.$new();
                        scope.myObject = {
                            'a': 'b'
                        };
                        el = angular.element(
                            '<a data-drag=\'myObject\' data-drag-key=\'myKey\'></a>'
                        );
                        $compile(el)(scope);
                        scope.$digest();
                        el.scope()
                            .handleDragStart(
                                e)
                    })
                });
                it('should serialize the drag data', function() {
                        var myObjectSerialized =
                            '{"a":"b"}';
                        e.dataTransfer.setDatas[
                            'application/json'].should
                            .equal(myObjectSerialized)
                    });
                it('it should allow effect', function() {
                    e.dataTransfer.effectAllowed.should
                        .equal('move')
                });
                it('should have the correct key', function() {
                        e.dataTransfer.setDatas[
                            'text/plain'].should.equal(
                            'myKey')
                    });
                it(
                    'should add the "dragging" class to the element', function() {
                        el.hasClass('dragging')
                            .should.be.true
                    })
            })
    });
    describe('on dragend', function() {
        beforeEach(function() {
            inject(function($rootScope, $compile) {
                e = {
                    dataTransfer: {
                        setDatas: {}
                        , setData: function(
                            type, content) {
                            this.setDatas[
                                type] =
                                content
                        }
                        , effectAllowed: null
                    }
                };
                var scope = $rootScope.$new();
                scope.myObject = {
                    'a': 'b'
                };
                el = angular.element(
                    '<a data-drag=\'myObject\' data-drag-key=\'myKey\'></a>'
                );
                $compile(el)(scope);
                scope.$digest();
                el.scope()
                    .handleDragEnd(e)
            })
        });
        it('should remove the "dragging" class', function() {
                el.hasClass('dragging')
                    .should.be.false
            })
    })
})
