'use strict'

module.exports = IGenerateVariableFullNameFactory

IGenerateVariableFullNameFactory.$inject = []

function IGenerateVariableFullNameFactory() {

    return function(hierarchicalVariable) {
        var fullName = (hierarchicalVariable.prunedName || hierarchicalVariable.name)
            , parent = hierarchicalVariable.parent
            ;

        while(parent.hierarchicalType === 'variable' ||
            (parent.parent && parent.parent.name !== 'graph')) {
            fullName = parent.name + ' | ' + fullName
            parent = parent.parent
        }

        return fullName
    }
}
