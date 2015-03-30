'use strict'

var chai = require('chai')
    , things = require('chai-things')
    ;

chai.use(things)
window.expect = chai.expect

chai.should()