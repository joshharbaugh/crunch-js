'use strict';
module.exports = MultiTableFactory

MultiTableFactory.$inject = [
    '$q'
    ,'cube'
    ,'stats'
    ,'ndarrayOps'
]
function MultiTableFactory($q, cube, stats, ops){
    function MultiTable(){
    }
    function formatPercentage(a){
        return ops.mulseq(a, 100)
    }
    MultiTable.prototype.display = function(){
        var percents = this.cubes.map(function(subcube){
            var pct = formatPercentage(stats.propTable(subcube.count.cube,1))
            return Array.prototype.slice.call(pct.data)
        }, this)
        var out = {
            rows: percents
            ,rowLabels: []
            ,
        }
        return out
    }

    return{
        create: function(params){
            var result = new MultiTable()
            result.columns = params.columns
            return $q.all(params.result).then(function(them){
                result.cubes = them
                return result
            })
        }
    }
}
