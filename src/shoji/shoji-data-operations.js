'use strict'

module.exports = ShojiDataOperationsFactory

function ShojiDataOperationsFactory($q, $http, $log, _) {

    function ShojiDataOperations() {

    }

    function createError(message, data) {
        var error = new Error(message)
            ;

        error.data = data
        return error
    }

    function processGetConfiguration(config) {
        config = config || {}

        if(config.noCache) {
            _.extend(config, {
                headers : _.extend((config.headers || {}), {
                    'Cache-Control' : 'no-cache'
                })
            })
        }

        return config
    }

    ShojiDataOperations.prototype.get = function(uri, params) {
        var outer = $q.defer()
            ;

        $http.get(uri, processGetConfiguration(params))
            .success(function(data) {
                outer.resolve(data)
            })
            .error(function(response) {
                outer.reject(createError('The shoji object with URI ' + uri +
                    ' could not be obtained. Error code' + response.status, response))
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
                outer.reject(createError('The resource could not be saved ' + response.status, response))
                $log.error(response)
            })

        return outer.promise
    }

    ShojiDataOperations.prototype.put = function(uri, params) {
        var outer = $q.defer()
            ;

        $http.put(uri, params.data)
            .success(function() {
                outer.resolve()
            })
            .error(function(response) {
                outer.reject(createError('The resource could not be updated ' + response.status, response))
                $log.error(response)
            })

        return outer.promise
    }

    ShojiDataOperations.prototype.patch = function(uri, params) {
        var outer = $q.defer()
            ;

        $http.patch(uri, params.data)
            .success(function() {
                outer.resolve()
            })
            .error(function(response) {
                outer.reject(createError('The resource could not be patched ' + response.status, response))
                $log.error(response)
            })

        return outer.promise
    }

    ShojiDataOperations.prototype.delete = function(uri) {
        var outer = $q.defer()
            ;

        $http.delete(uri)
            .success(function() {
                outer.resolve()
            })
            .error(function(response) {
                outer.reject(createError('The resource could not be deleted ' + response.status, response))
                $log.error(response)
            })

        return outer.promise
    }

    return new ShojiDataOperations()
}

ShojiDataOperationsFactory.$inject = ['$q', '$http', '$log', 'lodash']