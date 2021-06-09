
const axios = require('axios')
const log = global.log
const userTypes = require('../common/constants')
const TEST_SUPPORT_API_URL = process.env.TEST_SUPPORT_API_URL
const ORG_ADMIN_API_URL = process.env.ORG_ADMIN_API_URL
const SERVICE_NAME = 'user-service'

async function createUser (userType, payload) {
    let url = `${TEST_SUPPORT_API_URL}/users/${userType}`
    // If the user type is internal then don't fail if the user already exists
    if (userType === userTypes.USER_TYPE_INTERNAL) {
        url = `${url}/false`
    }
    log.info(`${SERVICE_NAME}::createUser:url:${url}`)
    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createUser:error: ${error}`)
            throw error
        })
}

async function createExternalUser (payload) {
    let url = `${TEST_SUPPORT_API_URL}/users/External`
    log.info(`${SERVICE_NAME}::createExternalUser:url:${url}`)
    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createExternalUser:error: ${error}`)
            throw error
        })
}

async function deleteUser (id) {
    let url = TEST_SUPPORT_API_URL + `/users/${id}`
    log.info(`${SERVICE_NAME}::deleteUser:url:${url}`)
    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteUser:error: ${error}`)
            throw error
        })
}

async function findUserByEmail (email) {
    let url = ORG_ADMIN_API_URL + `/users/byEmail/${email}`
    log.info(`${SERVICE_NAME}::findUserByEmail:url:${url}`)
    return axios.get(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::findUserByEmail:error: ${error}`)
            throw error
        })
}

async function findUserByName (name) {
    let url = TEST_SUPPORT_API_URL + `/users/byName/${name}`
    log.info(`${SERVICE_NAME}::findUserByName:url:${url}`)
    return axios.get(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::findUserByName:error: ${error}`)
            throw error
        })
}

module.exports.createUser = createUser
module.exports.deleteUser = deleteUser
module.exports.createExternalUser = createExternalUser
module.exports.findUserByEmail = findUserByEmail
module.exports.findUserByName = findUserByName
