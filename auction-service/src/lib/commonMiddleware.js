const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpEventNormalizer = require('@middy/http-event-normalizer')
const httpErrorHandler = require('@middy/http-error-handler')
const createError = require('http-errors')

module.exports.handler = (handler)=>middy(handler)
.use([httpJsonBodyParser(),httpEventNormalizer(),httpErrorHandler()])