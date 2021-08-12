const axios = require('axios')
const log = global.log
const userTypes = require('../common/constants')
const SERVICE_NAME = 'admin-test-users'

const ADMIN_TEST_USERS_API_URL = process.env.ADMIN_API_URL + '/TestUsers'

async function findUserByEmail (email) {
    let url = ADMIN_TEST_USERS_API_URL + `/byEmail/${email}`
    log.info(`${SERVICE_NAME}::findUserByEmail - url:${url}`)
    return axios.get(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            if(error.response.status !== 404){
                log.error(`${SERVICE_NAME}::findUserByEmail - error: ${error}`)
            } else{
                log.warn(`${SERVICE_NAME}::findUserByEmail - user not found`)
            }
            throw error
        })
}

async function findUserByName (name) {
    let url = `${ADMIN_TEST_USERS_API_URL}/byName/${name}`
    log.info(`${SERVICE_NAME}::findUserByName - url:${url}`)
    return axios.get(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            if(error.response.status !== 404){
                log.error(`${SERVICE_NAME}::findUserByName - error: ${error}`)
            } else{
                log.warn(`${SERVICE_NAME}::findUserByName - user not found`)
            }
            throw error
        })
}


async function createUser (userType, payload) {
    let url = `${ADMIN_TEST_USERS_API_URL}/${userType}`
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
    let url = `${ADMIN_TEST_USERS_API_URL}/External`
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
    let url = `${ADMIN_TEST_USERS_API_URL}/${id}`
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

module.exports.findUserByEmail = findUserByEmail
module.exports.findUserByName = findUserByName
module.exports.createUser = createUser
module.exports.createExternalUser = createExternalUser
module.exports.deleteUser = deleteUser