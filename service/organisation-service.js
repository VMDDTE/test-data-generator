
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL // This is TestSupport
const SERVICE_NAME = 'organisation-service'

async function createOrganisation (orgType, payload) {
    let url = `${ADMIN_BASE_API_URL}/organisations/create/${orgType}`
    log.info(`${SERVICE_NAME}::createOrganisation:url:${url}`)

    return axios.post(url, payload)
        .then(async (response) => {
            await rebuildRedisOrganisationsCache()
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
        .then(async (response) => {
            await rebuildRedisOrganisationsCache()
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
        .then(async (response) => {
            await rebuildRedisOrganisationsCache()
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteOrganisation:error: ${error}`)
            throw error
        })
}

async function rebuildRedisOrganisationsCache () {
    let url = `${ADMIN_BASE_API_URL}/organisations/RebuildCache`
    log.info(`${SERVICE_NAME}::rebuildRedisOrganisationsCache:url:${url}`)
    return axios.put(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::rebuildRedisOrganisationsCache:error: ${error}`)
            throw error
        })
}

async function findOrganisationByName (organisationType, name) {
    let url = `${ADMIN_BASE_API_URL}/organisations/byTypeAndName/${organisationType}/${name}`
    log.info(`${SERVICE_NAME}::findOrganisationByName:url:${url}`)

    return axios.get(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::findOrganisationByName:error: ${error}`)
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
module.exports.findOrganisationByName = findOrganisationByName