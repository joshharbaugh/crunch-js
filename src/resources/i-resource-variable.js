;
module.exports = (function() {
    'use strict';

    function IResourceVariable(iResourceVariables, $log, Shoji) {

        function isUrl(str) {
            return (str && str[0]==='/' || str.indexOf('http') > -1)
        }

        function assertQuery(q) {
            if (!q || !q.variableId) {
                throw new Error(
                    'iResourceVariable requires `variableId` parameter'
                )
            }
            return q
        }
        return function execute(q) {
            if(q.variableId && isUrl(q.variableId)){
                return Shoji(q.variableId).map()
            }
            q = assertQuery(q);
            $log.debug('iResourceVariable', 'fetching', q);
            return iResourceVariables(q)
                .then(function(variables) {
                    return variables.index
                        .first()
                        .map()
                })
        }
    }
    IResourceVariable.$inject = ['iResourceVariables', '$log', 'Shoji'
    ];
    return IResourceVariable
})
    .call(this);
