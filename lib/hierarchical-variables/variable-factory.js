'use strict'

module.exports = VariableFactory

VariableFactory.$inject = [
    'iFetchSubvariables'
    , 'pruneGroupNameFromVariableName'
    , 'iGenerateVariableFullName'
    , 'iCalculateItemLevel'
]

function VariableFactory(iFetchSubvariables, pruneGroupNameFromVariableName, iGenerateVariableFullName, iCalculateItemLevel) {
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
            if(!('fullName' in data)) {
                Object.defineProperties(data, properties)
                data.getSubvariables = getSubvariables
                data.toJSON = toJSON
                data.subvariables = data.subvariables || []
                data.parent = group
            }

            return data
        }
    })
}
