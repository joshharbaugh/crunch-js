'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    , shojiMod = require('../../shoji/index')
    ;

describe('Group', function() {

    function buildModule() {
        var main = mainMod()
            , shoji = shojiMod()
            ;

        angular.mock.module(main.name, shoji.name)
    }

    function buildSut() {
        var sut
            ;

        angular.mock.inject(function(Group) {
            sut = Group
        })

        return sut
    }

    function createVariable(id) {
        var variable
            ;

        angular.mock.inject(function(variableFactory) {
            variable = variableFactory.create({ self : id })
        })

        return variable
    }

    beforeEach(buildModule)

    describe('when checking if a group contains an item with a name', function() {
        var sut
            ;

        beforeEach(function() {
            var Group = buildSut()
                , variable = createVariable('123')
                ;

            variable.name = '123'

            sut = new Group('group name')
            sut.addItem(variable)
        })

        it('should return true if the group contains the named item', function() {
            expect(sut.containsItemNamed('123')).to.be.true
        })
    })

    describe('when serializing group object', function() {
        var sut
            ;

        beforeEach(function() {
            var Group = buildSut()
                , nestedGroup = new Group('nested 1')
                ;

            nestedGroup.addItem(new Group('nested 2'))
            nestedGroup.addItem(createVariable('456'))

            sut = new Group('group name')
            sut.addItem(createVariable('123'))
            sut.addItem(nestedGroup)
        })

        it('should convert the group object to a plain object compatible with the hierarchical order service', function() {
            var serialized = sut.toJSON()
                ;

            expect(serialized['group name'].indexOf('123')).to.equal(0)
            expect(serialized['group name'][1]['nested 1'][0].hasOwnProperty('nested 2')).to.be.true
        })
    })
})
