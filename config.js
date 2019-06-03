const settings = require('dotenv').config({ path: `./settings/${process.env.NODE_ENV}.env` })

if (settings.error) {
    throw settings.error
}

const joi = require('joi')

// Define config schema
const schema = {
    env: joi.string().valid('local', 'development', 'test', 'production').default('development')
}

// Build config
const config = {
    env: process.env.NODE_ENV
}

// Validate config
const result = joi.validate(config, schema, {
    abortEarly: false
})

// Throw if config is invalid
if (result.error) {
    throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

// Add some helper props
value.isLocal = value.env === 'local'
value.isDev = value.env === 'development'
value.isProd = value.env === 'production'
value.isTest = value.env === 'test'
value.isSecure = !(value.env === 'development' || value.env === 'local')
module.exports = value
