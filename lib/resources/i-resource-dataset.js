'use strict';
module.exports = IResourceDataset

IResourceDataset.$inject = [
    'iResourceDatasets'
    ,'Shoji'
    , '$log'
];

function IResourceDataset(iResourceDatasets, Shoji,  $log) {
    function assertQuery(q) {
        if(!q || !q.datasetId) {
            throw new Error('Provide a valid datasetId')
        }
    }

    function execute(q) {
        var params = {}
            ;

        assertQuery(q)

        if(q.noCache) {
            params.headers = {
                'Cache-Control' : 'no-cache'
                , 'Expires' : 0
            }
        }

        $log.debug('iResourceDataset', 'fetching', q);

        return Shoji(q.datasetId).map(params)
            .then(function(dataset) {
                return dataset
            })
    }
    return execute
}
