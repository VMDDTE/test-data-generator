const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'organisation-service'

const ORG_ADMIN_TEST_ORGANISATIONS_API_URL = process.env.ORG_ADMIN_API_URL + '/TestOrganisations'

async function createOrganisation (orgType, payload) {
    let url = `${ORG_ADMIN_TEST_ORGANISATIONS_API_URL}/Create/${orgType}`
    log.info(`${SERVICE_NAME}::createOrganisation - url:${url}`)

    return axios.post(url, payload)
        .then(async (response) => {
            await rebuildRedisOrganisationsCache()
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createOrganisation - error:${error}`)
            throw error
        })
}

async function deleteOrganisation (orgId) {
    let url = `${ORG_ADMIN_TEST_ORGANISATIONS_API_URL}/${orgId}`
    log.info(`${SERVICE_NAME}::deleteOrganisation - url:${url}`)

    return axios.delete(url)
        .then(async (response) => {
            await rebuildRedisOrganisationsCache()
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteOrganisation - error:${error}`)
            throw error
        })
}

async function rebuildRedisOrganisationsCache () {
    let url = `${ORG_ADMIN_TEST_ORGANISATIONS_API_URL}/RebuildCache`
    log.info(`${SERVICE_NAME}::rebuildRedisOrganisationsCache - url:${url}`)
    return axios.put(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::rebuildRedisOrganisationsCache - error:${error}`)
            throw error
        })
}

async function findOrganisationByName (organisationType, name) {
    let url = `${ORG_ADMIN_TEST_ORGANISATIONS_API_URL}/${organisationType}/${name}`
    log.info(`${SERVICE_NAME}::findOrganisationByName - url:${url}`)

    return axios.get(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::findOrganisationByName - error:${error}`)
            throw error
        })
}

async function assignRoleToOrganisationForUser (orgId, userId, roleName) {
    let url = `${ORG_ADMIN_TEST_ORGANISATIONS_API_URL}/${orgId}/assignrole/${userId}/${roleName}`
    log.info(`${SERVICE_NAME}::assignRoleToOrganisationForUser - url:${url}`)

    return axios.put(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::assignRoleToOrganisationForUser - error:${error}`)
            throw error
        })
}{}

module.exports.createOrganisation = createOrganisation
module.exports.deleteOrganisation = deleteOrganisation
module.exports.assignRoleToOrganisationForUser = assignRoleToOrganisationForUser
module.exports.findOrganisationByName = findOrganisationByName