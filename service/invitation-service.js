
const axios = require('axios')
const log = global.log
const TEST_SUPPORT_BASE_API_URL = process.env.TEST_SUPPORT_BASE_API_URL
const SERVICE_NAME = 'invitation-service'

async function createInvitation (externalUserId, organisationId, reference, externalUserRole) {
    let url = `${TEST_SUPPORT_BASE_API_URL}/Invitation`

    const payload = {
        ExternalUserId: externalUserId,
        OrganisationId: organisationId,
        Reference: reference,
        ExternalUserRole: externalUserRole
    }

    log.info(`${SERVICE_NAME}::createInvitation:url:${url}`)
    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createInvitation:error: ${error}`)
            throw error
        })
}

async function deleteInvitation (id) {
    let url = `${TEST_SUPPORT_BASE_API_URL}/Invitation/InvitationNo/${id}`
    log.info(`${SERVICE_NAME}::deleteInvitation:url:${url}`)
    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteInvitation:error: ${error}`)
            throw error
        })
}

module.exports.createInvitation = createInvitation
module.exports.deleteInvitation = deleteInvitation
