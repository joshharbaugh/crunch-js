var dragAndDropModule = require('../index');
module.exports = (function() {
    'use strict';
    describe('dropDirective', function() {
        var events = []
            ,el
            , e;
        beforeEach(function() {
            dragAndDropModule('drag-and-drop.test');
            var mod = angular.module('drag-and-drop.test');
            mod.factory('mySerializer', function() {
                return {
                    deserialize: function(str) {
                        return 'DESERIALIZED'
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
        describe('given dropEvent is specified', function() {
            var el
                , scope;;
            beforeEach(function() {
                inject(function($rootScope, $compile) {
                    scope = $rootScope.$new();
                    scope.myObject = {
                        'c': 'd'
                    };
                    el = angular.element(
                        '<a data-drop="myObject" data-drop-key="myKey" data-drop-event="meh"></a>'
                    );
                    $compile(el)(scope);
                    scope.$digest()
                });
                e = {
                    dataTransfer: {
                        storedData: {
                            'application/json': '{"a":"b"}'
                            ,'text/plain': 'myKey'
                        }
                        , getData: function(type) {
                            return this.storedData[
                                type]
                        }
                    }
                }
            });
            describe(
                'when dropped on element matching key', function() {
                    it('should emit the event', function(
                        done) {
                        scope.$on('meh', function(e, args) {
                            check(done, function() {
                                args.key.should
                                    .equal(
                                        'myKey'
                                );
                                args.droppedData
                                    .a.should
                                    .equal(
                                        'b');
                                args.targetData
                                    .c.should
                                    .equal(
                                        'd')
                            })
                        });
                        el.scope()
                            .handleDrop(e)
                    })
                })
        });
        describe('when dropping data having a __serializer', function() {
                var el
                    , scope;;
                beforeEach(function() {
                    inject(function($rootScope, $compile) {
                        scope = $rootScope.$new();
                        scope.myObject = {
                            'c': 'd'
                        };
                        el = angular.element(
                            '<a data-drop="myObject" data-drop-key="myKey" data-drop-event="meh"></a>'
                        );
                        $compile(el)(scope);
                        scope.$digest()
                    });
                    e = {
                        dataTransfer: {
                            storedData: {
                                'application/json': '{"a":"b","__serializer":"mySerializer"}'
                                ,'text/plain': 'myKey'
                            }
                            , getData: function(type) {
                                return this.storedData[
                                    type]
                            }
                        }
                    }
                });
                describe(
                    'when dropped on element matching key', function() {
                        it('should emit the event', function(
                            done) {
                            scope.$on('meh', function(e, args) {
                                check(done, function() {
                                    args.key.should
                                        .equal(
                                            'myKey'
                                    );
                                    args.droppedData
                                        .should.equal(
                                            'DESERIALIZED'
                                    );
                                    args.targetData
                                        .c.should
                                        .equal(
                                            'd')
                                })
                            });
                            el.scope()
                                .handleDrop(e)
                        })
                    })
            })
    })
})
    .call(this);
