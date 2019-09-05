
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'organisation-service'

async function createOrganisation (orgType, payload) {
    let url = `${ADMIN_BASE_API_URL}/organisations/create/${orgType}`
    log.info(`${SERVICE_NAME}::createOrganisation:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createOrganisation:error: ${error}`)
            throw error
        })
}

async function updateOrganisation (payload) {
    let url = `${ADMIN_BASE_API_URL}/organisations/updateVetPractice`
    log.info(`${SERVICE_NAME}::updateOrganisation:url:${url}`)

    return axios.put(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::updateOrganisation:error: ${error}`)
            throw error
        })
}

async function deleteOrganisation (orgId) {
    let url = `${ADMIN_BASE_API_URL}/organisations/${orgId}`
    log.info(`${SERVICE_NAME}::deleteOrganisation:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteOrganisation:error: ${error}`)
            throw error
        })
}

async function findManufacturerByName (name) {
    let url = `${ADMIN_BASE_API_URL}/organisations/byTypeAndName/Manufacturer/${name}`
    log.info(`${SERVICE_NAME}::findManufacturerByName:url:${url}`)

    return axios.get(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::findManufacturerByName:error: ${error}`)
            throw error
        })
}

async function assignRoleToOrganisationForUser (orgId, userId, roleName) {
    let url = `${ADMIN_BASE_API_URL}/organisations/${orgId}/assignrole/${userId}/${roleName}`
    log.info(`${SERVICE_NAME}::assignRoleToOrganisationForUser:url:${url}`)

    return axios.put(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::assignRoleToOrganisationForUser:error: ${error}`)
            throw error
        })
}{}

module.exports.createOrganisation = createOrganisation
module.exports.updateOrganisation = updateOrganisation
module.exports.deleteOrganisation = deleteOrganisation
module.exports.assignRoleToOrganisationForUser = assignRoleToOrganisationForUser
module.exports.findManufacturerByName = findManufacturerByName