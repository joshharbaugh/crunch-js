'use strict';

module.exports = MultiTableFactory

MultiTableFactory.$inject = [
    '$q'
    ,'cube'
    ,'stats'
    ,'ndarrayOps'
    ,'ndarrayUnpack'
    ,'show'
]
function MultiTableFactory($q, cube, stats, ops, unpack, show){
    function MultiTable(){
    }
    function formatPercentage(a){
        return ops.mulseq(a, 100)
    }
    MultiTable.prototype.display = function(){
        return $q.all(this.cubes).then(function(subcubes){
            var subtables =  subcubes.map(function(subcube){
                return {
                    labels: subcube.labels,
                    tab: unpack(formatPercentage(stats.propTable(subcube,1)))
                }
            }, this)
            var out = {
                subtables: subtables
            }
            return out
        })
    }

    return{
        create: function(params){
            var result = new MultiTable()
            result.columns = params.columns
            return $q.when(params.result).then(function(them){
                result.cubes = them
                return result
            })
        }
    }
}
