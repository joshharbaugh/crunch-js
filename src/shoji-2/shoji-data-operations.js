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

    ShojiDataOperations.prototype.post = function(uri, params) {
        var outer = $q.defer()
            ;

        $http.post(uri, params.data)
            .success(function(data, status, headers) {
                outer.resolve(headers('Location'))
            })
            .error(function(response) {
                outer.reject(new Error('The resource could not be saved ' + response.status))
                $log.error(response)
            })

        return outer.promise
    }

    return new ShojiDataOperations()
}

ShojiDataOperationsFactory.$inject = ['$q', '$http', '$log']