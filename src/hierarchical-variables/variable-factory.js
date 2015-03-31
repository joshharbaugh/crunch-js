'use strict'

module.exports = VariableFactory

VariableFactory.$inject = [
    'lodash'
    , '$q'
    , 'iGetVariableHash'
    , 'iFetchSubvariables'
    , 'pruneGroupNameFromVariableName'
    , 'iGenerateVariableFullName'
    , 'iCalculateItemLevel'
]

function VariableFactory(_
    , $q
    , iGetVariableHash
    , iFetchSubvariables
    , pruneGroupNameFromVariableName
    , iGenerateVariableFullName
    , iCalculateItemLevel) {
    var factory
        ;

    function isSubordinate(varb) {
        var subordinateRegexp = /\/joins\/.{1,32}\/variables/gi

        return varb.self && subordinateRegexp.test(varb.self)
    }

    function getSubvariables() {
        var self = this
            , order = self.subvariables
            ;
        if(typeof order[0] === 'string'){
            return iFetchSubvariables(this).then(function(subvariables) {
                self.subvariables = order.map(function(id) {
                    var subvar = factory.create(subvariables.getVariable(id))
                        ;

                    subvar.parent = self

                    return subvar
                })

                return self.subvariables
            })
        }
        return $q.when(self.subvariables)
    }

    function subvariableById(variableId) {
        var found = undefined
            , self = this
            ;

        self.subvariables.some(function(subvar) {
            var id = _.isString(subvar) ? subvar : subvar.self
                ;

            if(iGetVariableHash(id) === iGetVariableHash(variableId)) {
                found = subvar
            }

            return found
        })

        return found
    }

    function extendSelf(map, params) {
        var tuple = this
            ;

        return map.call(tuple, params).then(function(entity) {
            return factory.create(entity, tuple.parent)
        })
    }

    function clone() {
        return factory.create(this, this.parent)
    }

    function contains(variableId) {
        return subvariableById.call(this, variableId) !== undefined
    }

    function toJSON() {
        return this.self
    }

    var properties = {
        'fullName' : {
            get : function() {
                return this._fullName || (this._fullName =
                    iGenerateVariableFullName(this))
            }
        }

        , 'url' : {
            get : function() {
                //backward compatibility
                return this.self
            }
        }

        , 'prunedName' : {
            get : function() {
                return this._prunedName || (this._prunedName =
                    pruneGroupNameFromVariableName(this.name, this.parent))
            }
        }

        , 'subordinate' : {
            get : function() {
                return isSubordinate(this)
            }
        }

        , 'level' : {
            get : function() {
                return iCalculateItemLevel(this)
            }
        }

        , 'categoricalArray' : {
            get : function() {
                return this.type === 'categorical_array'
            }
        }

        , 'hierarchicalType' : {
            value : 'variable'
        }
    }

    return (factory = {
        create : function(data, group) {
            var variable = _.clone(data)
                ;

            variable.prototype = data.prototype

            Object.defineProperties(variable, properties)
            variable.map = _.wrap(data.map, extendSelf)
            variable.getSubvariables = getSubvariables
            variable.toJSON = toJSON
            variable.subvariables = variable.subvariables || []
            variable.subvariableById = subvariableById
            variable.contains = contains
            variable.clone = clone

            variable.parent = group

            return variable
        }
    })
}
