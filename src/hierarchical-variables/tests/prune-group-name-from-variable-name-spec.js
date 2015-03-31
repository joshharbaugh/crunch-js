'use strict'

var mocks = require('angular-mocks')
    , mainMod = require('../index')
    ;

describe('pruneGroupNameFromVariableName', function() {
    var sut
        ;

    function buildModule() {
        var main = mainMod()
            ;

        angular.mock.module(main.name)
    }

    function buildSut() {
        angular.mock.inject(function(pruneGroupNameFromVariableName) {
            sut = pruneGroupNameFromVariableName
        })
    }

    describe('when prunning a group name from a variable name', function() {
        beforeEach(buildModule)
        beforeEach(buildSut)

        describe('given the group name represents a prefix of the variable name', function() {
            var pruned
                ;

            beforeEach(function() {
                pruned = sut('Unaided Awareness - Digital Content', { name : 'Unaided Awareness' })
            })

            it('should remove the group name along with spaces and - symbol', function() {
                pruned.should.be.equal('Digital Content')
            })
        })

        describe('given the group name appears in the var name but not as a prefix', function() {
            var pruned
                ;

            beforeEach(function() {
                pruned = sut('Digital Content - Unaided Awareness', { name : 'Unaided Awareness' })
            })

            it('should not remove the group name', function() {
                pruned.should.be.equal('Digital Content - Unaided Awareness')
            })
        })

        describe('given the group has a parent that also matches part of the variable name', function() {
            var pruned
                ;

            beforeEach(function() {
                pruned = sut('Digital Content - Music - Unaided Awareness', { name : 'Music', parent : { name : 'Digital Content' } })
            })

            it('should keep the group name and its parent\'s', function() {
                pruned.should.be.equal('Unaided Awareness')
            })
        })

        describe('given the group name only matches part of a word', function() {
            var pruned
                ;

            beforeEach(function() {
                pruned = sut('Sports viewed live', { name : 'Sport' })
            })

            it('should only match whole words', function() {
                pruned.should.be.equal('Sports viewed live')
            })
        })

        describe('given the group name matches the entire variable name', function() {
            var pruned
                ;

            beforeEach(function() {
                pruned = sut('Sport', { name : 'Sport' })
            })

            it('should not prune the variable name', function() {
                pruned.should.be.equal('Sport')
            })
        })

        describe('given the group name with special characters like \' or (', function() {
            var pruned
                ;

            beforeEach(function() {
            })

            it('should prune without major issues', function() {
                sut("Facebook 'likes' variable name", { name : "Facebook 'likes'" })
                .should.be.equal('variable name')

                sut("Facebook (likes) variable name", { name : "Facebook (likes)" })
                .should.be.equal('variable name')
            })
        })

        describe('otherwise', function() {
            var pruned
                ;

            beforeEach(function() {
                pruned = sut('Digital Content - Unaided Awareness', { name : 'Group Name' })
            })

            it('should return the original variable name', function() {
                pruned.should.be.equal('Digital Content - Unaided Awareness')
            })
        })
    })

})
