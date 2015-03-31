;
module.exports = (function() {
    'use strict';
    var api = {
        element: 'shoji:entity'
        , self: '/api/'
        , description: 'The API root. GET user_url to access your Crunch resources. GET logout_url to sign out.'
        , urls: {
            roles_url: '/api/roles/users/'
            , logout_url: '/api/logout/'
            , user_url: '/api/users***REMOVED***'
        }
    };
    var user = {
        element: 'shoji:entity'
        , self: '/api/users***REMOVED***'
        , specification: '/api/specifications/users/'
        , description: 'Details for a User'
        , body: {
            first_name: 'Jean Luque'
            , last_name: 'Piccard'
            , email: '***REMOVED***'
            , ***REMOVED***
        }
        , urls: {
            password_reset_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/password_reset/'
            , archived_datasets_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/datasets/archived/'
            , password_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/password/'
            , sources_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/sources/'
            , projects_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/projects/'
            , datasets_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/datasets/'
            , account_role_url: 'https://devtest.crunch.io/api/accounts/00001/user_roles/576b848eb0fe421f862f8044816cfad3/'
            , invite_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/invite/'
            , url_upload_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/url_upload/'
            , account_url: 'https://devtest.crunch.io/api/accounts/00001/'
        }
    };
    var accountRole = {
        element: 'shoji:entity'
        , self: 'https://devtest.crunch.io/api/accounts/00001/user_roles/576b848eb0fe421f862f8044816cfad3/'
        , specification: 'https://devtest.crunch.io/api/specifications/user_roles/'
        , description: 'Detail of the relationship of a user in an account'
        , body: {}
        , urls: {
            object_url: 'https://devtest.crunch.io/api/accounts/00001/'
            , role_url: 'https://devtest.crunch.io/api/roles/accounts/08c98031d4344963901be3fbfbf62b37/'
            , user_url: 'https://devtest.crunch.io/api/users/139bfe2bcf584ebc8a0e3bfbdd95f70c/'
        }
    };
    var role = {
        element: 'shoji:entity'
        , self: 'https://devtest.crunch.io/api/roles/accounts/08c98031d4344963901be3fbfbf62b37/'
        , specification: 'https://devtest.crunch.io/api/specifications/roles/'
        , description: 'Detail information for a role'
        , body: {
            can_create_datasets: false
            , numeric_value: 'analyst'
            , can_alter_users: false
            , id: '08c98031d4344963901be3fbfbf62b37'
        }
    };
    return {
        api: api
        , user: user
        , accountRole: accountRole
        , role: role
    }
})
    .call(this);