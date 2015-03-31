'use strict'

var chai = require('chai')
    , things = require('chai-things')
    ;

chai.use(things)

window.expect = chai.expect

chai.should()

window.check = function(done, f) {
    try {
        f()
        done()
    } catch( e ) {
        done( e )
    }

}