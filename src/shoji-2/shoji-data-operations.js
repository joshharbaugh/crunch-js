'use strict'

module.exports = ShojiDataOperationsFactory

function ShojiDataOperationsFactory($q, $http, $log) {

    function ShojiDataOperations() {

    }

    ShojiDataOperations.prototype.get = function(uri) {
        var outer = $q.defer()
            ;

        $http.get(uri)
            .success(function(data) {
                outer.resolve(data)
            })
            .error(function(response) {
                outer.reject(new Error('The shoji object with URI ' + uri +
                    ' could not be obtained. Error code' + response.status))
                $log.error(response)
            })

        return outer.promise
    }

    return new ShojiDataOperations()
}

ShojiDataOperationsFactory.$inject = ['$q', '$http', '$log']