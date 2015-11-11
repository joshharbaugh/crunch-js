'use strict'
module.exports = CrFindVariablesFactory

CrFindVariablesFactory.$inject = []

function CrFindVariablesFactory(){
    // find a variableId reference inside a crunch expression
    // used in dimensions and/or measures of a cube.
    function findVariables(expr){
        var variable = expr.variable || false
            ,value = expr.value || false
            ,func = expr.function || false
            ,each = expr.each || false
            ,args = expr instanceof Array || false
            ,string = typeof expr === 'string' || false
            ;
        if (variable){
            return variable
        } else if (func){
            return findVariables(expr.args)
        } else if (each){
            var varid = expr.each || false
            if (!!varid){
                return varid
            }
        } else if (args) {
            return findVariables(expr[0])
        } else if (string){
            return expr
        }
        return undefined
    }

    return findVariables
}
