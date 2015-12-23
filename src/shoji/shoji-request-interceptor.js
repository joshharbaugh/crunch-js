'use strict'

module.exports = {
    $get : ShojiRequestInterceptorFactory
}

function ShojiRequestInterceptorFactory($delegate, $q, _) {
    var interceptors = []

    function matchInterceptor(url, config) {
        var found = null

        interceptors.some(function(interceptor) {
            var matched = interceptor.matches(url, config)

            if(matched) {
                found = interceptor
            }

            return matched
        })

        return found
    }

    function Interceptor(matcher, expectedConfig) {
        this.matcher = matcher
        this.expectedConfig = expectedConfig
    }

    Interceptor.prototype.matches = function(url, config) {
        var matched = false,
            matcher = this.matcher

        if(typeof matcher === 'string') {
            matched = url === matcher
        } else if(typeof matcher.test === 'function') {
            matched = matcher.test(url)
        } else if(typeof matcher === 'function') {
            matched = matcher(url, config)
        }

        if(config.params) {
            matched = matched && _.isEqual(config.params, this.expectedConfig.params)
        }

        return matched
    }

    Interceptor.prototype.respondSuccess = function(response) {
        this.response = $q.when(response)
    }

    Interceptor.prototype.respondError = function(response) {
        this.response = $q.reject(response)
    }

    function ShojiRequestInterceptor() {

    }

    ShojiRequestInterceptor.prototype = Object.create($delegate)


    ShojiRequestInterceptor.prototype.get = function(url, config) {
        var interceptor = matchInterceptor(url, (config || {})),
            response

        if(interceptor) {
            response = interceptor.response
        } else {
            response = $delegate.get(url, config)
        }

        return response
    }

    ShojiRequestInterceptor.prototype.interceptGET = function(url, config) {
        var interceptor = new Interceptor(url, (config || {}))

        interceptors.push(interceptor)

        return interceptor
    }

    return new ShojiRequestInterceptor()
}

ShojiRequestInterceptorFactory.$inject = [
    '$delegate',
    '$q',
    'lodash'
]