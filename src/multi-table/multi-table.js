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
    MultiTable.prototype.display = function(settings){
        var body
            ;
        return $q.all(this.cubes).then(function(subcubes){
            var subtables =  subcubes.map(function(subcube){
                if (settings.countsOrPercents.value === 'percent') {
                    body = formatPercentage(stats.propTable(subcube, 1))
                } else {
                    body = subcube.count.cube
                }
                return {
                    rowLabels: subcube.labels[0]
                    ,colLabels: subcube.labels[1]
                    ,tab: unpack(body)
                }
            }, this)

            var rowLabels = (subtables[0].rowLabels)
            var out = {
                rowLabels: rowLabels
                ,subtables: subtables
                ,marginal: unpack(stats.margin(subcubes[0],0))
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
