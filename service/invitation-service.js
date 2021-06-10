const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'invitation-service'

const ORG_ADMIN_TEST_INVITATIONS_API_URL = process.env.ORG_ADMIN_API_URL + '/TestInvitations'
const ORG_ADMIN_INVITATIONS_API_URL = process.env.ORG_ADMIN_API_URL + '/Invitations'

async function createInvitation (externalUserId, organisationId, reference, externalUserRole) {
    let url = ORG_ADMIN_TEST_INVITATIONS_API_URL

    // Not sure when ExternalUserRole changed to InviteeRole, but TestSupport was doing this mapping
    const payload = {
        ExternalUserId: externalUserId,
        OrganisationId: organisationId,
        Reference: reference,
        InviteeRole: externalUserRole 
    }

    log.info(`${SERVICE_NAME}::createInvitation - url:${url}`)
    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createInvitation - error: ${error}`)
            throw error
        })
}

async function deleteInvitation (id) {
    let url = `${ORG_ADMIN_INVITATIONS_API_URL}/${id}`
    log.info(`${SERVICE_NAME}::deleteInvitation - url:${url}`)
    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            // TestSupport had logic to ignore BadRequest/NotFound
            if(error.response.status !== 400 && error.response.status !== 404){
                log.error(`${SERVICE_NAME}::deleteInvitation - error: ${error}`)
                throw error
            }
        })
}

module.exports.createInvitation = createInvitation
module.exports.deleteInvitation = deleteInvitation
