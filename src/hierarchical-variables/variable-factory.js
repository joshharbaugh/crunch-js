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
        , dataProperties = [
            'self'
            , 'name'
            , 'alias'
            , 'derived'
            , 'discarded'
            , 'type'
            , 'id'
            , 'description'
            , 'urls'
            , 'fragments'
            , 'views'
            , 'catalogs'
            , 'private'
        ]
        ;

    function isSubordinate(varb) {
        var subordinateRegexp = /\/joins\/.{1,32}\/variables/gi

        return varb.self && subordinateRegexp.test(varb.self)
    }

    function Variable(data, parent) {
        this.subvariables = data.subvariables || []
        this.parent = parent
        this.data = data
    }

    Object.defineProperties(Variable.prototype, {
        fullName : {
            get : function() {
                return this._fullName || (this._fullName =
                        iGenerateVariableFullName(this))
            }
        }

        , url : {
            get : function() {
                //backward compatibility
                return this.self
            }
        }

        , prunedName : {
            get : function() {
                return this._prunedName || (this._prunedName =
                        pruneGroupNameFromVariableName(this.name, this.parent))
            }
        }

        , subordinate : {
            get : function() {
                return isSubordinate(this)
            }
        }

        , level : {
            get : function() {
                return iCalculateItemLevel(this)
            }
        }

        , categoricalArray : {
            get : function() {
                return this.type === 'categorical_array'
            }
        }

        , hierarchicalType : {
            value : 'variable'
        }
    })

    dataProperties.forEach(function(prop) {
        Object.defineProperty(Variable.prototype, prop, {
            get : function() {
                return this.data[prop]
            }
            , set : function(value) {
                this.data[prop] = value
            }
        })
    })

    Variable.prototype.getSubvariables = function() {
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

    Variable.prototype.subvariableById = function(variableId) {
        var found = null
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

    Variable.prototype.toJSON = function() {
        return this.self
    }

    Variable.prototype.contains = function(variableId) {
        return this.subvariableById(variableId) !== null
    }

    Variable.prototype.clone = function() {
        return factory.create(this, this.parent)
    }

    Variable.prototype.map = function() {
        var parent = this.parent
            ;

        return this.data.map().then(function(entity) {
            return factory.create(entity, parent)
        })
    }

    return (factory = {
        create : function(data, group) {
            return new Variable(data, group)
        }
    })
}
