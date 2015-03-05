
var app = angular.module('crVariablesDemo', [
    'shoji',
    'resources',
    'dataset-context',
    'hierarchical-variables'
])

app.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true
})

app.factory('signin', function($http, Shoji) {
    return function(email, password) {
        return Shoji('***REMOVED***').map().then(function(api) {
            return $http({
                url : api.urls.login.self,
                method: 'POST',
                data : {
                    email : email,
                    password : password
                }
            })
        })
    }
})

app.run(function(signin, currentDataset, iFetchHierarchicalVariables) {
    signin('***REMOVED***', '***REMOVED***').then(function() {
        currentDataset.set('***REMOVED***/')
        currentDataset.fetch().then(function(ds) {
            iFetchHierarchicalVariables({ datasetId : ds.self }).then(function(hierarchicalVariables) {
                hierarchicalVariables.slice(0,3).forEach(function(variable) {
                    console.log(variable.name)
                })
            })
        })
    })

})
